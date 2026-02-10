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
// Create a new calendar
export async function createCalendar(name: string, description: string): Promise<Calendar> {
  const response = await authenticatedFetch('/calendars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, type: 'personal' }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create calendar');
  }
  
  const data = await response.json();
  return data.calendar;
}

// Update a calendar
export async function updateCalendar(calendarId: string, name: string, description: string): Promise<Calendar> {
  console.log(`[updateCalendar] Updating calendar ${calendarId} with name: "${name}", description: "${description}"`);
  
  const response = await authenticatedFetch(`/calendars/${calendarId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[updateCalendar] Error response:', errorData);
    throw new Error(errorData.message || 'Failed to update calendar');
  }
  
  const data = await response.json();
  console.log('[updateCalendar] Success:', data.calendar);
  return data.calendar;
}

// Delete a calendar
export async function deleteCalendar(calendarId: string): Promise<{ success: boolean; message: string }> {
  console.log(`[deleteCalendar] Deleting calendar ${calendarId}`);
  
  const response = await authenticatedFetch(`/calendars/${calendarId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[deleteCalendar] Error response:', errorData);
    throw new Error(errorData.message || 'Failed to delete calendar');
  }
  
  const data = await response.json();
  console.log('[deleteCalendar] Success:', data);
  return { success: true, message: data.message || 'Calendar deleted successfully' };
}