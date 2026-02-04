import jwt, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { UserRole } from '../models/user';

/**
 * JWT payload interface
 * Contains user information encoded in the token
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

/**
 * JWT configuration
 * Secrets are loaded from environment variables
 * Defaults provided for development (MUST be changed in production)
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

/**
 * Token expiration times
 * Can be set via environment variables
 * Defaults: 15 minutes for access token, 7 days for refresh token
 * Supports formats like '15m', '1h', '7d' or numeric seconds
 */
const ACCESS_TOKEN_EXPIRES_IN: string | number = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN: string | number = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * JWT Utility class for token generation and verification
 * Handles both access and refresh tokens with proper validation
 */
export class JWTUtils {
  /**
   * Generate access token
   * Used for API request authentication
   * 
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @param role - User's role (admin or user)
   * @returns Signed JWT access token
   */
  static generateAccessToken(userId: string, email: string, role: UserRole): string {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      type: 'access',
    };

    const signOptions: SignOptions = {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
      issuer: 'almanac-api',
      subject: userId,
    };

    return jwt.sign(payload, JWT_SECRET as Secret, signOptions);
  }

  /**
   * Generate refresh token
   * Used to generate new access tokens without re-authentication
   * Includes unique jwtid to prevent token collisions
   * 
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @param role - User's role (admin or user)
   * @returns Signed JWT refresh token
   */
  static generateRefreshToken(userId: string, email: string, role: UserRole): string {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      type: 'refresh',
    };

    // Unique ID for refresh token to prevent identical tokens
    const jwtId = randomUUID();

    const signOptions: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
      issuer: 'almanac-api',
      subject: userId,
      jwtid: jwtId,
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET as Secret, signOptions);
  }

  /**
   * Verify and decode access token
   * Validates token signature and expiration
   * 
   * @param token - JWT access token to verify
   * @returns Decoded token payload
   * @throws Error if token is invalid or expired
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: 'almanac-api',
      };

      const decoded = jwt.verify(token, JWT_SECRET as Secret, verifyOptions) as JWTPayload;

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type: expected access token');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify and decode refresh token
   * Validates token signature and expiration
   * 
   * @param token - JWT refresh token to verify
   * @returns Decoded token payload
   * @throws Error if token is invalid or expired
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const verifyOptions: VerifyOptions = {
        issuer: 'almanac-api',
      };

      const decoded = jwt.verify(token, JWT_REFRESH_SECRET as Secret, verifyOptions) as JWTPayload;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type: expected refresh token');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Decode token without verification
   * Used for debugging or extracting payload without signature validation
   * WARNING: Do not use for security-critical operations
   * 
   * @param token - JWT token to decode
   * @returns Decoded token payload or null if invalid
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }

  /**
   * Get token expiration time
   * 
   * @param token - JWT token
   * @returns Expiration date or null if token has no expiration
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   * 
   * @param token - JWT token
   * @returns true if token is expired, false otherwise
   */
  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;
    return expiration < new Date();
  }

  /**
   * Get time until token expiration in seconds
   * 
   * @param token - JWT token
   * @returns Seconds until expiration, or 0 if already expired
   */
  static getTimeUntilExpiration(token: string): number {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return 0;

    const secondsUntilExpiration = Math.floor((expiration.getTime() - Date.now()) / 1000);
    return Math.max(0, secondsUntilExpiration);
  }
}

export default JWTUtils;
