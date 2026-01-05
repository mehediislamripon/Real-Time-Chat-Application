# XeroxChat - Production-Grade Real-Time Chat Application

A production-ready real-time chat application built with **Node.js, Express.js, Socket.IO, and TypeScript**. Designed for **long-term maintainability, scalability, and enterprise-grade quality**.

## Key Features

### Core Functionality
- Real-time messaging using Socket.IO with fully typed events
- Multiple chat rooms with active user tracking
- User management with duplicate username prevention
- Responsive UI with modern styling
- Server-side message formatting with timezone support (Asia/Dhaka)

### Production Quality
- **Zero `any` usage** - 100% type-safe TypeScript with strict mode
- **Input validation** - Zod schemas with XSS sanitization
- **Error handling** - Custom typed error classes and recovery
- **Structured logging** - Production-ready logger with levels
- **Full test coverage** - Vitest with 39+ passing tests
- **Environment validation** - Typed config management
- **Graceful shutdown** - Proper process cleanup and signal handling
- **Scalability ready** - Redis adapter types included

## Project Structure

```
Real-Time-Chat-Application/
├── src/                                    # Server source (TypeScript)
│   ├── main.ts                             # NEW: Main entry point with graceful shutdown
│   ├── server.ts                           # Legacy entry point (still supported)
│   ├── config/
│   │   └── index.ts                        # NEW: Env validation & config management
│   ├── app/
│   │   └── express.ts                      # NEW: Express app factory with middleware
│   ├── socket/
│   │   ├── index.ts
│   │   ├── handlers.ts                     # NEW: Decoupled event handlers
│   │   └── server.ts                       # NEW: Typed Socket.IO factory
│   ├── services/
│   │   ├── index.ts
│   │   ├── user.service.ts                 # NEW: Class-based with DI support
│   │   ├── message.service.ts              # NEW: Message formatting service
│   │   └── logger.service.ts               # NEW: Structured logging
│   ├── types/
│   │   ├── index.ts                        # Core types (readonly/immutable)
│   │   ├── socket.types.ts                 # NEW: Strongly-typed socket events
│   │   └── errors.ts                       # NEW: Custom error classes
│   ├── validation/
│   │   ├── index.ts
│   │   └── schemas.ts                      # NEW: Zod validation schemas
│   └── utils/
│       ├── messages.ts                     # Legacy (deprecated - use message.service)
│       └── users.ts                        # Legacy (deprecated - use user.service)
├── public/                                 # Client-side code
│   ├── index.html
│   ├── chat.html
│   ├── js/
│   │   ├── script.ts
│   │   ├── script.js
│   │   └── socket.io.d.ts
│   └── css/
│       └── style.css
├── tests/                                  # NEW: Test suite
│   ├── services/
│   │   ├── user.service.test.ts
│   │   └── message.service.test.ts
│   ├── socket/
│   │   └── handlers.test.ts
│   └── validation/
│       └── schemas.test.ts
├── dist/                                   # Compiled output (generated)
├── tsconfig.json                           # UPDATED: Extra strict rules
├── vitest.config.ts                        # NEW: Vitest configuration
├── nodemon.json                            # UPDATED: For main.ts
├── webpack.config.js
├── .env.example                            # NEW: Environment template
├── package.json                            # UPDATED: New scripts & deps
└── README.md                               # This file
```

** = New or significantly improved in v2.0**

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Real-Time-Chat-Application

# Install dependencies
npm install
```

### Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (optional - defaults are provided)
# NODE_ENV=development
# PORT=3000
# CORS_ORIGIN=*
# DEFAULT_TIMEZONE=Asia/Dhaka
```

## Running the Application

### Development

