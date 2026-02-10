import { authenticatedFetch } from '../../utils/auth/authClient';

export interface InviteRequest {
  emails: string[];
  role: 'editor' | 'viewer';
  calendarId: string;
}

export const inviteUsersToCalendar = async (
  calendarId: string,
  users: Array<{ email: string; role: 'editor' | 'viewer' }>
): Promise<{ success: boolean; message: string }> => {
  const response = await authenticatedFetch('/members', {
    method: 'POST',
    body: JSON.stringify({
      emails: users.map(u => u.email),
      role: users[0].role,
      calendar_id: calendarId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to invite users');
  }

  const data = await response.json();
  return {
    success: true,
    message: data.message || 'Invitations sent successfully',
  };
};

export const inviteUserToCalendar = async (
  calendarId: string,
  email: string,
  role: 'editor' | 'viewer'
): Promise<{ success: boolean; message: string }> => {
  const response = await authenticatedFetch('/members', {
    method: 'POST',
    body: JSON.stringify({
      email,
      role,
      calendar_id: calendarId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to invite user');
  }

  const data = await response.json();
  return {
    success: true,
    message: data.message || 'Invitation sent successfully',
  };
};
