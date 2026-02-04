import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/user';
import {
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/user';

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user (admin only)
 * @access  Private (Admin)
 * @body    { name: string, email: string, password: string, role?: UserRole }
 * @returns { user object without password }
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Private (Own user or Admin)
 * @body    { name?: string, email?: string, preferences?: object }
 * @note    Users can only update their own profile; admins can update any user and change roles
 * @returns { updated user object without sensitive fields }
 */
router.put('/:id', authenticate, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Private (Own user or Admin)
 * @note    Users can delete their own account; admins can delete any user
 * @returns { success message }
 */
router.delete('/:id', authenticate, deleteUser);

export default router;