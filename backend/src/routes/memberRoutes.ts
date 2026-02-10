import { Router } from "express";
import { addMember } from "../controllers/members/addMember";
import { getMembers } from "../controllers/members/getMembers";
import { getAllMembers } from "../controllers/members/getAllMembers";
import { updateMemberRole } from "../controllers/members/updateMemberRole";
import { removeMember } from "../controllers/members/removeMember";
import { getPendingInvitations, acceptInvitation, declineInvitation } from "../controllers/members/getPendingInvitations";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @route   POST /api/members
 * @desc    Add a member to a calendar
 * @access  Private
 */
router.post('/', authenticate, addMember);

/**
 * @route   GET /api/members/invitations/pending
 * @desc    Get all pending invitations for the current user
 * @access  Private
 */
router.get('/invitations/pending', authenticate, getPendingInvitations);

/**
 * @route   POST /api/members/:memberId/accept
 * @desc    Accept a pending invitation
 * @access  Private
 */
router.post('/:memberId/accept', authenticate, acceptInvitation);

/**
 * @route   POST /api/members/:memberId/decline
 * @desc    Decline a pending invitation
 * @access  Private
 */
router.post('/:memberId/decline', authenticate, declineInvitation);

/**
 * @route   GET /api/members/all/:calendarId
 * @desc    Get all members for a calendar
 * @access  Private
 */
router.get('/all/:calendarId', authenticate, getAllMembers);

/**
 * @route   GET /api/members/:calendar_id
 * @desc    Get current user's membership for a calendar
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
