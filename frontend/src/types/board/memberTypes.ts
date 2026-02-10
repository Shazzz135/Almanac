/**
 * Member & Invitation Types
 * Defines all TypeScript interfaces and types for calendar members and invitations
 */

export type MemberRole = 'owner' | 'editor' | 'viewer';

export interface Member {
  _id: string;
  user_id: string;
  calendar_id: string;
  role: MemberRole;
  name?: string;
  email?: string;
  accepted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  joined_at?: string;
}

export interface Invitation {
  _id: string;
  member_id?: string;
  calendarName: string;
  calendarDescription?: string;
  calendarId?: string;
  calendarType?: string;
  inviterName: string;
  inviterEmail?: string;
  role: MemberRole;
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
}

export interface InviteRequest {
  email: string;
  role: MemberRole;
  calendar_id: string;
}

export interface MemberResponse {
  success: boolean;
  message: string;
  member?: Member;
  data?: {
    member: Member;
  };
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data?: {
    invitations: Invitation[];
  };
}