```bash
# Start with hot-reload (recommended)
npm run dev:watch

# Or start with ts-node (no watch)
npm run dev

# Or start legacy version
npm run dev:legacy
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build TypeScript and client code
npm run build

# Start production server
npm start
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage

# UI dashboard
npm test:ui
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with ts-node (new entry point) |
| `npm run dev:legacy` | Start with legacy entry point |
| `npm run dev:watch` | **Recommended**: Hot-reload development |
| `npm run build` | Build server & client for production |
| `npm run build:server` | Build server TypeScript only |
| `npm run build:client` | Bundle client code only |
| `npm run start` | Run production build |
| `npm run test` | Run test suite once |
| `npm run test:watch` | Watch mode for tests |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:ui` | Vitest UI dashboard |
| `npm run typecheck` | Check types without building |
| `npm run lint:check` | Check linting issues |
| `npm run clean` | Remove dist/ directory |

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Client (Socket.IO)              │
├─────────────────────────────────────────┤
│  Socket Event Handlers (typed)          │
├─────────────────────────────────────────┤
│  Services (UserService, MessageService) │
├─────────────────────────────────────────┤
│  Validation Layer (Zod schemas)         │
├─────────────────────────────────────────┤
│  Error Handling & Logging               │
├─────────────────────────────────────────┤
│  Config & Environment                   │
└─────────────────────────────────────────┘
```

### Type Safety Levels

```typescript
// 1. Input Validation
const joinRoomSchema = z.object({
  username: usernameSchema,  // min 2, max 20, alphanumeric
  room: roomSchema,          // min 1, max 50
});

// 2. Type-Safe Events
interface ClientToServerEvents {
  joinRoom: (data: JoinRoomPayload) => void;
  chatMessage: (message: string) => void;
}

// 3. Service Layer (immutable)
const user: User = Object.freeze({ 
  id, username, room 
});

// 4. Error Handling
type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false, error: E };
```

## Type System Features

### Strict TypeScript Configuration
```jsonc
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noImplicitOverride": true
}
```

### No `any` Usage
Every variable, parameter, and return type has an explicit type.

### Immutable Data
```typescript
// Readonly throughout the app
interface User {
  readonly id: string;
  readonly username: string;
  readonly room: string;
}
```

### Discriminated Unions for Safety
```typescript
type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false, error: E };

// Type guard enforced at compile time
if (result.success) {
  console.log(result.data);  // Guaranteed to exist
} else {
  console.log(result.error); // Guaranteed to exist
}
```

## Key Services

### UserService
```typescript
class UserService {
  join(id: string, username: string, room: string): Result<User>
  getById(id: string): User | undefined
  leave(id: string): User | undefined
  getRoomUsers(room: string): readonly User[]
  isUsernameAvailable(username: string): boolean
  getActiveRooms(): string[]
}
```

### MessageService
```typescript
function formatMessage(username: string, text: string): FormattedMessage
function createBotMessage(text: string): FormattedMessage
function createWelcomeMessage(): FormattedMessage
function createUserJoinedMessage(username: string): FormattedMessage
function createUserLeftMessage(username: string): FormattedMessage
```

### Logger Service
```typescript
class Logger {
  debug(message: string, data?: Record<string, unknown>): void
  info(message: string, data?: Record<string, unknown>): void
  warn(message: string, data?: Record<string, unknown>): void
  error(message: string, error?: Error, data?: Record<string, unknown>): void
  child(context: string): Logger  // Hierarchical contexts
}
```

## Validation & Security

### Input Validation with Zod

All inputs are validated at the boundary:

```typescript
// Username: 2-20 chars, alphanumeric + underscore/hyphen
const username = usernameSchema.parse(input);

// Message: 1-1000 chars, XSS-sanitized
const message = messageSchema.parse(input);
// <script> becomes &lt;script&gt;

// Room: 1-50 chars, alphanumeric + space/underscore/hyphen
const room = roomSchema.parse(input);
```

### XSS Prevention
```typescript
.transform((val) => 
  val
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
)
```

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Testing

### Test Coverage
- **Unit Tests**: UserService, MessageService, Validation schemas
- **Integration Tests**: Socket event handlers
- **Mocking**: Services properly mocked for isolation

### Example Tests
```typescript
describe('UserService', () => {
  it('should reject duplicate usernames (case-insensitive)', () => {
    userService.join('socket-1', 'alice', 'general');
    const result = userService.join('socket-2', 'ALICE', 'general');
    
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('USERNAME_TAKEN');
  });
});

