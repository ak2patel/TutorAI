import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { buildPrompt, parseGeneratedPaper } from '../services/prompt.service';
import { generateWithGroq } from '../services/llm.service';
import type { IAssignment } from '../types';

// ============================================
// BullMQ Worker
// Processes AI question paper generation jobs
// ============================================

let worker: Worker | null = null;

// Socket.IO emitter — will be injected from index.ts in commit 5
let emitStatusUpdate: ((assignmentId: string, status: string, message?: string) => void) | null = null;

export const setStatusEmitter = (
  emitter: (assignmentId: string, status: string, message?: string) => void
): void => {
  emitStatusUpdate = emitter;
};

const notifyClient = (assignmentId: string, status: string, message?: string): void => {
  if (emitStatusUpdate) {
    emitStatusUpdate(assignmentId, status, message);
  }
};

/**
 * Process a single generation job
 */
const processGenerationJob = async (job: Job<{ assignmentId: string }>): Promise<void> => {
  const { assignmentId } = job.data;
  console.log(`⚙️ Processing generation job for assignment ${assignmentId}`);

  // 1. Fetch assignment from DB
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  // 2. Update status to processing
  assignment.status = 'processing';
  await assignment.save();
  notifyClient(assignmentId, 'processing', 'Generating question paper...');

  // 3. Build structured prompt
  const assignmentData = assignment.toJSON() as unknown as IAssignment;
  const prompt = buildPrompt(assignmentData);
  console.log(`📝 Prompt built (${prompt.length} chars) for assignment ${assignmentId}`);

  // 4. Call Groq LLM
  notifyClient(assignmentId, 'processing', 'AI is generating questions...');
  const rawResponse = await generateWithGroq(prompt);
  console.log(`🤖 Groq response received (${rawResponse.length} chars)`);

  // 5. Parse and validate the response
  notifyClient(assignmentId, 'processing', 'Parsing generated paper...');
  const generatedPaper = parseGeneratedPaper(rawResponse);
  console.log(
    `✅ Parsed: ${generatedPaper.sections.length} sections, ` +
    `${generatedPaper.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions`
  );

  // 6. Save to DB
  assignment.generatedPaper = generatedPaper;
  assignment.status = 'completed';
  assignment.errorMessage = undefined;
  await assignment.save();

  // 7. Cache in Redis
  const redis = getRedisConnection();
  await redis.setex(
    `assignment:${assignmentId}`,
    3600,
    JSON.stringify(assignment.toJSON())
  );

  // 8. Notify client
  notifyClient(assignmentId, 'completed', 'Question paper generated successfully!');
  console.log(`🎉 Assignment ${assignmentId} generation completed`);
};

/**
 * Starts the BullMQ worker
 */
export const startWorker = (): Worker => {
  if (worker) {
    return worker;
  }

  worker = new Worker(
    'question-generation',
    async (job) => {
      await processGenerationJob(job);
    },
    {
      connection: getRedisConnection(),
      concurrency: 2, // Process up to 2 jobs at a time
      limiter: {
        max: 5,
        duration: 60000, // Max 5 jobs per minute (rate limit protection)
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', async (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message);

    if (job) {
      const { assignmentId } = job.data as { assignmentId: string };
      
      // Update assignment status on final failure
      try {
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'failed',
          errorMessage: error.message,
        });
        notifyClient(assignmentId, 'failed', error.message);
      } catch (dbError) {
        console.error('Failed to update assignment status:', dbError);
      }
    }
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  console.log('🔧 BullMQ worker started (concurrency: 2)');
  return worker;
};

export const closeWorker = async (): Promise<void> => {
  if (worker) {
    await worker.close();
    worker = null;
    console.log('🔧 BullMQ worker closed');
  }
};
