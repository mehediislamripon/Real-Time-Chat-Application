/**
 * Main Server Entry Point
 * Production-grade server setup with proper initialization
 */

import http from 'http';
import { config } from './config';
import { createApp } from './app/express';
import { createSocketServer, configureSocketMiddleware, registerSocketHandlers } from './socket';
import { createLogger } from './services/logger.service';

const logger = createLogger('Server');

/**
 * Initialize and start the server
 */
async function bootstrap(): Promise<void> {
  try {
    // Create Express app
    const app = createApp();

    // Create HTTP server
    const server = http.createServer(app);

    // Create and configure Socket.IO
    const io = createSocketServer(server);
    configureSocketMiddleware(io);
    registerSocketHandlers(io);

    // Start listening
    const port = config.env.PORT;
    
    server.listen(port, () => {
      logger.info(`🚀 ${config.app.name} server started`, {
        port,
        environment: config.env.NODE_ENV,
        version: config.app.version,
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      // Close Socket.IO connections
      io.close(() => {
        logger.info('Socket.IO connections closed');
      });

      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after timeout
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', reason as Error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', error as Error);
    process.exit(1);
  }
}

// Start the server
bootstrap();