describe('Validation Schemas', () => {
  it('should sanitize HTML to prevent XSS', () => {
    const result = messageSchema.safeParse('<script>alert("xss")</script>');
    
    expect(result.success).toBe(true);
    expect(result.data).toContain('&lt;script&gt;');
  });
});
```

## Logging Example

```
[INFO] 2026-01-05T10:34:01.993Z [UserService] User joined {
  "userId": "socket-123",
  "username": "alice",
  "room": "general"
}

[WARN] 2026-01-05T10:34:05.123Z [SocketHandler] Join room validation failed {
  "socketId": "socket-456",
  "error": "Username is already taken"
}

[ERROR] 2026-01-05T10:34:10.456Z [Server] Socket error {
  "socketId": "socket-789",
  "error": {
    "message": "Connection dropped",
    "stack": "..."
  }
}
```

## Scalability Path

### Current (Single Instance)
```
Client ←→ Socket.IO Server ←→ In-Memory Store
```

### Redis Adapter Ready
```
Client ←→ Socket.IO Server ₁ ─┐
Client ←→ Socket.IO Server ₂ ─┼─→ Redis Adapter ←→ Shared State
Client ←→ Socket.IO Server ₃ ─┘
```

**To add Redis:**
```bash
npm install @socket.io/redis-adapter redis

# Update src/socket/server.ts
import { createAdapter } from '@socket.io/redis-adapter';
io.adapter(createAdapter(pubClient, subClient));
```

## Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| socket.io | ^4.8.1 | Real-time communication |
| moment-timezone | ^0.6.0 | Timezone handling |
| **zod** | ^3.24.0 | **NEW**: Input validation |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.9.3 | Type system |
| ts-node | ^10.9.2 | Run TypeScript directly |
| nodemon | ^3.1.11 | Hot reload |
| vitest | ^2.1.0 | **NEW**: Testing framework |
| @vitest/ui | ^2.1.0 | **NEW**: Test UI |
| webpack | ^5.103.0 | Bundling |

## Migration from v1.0 to v2.0

### Backward Compatibility
The v1.0 code still works! You can:
- Use `npm run dev:legacy` to run old code
- Import from deprecated `src/utils/` (still available)
- Use old `src/server.ts` as entry point

### Migration Path
```typescript
// OLD (still works)
import { userJoin, getCurrentUser } from './utils/users';
import formatMessage from './utils/messages';

// NEW (recommended)
import { userService } from './services/user.service';
import { messageService } from './services/message.service';

// v2.0 benefits
const result = userService.join(id, username, room);
if (result.success) {
  const user = result.data;  // Type-safe
} else {
  console.error(result.error.message);  // Type-safe errors
}
```

## Using the Application

### 1. Start the Server
```bash
npm run dev:watch
```

### 2. Open in Browser
Navigate to `http://localhost:3000`

### 3. Join a Chat Room
- Enter your **username** (2-20 characters)
- Select a **room name**
- Click "Join Room"

### 4. Start Chatting
- Type message and press Enter or click Send
- See real-time updates from other users
- View user list and timestamps

### Available Rooms
- general
- random
- tech
- gaming
- off-topic

(Or create your own custom room name!)

## Code Examples

### Handling Socket Events (Type-Safe)

```typescript
// New v2.0 way (Recommended)
import { TypedSocket, SocketEvents } from './types/socket.types';
import { userService } from './services/user.service';

socket.on(SocketEvents.JOIN_ROOM, (data: JoinRoomPayload) => {
  const result = userService.join(socket.id, data.username, data.room);
  
  if (result.success) {
    const user = result.data;
    socket.join(user.room);
    // Fully type-safe, no `any` type
  } else {
    socket.emit(SocketEvents.USERNAME_ERROR, result.error.message);
    // Error type guaranteed
  }
});
```

