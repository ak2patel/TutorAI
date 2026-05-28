import Redis from 'ioredis';
import { env } from './env';

// ============================================
// Redis Connection (Upstash-compatible)
// ============================================

let redisConnection: Redis | null = null;

/**
 * Returns a shared ioredis instance.
 * Used for direct Redis commands (caching, etc.)
 */
export const getRedisConnection = (): Redis => {
  if (!redisConnection) {
    redisConnection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      lazyConnect: false,
      tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
      retryStrategy: (times: number) => {
        if (times > 5) {
          console.error('❌ Redis connection failed after 5 retries');
          return null;
        }
        return Math.min(times * 500, 3000);
      },
    });

    redisConnection.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisConnection.on('error', (error) => {
      console.error('❌ Redis connection error:', error.message);
    });
  }

  return redisConnection;
};

/**
 * Returns a plain connection config object for BullMQ.
 * BullMQ creates its own ioredis instances internally,
 * so we give it parsed connection options instead of an instance.
 */
export const getBullMQConnectionOptions = () => {
  const url = new URL(env.REDIS_URL);
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    username: url.username || 'default',
    tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
    maxRetriesPerRequest: null as null,
    enableReadyCheck: false,
  };
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
    console.log('🔌 Redis disconnected gracefully');
  }
};
