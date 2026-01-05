/**
 * Strongly-Typed Socket.IO Event Contracts
 * Provides type-safe client ↔ server communication
 */

import { FormattedMessage, User } from './';

// ============================================
// Client → Server Events (what client emits)
// ============================================

export interface JoinRoomPayload {
  readonly username: string;
  readonly room: string;
}

export interface ChatMessagePayload {
  readonly content: string;
  readonly timestamp?: number;
}

export interface TypingPayload {
  readonly isTyping: boolean;
}

// Map of events client can emit to server
export interface ClientToServerEvents {
  joinRoom: (data: JoinRoomPayload) => void;
  chatMessage: (message: string) => void;
  typing: (data: TypingPayload) => void;
  leaveRoom: () => void;
}

// ============================================
// Server → Client Events (what server emits)
// ============================================

export interface RoomUsersPayload {
  readonly room: string;
  readonly users: readonly User[];
}

export interface UserTypingPayload {
  readonly username: string;
  readonly isTyping: boolean;
}

// Map of events server can emit to client
export interface ServerToClientEvents {
  message: (message: FormattedMessage) => void;
  roomUsers: (data: RoomUsersPayload) => void;
  usernameError: (error: string) => void;
  userTyping: (data: UserTypingPayload) => void;
  error: (error: { code: string; message: string }) => void;
}

// ============================================
// Inter-Server Events (for scaling with Redis)
// ============================================

export interface InterServerEvents {
  ping: () => void;
  userCountUpdate: (count: number) => void;
}

// ============================================
// Socket Data (stored per connection)
// ============================================

export interface SocketData {
  user?: User;
  joinedAt?: Date;
  lastActivity?: Date;
}

// ============================================
// Typed Socket Instance
// ============================================

import { Server, Socket } from 'socket.io';

export type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// ============================================
// Event Names as Constants (for consistency)
// ============================================

export const SocketEvents = {
  // Client → Server
  JOIN_ROOM: 'joinRoom',
  CHAT_MESSAGE: 'chatMessage',
  TYPING: 'typing',
  LEAVE_ROOM: 'leaveRoom',
  
  // Server → Client
  MESSAGE: 'message',
  ROOM_USERS: 'roomUsers',
  USERNAME_ERROR: 'usernameError',
  USER_TYPING: 'userTyping',
  ERROR: 'error',
  
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
} as const;

export type SocketEventName = typeof SocketEvents[keyof typeof SocketEvents];
