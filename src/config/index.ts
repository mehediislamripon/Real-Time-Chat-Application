/**
 * Application Configuration
 * Centralized configuration with environment variable validation
 */

import { z } from 'zod';

// Environment schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  
  // Redis configuration for scaling (optional)
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Security
  CORS_ORIGIN: z.string().default('*'),
  
  // Timezone
  DEFAULT_TIMEZONE: z.string().default('Asia/Dhaka'),
});

// Parse and validate environment variables
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }
  
  return result.data;
};

// Configuration shape
const createConfig = () => ({
  env: parseEnv(),
  
  app: {
    name: 'XeroxChat',
    botName: 'XeroxChat Bot',
    version: '1.0.0',
  } as const,
  
  socket: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxBufferSize: 1e6, // 1MB
  } as const,
  
  rateLimit: {
    messagesPerMinute: 30,
    joinAttemptsPerMinute: 5,
  } as const,
});

// Immutable configuration object
export const config = Object.freeze(createConfig());

// Type exports
export type Config = typeof config;
export type Environment = z.infer<typeof envSchema>;
