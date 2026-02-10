import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import { CustomError } from "../../errors/CustomError";

export const getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendarId } = req.params;
        const userId = req.user?._id;
        
        console.log(`[getAllMembers] Fetching all members for calendar: ${calendarId}, user: ${userId}`);
        
        if (!calendarId) {
            return res.status(400).json({ success: false, message: "calendarId is required" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        // Check if the requesting user is a member of this calendar
        const requesterMember = await Member.findOne({ calendar_id: calendarId, user_id: userId });
        if (!requesterMember) {
            throw new CustomError("You are not a member of this calendar", 403, "MEMBER_ERROR");
        }
        
        // Get all members of the calendar with populated user info
        const members = await Member.find({ calendar_id: calendarId })
            .populate('user_id', 'name email');
        
        console.log(`[getAllMembers] Found ${members.length} members for calendar ${calendarId}`);
        
        // Transform the response to match frontend expectations
        const transformedMembers = members.map(member => {
            const userData = member.user_id as any;
            return {
                _id: member._id,
                user_id: userData?._id || member.user_id,
                calendar_id: member.calendar_id,
                role: member.role,
                name: userData?.name || '',
                email: userData?.email || '',
                accepted: member.accepted,
                createdAt: member.createdAt,
                updatedAt: member.updatedAt,
            };
        });
        
        res.status(200).json({ success: true, members: transformedMembers });
    } catch (error) {
        console.error(`[getAllMembers] Error:`, error);
        next(error);
    }
};
