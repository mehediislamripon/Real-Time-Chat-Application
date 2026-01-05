/**
 * User Service
 * Handles user management with proper encapsulation and type safety
 */

import { User } from '../types';
import { UserError, ErrorCodes, Result, success, failure } from '../types/errors';
import { createLogger } from './logger.service';

const logger = createLogger('UserService');

// User store interface for dependency injection
export interface UserStore {
  add(user: User): void;
  remove(id: string): User | undefined;
  findById(id: string): User | undefined;
  findByUsername(username: string): User | undefined;
  findByRoom(room: string): readonly User[];
  getAll(): readonly User[];
  clear(): void;
  count(): number;
}

// In-memory implementation
class InMemoryUserStore implements UserStore {
  private users: Map<string, User> = new Map();
  private usernameIndex: Map<string, string> = new Map(); // username -> id

  add(user: User): void {
    this.users.set(user.id, user);
    this.usernameIndex.set(user.username.toLowerCase(), user.id);
  }

  remove(id: string): User | undefined {
    const user = this.users.get(id);
    if (user) {
      this.users.delete(id);
      this.usernameIndex.delete(user.username.toLowerCase());
    }
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findByUsername(username: string): User | undefined {
    const id = this.usernameIndex.get(username.toLowerCase());
    return id ? this.users.get(id) : undefined;
  }

  findByRoom(room: string): readonly User[] {
    return Array.from(this.users.values()).filter(
      (user) => user.room.toLowerCase() === room.toLowerCase()
    );
  }

  getAll(): readonly User[] {
    return Array.from(this.users.values());
  }

  clear(): void {
    this.users.clear();
    this.usernameIndex.clear();
  }

  count(): number {
    return this.users.size;
  }
}

// User service class
export class UserService {
  constructor(private readonly store: UserStore = new InMemoryUserStore()) {}

  /**
   * Add a new user to the chat
   */
  join(id: string, username: string, room: string): Result<User, UserError> {
    // Check for duplicate username
    const existingUser = this.store.findByUsername(username);
    if (existingUser) {
      logger.warn('Username already taken', { username, attemptedId: id });
      return failure(new UserError('Username is already taken', ErrorCodes.USERNAME_TAKEN));
    }

    const user: User = Object.freeze({ id, username, room });
    this.store.add(user);
    
    logger.info('User joined', { userId: id, username, room });
    return success(user);
  }

  /**
   * Get user by socket ID
   */
  getById(id: string): User | undefined {
    return this.store.findById(id);
  }

  /**
   * Get user by username
   */
  getByUsername(username: string): User | undefined {
    return this.store.findByUsername(username);
  }

  /**
   * Remove user when they disconnect
   */
  leave(id: string): User | undefined {
    const user = this.store.remove(id);
    if (user) {
      logger.info('User left', { userId: id, username: user.username, room: user.room });
    }
    return user;
  }

  /**
   * Get all users in a specific room
   */
  getRoomUsers(room: string): readonly User[] {
    return this.store.findByRoom(room);
  }

  /**
   * Get total user count
   */
  getTotalCount(): number {
    return this.store.count();
  }

  /**
   * Get room count
   */
  getRoomCount(room: string): number {
    return this.store.findByRoom(room).length;
  }

  /**
   * Check if username is available
   */
  isUsernameAvailable(username: string): boolean {
    return !this.store.findByUsername(username);
  }

  /**
   * Get all active rooms
   */
  getActiveRooms(): string[] {
    const rooms = new Set<string>();
    this.store.getAll().forEach((user) => rooms.add(user.room));
    return Array.from(rooms);
  }
}

// Singleton instance for the application
export const userService = new UserService();
