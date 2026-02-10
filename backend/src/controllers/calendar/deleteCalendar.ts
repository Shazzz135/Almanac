import { Request, Response, NextFunction } from "express";
import Calendar from "../../models/calendar";
import Member from "../../models/members";
import User from "../../models/user";
import { CustomError } from "../../errors/CustomError";

export const deleteCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { calendarId } = req.params;
        const owner_id = req.user?._id;

        const calendar = await Calendar.findOneAndDelete({ _id: calendarId, owner_id });
        if (!calendar) {
            throw new CustomError("Calendar not found or unauthorized", 404, "CALENDAR_ERROR");
        }

        // Cascade delete members
        await Member.deleteMany({ calendar_id: calendarId });

        // Decrement calendarCount for user, not below 0
        const user = await User.findById(owner_id);
        if (user && typeof user.calendarCount === "number" && user.calendarCount > 0) {
            user.calendarCount -= 1;
            await user.save();
        }

        res.status(200).json({ success: true, message: "Calendar and associated members deleted" });
    } catch (error) {
        next(error);
    }
};
