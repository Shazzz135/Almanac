/**
 * Authenticated HTTP Client
 * Provides a fetch wrapper that automatically includes JWT authentication headers
 * Automatically refreshes access token on 401 responses if refresh token is available
 */

import { getApiUrl } from '../api';
import { getAccessToken, getRefreshToken, updateAccessToken, clearTokens } from './tokenstorage';

// ============================================================================
// STATE FOR RETRY LOGIC
// ============================================================================

// Track ongoing refresh attempts to prevent race conditions
let refreshPromise: Promise<string> | null = null;

// ============================================================================
// REFRESH TOKEN WITH LOCK (prevent race conditions)
// ============================================================================

/**
 * Refresh the access token using refresh token
 * Prevents multiple concurrent refresh attempts with a promise cache
 */
const refreshAccessTokenWithLock = async (): Promise<string> => {
    // If a refresh is already in progress, wait for it instead of starting a new one
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(getApiUrl('/auth/refresh'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                // Refresh token is expired or invalid
                clearTokens();
                throw new Error('Session expired. Please login again.');
            }

            const result = await response.json();
            const newAccessToken = result.data.accessToken;
            updateAccessToken(newAccessToken);
            return newAccessToken;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// ============================================================================
// AUTHENTICATED FETCH
// ============================================================================

/**
 * Makes an authenticated HTTP request to the API
 * Automatically includes JWT authentication headers
 * Automatically refreshes access token on 401 and retries the request
 * 
 * @param endpoint - API endpoint path (e.g., '/auth/login')
 * @param options - Standard fetch options (method, body, headers, etc.)
 * @returns Promise with the Response object
 * 
 * @example
 * ```typescript
 * const response = await authenticatedFetch('/auth/me', { method: 'GET' });
 * const data = await response.json();
 * ```
 */
export const authenticatedFetch = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    let token = getAccessToken();
    
    // For password reset flow, use reset token if available
    if (!token && endpoint === '/auth/reset-password') {
        token = sessionStorage.getItem('resetToken') || '';
    }

    // Start with default headers and merge with any provided headers
    let headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        // Use Headers object for safe header manipulation
        const mutableHeaders = new Headers(headers);
        mutableHeaders.set('Authorization', `Bearer ${token}`);
        headers = mutableHeaders;
    }

    // Make the request with authentication headers
    let response = await fetch(getApiUrl(endpoint), {
        ...options,
        headers,
    });

    // If we get a 401 and have a refresh token, try to refresh and retry
    if (response.status === 401 && getRefreshToken()) {
        try {
            // Attempt to refresh the access token
            const newAccessToken = await refreshAccessTokenWithLock();

            // Retry the original request with the new token
            const retryHeaders = new Headers(headers);
            retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

            response = await fetch(getApiUrl(endpoint), {
                ...options,
                headers: retryHeaders,
            });
        } catch (error) {
            // Refresh failed, return the original 401 response
            console.error('Token refresh failed:', error);
        }
    }

    return response;
};