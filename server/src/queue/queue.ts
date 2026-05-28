import { Queue } from 'bullmq';
import { getBullMQConnectionOptions } from '../config/redis';

// ============================================
// BullMQ Queue Definition
// Manages AI question paper generation jobs
// ============================================

const QUEUE_NAME = 'question-generation';

let generationQueue: Queue | null = null;

export const getGenerationQueue = (): Queue => {
  if (!generationQueue) {
    generationQueue = new Queue(QUEUE_NAME, {
      connection: getBullMQConnectionOptions(),
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          count: 100,
        },
        removeOnFail: {
          count: 50,
        },
      },
    });

    console.log(`📋 BullMQ queue "${QUEUE_NAME}" initialized`);
  }

  return generationQueue;
};

/**
 * Adds a generation job to the queue
 */
export const enqueueGenerationJob = async (assignmentId: string): Promise<string> => {
  const queue = getGenerationQueue();
  
  const job = await queue.add(
    'generate-paper',
    { assignmentId },
    {
      jobId: `gen-${assignmentId}-${Date.now()}`,
    }
  );

  console.log(`📥 Job ${job.id} enqueued for assignment ${assignmentId}`);
  return job.id || '';
};

export const closeQueue = async (): Promise<void> => {
  if (generationQueue) {
    await generationQueue.close();
    generationQueue = null;
    console.log('📋 BullMQ queue closed');
  }
};
