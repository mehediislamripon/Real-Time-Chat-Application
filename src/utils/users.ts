import { User, UserJoinResult } from "../types/index";

// In-memory user store
const users: User[] = [];

/**
 * Adds a user to the chat when they join a room
 * Prevents duplicate usernames (case-insensitive)
 * @param id - Socket ID of the user
 * @param username - Username of the user
 * @param room - Room name to join
 * @returns Object containing error or the created user
 */
function userJoin(id: string, username: string, room: string): UserJoinResult {
   // Disallow duplicate usernames (case-insensitive)
   const existingUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
   );

   if (existingUser) {
      return { error: "Username is already taken" };
   }

   const user: User = { id, username, room };
   users.push(user);

   return { user };
}

/**
 * Gets current user by socket ID
 * @param id - Socket ID of the user
 * @returns User object or undefined if not found
 */
function getCurrentUser(id: string): User | undefined {
   return users.find((user) => user.id === id);
}

/**
 * Removes user from chat when they disconnect
 * @param id - Socket ID of the user
 * @returns User object if removed, undefined if not found
 */
function userLeave(id: string): User | undefined {
   const index = users.findIndex((user) => user.id === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
   return undefined;
}

/**
 * Gets all users in a specific room
 * @param room - Room name
 * @returns Array of users in the room
 */
function getRoomUsers(room: string): User[] {
   return users.filter((user) => user.room === room);
}

export { userJoin, getCurrentUser, userLeave, getRoomUsers };
