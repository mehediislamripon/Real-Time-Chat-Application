/**
 * Client-side chat application
 * Handles Socket.IO communication and DOM updates
 */

// Type definitions for Qs library
interface QsParseOptions {
   ignoreQueryPrefix?: boolean;
}

declare const Qs: {
   parse: (str: string, options?: QsParseOptions) => Record<string, string>;
};

interface Message {
   username: string;
   text: string;
   time: string;
}

interface RoomUsersData {
   room: string;
   users: Array<{ username: string }>;
}

// DOM elements
const chatForm = document.getElementById("chat-form") as HTMLFormElement;
const chatMessages = document.querySelector(".chat-messages") as HTMLDivElement;
const roomName = document.getElementById("room-name") as HTMLElement;
const userList = document.getElementById("users") as HTMLUListElement;

// Get username and room from URL query parameters
const queryParams = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});
const username: string = queryParams.username as string;
const room: string = queryParams.room as string;

// Initialize Socket.IO connection
const socket = io();

/**
 * Handle username error (duplicate username)
 */
socket.on("usernameError", (msg: string) => {
   alert(msg);
   window.location.href = "/";
});

/**
 * Emit join room event with username and room data
 */
socket.emit("joinRoom", { username, room });

/**
 * Handle room users update
 */
socket.on("roomUsers", (data: RoomUsersData) => {
   outputRoomName(data.room);
   outputUsers(data.users);
});

/**
 * Handle incoming messages from server
 */
socket.on("message", (message: Message) => {
   outputMessage(message);

   // Auto-scroll to latest message
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

/**
 * Handle chat form submission
 */
chatForm.addEventListener("submit", (e: SubmitEvent) => {
   e.preventDefault();

   const msgInput = (e.target as HTMLFormElement).elements.namedItem(
      "msg"
   ) as HTMLInputElement;
   const msg = msgInput.value;

   // Emit message to server
   socket.emit("chatMessage", msg);

   // Clear input and refocus
   msgInput.value = "";
   msgInput.focus();
});

/**
 * Output message to the DOM
 * @param message - The message object containing username, text, and time
 */
function outputMessage(message: Message): void {
   const div = document.createElement("div");
   div.classList.add("message");
   div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
      ${message.text}
   </p>`;

   chatMessages.appendChild(div);
}

/**
 * Update room name in the DOM
 * @param roomName - The name of the current room
 */
function outputRoomName(roomNameValue: string): void {
   roomName.innerHTML = roomNameValue;
}

/**
 * Update users list in the DOM
 * @param users - Array of users in the room
 */
function outputUsers(users: Array<{ username: string }>): void {
   userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
