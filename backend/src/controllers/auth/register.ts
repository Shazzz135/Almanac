import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import { ValidationError } from '../../errors';
import EmailService from '../../email/email';
import CodeGenerator from '../../utils/codeGenerator';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 * @body    { name: string, email: string, password: string }
 * @returns { user object with verification pending }
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body;

		// Validation
		if (!name || !email || !password) {
			throw new ValidationError('Name, email, and password are required');
		}

		if (name.trim().length < 2) {
			throw new ValidationError('Name must be at least 2 characters');
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new ValidationError('Please enter a valid email');
		}

		// Password validation
		if (password.length < 6) {
			throw new ValidationError('Password must be at least 6 characters');
		}

		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

		if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
			throw new ValidationError(
				'Password must contain uppercase, lowercase, digit, and special character'
			);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			throw new ValidationError('Email is already registered');
		}

		// Generate 6-digit verification code
		const verificationCode = CodeGenerator.generate6DigitCode();
		const hashedCode = CodeGenerator.hashCode(verificationCode);

		// Create new user
		const user = new User({
			name: name.trim(),
			email: email.toLowerCase(),
			password,
			role: 'user',
			isActive: true,
			isEmailVerified: false,
			emailVerificationCode: hashedCode,
			emailVerificationCodeExpiry: CodeGenerator.getCodeExpiration(),
			failedLoginAttempts: 0
		});

		// Save user to database (password will be hashed by pre-save hook)
		await user.save();

		// Send verification email
		try {
			const emailService = await EmailService.create();
			await emailService.sendVerificationCode(user.email, verificationCode, user.name);
		} catch (emailError) {
			// Log email error but don't fail registration - user can resend verification later
			console.error('Failed to send verification email:', emailError);
			// In production, you may want to delete the user if email fails
			// For now, we let the user exist and can resend verification email manually
		}

		res.status(201).json({
			success: true,
			message: 'Registration successful. Please verify your email.',
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					isEmailVerified: user.isEmailVerified
				}
			}
		});

	} catch (error) {
		next(error);
	}
};
