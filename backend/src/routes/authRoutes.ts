import { Router } from 'express';
import {
	register,
	login,
	refresh,
	logout,
	forgotPassword,
	verifyResetCode,
	resetPassword,
	verifyEmail,
	resendVerification
} from '../controllers/auth';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { name: string, email: string, password: string }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT tokens
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email with 6-digit code
 * @access  Public
 * @body    { email: string, code: string }
 */
router.post('/verify-email', verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 * @body    { email: string }
 */
router.post('/resend-verification', resendVerification);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset by sending code to email
 * @access  Public
 * @body    { email: string }
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/verify-reset-code
 * @desc    Verify password reset code
 * @access  Public
 * @body    { email: string, code: string }
 */
router.post('/verify-reset-code', verifyResetCode);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password after verification
 * @access  Private (requires reset token from verify-reset-code)
 * @body    { code: string, newPassword: string }
 */
router.post('/reset-password', authenticate, resetPassword);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refreshToken: string }
 */
router.post('/refresh', refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Private
 * @headers { Authorization: Bearer <accessToken> }
 * @body    { refreshToken: string }
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 * @headers { Authorization: Bearer <accessToken> }
 */
router.get('/me', authenticate, (_req, res) => {
	const user = _req.user;
	res.json({
		success: true,
		data: {
			user: {
				id: user?._id,
				name: user?.name,
				email: user?.email,
				role: user?.role,
				isEmailVerified: user?.isEmailVerified,
				lastLogin: user?.lastLogin
			}
		}
	});
});

export default router;
