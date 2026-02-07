import { Request, Response, NextFunction } from "express";
import Member from "../../models/members";

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendar_id } = req.params;
        if (!calendar_id) {
            return res.status(400).json({ success: false, message: "calendar_id is required" });
        }
        const members = await Member.find({ calendar_id }).populate('user_id', 'name email role');
        res.status(200).json({ success: true, members });
    } catch (error) {
        next(error);
    }
};
