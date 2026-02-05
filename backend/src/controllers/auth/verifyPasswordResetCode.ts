import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import { AuthenticationError } from '../../errors';
import PasswordResetUtil from '../../utils/passwordReset';
import { ApiResponseUtil } from '../../utils/apiResponse';

/**
 * @route   POST /api/auth/verify-password-reset-code
 * @desc    Verify 6-digit code and update password (forgot password flow)
 * @access  Private (requires valid JWT token from verify-reset-code)
 */
export const verifyPasswordResetCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, newPassword } = req.body;

    // Get user
    const user = await User.findById(req.user!._id).select('+password');
    if (!user) throw new AuthenticationError('User not found');

    // Validate code
    PasswordResetUtil.validateVerificationCode(code, user);

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      throw new AuthenticationError('Password must be at least 6 characters');
    }

    // Prevent password reuse
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw new AuthenticationError('Cannot use current password');
    }

    // Update password
    user.password = newPassword;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpiry = undefined;
    user.pendingNewPassword = undefined;
    await user.save();

    ApiResponseUtil.success(res, { 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    }, 'Password updated successfully');

  } catch (error) {
    next(error);
  }
};