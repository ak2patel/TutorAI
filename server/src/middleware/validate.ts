import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ============================================
// Zod Validation Middleware
// Validates request body/params/query against a Zod schema
// ============================================

type ValidationTarget = 'body' | 'params' | 'query';

export const validate = (schema: z.ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    // Attach validated data back to request
    req[target] = result.data;
    next();
  };
};

// ============================================
// Validation Schemas
// ============================================

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().min(1, 'Subject is required').max(100),
  topic: z.string().max(200).optional(),
  institution: z.string().max(200).optional(),
  className: z.string().max(50).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z
    .array(
      z.object({
        type: z.string().min(1),
        numberOfQuestions: z.number().int().min(1, 'Must have at least 1 question'),
        marksPerQuestion: z.number().int().min(1, 'Marks must be at least 1'),
      })
    )
    .min(1, 'At least one question type is required'),
  totalQuestions: z.number().int().min(1),
  totalMarks: z.number().int().min(1),
  additionalInstructions: z.string().max(2000).optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
