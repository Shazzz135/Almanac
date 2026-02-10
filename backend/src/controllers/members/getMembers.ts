import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendar_id } = req.params;
        const user_id = req.user?._id;
        
        console.log(`[getMembers] Fetching members for calendar: ${calendar_id}, user: ${user_id}`);
        
        if (!calendar_id) {
            return res.status(400).json({ success: false, message: "calendar_id is required" });
        }
        if (!user_id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        // Find the member record for the current user and calendar
        const member = await Member.findOne({ calendar_id, user_id }).populate('user_id', 'name email');
        
        if (!member) {
            console.log(`[getMembers] No membership found for user ${user_id} in calendar ${calendar_id}`);
            return res.status(404).json({ success: false, message: "Membership not found" });
        }
        
        console.log(`[getMembers] Found member:`, member._id);
        res.status(200).json({ success: true, member });
    } catch (error) {
        console.error(`[getMembers] Error:`, error);
        next(error);
    }
};
