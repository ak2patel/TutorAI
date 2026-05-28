import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { asyncHandler, createAppError } from '../middleware/errorHandler';
import { getRedisConnection } from '../config/redis';
import { enqueueGenerationJob } from '../queue/queue';
import type { CreateAssignmentRequest, ApiResponse, IAssignment } from '../types';

// ============================================
// Assignment Controller
// Handles CRUD operations and enqueues generation jobs
// ============================================

const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_PREFIX = 'assignment:';

/**
 * POST /api/assignments
 * Create a new assignment and enqueue AI generation job
 */
export const createAssignment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateAssignmentRequest;
  
  console.log('📝 Creating new assignment:', {
    title: body.title,
    subject: body.subject,
    totalQuestions: body.totalQuestions,
    totalMarks: body.totalMarks,
    questionTypes: body.questionTypes?.length
  });

  const assignment = await Assignment.create({
    ...body,
    dueDate: new Date(body.dueDate),
    status: 'pending',
  });

  console.log(`✅ Assignment created with ID: ${assignment.id}`);

  // Enqueue AI generation job
  console.log(`📤 Enqueueing generation job for assignment ${assignment.id}`);
  await enqueueGenerationJob(assignment.id);
  console.log(`✅ Job enqueued successfully`);

  const response: ApiResponse<IAssignment> = {
    success: true,
    data: assignment.toJSON() as unknown as IAssignment,
    message: 'Assignment created successfully',
  };

  res.status(201).json(response);
});

/**
 * GET /api/assignments
 * List all assignments (for dashboard)
 */
export const getAssignments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const assignments = await Assignment.find()
    .select('-generatedPaper -uploadedContent') // Exclude heavy fields for listing
    .sort({ createdAt: -1 })
    .lean();

  const response: ApiResponse<typeof assignments> = {
    success: true,
    data: assignments,
  };

  res.json(response);
});

/**
 * GET /api/assignments/:id
 * Get a single assignment with generated paper (uses Redis cache)
 */
export const getAssignment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const redis = getRedisConnection();

  // Check cache first
  const cached = await redis.get(`${CACHE_PREFIX}${id}`);
  if (cached) {
    const response: ApiResponse = {
      success: true,
      data: JSON.parse(cached),
    };
    res.json(response);
    return;
  }

  const assignment = await Assignment.findById(id).lean();
  if (!assignment) {
    throw createAppError('Assignment not found', 404);
  }

  // Cache completed assignments
  if (assignment.status === 'completed') {
    await redis.setex(`${CACHE_PREFIX}${id}`, CACHE_TTL, JSON.stringify(assignment));
  }

  const response: ApiResponse<typeof assignment> = {
    success: true,
    data: assignment,
  };

  res.json(response);
});

/**
 * POST /api/assignments/:id/regenerate
 * Re-trigger AI generation for an existing assignment
 */
export const regenerateAssignment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw createAppError('Assignment not found', 404);
  }

  // Reset status and clear previous paper
  assignment.status = 'pending';
  assignment.generatedPaper = undefined;
  assignment.errorMessage = undefined;
  await assignment.save();

  // Invalidate cache
  const redis = getRedisConnection();
  await redis.del(`${CACHE_PREFIX}${id}`);

  // Re-enqueue job
  await enqueueGenerationJob(assignment.id);

  const response: ApiResponse<IAssignment> = {
    success: true,
    data: assignment.toJSON() as unknown as IAssignment,
    message: 'Regeneration queued',
  };

  res.json(response);
});

/**
 * PATCH /api/assignments/:id
 * Update assignment title
 */
export const updateAssignment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw createAppError('Title is required', 400);
  }

  const assignment = await Assignment.findByIdAndUpdate(
    id,
    { title: title.trim() },
    { new: true, runValidators: true }
  );

  if (!assignment) {
    throw createAppError('Assignment not found', 404);
  }

  // Invalidate cache
  const redis = getRedisConnection();
  await redis.del(`${CACHE_PREFIX}${id}`);

  const response: ApiResponse<IAssignment> = {
    success: true,
    data: assignment.toJSON() as unknown as IAssignment,
    message: 'Assignment updated successfully',
  };

  res.json(response);
});

/**
 * DELETE /api/assignments/:id
 * Delete an assignment
 */
export const deleteAssignment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) {
    throw createAppError('Assignment not found', 404);
  }

  // Invalidate cache
  const redis = getRedisConnection();
  await redis.del(`${CACHE_PREFIX}${id}`);

  const response: ApiResponse = {
    success: true,
    message: 'Assignment deleted successfully',
  };

  res.json(response);
});
