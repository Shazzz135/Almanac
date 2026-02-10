import { Request, Response, NextFunction } from "express";
import Calendar from "../../models/calendar";
import Member from "../../models/members";
import User from "../../models/user";
import { CustomError } from "../../errors/CustomError";

export const createCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, type } = req.body;
        const owner_id = req.user?._id; // Assumes auth middleware attaches user

        if (!name || !type) {
            throw new CustomError("Name and type are required", 400, "CALENDAR_ERROR");
        }

        const calendar = new Calendar({
            owner_id,
            name,
            description,
            type,
        });
        await calendar.save();

        // Create owner membership record
        const ownerMembership = new Member({
            user_id: owner_id,
            calendar_id: calendar._id,
            role: 'owner',
            accepted: true,
            joined_at: new Date(),
        });
        await ownerMembership.save();

        // Increment calendarCount for user if less than 3
        const user = await User.findById(owner_id);
        if (user && typeof user.calendarCount === "number" && user.calendarCount < 3) {
            user.calendarCount += 1;
            await user.save();
        }

        res.status(201).json({ success: true, calendar });
    } catch (error) {
        next(error);
    }
};
