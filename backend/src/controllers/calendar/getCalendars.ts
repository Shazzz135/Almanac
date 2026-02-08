import { Request, Response, NextFunction } from "express";

import { getUserCalendars } from '../../services/calendarService';

export const getCalendars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const calendars = await getUserCalendars(userId);
        res.status(200).json({ success: true, calendars });
    } catch (error) {
        next(error);
    }
};
