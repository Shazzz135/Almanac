import { authenticatedFetch } from '../../utils/auth/authClient';

export interface Calendar {
  _id: string;
  name: string;
  description?: string;
  type: string;
  owner_id: string;
}

export async function getUserCalendar(): Promise<Calendar> {
  const response = await authenticatedFetch('/calendars');
  if (!response.ok) {
    throw new Error('Failed to fetch calendars');
  }
  const data = await response.json();
  // Return the first calendar (user's primary calendar)
  const calendars = data.calendars || [];
  if (calendars.length === 0) {
    throw new Error('No calendars found');
  }
  return calendars[0];
}
