import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { ApiResponseUtil } from '../../utils/apiResponse';
import User, { UserRole, IUser } from '../../models/user';
import { AuthorizationError } from '../../errors/authorizationError';
import { asyncHandler } from '../../utils/asyncHandler';

/**
 * Create a new user (by admin)
 * @route POST /api/users
 * @access Private (Admin)
 */
export const createUser = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            throw new AuthorizationError('Authentication required');
        }

        // Only admins can create users
        if (req.user.role !== UserRole.ADMIN) {
            return ApiResponseUtil.error(
                res,
                'Access denied: only admins can create users',
                403
            );
        }

        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return ApiResponseUtil.error(
                res,
                'Missing required fields: name, email, password',
                400
            );
        }

        // Validate role if provided
        if (role && !Object.values(UserRole).includes(role)) {
            return ApiResponseUtil.error(res, 'Invalid role provided', 400);
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });
        if (existingUser) {
            return ApiResponseUtil.error(
                res,
                'Email is already in use',
                400
            );
        }

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            role: role || UserRole.USER,
            isActive: true,
        });

        await newUser.save();

        // Return user without sensitive fields
        const userResponse = newUser.toObject() as Partial<IUser>;
        delete (userResponse as any).password;
        delete (userResponse as any).twoFactorCode;
        delete (userResponse as any).emailVerificationCode;
        delete (userResponse as any).pendingNewPassword;

        return ApiResponseUtil.success(
            res,
            userResponse,
            'User created successfully',
            201
        );
    }
);