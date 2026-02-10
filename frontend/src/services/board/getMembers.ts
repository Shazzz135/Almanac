import { authenticatedFetch } from '../../utils/auth/authClient';
import type { Member } from '../../types/board/memberTypes';

export async function getAllMembers(calendarId: string): Promise<Member[]> {
  const response = await authenticatedFetch(`/members/all/${calendarId}`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.members || [];
}
