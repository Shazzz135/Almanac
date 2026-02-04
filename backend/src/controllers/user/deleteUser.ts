import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { ApiResponseUtil } from '../../utils/apiResponse';
import User, { UserRole } from '../../models/user';
import { AuthorizationError } from '../../errors/authorizationError';
import { asyncHandler } from '../../utils/asyncHandler';

/**
 * Delete user by ID
 * @route DELETE /api/users/:id
 * @access Private (Own user or Admin)
 */
export const deleteUser = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            throw new AuthorizationError('Authentication required');
        }

        const targetUserId = req.params.id;
        const currentUserId = (req.user as any)._id.toString();
        const currentUserRole = req.user.role || UserRole.USER;

        // Check if user has permission to delete this profile
        // Users can delete their own account, admins can delete any account
        const canDelete =
            currentUserId === targetUserId ||
            currentUserRole === UserRole.ADMIN;

        if (!canDelete) {
            return ApiResponseUtil.error(
                res,
                'Access denied: you can only delete your own account',
                403
            );
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return ApiResponseUtil.error(res, 'User not found', 404);
        }

        // TODO: Check if user has associated resources
        // - Check for any related data
        // - Decide whether to cascade delete or prevent deletion

        await User.findByIdAndDelete(targetUserId);

        return ApiResponseUtil.success(
            res,
            null,
            'User deleted successfully',
            200
        );
    }
);