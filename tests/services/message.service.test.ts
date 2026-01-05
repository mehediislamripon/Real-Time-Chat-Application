/**
 * Message Service Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  formatMessage, 
  createBotMessage, 
  createWelcomeMessage,
  createUserJoinedMessage,
  createUserLeftMessage,
  MessageService 
} from '../../src/services/message.service';

// Mock moment-timezone
vi.mock('moment-timezone', () => ({
  default: () => ({
    tz: () => ({
      format: () => '10:30 am',
    }),
  }),
}));

describe('Message Service', () => {
  describe('formatMessage', () => {
    it('should format message with username and text', () => {
      const message = formatMessage('alice', 'Hello, world!');

      expect(message.username).toBe('alice');
      expect(message.text).toBe('Hello, world!');
      expect(message.time).toBe('10:30 am');
    });

    it('should create immutable message', () => {
      const message = formatMessage('alice', 'Hello');

      expect(Object.isFrozen(message)).toBe(true);
    });
  });

  describe('createBotMessage', () => {
    it('should create message from bot', () => {
      const message = createBotMessage('System message');

      expect(message.username).toBe('XeroxChat Bot');
      expect(message.text).toBe('System message');
    });
  });

  describe('createWelcomeMessage', () => {
    it('should create welcome message', () => {
      const message = createWelcomeMessage();

      expect(message.text).toContain('Welcome');
    });
  });

  describe('createUserJoinedMessage', () => {
    it('should create user joined message', () => {
      const message = createUserJoinedMessage('alice');

      expect(message.text).toContain('alice');
      expect(message.text).toContain('joined');
    });
  });

  describe('createUserLeftMessage', () => {
    it('should create user left message', () => {
      const message = createUserLeftMessage('alice');

      expect(message.text).toContain('alice');
      expect(message.text).toContain('left');
    });
  });

  describe('MessageService class', () => {
    let service: MessageService;

    beforeEach(() => {
      service = new MessageService();
    });

    it('should format messages', () => {
      const message = service.format('alice', 'Hello');

      expect(message.username).toBe('alice');
      expect(message.text).toBe('Hello');
    });

    it('should create bot messages', () => {
      const message = service.botMessage('Test');

      expect(message.username).toBe('XeroxChat Bot');
    });
  });
});
