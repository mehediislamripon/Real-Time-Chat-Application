/**
 * Express Application Factory
 * Creates and configures the Express application
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import { createLogger } from '../services/logger.service';
import { isAppError, AppError, ErrorCodes } from '../types/errors';

const logger = createLogger('Express');

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Request logging
  app.use((req, _res, next) => {
    logger.debug('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
    next();
  });

  // Parse JSON bodies
  app.use(express.json({ limit: '10kb' }));

  // Serve static files
  app.use(express.static(path.join(__dirname, '../../public')));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes placeholder
  app.get('/api/v1/status', (_req: Request, res: Response) => {
    res.json({
      version: '1.0.0',
      status: 'running',
    });
  });

  // 404 handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError('Not Found', ErrorCodes.INTERNAL_ERROR, 404));
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (isAppError(err)) {
      logger.warn('Application error', { 
        code: err.code, 
        message: err.message,
        statusCode: err.statusCode 
      });
      
      res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message,
        },
      });
    } else {
      logger.error('Unexpected error', err);
      
      res.status(500).json({
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  });

  logger.info('Express application created');
  return app;
}
