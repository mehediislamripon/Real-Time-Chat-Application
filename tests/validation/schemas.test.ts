/**
 * Validation Schema Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  usernameSchema, 
  roomSchema, 
  messageSchema, 
  joinRoomSchema,
  validate 
} from '../../src/validation/schemas';

describe('Validation Schemas', () => {
  describe('usernameSchema', () => {
    it('should accept valid usernames', () => {
      expect(usernameSchema.safeParse('alice').success).toBe(true);
      expect(usernameSchema.safeParse('Bob_123').success).toBe(true);
      expect(usernameSchema.safeParse('user-name').success).toBe(true);
    });

    it('should reject too short usernames', () => {
      const result = usernameSchema.safeParse('a');
      expect(result.success).toBe(false);
    });

    it('should reject too long usernames', () => {
      const result = usernameSchema.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
    });

    it('should reject usernames with special characters', () => {
      expect(usernameSchema.safeParse('user@name').success).toBe(false);
      expect(usernameSchema.safeParse('user name').success).toBe(false);
      expect(usernameSchema.safeParse('user!').success).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = usernameSchema.safeParse('  alice  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('alice');
      }
    });
  });

  describe('roomSchema', () => {
    it('should accept valid room names', () => {
      expect(roomSchema.safeParse('general').success).toBe(true);
      expect(roomSchema.safeParse('Room 123').success).toBe(true);
      expect(roomSchema.safeParse('my-room_name').success).toBe(true);
    });

    it('should reject empty room names', () => {
      expect(roomSchema.safeParse('').success).toBe(false);
    });

    it('should reject room names with special characters', () => {
      expect(roomSchema.safeParse('room@name').success).toBe(false);
    });
  });

  describe('messageSchema', () => {
    it('should accept valid messages', () => {
      expect(messageSchema.safeParse('Hello!').success).toBe(true);
      expect(messageSchema.safeParse('A').success).toBe(true);
    });

    it('should reject empty messages', () => {
      expect(messageSchema.safeParse('').success).toBe(false);
    });

    it('should reject too long messages', () => {
      expect(messageSchema.safeParse('a'.repeat(1001)).success).toBe(false);
    });

    it('should sanitize HTML to prevent XSS', () => {
      const result = messageSchema.safeParse('<script>alert("xss")</script>');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toContain('<script>');
        expect(result.data).toContain('&lt;script&gt;');
      }
    });
  });

  describe('joinRoomSchema', () => {
    it('should accept valid join room data', () => {
      const result = joinRoomSchema.safeParse({
        username: 'alice',
        room: 'general',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(joinRoomSchema.safeParse({ username: 'a' }).success).toBe(false);
      expect(joinRoomSchema.safeParse({ room: 'general' }).success).toBe(false);
    });
  });

  describe('validate helper', () => {
    it('should return success result for valid data', () => {
      const result = validate(usernameSchema, 'alice');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('alice');
      }
    });

    it('should return failure result for invalid data', () => {
      const result = validate(usernameSchema, 'a');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('at least 2 characters');
      }
    });
  });
});
