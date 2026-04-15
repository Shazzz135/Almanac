import { Request, Response, NextFunction } from "express";
import { deleteEvent } from "../../services/eventService";
import { ValidationError } from "../../errors/index";

export const deleteEventHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { eventId } = req.params;
		const user_id = req.user?._id;

		console.log('[deleteEventHandler] Deleting event:', {
			eventId,
			user_id,
		});

		if (!user_id) {
			throw new ValidationError("User not authenticated");
		}

		if (!eventId) {
			throw new ValidationError("Event ID is required");
		}

		await deleteEvent(eventId, user_id);

		res.status(200).json({ success: true, message: "Event deleted successfully" });
	} catch (error) {
		next(error);
	}
};
