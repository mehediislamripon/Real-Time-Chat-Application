/**
 * Global type declarations for Socket.IO client
 */

declare function io(): SocketIOClient.Socket;

namespace SocketIOClient {
  export interface Socket {
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, data: any): void;
  }
}
