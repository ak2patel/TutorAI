import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { asyncHandler, createAppError } from '../middleware/errorHandler';
import { getRedisConnection } from '../config/redis';
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

  const assignment = await Assignment.create({
    ...body,
    dueDate: new Date(body.dueDate),
    status: 'pending',
  });

  // Queue will be set up in commit 4 - for now just save
  // The queue import and job enqueue will be added in the BullMQ commit

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

  // Queue will re-enqueue job in commit 4

  const response: ApiResponse<IAssignment> = {
    success: true,
    data: assignment.toJSON() as unknown as IAssignment,
    message: 'Regeneration queued',
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
