import { Request, Response, NextFunction } from "express";
import Calendar from "../../models/calendar";

export const getCalendars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner_id = req.user?._id; // Assumes auth middleware attaches user
        const calendars = await Calendar.find({ owner_id });
        res.status(200).json({ success: true, calendars });
    } catch (error) {
        next(error);
    }
};
