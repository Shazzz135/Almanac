import { authenticatedFetch } from '../../utils/auth/authClient';

export interface Member {
  user_id: string;
  calendar_id: string;
  role: 'owner' | 'editor' | 'viewer';
  name?: string;
  email?: string;
  accepted?: boolean;
}

export async function getAllMembers(calendarId: string): Promise<Member[]> {
  const response = await authenticatedFetch(`/members/all/${calendarId}`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.members || [];
}
