import Redis from 'ioredis';
import { env } from './env';

let redisConnection: Redis | null = null;

export const getRedisConnection = (): Redis => {
  if (!redisConnection) {
    redisConnection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.error('❌ Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 200, 2000);
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

export const disconnectRedis = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
    console.log('🔌 Redis disconnected gracefully');
  }
};
