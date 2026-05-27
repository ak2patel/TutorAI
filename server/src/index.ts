import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { disconnectRedis } from './config/redis';
import assignmentRoutes from './routes/assignment.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { initWebSocket, emitAssignmentStatus } from './websocket/socket';
import { startWorker, closeWorker, setStatusEmitter } from './queue/worker';
import { closeQueue } from './queue/queue';

// ============================================
// VedaAI Server Entry Point
// Express + Socket.IO (WebSocket added in commit 5)
// ============================================

const app = express();
const httpServer = createServer(app);

// --- Middleware ---
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// --- Routes ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/assignments', assignmentRoutes);

// --- Error Handler (must be last) ---
app.use(errorHandler);

// --- Start Server ---
const startServer = async (): Promise<void> => {
  await connectDatabase();

  // Initialize Socket.IO
  initWebSocket(httpServer);

  // Initialize BullMQ Worker
  setStatusEmitter(emitAssignmentStatus);
  startWorker();

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 VedaAI Server running on port ${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
  });
};

// --- Graceful Shutdown ---
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  
  httpServer.close(async () => {
    await closeWorker();
    await closeQueue();
    await disconnectDatabase();
    await disconnectRedis();
    console.log('👋 Server shut down complete');
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export { app, httpServer };
