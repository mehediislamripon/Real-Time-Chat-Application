# XeroxChat - Real-Time Chat Application (TypeScript)

A modern, real-time chat application built with Express.js, Socket.IO, and TypeScript. This project follows best practices for TypeScript development with a well-organized folder structure and comprehensive type safety.

## 🎯 Features

-  Real-time messaging using Socket.IO
-  Multiple chat rooms
-  User management (join/leave notifications)
-  Duplicate username prevention
-  Responsive UI with modern styling
-  Server-side message formatting with timezone support (Asia/Dhaka)
-  TypeScript strict mode enabled for maximum type safety
-  Webpack bundling for client-side code

## 📁 Project Structure

```
Real-Time-Chat-Application/
├── src/                          # Server source code (TypeScript)
│   ├── server.ts                 # Main server entry point
│   ├── types/                    # Type definitions
│   │   └── index.ts              # Shared interfaces and types
│   ├── utils/                    # Utility functions
│   │   ├── messages.ts           # Message formatting utility
│   │   └── users.ts              # User management functions
│   └── services/                 # Business logic services (expandable)
├── public/                       # Static assets and client code
│   ├── index.html                # Join room page
│   ├── chat.html                 # Chat page
│   ├── js/
│   │   ├── script.ts             # Client-side TypeScript
│   │   ├── script.js             # Compiled JavaScript (generated)
│   │   └── socket.io.d.ts        # Socket.IO type definitions
│   └── css/
│       └── style.css             # Application styles
├── dist/                         # Compiled server code (generated)
├── tsconfig.json                 # TypeScript config for server
├── tsconfig.client.json          # TypeScript config for client
├── webpack.config.js             # Webpack bundling config
├── nodemon.json                  # Nodemon development config
├── .eslintrc.json                # ESLint configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file

```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Build TypeScript and start with auto-reload
npm run dev

# Alternative: Watch TypeScript and reload on changes
npm run dev:watch
```

The development server will start on `http://localhost:3000`

### Production Build

```bash
# Build both server and client
npm run build

# Start the production server
npm start
```

## 📦 Build Scripts

-  **`npm run build`** - Compile TypeScript server and bundle client code
-  **`npm run build:server`** - Compile only server TypeScript
-  **`npm run build:client`** - Bundle only client TypeScript
-  **`npm run start`** - Run compiled production server
-  **`npm run dev`** - Run development server with ts-node
-  **`npm run dev:watch`** - Run development server with auto-reload (nodemon)

## 🏗️ TypeScript Architecture

### Type Safety

The project uses TypeScript with `strict: true` for maximum type safety:

```typescript
// All types are explicitly defined
interface User {
   id: string;
   username: string;
   room: string;
}

interface FormattedMessage {
   username: string;
   text: string;
   time: string;
}
```

### Server-Side (src/)

-  **types/index.ts** - Centralized type definitions
-  **utils/messages.ts** - Message formatting with proper typing
-  **utils/users.ts** - User management with type-safe operations
-  **server.ts** - Main server with fully typed Socket.IO handlers

### Client-Side (public/js/)

-  **script.ts** - Client-side chat logic with DOM type safety
-  **socket.io.d.ts** - Socket.IO client type declarations

## 🔧 Configuration Files

### tsconfig.json (Server)

-  Target: ES2020
-  Strict mode enabled
-  Source maps for debugging
-  Output to `dist/` directory

### tsconfig.client.json (Client)

-  Target: ES2020
-  DOM libraries included
-  Webpack integration
-  Output to `public/js/` directory

### webpack.config.js

-  Minification enabled
-  Source map generation
-  TypeScript loader integration
-  Production-optimized bundle

### nodemon.json

-  Watches `src/` directory
-  Auto-restart on TypeScript changes
-  Development environment configuration

## 📋 Dependencies

### Production

-  **express** (^5.2.1) - Web framework
-  **socket.io** (^4.8.1) - Real-time communication
-  **moment-timezone** (^0.6.0) - Timezone support

### Development

-  **typescript** - TypeScript compiler
-  **ts-node** - Execute TypeScript directly
-  **nodemon** - Auto-reload on changes
-  **webpack** & **webpack-cli** - Module bundler
-  **ts-loader** - TypeScript loader for webpack
-  **@types/** - Type definitions for all packages
-  **eslint** - Code linting

## 🎮 Usage

### Access the Application

1. Open browser and navigate to `http://localhost:3000`
2. Enter username and select a room
3. Join chat and start messaging in real-time

### Available Rooms

-  Room-1
-  Room-2
-  Room-3
-  Room-4
-  Room-5

## 📚 Code Examples

### Server-Side Usage

```typescript
// Type-safe user management
import { userJoin, getRoomUsers } from "./utils/users";
import formatMessage from "./utils/messages";

const { error, user } = userJoin(socketId, username, room);
if (error) {
   // Handle error - fully typed
   socket.emit("usernameError", error);
}

const message = formatMessage(username, text);
// message is guaranteed to have: { username, text, time }
```

### Client-Side Usage

```typescript
// Type-safe Socket.IO communication
socket.on("message", (message: Message) => {
   outputMessage(message);
});

socket.emit("chatMessage", userInput);
```

## 🔍 Type Safety Features

-  **Strict null checks** - Prevents null/undefined errors
-  **Explicit return types** - All functions have defined return types
-  **Interface definitions** - Shared types across client and server
-  **TypeScript strict mode** - Maximum compiler strictness
-  **Source maps** - Debug original TypeScript in browser

## 🛠️ Development Workflow

1. **Edit TypeScript files** in `src/` or `public/js/`
2. **Development mode** automatically recompiles
3. **Check for errors** with strict type checking
4. **Build production** with optimized output
5. **Run server** with compiled JavaScript

## 📝 Best Practices Implemented

✅ **Folder Organization** - Logical separation of concerns
✅ **Type Definitions** - Centralized in `src/types/`
✅ **Naming Conventions** - PascalCase for types, camelCase for functions
✅ **Documentation** - JSDoc comments on functions
✅ **Error Handling** - Type-safe error management
✅ **Source Maps** - Debugging support
✅ **Linting** - ESLint configuration included
✅ **Build Optimization** - Webpack minification and bundling

## 🚀 Future Enhancements

-  Add database integration (MongoDB/PostgreSQL)
-  User authentication system
-  Message persistence
-  Direct messaging between users
-  User profiles and avatars
-  Message reactions and replies
-  Unit and integration tests

## 📄 License

ISC

## 👨‍💻 Author

Mehedi Islam Ripon
