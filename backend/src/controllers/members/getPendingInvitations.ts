import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import Calendar from "../../models/calendar";

/**
 * Helper function to update calendar type based on member count
 * If a calendar has more than 1 member, update it to 'group' type
 */
const updateCalendarTypeIfNeeded = async (calendar_id: string) => {
    try {
        // Count accepted members (including owner and accepted invites)
        const memberCount = await Member.countDocuments({
            calendar_id,
            accepted: true,
        });

        // If more than 1 member, update type to 'group'
        if (memberCount > 1) {
            await Calendar.updateOne(
                { _id: calendar_id },
                { type: 'group' }
            );
        }
    } catch (error) {
        console.error('Error updating calendar type:', error);
        // Don't throw - this is a non-critical operation
    }
};

/**
 * Get all pending invitations for the current user
 * Returns member records where accepted === false with populated calendar and owner info
 */
export const getPendingInvitations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Find all pending invitations for this user
        const pendingInvitations = await Member.find({
            user_id: userId,
            accepted: false,
        })
            .populate({
                path: 'calendar_id',
                select: 'name description type owner_id',
                populate: {
                    path: 'owner_id',
                    select: 'name email',
                }
            })
            .exec();

        // Transform the data to match frontend expectations
        const invitations = pendingInvitations.map((invitation) => {
            const calendar = invitation.calendar_id as any;
            const owner = calendar?.owner_id as any;
            
            return {
                _id: invitation._id,
                member_id: invitation._id,
                calendarName: calendar?.name || 'Unknown Calendar',
                calendarDescription: calendar?.description,
                calendarType: calendar?.type,
                inviterName: owner?.name || 'Unknown User',
                inviterEmail: owner?.email,
                role: invitation.role,
                status: 'pending' as const,
                created_at: invitation.createdAt,
            };
        });

        res.status(200).json({ 
            success: true, 
            data: { invitations },
            count: invitations.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Accept a pending invitation
 * Updates the member record to set accepted: true and joined_at: now
 * Also updates calendar type to 'group' if it now has multiple members
 */
export const acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { memberId } = req.params;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!memberId) {
            return res.status(400).json({ success: false, message: "memberId is required" });
        }

        // Find and verify the invitation belongs to this user
        const invitation = await Member.findOne({
            _id: memberId,
            user_id: userId,
            accepted: false,
        });

        if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found" });
        }

        // Update the invitation to accepted
        invitation.accepted = true;
        invitation.joined_at = new Date();
        await invitation.save();

        // Update calendar type if needed (when it now has multiple members)
        await updateCalendarTypeIfNeeded(invitation.calendar_id.toString());

        res.status(200).json({ 
            success: true, 
            message: "Invitation accepted successfully",
            data: { member: invitation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Decline a pending invitation
 * Removes the member record entirely
 */
export const declineInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { memberId } = req.params;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!memberId) {
            return res.status(400).json({ success: false, message: "memberId is required" });
        }

        // Find and verify the invitation belongs to this user
        const invitation = await Member.findOne({
            _id: memberId,
            user_id: userId,
            accepted: false,
        });

        if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found" });
        }

        // Delete the invitation
        await Member.deleteOne({ _id: memberId });

        res.status(200).json({ 
            success: true, 
            message: "Invitation declined successfully",
        });
    } catch (error) {
        next(error);
    }
};
