import { Request, Response, NextFunction } from "express";
import Calendar from "../../models/calendar";
import { CustomError } from "../../errors/CustomError";

export const updateCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendarId } = req.params;
        const { name, description, type } = req.body;
        const owner_id = req.user?._id;

        const calendar = await Calendar.findOne({ _id: calendarId, owner_id });
        if (!calendar) {
            throw new CustomError("Calendar not found or unauthorized", 404, "CALENDAR_ERROR");
        }

        if (name) calendar.name = name;
        if (description) calendar.description = description;
        if (type) calendar.type = type;

        await calendar.save();
        res.status(200).json({ success: true, calendar });
    } catch (error) {
        next(error);
    }
};
