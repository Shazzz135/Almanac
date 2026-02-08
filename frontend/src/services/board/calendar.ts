import { authenticatedFetch } from '../../utils/auth/authClient';

export interface Calendar {
  _id: string;
  name: string;
  description?: string;
  type: string;
  owner_id: string;
}

// Returns all calendars the user is a member of
export async function getUserCalendar(): Promise<{ calendars: Calendar[] }> {
  const response = await authenticatedFetch('/calendars');
  if (!response.ok) {
    throw new Error('Failed to fetch calendars');
  }
  const data = await response.json();
  return { calendars: data.calendars || [] };
}
