import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import formatMessage from "./utils/messages";
import {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
} from "./utils/users";
import { JoinRoomData } from "./types/index";

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

const BOT_NAME = "XeroxChat Bot";
const PORT = process.env['PORT'] ?? 3000;

/**
 * Socket.IO connection handler
 */
io.on("connection", (socket) => {
   /**
    * Handle user joining a room
    */
   socket.on("joinRoom", (data: JoinRoomData) => {
      const { username, room } = data;
      const { error, user } = userJoin(socket.id, username, room);

      if (error) {
         socket.emit("usernameError", error);
         return;
      }

      if (!user) {
         return;
      }

      socket.join(user.room);

      // Welcome the current user
      socket.emit("message", formatMessage(BOT_NAME, "Welcome to XeroxChat!"));

      // Broadcast when a user joins
      socket.broadcast
         .to(user.room)
         .emit(
            "message",
            formatMessage(BOT_NAME, `${user.username} has joined the chat!`)
         );

      // Send room users info to all users in room
      io.to(user.room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room),
      });
   });

   /**
    * Handle chat message from user
    */
   socket.on("chatMessage", (msg: string) => {
      const user = getCurrentUser(socket.id);

      if (!user) {
         return;
      }

      io.to(user.room).emit("message", formatMessage(user.username, msg));
   });

   /**
    * Handle user disconnect
    */
   socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
         io.to(user.room).emit(
            "message",
            formatMessage(BOT_NAME, `${user.username} has left the chat!`)
         );

         // Send updated room users info
         io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
         });
      }
   });
});

/**
 * Start the server
 */
server.listen(PORT, () => {
   console.log(`🎯 Server is running on PORT: ${PORT}`);
});
