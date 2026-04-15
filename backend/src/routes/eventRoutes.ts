import { Router } from "express";
import { createEventHandler } from "../controllers/events/createEvent";
import { getEventsHandler } from "../controllers/events/getEvents";
import { deleteEventHandler } from "../controllers/events/deleteEvent";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @route   POST /api/events
 * @desc    Create a new event in a calendar
 * @access  Private
 */
router.post("/", authenticate, createEventHandler);

/**
 * @route   GET /api/events
 * @desc    Get all events for a specific calendar
 * @access  Private
 */
router.get("/", authenticate, getEventsHandler);

/**
 * @route   DELETE /api/events/:eventId
 * @desc    Delete an event
 * @access  Private
 */
router.delete("/:eventId", authenticate, deleteEventHandler);

export default router;
