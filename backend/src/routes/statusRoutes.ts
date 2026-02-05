import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/user';
import { getDbStatus, getSystemStatus } from '../controllers/status';

const router = Router();

/**
 * @route   GET /api/status/db
 * @desc    Get database connection status (admin only)
 * @access  Private (Admin)
 */
router.get('/db', authenticate, authorize(UserRole.ADMIN), getDbStatus);

/**
 * @route   GET /api/status/system
 * @desc    Get system status (admin only)
 * @access  Private (Admin)
 */
router.get('/system', authenticate, authorize(UserRole.ADMIN), getSystemStatus);

export default router;
