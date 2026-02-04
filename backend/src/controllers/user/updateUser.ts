import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { ApiResponseUtil } from '../../utils/apiResponse';
import User, { UserRole } from '../../models/user';
import { PermissionChecker } from '../../utils/permissions';
import { AuthorizationError } from '../../errors/authorizationError';
import { asyncHandler } from '../../utils/asyncHandler';

/**
 * Update user by ID
 * @route PUT /api/users/:id
 * @access Private (Own user or Admin)
 */
export const updateUser = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            throw new AuthorizationError('Authentication required');
        }

        const targetUserId = req.params.id;
        const currentUserRole = req.user.role || UserRole.USER;

        // Check if user has permission to modify this profile
        PermissionChecker.requireModifyUserPermission(req, targetUserId);

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return ApiResponseUtil.error(res, 'User not found', 404);
        }

        // Extract allowed fields from request body
        const { name, email, preferences } = req.body;

        // Validate and update email if provided
        if (email && email !== targetUser.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return ApiResponseUtil.error(res, 'Email is already in use', 400);
            }
            targetUser.email = email.toLowerCase();
        }

        // Update other allowed fields
        if (name !== undefined) targetUser.name = name;

        // Update preferences if provided
        if (preferences) {
            if (preferences.timezone !== undefined) {
                targetUser.preferences.timezone = preferences.timezone;
            }
            if (preferences.notifications) {
                targetUser.preferences.notifications = {
                    ...targetUser.preferences.notifications,
                    ...preferences.notifications,
                };
            }
        }

        // Prevent non-admins from changing role
        if (req.body.role && currentUserRole !== UserRole.ADMIN) {
            return ApiResponseUtil.error(
                res,
                'Only administrators can change user roles',
                403
            );
        }
        if (req.body.role && currentUserRole === UserRole.ADMIN) {
            if (!Object.values(UserRole).includes(req.body.role)) {
                return ApiResponseUtil.error(res, 'Invalid role provided', 400);
            }
            targetUser.role = req.body.role;
        }

        // Prevent changing isActive (except by admins)
        if (req.body.isActive !== undefined && currentUserRole === UserRole.ADMIN) {
            targetUser.isActive = req.body.isActive;
        }

        await targetUser.save();

        // Return user without sensitive fields
        const userResponse = targetUser.toObject();
        delete (userResponse as any).password;
        delete (userResponse as any).twoFactorCode;
        delete (userResponse as any).emailVerificationCode;
        delete (userResponse as any).pendingNewPassword;

        return ApiResponseUtil.success(
            res,
            userResponse,
            'User updated successfully',
            200
        );
    }
);