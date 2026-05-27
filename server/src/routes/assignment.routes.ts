import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  regenerateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller';
import { validate, createAssignmentSchema, idParamSchema } from '../middleware/validate';
import { generationLimiter } from '../middleware/rateLimiter';

// ============================================
// Assignment Routes
// ============================================

const router = Router();

// List all assignments
router.get('/', getAssignments);

// Get single assignment (with generated paper)
router.get('/:id', validate(idParamSchema, 'params'), getAssignment);

// Create new assignment + trigger generation
router.post('/', generationLimiter, validate(createAssignmentSchema), createAssignment);

// Regenerate question paper
router.post('/:id/regenerate', generationLimiter, validate(idParamSchema, 'params'), regenerateAssignment);

// Delete assignment
router.delete('/:id', validate(idParamSchema, 'params'), deleteAssignment);

export default router;
