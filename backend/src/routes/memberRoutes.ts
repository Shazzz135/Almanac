import { Router } from "express";
import { addMember } from "../controllers/members/addMember";
import { getMembers } from "../controllers/members/getMembers";
import { updateMemberRole } from "../controllers/members/updateMemberRole";
import { removeMember } from "../controllers/members/removeMember";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @route   POST /api/members
 * @desc    Add a member to a calendar
 * @access  Private
 */
router.post('/', authenticate, addMember);

/**
 * @route   GET /api/members/:calendar_id
 * @desc    Get all members for a calendar
 * @access  Private
 */
router.get('/:calendar_id', authenticate, getMembers);

/**
 * @route   PUT /api/members/:memberId
 * @desc    Update a member's role
 * @access  Private
 */
router.put('/:memberId', authenticate, updateMemberRole);

/**
 * @route   DELETE /api/members/:memberId
 * @desc    Remove a member from a calendar
 * @access  Private
 */
router.delete('/:memberId', authenticate, removeMember);

export default router;
