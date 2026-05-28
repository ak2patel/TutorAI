'use client';

import { useEffect } from 'react';
import { initSocket } from '@/services/websocket';

export default function SocketInitializer() {
  useEffect(() => {
    // Initialize WebSocket connection when app loads
    const socket = initSocket();
    
    return () => {
      // Cleanup on unmount
      socket.disconnect();
    };
  }, []);

  return null;
}
