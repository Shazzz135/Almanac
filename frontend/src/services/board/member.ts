import { authenticatedFetch } from '../../utils/auth/authClient';
import type { Member } from '../../types/board/memberTypes';

// Get the current user's membership for a calendar
export async function getCurrentMember(calendarId: string): Promise<Member | null> {
  try {
    const response = await authenticatedFetch(`/members/${calendarId}`);
    if (!response.ok) {
      console.error(`Failed to fetch member for calendar ${calendarId}:`, response.status);
      return null;
    }
    const data = await response.json();
    // Backend returns { success: true, member: {...} }
    const member = data.member;
    if (!member) {
      return null;
    }
    // Ensure _id exists; MongoDB should auto-include it
    return {
      ...member,
      _id: member._id || member.id,
    };
  } catch (err) {
    console.error(`Error fetching member for calendar ${calendarId}:`, err);
    return null;
  }
}

// Remove a member from a calendar
export async function removeMemberFromCalendar(memberId: string): Promise<{ success: boolean; message: string }> {
  if (!memberId) {
    throw new Error('Member ID is required');
  }
  try {
    console.log(`[removeMemberFromCalendar] Starting deletion for member: ${memberId}`);
    const response = await authenticatedFetch(`/members/${memberId}`, {
      method: 'DELETE',
    });
    console.log(`[removeMemberFromCalendar] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[removeMemberFromCalendar] Error response body:`, errorText);
      let errorMsg = 'Failed to remove member from calendar';
      try {
        const errorData = JSON.parse(errorText);
        errorMsg = errorData.message || errorData.error?.message || errorMsg;
      } catch {
        errorMsg = errorText || errorMsg;
      }
      throw new Error(errorMsg);
    }
    
    // Get response text first, then parse if available
    const responseText = await response.text();
    let data: any = { success: true, message: 'Member removed successfully' };
    
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn(`[removeMemberFromCalendar] Could not parse response body, but deletion succeeded:`, parseErr);
      }
    }
    
    console.log(`[removeMemberFromCalendar] Success response:`, data);
    return data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[removeMemberFromCalendar] Exception thrown:`, { error: err, message: errorMsg });
    throw new Error(errorMsg);
  }
}

// Get all members for a calendar
export async function getAllCalendarMembers(calendarId: string): Promise<Member[]> {
  try {
    console.log(`[getAllCalendarMembers] Fetching all members for calendar: ${calendarId}`);
    const response = await authenticatedFetch(`/members/all/${calendarId}`);
    
    if (!response.ok) {
      console.error(`[getAllCalendarMembers] Failed to fetch members, status: ${response.status}`);
      throw new Error('Failed to fetch calendar members');
    }
    
    const data = await response.json();
    console.log(`[getAllCalendarMembers] Success, found ${data.members?.length || 0} members`);
    
    // Ensure all members have required fields
    return (data.members || []).map((member: any) => ({
      _id: member._id || member.id,
      user_id: member.user_id,
      calendar_id: member.calendar_id,
      role: member.role || 'viewer',
      name: member.name || '',
      email: member.email || '',
      accepted: member.accepted !== undefined ? member.accepted : true,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));
  } catch (err) {
    console.error(`[getAllCalendarMembers] Error:`, err);
    throw err;
  }
}

// Update a member's role
export async function updateMemberRole(memberId: string, newRole: string): Promise<Member> {
  if (!memberId) {
    throw new Error('Member ID is required');
  }
  if (!newRole) {
    throw new Error('Role is required');
  }
  
  try {
    console.log(`[updateMemberRole] Updating member ${memberId} to role: ${newRole}`);
    const response = await authenticatedFetch(`/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[updateMemberRole] Error response:`, errorText);
      let errorMsg = 'Failed to update member role';
      try {
        const errorData = JSON.parse(errorText);
        errorMsg = errorData.message || errorData.error?.message || errorMsg;
      } catch {
        errorMsg = errorText || errorMsg;
      }
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    console.log(`[updateMemberRole] Success, new role: ${data.member?.role}`);
    
    return {
      ...data.member,
      _id: data.member._id || data.member.id,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[updateMemberRole] Exception thrown:`, { error: err, message: errorMsg });
    throw new Error(errorMsg);
  }
}