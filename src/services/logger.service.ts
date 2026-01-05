/**
 * Logger Service
 * Structured logging with different log levels
 */

import { config } from '../config';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log entry structure
interface LogEntry {
  level: keyof typeof LogLevel;
  message: string;
  timestamp: string;
  context?: string | undefined;
  data?: Record<string, unknown> | undefined;
  error?: {
    message: string;
    stack?: string | undefined;
    code?: string | undefined;
  };
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  context?: string | undefined;
  enableColors: boolean;
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m',   // Cyan
  info: '\x1b[32m',    // Green
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  context: '\x1b[35m', // Magenta
} as const;

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level ?? LogLevel.DEBUG,
      context: config.context,
      enableColors: config.enableColors ?? process.env['NODE_ENV'] !== 'production',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(entry: LogEntry): string {
    const { enableColors } = this.config;
    const levelColor = colors[entry.level.toLowerCase() as keyof typeof colors] || colors.reset;
    
    let output = '';
    
    if (enableColors) {
      output += `${levelColor}[${entry.level}]${colors.reset} `;
      output += `${entry.timestamp} `;
      if (entry.context) {
        output += `${colors.context}[${entry.context}]${colors.reset} `;
      }
      output += entry.message;
    } else {
      output += `[${entry.level}] ${entry.timestamp}`;
      if (entry.context) {
        output += ` [${entry.context}]`;
      }
      output += ` ${entry.message}`;
    }
    
    return output;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const levelName = LogLevel[level] as keyof typeof LogLevel;
    const entry: LogEntry = {
      level: levelName,
      message,
      timestamp: new Date().toISOString(),
      context: this.config.context,
      data,
    };

    const formattedMessage = this.formatMessage(entry);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      default:
        console.log(formattedMessage, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData: Record<string, unknown> = { ...data };
    
    if (error instanceof Error) {
      errorData['error'] = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      errorData['error'] = error;
    }
    
    this.log(LogLevel.ERROR, message, errorData);
  }

  // Create a child logger with a specific context
  child(context: string): Logger {
    return new Logger({
      ...this.config,
      context: this.config.context ? `${this.config.context}:${context}` : context,
    });
  }
}

// Create default logger instance
export const logger = new Logger({
  level: config.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
});

// Named loggers for different modules
export const createLogger = (context: string): Logger => logger.child(context);

export { Logger };
