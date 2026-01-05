/**
 * Core Type Definitions for Chat Application
 * All types are immutable for safety
 */

// ============================================
// User Types
// ============================================

export interface User {
  readonly id: string;
  readonly username: string;
  readonly room: string;
}

export interface UserWithMetadata extends User {
  readonly joinedAt: Date;
  readonly lastActivity?: Date;
}

// ============================================
// Message Types
// ============================================

export interface FormattedMessage {
  readonly username: string;
  readonly text: string;
  readonly time: string;
}

export interface MessageWithId extends FormattedMessage {
  readonly id: string;
  readonly timestamp: number;
}

// ============================================
// Room Types
// ============================================

export interface RoomInfo {
  readonly name: string;
  readonly userCount: number;
  readonly createdAt: Date;
}

export interface RoomUsers {
  readonly room: string;
  readonly users: readonly User[];
}

// ============================================
// Legacy Types (for backward compatibility)
// ============================================

/** @deprecated Use Result<User, UserError> from errors.ts instead */
export interface UserJoinResult {
  error?: string;
  user?: User;
}

/** @deprecated Use JoinRoomPayload from socket.types.ts instead */
export interface JoinRoomData {
  username: string;
  room: string;
}

// ============================================
// Re-exports
// ============================================

export * from './socket.types';
export * from './errors';
