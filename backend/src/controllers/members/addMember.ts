import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import User from "../../models/user";
import Calendar from "../../models/calendar";
import { MemberRole } from "../../models/members";
import { CustomError } from "../../errors/CustomError";

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

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, calendar_id, role, email } = req.body;
        
        // If email is provided, look up the user
        let targetUserId = user_id;
        if (!targetUserId && email) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new CustomError("User with this email not found", 404, "MEMBER_ERROR");
            }
            targetUserId = user._id;
        }

        if (!targetUserId || !calendar_id || !role) {
            throw new CustomError("user_id/email, calendar_id, and role are required", 400, "MEMBER_ERROR");
        }

        // Role check: only owner/editor can add members
        const requesterId = req.user?._id;
        const requesterMembership = await Member.findOne({ user_id: requesterId, calendar_id });
        if (!requesterMembership || (requesterMembership.role !== "owner" && requesterMembership.role !== "editor")) {
            throw new CustomError("Only owners or editors can add members", 403, "MEMBER_ERROR");
        }

        // Prevent duplicate member entries
        const existingMember = await Member.findOne({ user_id: targetUserId, calendar_id });
        if (existingMember) {
            throw new CustomError("User is already a member of this calendar", 409, "MEMBER_ERROR");
        }

        // Create member with accepted set to false for invitations
        const member = new Member({
            user_id: targetUserId,
            calendar_id,
            role,
            accepted: false, // New invitations start as pending
        });
        await member.save();
        
        res.status(201).json({ 
            success: true, 
            message: `Invitation sent successfully`,
            data: { member } 
        });
    } catch (error) {
        next(error);
    }
};
