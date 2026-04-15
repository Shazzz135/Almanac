import { authenticatedFetch } from '../../utils/auth/authClient';

export interface Event {
  _id: string;
  calendar_id: string;
  title: string;
  description?: string;
  color: string;
  location?: string;
  start: string;
  end: string;
  allDay: boolean;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new event in a calendar
 */
export async function createEvent(
  calendarId: string,
  eventData: {
    title: string;
    description: string;
    color: string;
    location: string;
    start: string;
    end: string;
  }
): Promise<Event> {
  const payload = {
    calendar_id: calendarId,
    ...eventData,
  };

  console.log('[events.createEvent] Sending payload:', payload);

  const response = await authenticatedFetch('/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[events.createEvent] Error response:', {
      status: response.status,
      errorData,
    });
    const errorMsg = errorData.error?.message || errorData.message || 'Failed to create event';
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.event;
}

/**
 * Get all events for a specific calendar
 */
export async function getEventsByCalendar(calendarId: string): Promise<Event[]> {
  const response = await authenticatedFetch(`/events?calendarId=${calendarId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || errorData.message || 'Failed to fetch events';
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.events || [];
}

/**
 * Delete an event
 */
export async function deleteEventFromServer(eventId: string): Promise<void> {
  const response = await authenticatedFetch(`/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || errorData.message || 'Failed to delete event';
    throw new Error(errorMsg);
  }
}
