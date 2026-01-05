/**
 * Custom Error Types
 * Typed error classes for consistent error handling
 */

// Error codes as const for type safety
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_USERNAME: 'INVALID_USERNAME',
  INVALID_ROOM: 'INVALID_ROOM',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  
  // User errors
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_NOT_IN_ROOM: 'USER_NOT_IN_ROOM',
  
  // Room errors
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Base application error
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    
    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

// Validation error
export class ValidationError extends AppError {
  public readonly field: string | undefined;
  public readonly details: Record<string, unknown> | undefined;

  constructor(
    message: string,
    field?: string | undefined,
    details?: Record<string, unknown> | undefined
  ) {
    super(message, ErrorCodes.VALIDATION_ERROR, 400);
    this.field = field;
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// User-related errors
export class UserError extends AppError {
  constructor(message: string, code: ErrorCode = ErrorCodes.USER_NOT_FOUND) {
    super(message, code, 400);
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

// Rate limit error
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 60) {
    super(message, ErrorCodes.RATE_LIMIT_EXCEEDED, 429);
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// Type guard for AppError
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Error result type for function returns
export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Helper to create success result
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

// Helper to create failure result
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}
