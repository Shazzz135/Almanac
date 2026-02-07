import { Router } from "express";
import { createCalendar } from '../controllers/calendar/createCalendar';
import { getCalendars } from '../controllers/calendar/getCalendars';
import { updateCalendar } from '../controllers/calendar/updateCalendar';
import { deleteCalendar } from '../controllers/calendar/deleteCalendar';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

/**
 * @route   POST /api/calendars
 * @desc    Create a new calendar
 * @access  Private
 */
router.post('/', authenticate, createCalendar);

/**
 * @route   GET /api/calendars
 * @desc    Get all calendars for authenticated user
 * @access  Private
 */
router.get('/', authenticate, getCalendars);

/**
 * @route   PUT /api/calendars/:calendarId
 * @desc    Update a calendar
 * @access  Private
 */
router.put('/:calendarId', authenticate, updateCalendar);

/**
 * @route   DELETE /api/calendars/:calendarId
 * @desc    Delete a calendar
 * @access  Private
 */
router.delete('/:calendarId', authenticate, deleteCalendar);

export default router;
