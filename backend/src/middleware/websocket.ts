import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

/**
 * Initialize WebSocket connection for real-time features
 * @param httpServer - HTTP server instance
 * @returns SocketIO server instance
 */
export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
      credentials: true,
    },
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // TODO: Implement real-time features
    // - Live calendar updates when someone creates/deletes an event
    // - Presence tracking (who's viewing which calendar)
    // - Collaborative features (comments, mentions)

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Get the SocketIO server instance
 */
export function getSocketIO(): SocketIOServer {
  if (!io) {
    throw new Error('WebSocket not initialized. Call initializeWebSocket first.');
  }
  return io;
}

/**
 * Emit an event to all connected clients
 */
export function broadcastEvent(eventName: string, data: any): void {
  if (io) {
    io.emit(eventName, data);
  }
}

/**
 * Emit an event to a specific room (e.g., calendar subscribers)
 */
export function emitToRoom(roomName: string, eventName: string, data: any): void {
  if (io) {
    io.to(roomName).emit(eventName, data);
  }
}
