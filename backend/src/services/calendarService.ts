import Calendar from '../models/calendar';
import Member from '../models/members';


/**
 * Fetch all calendars the user is a member of (accepted), including owned calendars.
 * @param userId - The user's ObjectId
 */
export async function getUserCalendars(userId: string) {
  // Find all accepted memberships
  const memberLinks = await Member.find({ user_id: userId, accepted: true });
  const memberCalendarIds = memberLinks.map((m) => m.calendar_id);

  // Find all calendars where user is owner
  const ownedCalendars = await Calendar.find({ owner_id: userId });
  const ownedCalendarIds = ownedCalendars.map((c) => c._id.toString());

  // Merge and dedupe calendar IDs
  const allCalendarIds = Array.from(new Set([
    ...memberCalendarIds.map((id) => id.toString()),
    ...ownedCalendarIds,
  ]));

  // Fetch all calendars
  const calendars = await Calendar.find({ _id: { $in: allCalendarIds } });
  return calendars;
}
