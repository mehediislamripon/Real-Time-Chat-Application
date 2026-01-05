/**
 * Socket.IO Event Handlers
 * Decoupled socket event handlers with proper typing
 */

import { TypedSocket, TypedServer, SocketEvents, JoinRoomPayload } from '../types/socket.types';
import { userService } from '../services/user.service';
import { messageService } from '../services/message.service';
import { validate, joinRoomSchema, messageSchema } from '../validation/schemas';
import { createLogger } from '../services/logger.service';

const logger = createLogger('SocketHandler');

/**
 * Broadcast room users update to all users in a room
 */
function broadcastRoomUsers(io: TypedServer, room: string): void {
  const users = userService.getRoomUsers(room);
  io.to(room).emit(SocketEvents.ROOM_USERS, { room, users });
}

/**
 * Handle user joining a room
 */
export function handleJoinRoom(
  io: TypedServer,
  socket: TypedSocket,
  data: JoinRoomPayload
): void {
  logger.debug('Join room attempt', { socketId: socket.id, data });

  // Validate input
  const validationResult = validate(joinRoomSchema, data);
  if (!validationResult.success) {
    logger.warn('Join room validation failed', { 
      socketId: socket.id, 
      error: validationResult.error.message 
    });
    socket.emit(SocketEvents.USERNAME_ERROR, validationResult.error.message);
    return;
  }

  const { username, room } = validationResult.data;

  // Attempt to join
  const joinResult = userService.join(socket.id, username, room);
  if (!joinResult.success) {
    logger.warn('Join room failed', { 
      socketId: socket.id, 
      error: joinResult.error.message 
    });
    socket.emit(SocketEvents.USERNAME_ERROR, joinResult.error.message);
    return;
  }

  const user = joinResult.data;
  
  // Store user data in socket
  socket.data.user = user;
  socket.data.joinedAt = new Date();

  // Join the socket.io room
  socket.join(user.room);

  // Welcome the current user
  socket.emit(SocketEvents.MESSAGE, messageService.welcome());

  // Broadcast to others in room
  socket.broadcast
    .to(user.room)
    .emit(SocketEvents.MESSAGE, messageService.userJoined(user.username));

  // Update room users list
  broadcastRoomUsers(io, user.room);

  logger.info('User joined room successfully', { 
    userId: socket.id, 
    username: user.username, 
    room: user.room 
  });
}

/**
 * Handle incoming chat message
 */
export function handleChatMessage(
  io: TypedServer,
  socket: TypedSocket,
  msg: string
): void {
  const user = socket.data.user ?? userService.getById(socket.id);

  if (!user) {
    logger.warn('Message from unknown user', { socketId: socket.id });
    socket.emit(SocketEvents.ERROR, {
      code: 'USER_NOT_FOUND',
      message: 'You must join a room first',
    });
    return;
  }

  // Validate message
  const validationResult = validate(messageSchema, msg);
  if (!validationResult.success) {
    logger.warn('Message validation failed', {
      socketId: socket.id,
      error: validationResult.error.message,
    });
    socket.emit(SocketEvents.ERROR, {
      code: 'INVALID_MESSAGE',
      message: validationResult.error.message,
    });
    return;
  }

  const sanitizedMessage = validationResult.data;

  // Update last activity
  socket.data.lastActivity = new Date();

  // Broadcast message to room
  io.to(user.room).emit(
    SocketEvents.MESSAGE,
    messageService.format(user.username, sanitizedMessage)
  );

  logger.debug('Message sent', { 
    username: user.username, 
    room: user.room,
    messageLength: sanitizedMessage.length 
  });
}

/**
 * Handle user typing indicator
 */
export function handleTyping(
  socket: TypedSocket,
  data: { isTyping: boolean }
): void {
  const user = socket.data.user ?? userService.getById(socket.id);

  if (!user) return;

  socket.broadcast.to(user.room).emit(SocketEvents.USER_TYPING, {
    username: user.username,
    isTyping: data.isTyping,
  });
}

/**
 * Handle user disconnect
 */
export function handleDisconnect(io: TypedServer, socket: TypedSocket): void {
  const user = userService.leave(socket.id);

  if (user) {
    // Notify room
    io.to(user.room).emit(
      SocketEvents.MESSAGE,
      messageService.userLeft(user.username)
    );

    // Update room users list
    broadcastRoomUsers(io, user.room);

    logger.info('User disconnected', { 
      userId: socket.id, 
      username: user.username, 
      room: user.room 
    });
  }
}

/**
 * Register all socket event handlers
 */
export function registerSocketHandlers(io: TypedServer): void {
  io.on(SocketEvents.CONNECTION, (socket: TypedSocket) => {
    logger.debug('New connection', { socketId: socket.id });

    // Register event handlers
    socket.on(SocketEvents.JOIN_ROOM, (data) => {
      handleJoinRoom(io, socket, data);
    });

    socket.on(SocketEvents.CHAT_MESSAGE, (msg) => {
      handleChatMessage(io, socket, msg);
    });

    socket.on(SocketEvents.TYPING, (data) => {
      handleTyping(socket, data);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      handleDisconnect(io, socket);
    });

    // Error handling for this socket
    socket.on('error', (error) => {
      logger.error('Socket error', error, { socketId: socket.id });
    });
  });

  logger.info('Socket handlers registered');
}
