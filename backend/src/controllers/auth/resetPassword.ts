import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import { ApiResponseUtil } from '../../utils/apiResponse';
import { ValidationError, AuthenticationError } from '../../errors';
import CodeGenerator from '../../utils/codeGenerator';

/**
 * @route   POST /api/auth/reset-password
 * @desc    Update password after verification (forgot password flow)
 * @access  Private (requires valid JWT reset token from verify-reset-code)
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newPassword, code } = req.body;

    // Validate inputs
    if (!newPassword || !code) {
      throw new ValidationError('New password and verification code are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Get user from JWT token (set by auth middleware)
    if (!req.user) {
      throw new AuthenticationError('Authentication required. Please verify your code first.');
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify the code matches
    const hashedCode = CodeGenerator.hashCode(code);
    if (user.twoFactorCode !== hashedCode) {
      throw new ValidationError('Invalid or expired verification code');
    }

    if (!user.twoFactorCodeExpiry || new Date() > new Date(user.twoFactorCodeExpiry)) {
      throw new ValidationError('Verification code has expired');
    }

    // Prevent password reuse - check if new password is same as current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw new ValidationError('Cannot use current password');
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.lastPasswordResetAt = new Date();
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpiry = undefined;
    await user.save();

    ApiResponseUtil.success(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};