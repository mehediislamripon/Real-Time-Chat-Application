/**
 * Type definitions for chat application
 */

export interface User {
   id: string;
   username: string;
   room: string;
}

export interface UserJoinResult {
   error?: string;
   user?: User;
}

export interface FormattedMessage {
   username: string;
   text: string;
   time: string;
}

export interface RoomUsers {
   room: string;
   users: User[];
}

export interface JoinRoomData {
   username: string;
   room: string;
}
