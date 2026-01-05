/**
 * Validation Schemas
 * Zod schemas for runtime validation of all inputs
 */

import { z } from 'zod';

// ============================================
// Username Validation
// ============================================

export const usernameSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.string()
      .min(2, 'Username must be at least 2 characters')
      .max(20, 'Username must be at most 20 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
  );

// ============================================
// Room Validation
// ============================================

export const roomSchema = z
  .string()
  .min(1, 'Room name is required')
  .max(50, 'Room name must be at most 50 characters')
  .regex(
    /^[a-zA-Z0-9_\- ]+$/,
    'Room name can only contain letters, numbers, spaces, underscores, and hyphens'
  )
  .transform((val) => val.trim());

// ============================================
// Message Validation
// ============================================

export const messageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(1000, 'Message must be at most 1000 characters')
  .transform((val) => val.trim())
  // Sanitize to prevent XSS
  .transform((val) => 
    val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  );

// ============================================
// Join Room Payload Validation
// ============================================

export const joinRoomSchema = z.object({
  username: usernameSchema,
  room: roomSchema,
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;

// ============================================
// Chat Message Payload Validation
// ============================================

export const chatMessageSchema = z.object({
  content: messageSchema,
  timestamp: z.number().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// ============================================
// Validation Helper
// ============================================

import { ValidationError } from '../types/errors';
import { Result, success, failure } from '../types/errors';

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationError> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const issues = result.error.issues;
    const firstError = issues[0];
    return failure(
      new ValidationError(
        firstError?.message ?? 'Validation failed',
        firstError?.path.join('.'),
        { errors: issues }
      )
    );
  }
  
  return success(result.data);
}

// Quick validators that return the data or throw
export const validators = {
  username: (value: unknown) => usernameSchema.parse(value),
  room: (value: unknown) => roomSchema.parse(value),
  message: (value: unknown) => messageSchema.parse(value),
  joinRoom: (value: unknown) => joinRoomSchema.parse(value),
} as const;
