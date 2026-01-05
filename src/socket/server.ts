/**
 * Socket.IO Server Factory
 * Creates and configures the Socket.IO server with proper typing
 */

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { TypedServer, ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket.types';
import { config } from '../config';
import { createLogger } from '../services/logger.service';

const logger = createLogger('SocketFactory');

export interface SocketServerOptions {
  cors?: {
    origin: string | string[];
    methods?: string[];
    credentials?: boolean;
  };
  pingTimeout?: number;
  pingInterval?: number;
  maxHttpBufferSize?: number;
}

/**
 * Create a typed Socket.IO server
 */
export function createSocketServer(
  httpServer: HttpServer,
  options: SocketServerOptions = {}
): TypedServer {
  const defaultOptions: SocketServerOptions = {
    cors: {
      origin: config.env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: config.socket.pingTimeout,
    pingInterval: config.socket.pingInterval,
    maxHttpBufferSize: config.socket.maxBufferSize,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const io: TypedServer = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, mergedOptions);

  logger.info('Socket.IO server created', { 
    cors: mergedOptions.cors,
    pingTimeout: mergedOptions.pingTimeout 
  });

  return io;
}

/**
 * Configure middleware for the Socket.IO server
 */
export function configureSocketMiddleware(io: TypedServer): void {
  // Connection logging middleware
  io.use((socket, next) => {
    logger.debug('Socket connection attempt', {
      socketId: socket.id,
      address: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'],
    });
    next();
  });

  // Error handling middleware
  io.use((socket, next) => {
    socket.on('error', (error) => {
      logger.error('Socket error in middleware', error, { socketId: socket.id });
    });
    next();
  });

  logger.info('Socket middleware configured');
}
