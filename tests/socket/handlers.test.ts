/**
 * Socket Event Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleJoinRoom, handleChatMessage } from '../../src/socket/handlers';
import * as userServiceModule from '../../src/services/user.service';

// Mock the services
vi.mock('../../src/services/user.service', () => ({
  userService: {
    join: vi.fn(),
    getById: vi.fn(),
    leave: vi.fn(),
    getRoomUsers: vi.fn(() => []),
  },
}));

vi.mock('../../src/services/message.service', () => ({
  messageService: {
    welcome: vi.fn(() => ({ username: 'Bot', text: 'Welcome!', time: '10:00 am' })),
    userJoined: vi.fn((name: string) => ({ username: 'Bot', text: `${name} joined`, time: '10:00 am' })),
    userLeft: vi.fn((name: string) => ({ username: 'Bot', text: `${name} left`, time: '10:00 am' })),
    format: vi.fn((user: string, msg: string) => ({ username: user, text: msg, time: '10:00 am' })),
  },
}));

describe('Socket Handlers', () => {
  let mockIo: any;
  let mockSocket: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSocket = {
      id: 'socket-123',
      data: {},
      join: vi.fn(),
      emit: vi.fn(),
      broadcast: {
        to: vi.fn(() => ({
          emit: vi.fn(),
        })),
      },
      on: vi.fn(),
    };

    mockIo = {
      to: vi.fn(() => ({
        emit: vi.fn(),
      })),
      on: vi.fn(),
    };
  });

  describe('handleJoinRoom', () => {
    it('should emit error for invalid username', () => {
      handleJoinRoom(mockIo, mockSocket, { username: 'a', room: 'general' });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'usernameError',
        expect.stringContaining('at least 2 characters')
      );
    });

    it('should emit error for invalid room', () => {
      handleJoinRoom(mockIo, mockSocket, { username: 'alice', room: '' });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'usernameError',
        expect.stringContaining('required')
      );
    });
  });

  describe('handleChatMessage', () => {
    it('should emit error when user not found', () => {
      mockSocket.data.user = undefined;
      
      // Access the mocked module
      const mockedUserService = userServiceModule.userService as unknown as {
        getById: ReturnType<typeof vi.fn>;
      };
      mockedUserService.getById.mockReturnValue(undefined);

      handleChatMessage(mockIo, mockSocket, 'Hello');

      expect(mockSocket.emit).toHaveBeenCalledWith('error', expect.objectContaining({
        code: 'USER_NOT_FOUND',
      }));
    });
  });
});
