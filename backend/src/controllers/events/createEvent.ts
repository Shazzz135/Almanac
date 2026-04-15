import { Request, Response, NextFunction } from "express";
import { createEvent } from "../../services/eventService";
import { ValidationError } from "../../errors/index";

export const createEventHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { calendar_id, title, description, color, location, start, end, allDay } =
			req.body;
		const user_id = req.user?._id;

		console.log('[createEventHandler] Request body:', JSON.stringify(req.body, null, 2));
		console.log('[createEventHandler] User ID:', user_id);

		if (!user_id) {
			throw new ValidationError("User not authenticated");
		}

		if (!calendar_id) {
			throw new ValidationError("Calendar ID is required");
		}

		const event = await createEvent(calendar_id, user_id, {
			title,
			description,
			color,
			location,
			start,
			end,
			allDay,
		});

		res.status(201).json({ success: true, event });
	} catch (error) {
		next(error);
	}
};
