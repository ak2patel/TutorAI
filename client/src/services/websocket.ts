import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { setGenerationStatus } from '../store/slices/assessmentSlice';
import type { GenerationStatusEvent } from '../types';

// ============================================
// Socket.IO Client
// Connects to backend for real-time progress updates
// ============================================

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (socket && socket.connected) return socket;

  const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
  
  console.log('🔌 Initializing WebSocket connection to:', url);
  
  socket = io(url, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected successfully');
  });

  socket.on('generation-status', (event: GenerationStatusEvent) => {
    console.log('📡 Status update received:', event);
    
    // Check if this update is for the currently tracked assignment
    const { currentAssignmentId } = store.getState().assessment;
    
    if (currentAssignmentId === event.assignmentId) {
      store.dispatch(
        setGenerationStatus({
          status: event.status,
          message: event.message || 'Processing...',
        })
      );
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ WebSocket connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  return socket;
};

export const joinAssignmentRoom = (assignmentId: string): void => {
  const s = initSocket();
  console.log('🔌 Joining assignment room:', assignmentId);
  s.emit('join-assignment', assignmentId);
};

export const leaveAssignmentRoom = (assignmentId: string): void => {
  const s = initSocket();
  console.log('🔌 Leaving assignment room:', assignmentId);
  s.emit('leave-assignment', assignmentId);
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 WebSocket disconnected manually');
  }
};
