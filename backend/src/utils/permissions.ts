import { UserRole } from '../models/user';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuthorizationError } from '../errors/authorizationError';

/**
 * Permission checking utilities for role-based access control
 * Provides helper methods for validating permissions in controllers and services
 * 
 * Current roles:
 * - ADMIN: Full system access
 * - USER: Can only access and modify their own resources
 */
export class PermissionChecker {
  /**
   * Check if user can modify their own profile
   * Users can only modify themselves, admins can modify any user
   * 
   * @param currentUserId - Current user's ID
   * @param currentUserRole - Current user's role
   * @param targetUserId - User ID being modified
   * @returns true if modification is allowed
   */
  static canModifyUser(
    currentUserId: string,
    currentUserRole: UserRole,
    targetUserId: string
  ): boolean {
    // Users can always modify themselves
    if (currentUserId === targetUserId) {
      return true;
    }

    // Admins can modify any user
    if (currentUserRole === UserRole.ADMIN) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can view another user's profile
   * Users can only view their own profile, admins can view any user
   * 
   * @param currentUserId - Current user's ID
   * @param currentUserRole - Current user's role
   * @param targetUserId - User ID being accessed
   * @returns true if viewing is allowed
   */
  static canViewUser(
    currentUserId: string,
    currentUserRole: UserRole,
    targetUserId: string
  ): boolean {
    // Users can always view their own profile
    if (currentUserId === targetUserId) {
      return true;
    }

    // Admins can view any user
    if (currentUserRole === UserRole.ADMIN) {
      return true;
    }

    return false;
  }

  /**
   * Check if user can delete a user
   * Only admins can delete users
   * 
   * @param currentUserRole - Current user's role
   * @returns true if deletion is allowed
   */
  static canDeleteUser(currentUserRole: UserRole): boolean {
    return currentUserRole === UserRole.ADMIN;
  }

  /**
   * Enforce modification permission
   * Throws AuthorizationError if user cannot modify the target user
   * 
   * @param req - Express request with authenticated user
   * @param targetUserId - User ID to validate modification for
   * @throws AuthorizationError if access is denied
   */
  static requireModifyUserPermission(req: AuthRequest, targetUserId: string): void {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userId = (req.user as any)._id.toString();
    const userRole = req.user.role || UserRole.USER;

    if (!this.canModifyUser(userId, userRole, targetUserId)) {
      throw new AuthorizationError('Access denied: you can only modify your own profile');
    }
  }

  /**
   * Enforce view permission
   * Throws AuthorizationError if user cannot view the target user
   * 
   * @param req - Express request with authenticated user
   * @param targetUserId - User ID to validate viewing for
   * @throws AuthorizationError if access is denied
   */
  static requireViewUserPermission(req: AuthRequest, targetUserId: string): void {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userId = (req.user as any)._id.toString();
    const userRole = req.user.role || UserRole.USER;

    if (!this.canViewUser(userId, userRole, targetUserId)) {
      throw new AuthorizationError('Access denied: you can only view your own profile');
    }
  }

  /**
   * Enforce admin-only permission
   * Throws AuthorizationError if user is not an admin
   * 
   * @param req - Express request with authenticated user
   * @throws AuthorizationError if user is not an admin
   */
  static requireAdmin(req: AuthRequest): void {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = req.user.role || UserRole.USER;

    if (userRole !== UserRole.ADMIN) {
      throw new AuthorizationError('Access denied: admin privileges required');
    }
  }

  /**
   * Enforce delete permission
   * Throws AuthorizationError if user cannot delete the target user
   * 
   * @param req - Express request with authenticated user
   * @throws AuthorizationError if access is denied
   */
  static requireDeleteUserPermission(req: AuthRequest): void {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = req.user.role || UserRole.USER;

    if (!this.canDeleteUser(userRole)) {
      throw new AuthorizationError('Access denied: only admins can delete users');
    }
  }
}