/**
 * User Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('join', () => {
    it('should add a user successfully', () => {
      const result = userService.join('socket-1', 'alice', 'general');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('socket-1');
        expect(result.data.username).toBe('alice');
        expect(result.data.room).toBe('general');
      }
    });

    it('should reject duplicate usernames', () => {
      userService.join('socket-1', 'alice', 'general');
      const result = userService.join('socket-2', 'Alice', 'general');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('USERNAME_TAKEN');
      }
    });

    it('should allow same username in different case sensitivity', () => {
      userService.join('socket-1', 'alice', 'general');
      const result = userService.join('socket-2', 'ALICE', 'general');

      // Should fail because username check is case-insensitive
      expect(result.success).toBe(false);
    });
  });

  describe('getById', () => {
    it('should return user by socket id', () => {
      userService.join('socket-1', 'alice', 'general');

      const user = userService.getById('socket-1');

      expect(user).toBeDefined();
      expect(user?.username).toBe('alice');
    });

    it('should return undefined for non-existent user', () => {
      const user = userService.getById('non-existent');

      expect(user).toBeUndefined();
    });
  });

  describe('leave', () => {
    it('should remove user and return their data', () => {
      userService.join('socket-1', 'alice', 'general');

      const user = userService.leave('socket-1');

      expect(user).toBeDefined();
      expect(user?.username).toBe('alice');
      expect(userService.getById('socket-1')).toBeUndefined();
    });

    it('should return undefined for non-existent user', () => {
      const user = userService.leave('non-existent');

      expect(user).toBeUndefined();
    });
  });

  describe('getRoomUsers', () => {
    it('should return all users in a room', () => {
      userService.join('socket-1', 'alice', 'general');
      userService.join('socket-2', 'bob', 'general');
      userService.join('socket-3', 'charlie', 'random');

      const users = userService.getRoomUsers('general');

      expect(users).toHaveLength(2);
      expect(users.map((u) => u.username)).toContain('alice');
      expect(users.map((u) => u.username)).toContain('bob');
    });

    it('should return empty array for empty room', () => {
      const users = userService.getRoomUsers('empty-room');

      expect(users).toHaveLength(0);
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true for available username', () => {
      expect(userService.isUsernameAvailable('alice')).toBe(true);
    });

    it('should return false for taken username', () => {
      userService.join('socket-1', 'alice', 'general');

      expect(userService.isUsernameAvailable('alice')).toBe(false);
      expect(userService.isUsernameAvailable('ALICE')).toBe(false);
    });
  });

  describe('getActiveRooms', () => {
    it('should return all active rooms', () => {
      userService.join('socket-1', 'alice', 'general');
      userService.join('socket-2', 'bob', 'random');

      const rooms = userService.getActiveRooms();

      expect(rooms).toHaveLength(2);
      expect(rooms).toContain('general');
      expect(rooms).toContain('random');
    });
  });
});
