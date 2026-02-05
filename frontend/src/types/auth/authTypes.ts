/**
 * Authentication Types
 * Defines all TypeScript interfaces and types for authentication
 */

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface MeResponse {
  data: {
    user: User;
  };
  message: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
  };
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRoleType;
    };
  };
}

export interface VerifyPasswordResetCodeRequest {
  code: string;
  newPassword: string;
}

export interface VerifyPasswordResetCodeResponse {
  message: string;
}
