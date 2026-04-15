import { Request, Response, NextFunction } from "express";
import { getEventsByCalendar } from "../../services/eventService";
import { ValidationError } from "../../errors/index";

export const getEventsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { calendarId } = req.query;
		const user_id = req.user?._id;

		if (!user_id) {
			throw new ValidationError("User not authenticated");
		}

		if (!calendarId || typeof calendarId !== "string") {
			throw new ValidationError("Calendar ID is required");
		}

		const events = await getEventsByCalendar(calendarId, user_id);

		res.status(200).json({ success: true, events });
	} catch (error) {
		next(error);
	}
};