### Using Validation

```typescript
import { validate, joinRoomSchema } from './validation/schemas';

const validationResult = validate(joinRoomSchema, {
  username: userInput,
  room: roomInput
});

if (validationResult.success) {
  const { username, room } = validationResult.data;
  // Data is validated and typed
} else {
  console.error(validationResult.error.message);
  // Error details are available
}
```

### Using Services

```typescript
import { userService } from './services/user.service';
import { messageService } from './services/message.service';
import { createLogger } from './services/logger.service';

const logger = createLogger('ChatHandler');

// Type-safe user operations
const users = userService.getRoomUsers(room);
const count = userService.getRoomCount(room);

// Type-safe messages
const msg = messageService.format(username, text);
const welcome = messageService.welcome();

// Structured logging
logger.info('Chat started', { username, room, userCount: count });
logger.error('Connection failed', error, { socketId });
```

## Best Practices Implemented

| Practice | Implementation |
|----------|-----------------|
| **Type Safety** | Strict TypeScript, no `any`, immutable types |
| **Input Validation** | Zod schemas at all boundaries |
| **Error Handling** | Custom typed error classes with codes |
| **Logging** | Structured logging with levels & contexts |
| **Testing** | 39+ tests with Vitest, mocking support |
| **DI Ready** | Services accept interfaces for mocking |
| **Separation of Concerns** | Handlers → Services → Validation → Storage |
| **Security** | XSS sanitization, security headers |
| **Configuration** | Centralized, environment-validated config |
| **Documentation** | JSDoc comments, comprehensive README |
| **Backward Compat** | Old code still works alongside new code |
| **Scalability** | Redis adapter types included |

## Future Enhancements

### Short Term
- [ ] Add Redis adapter for multi-instance scaling
- [ ] Implement rate limiting using config
- [ ] Add user authentication (JWT)
- [ ] Private messaging between users
- [ ] Message edit/delete functionality
- [ ] Read receipts and typing indicators

### Medium Term
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Message persistence
- [ ] User profiles and avatars
- [ ] Message search
- [ ] Reaction emojis
- [ ] Thread replies

### Long Term
- [ ] File uploads/sharing
- [ ] Video call integration
- [ ] Message encryption
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Mobile app (React Native)

## Learn More

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Strict Mode](https://www.typescriptlang.org/tsconfig#strict)

### Socket.IO
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Typed Events](https://socket.io/docs/v4/server-api/#Type-hints)

### Validation
- [Zod Documentation](https://zod.dev/)

### Testing
- [Vitest Documentation](https://vitest.dev/)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Guidelines
- Write tests for new features
- Ensure `npm typecheck` passes
- Use the logger service for debugging
- Follow existing code style
- Update README if adding features

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001 npm run dev
```

### Type Errors
```bash
# Check all types
npm run typecheck

# Full build
npm run build
```

### Tests Failing
```bash
# Run tests with details
npm run test:watch

# Check coverage gaps
npm run test:coverage
```

### Module Not Found
```bash
# Rebuild TypeScript
npm run build:server

# Clear cache
rm -rf dist/
npm run build
```

## Project Stats

| Metric | Value |
|--------|-------|
| TypeScript Lines | ~2,500+ |
| Type Coverage | 100% (no `any`) |
| Test Count | 39+ |
| Test Coverage Target | 80%+ |
| Supported Node | >=18.0.0 |
| Production Ready | Yes |

## License

ISC - See LICENSE file for details

## Author

**Mehedi Islam Ripon**

### Contributions & Support

- Star this repo if you find it helpful!
- Report bugs via GitHub Issues
- Discuss improvements in Discussions
- Submit PRs for new features

---

**Last Updated:** January 2026  
**Version:** 2.0.0 (Production-Grade Release)

---

<p align="center">
  Built with ❤️ using TypeScript, Express.js, and Socket.IO
</p>
