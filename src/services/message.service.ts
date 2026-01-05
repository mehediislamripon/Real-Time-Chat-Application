/**
 * Message Service
 * Handles message formatting and processing
 */

import moment from 'moment-timezone';
import { FormattedMessage } from '../types';
import { config } from '../config';

export interface MessageOptions {
  timezone?: string;
  format?: string;
}

const DEFAULT_OPTIONS: Required<MessageOptions> = {
  timezone: config.env.DEFAULT_TIMEZONE,
  format: 'h:mm a',
};

/**
 * Format a message with timestamp
 */
export function formatMessage(
  username: string,
  text: string,
  options: MessageOptions = {}
): FormattedMessage {
  const { timezone, format } = { ...DEFAULT_OPTIONS, ...options };
  
  return Object.freeze({
    username,
    text,
    time: moment().tz(timezone).format(format),
  });
}

/**
 * Create a system message from the bot
 */
export function createBotMessage(text: string): FormattedMessage {
  return formatMessage(config.app.botName, text);
}

/**
 * Create a welcome message
 */
export function createWelcomeMessage(): FormattedMessage {
  return createBotMessage(`Welcome to ${config.app.name}!`);
}

/**
 * Create a user joined message
 */
export function createUserJoinedMessage(username: string): FormattedMessage {
  return createBotMessage(`${username} has joined the chat!`);
}

/**
 * Create a user left message
 */
export function createUserLeftMessage(username: string): FormattedMessage {
  return createBotMessage(`${username} has left the chat!`);
}

// Message service class for more complex scenarios
export class MessageService {
  private readonly options: Required<MessageOptions>;

  constructor(options: MessageOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  format(username: string, text: string): FormattedMessage {
    return formatMessage(username, text, this.options);
  }

  botMessage(text: string): FormattedMessage {
    return this.format(config.app.botName, text);
  }

  welcome(): FormattedMessage {
    return this.botMessage(`Welcome to ${config.app.name}!`);
  }

  userJoined(username: string): FormattedMessage {
    return this.botMessage(`${username} has joined the chat!`);
  }

  userLeft(username: string): FormattedMessage {
    return this.botMessage(`${username} has left the chat!`);
  }
}

// Export singleton instance
export const messageService = new MessageService();
