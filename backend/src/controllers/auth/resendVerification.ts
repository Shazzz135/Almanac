import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import { ApiResponseUtil } from '../../utils/apiResponse';
import { ValidationError } from '../../errors';
import CodeGenerator from '../../utils/codeGenerator';
import EmailService from '../../email/email';

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification code
 * @access  Public
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ValidationError('No account found with this email');
    }

    if (user.isEmailVerified) {
      throw new ValidationError('Email is already verified');
    }

    // Generate new code
    const verificationCode = CodeGenerator.generate6DigitCode();
    user.emailVerificationCode = CodeGenerator.hashCode(verificationCode);
    user.emailVerificationCodeExpiry = CodeGenerator.getCodeExpiration();
    await user.save();

    try {
      const emailService = await EmailService.create();
      await emailService.sendVerificationCode(user.email, verificationCode, user.name);
      console.log(`[RESEND-VERIFICATION] Code sent to ${user.email}`);
    } catch (emailError) {
      console.error('[RESEND-VERIFICATION] Failed to send email:', emailError);
      
      // Clear the code if email fails
      user.emailVerificationCode = undefined;
      user.emailVerificationCodeExpiry = undefined;
      await user.save();
      
      // Return more specific error message
      const errorMsg = emailError instanceof Error ? emailError.message : 'Failed to send verification email';
      throw new ValidationError(`Email service error: ${errorMsg}. Please try again later or contact support.`);
    }

    ApiResponseUtil.success(res, { email: user.email }, 'Verification code sent to your email');
  } catch (error) {
    next(error);
  }
};