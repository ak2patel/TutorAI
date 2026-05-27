import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';

// ============================================
// Socket.IO Server Setup
// Provides real-time generation status to frontend
// ============================================

let io: Server | null = null;

export const initWebSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Client joins a room specific to an assignment ID
    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`🔌 Client ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(assignmentId);
      console.log(`🔌 Client ${socket.id} left room: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emits a status update event to a specific assignment room
 */
export const emitAssignmentStatus = (
  assignmentId: string,
  status: string,
  message?: string
): void => {
  if (io) {
    io.to(assignmentId).emit('generation-status', {
      assignmentId,
      status,
      message,
    });
  }
};
