/**
 * Navigation utilities for role-based routing
 */

import type { UserRoleType } from '../../types/auth/authTypes';

/**
 * Get the dashboard path for a specific user role
 */
export const getDashboardPath = (role: UserRoleType): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'user':
      return '/user/dashboard';
    default:
      return '/home'; // Fallback
  }
};

/**
 * Get a user-friendly role name
 */
export const getRoleName = (role: UserRoleType): string => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'user':
      return 'User';
    default:
      return 'User';
  }
};