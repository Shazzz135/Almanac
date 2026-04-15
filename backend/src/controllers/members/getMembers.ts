import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";
import Calendar from "../../models/calendar";

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendar_id } = req.params;
        const user_id = req.user?._id;
        
        console.log(`[getMembers] Fetching member info for calendar: ${calendar_id}, user: ${user_id}`);
        
        if (!calendar_id) {
            return res.status(400).json({ success: false, message: "calendar_id is required" });
        }
        if (!user_id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        // First, try to find a member record (for invited members or owner membership records)
        let member = await Member.findOne({ calendar_id, user_id }).populate('user_id', 'name email');
        
        if (member) {
            console.log(`[getMembers] Found member record with role: ${member.role}`);
            return res.status(200).json({ success: true, member });
        }
        
        // If no member record exists, check if user is the calendar owner
        console.log(`[getMembers] No member record found, checking if user is calendar owner`);
        const calendar = await Calendar.findById(calendar_id);
        
        if (!calendar) {
            console.log(`[getMembers] Calendar not found`);
            return res.status(404).json({ success: false, message: "Calendar not found" });
        }
        
        if (calendar.owner_id.toString() === user_id.toString()) {
            console.log(`[getMembers] User is the calendar owner`);
            // Return a synthesized owner member object
            const ownerMember = {
                _id: `owner-${calendar_id}`,
                user_id: { _id: user_id, name: 'You', email: '' },
                calendar_id,
                role: 'owner',
                accepted: true,
                joined_at: calendar.createdAt,
            };
            return res.status(200).json({ success: true, member: ownerMember });
        }
        
        console.log(`[getMembers] User is not a member or owner of this calendar`);
        return res.status(403).json({ success: false, message: "Not a member of this calendar" });
    } catch (error) {
        console.error(`[getMembers] Error:`, error);
        next(error);
    }
};
