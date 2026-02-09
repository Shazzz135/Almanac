import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendar_id } = req.params;
        const user_id = req.user?._id; // assuming authentication middleware sets req.user
        if (!calendar_id) {
            return res.status(400).json({ success: false, message: "calendar_id is required" });
        }
        if (!user_id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        // Find the member record for the current user and calendar
        const member = await Member.findOne({ calendar_id, user_id }).populate('user_id', 'name email');
        if (!member) {
            return res.status(404).json({ success: false, message: "Membership not found" });
        }
        res.status(200).json({ success: true, member });
    } catch (error) {
        next(error);
    }
};
