import Event from '../models/events';
import Member from '../models/members';
import Calendar from '../models/calendar';
import { ValidationError, AuthorizationError } from '../errors/index';

type MemberRole = 'owner' | 'editor' | 'viewer';

/**
 * Get user's role for a calendar
 * @param calendar_id - Calendar ObjectId
 * @param userId - User ObjectId
 * @returns 'owner' | 'editor' | 'viewer' | null
 */
async function getUserRoleForCalendar(calendar_id: string, userId: string): Promise<MemberRole | null> {
	// Check if user is owner
	const calendar = await Calendar.findOne({ _id: calendar_id, owner_id: userId });
	if (calendar) {
		return 'owner';
	}

	// Check if user is an accepted member
	const member = await Member.findOne({
		calendar_id,
		user_id: userId,
		accepted: true,
	});

	if (member) {
		return member.role as MemberRole;
	}

	return null;
}

/**
 * Check if user is a member or owner of a calendar
 * @param calendar_id - Calendar ObjectId
 * @param userId - User ObjectId
 */
async function isUserMemberOfCalendar(calendar_id: string, userId: string) {
	const role = await getUserRoleForCalendar(calendar_id, userId);
	return role !== null;
}

/**
 * Create a new event in a calendar
 * @param calendar_id - Calendar ObjectId
 * @param userId - User ObjectId (creator)
 * @param eventData - Event data from form
 */
export async function createEvent(
	calendar_id: string,
	userId: string,
	eventData: {
		title: string;
		description?: string;
		color: string;
		location?: string;
		start: string;
		end: string;
		allDay?: boolean;
	}
) {
	console.log('[eventService.createEvent] Starting with:', {
		calendar_id,
		userId,
		eventData,
	});

	// Check if user has permission to create event (owner or editor only)
	const userRole = await getUserRoleForCalendar(calendar_id, userId);
	console.log('[eventService.createEvent] userRole:', userRole);
	if (!userRole) {
		throw new AuthorizationError('You are not a member of this calendar.');
	}
	if (userRole === 'viewer') {
		throw new AuthorizationError('Viewers cannot create events.');
	}

	// Validate event data
	if (!eventData.title || !eventData.title.trim()) {
		throw new ValidationError('Event title is required.');
	}
	if (!eventData.color) {
		throw new ValidationError('Event color is required.');
	}

	// Parse dates
	const startDate = new Date(eventData.start);
	const endDate = new Date(eventData.end);

	console.log('[eventService.createEvent] Parsed dates:', {
		startInput: eventData.start,
		startDate: startDate.toISOString(),
		endInput: eventData.end,
		endDate: endDate.toISOString(),
	});

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		throw new ValidationError('Invalid event start or end time.');
	}

	if (endDate <= startDate) {
		throw new ValidationError('Event end time must be after start time.');
	}

	// Create event
	const event = await Event.create({
		calendar_id,
		title: eventData.title.trim(),
		description: eventData.description?.trim() || undefined,
		color: eventData.color,
		location: eventData.location?.trim() || undefined,
		start: startDate,
		end: endDate,
		allDay: eventData.allDay || false,
		created_by: userId,
	});

	console.log('[eventService.createEvent] Event created:', event._id);
	return event;
}

/**
 * Get all events for a specific calendar (user must be member)
 * @param calendar_id - Calendar ObjectId
 * @param userId - User ObjectId
 */
export async function getEventsByCalendar(
	calendar_id: string,
	userId: string
) {
	// Validate user is member or owner of calendar
	const isMember = await isUserMemberOfCalendar(calendar_id, userId);
	if (!isMember) {
		throw new AuthorizationError('You are not a member of this calendar.');
	}

	// Fetch events sorted by start time
	const events = await Event.find({ calendar_id })
		.sort({ start: 1 })
		.exec();

	return events;
}

/**
 * Delete an event (only owner or editor can delete)
 * @param eventId - Event ObjectId
 * @param userId - User ObjectId
 */
export async function deleteEvent(eventId: string, userId: string) {
	const event = await Event.findById(eventId);
	if (!event) {
		throw new ValidationError('Event not found.');
	}

	// Check user's role for this calendar
	const userRole = await getUserRoleForCalendar(event.calendar_id.toString(), userId);
	console.log('[eventService.deleteEvent] userRole:', userRole);

	// Only owner or editor can delete
	if (!userRole || userRole === 'viewer') {
		throw new AuthorizationError('You do not have permission to delete this event.');
	}

	await Event.findByIdAndDelete(eventId);
}
