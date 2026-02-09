import { authenticatedFetch } from '../../utils/auth/authClient';

export interface Member {
  user_id: string;
  calendar_id: string;
  role: 'owner' | 'editor' | 'viewer';
  name?: string;
  email?: string;
}

// Get the current user's membership for a calendar
export async function getCurrentMember(calendarId: string): Promise<Member | null> {
  const response = await authenticatedFetch(`/members/${calendarId}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  // Find the member matching the current user
  // (Assume backend only returns the current user's membership)
  return data.member || null;
}
