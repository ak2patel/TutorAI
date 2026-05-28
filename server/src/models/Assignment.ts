import mongoose, { Schema, Document } from 'mongoose';
import type { IAssignment, AssignmentStatus } from '../types';

// ============================================
// Assignment Mongoose Model
// Stores assignment config + generated question paper
// ============================================

export interface IAssignmentDocument extends Omit<IAssignment, '_id'>, Document {}

const QuestionSchema = new Schema({
  questionNumber: { type: Number, required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging'],
    required: true,
  },
  marks: { type: Number, required: true },
}, { _id: false });

const SectionSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  instruction: { type: String, required: true },
  marksPerQuestion: { type: Number, required: true },
  questions: [QuestionSchema],
}, { _id: false });

const AnswerSchema = new Schema({
  questionNumber: { type: Number, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const GeneratedPaperSchema = new Schema({
  institutionName: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  duration: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  generalInstructions: { type: String, required: true },
  sections: [SectionSchema],
  answerKey: [AnswerSchema],
}, { _id: false });

const QuestionTypeSchema = new Schema({
  type: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true, min: 1 },
  marksPerQuestion: { type: Number, required: true, min: 1 },
}, { _id: false });

const AssignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    institution: { type: String, trim: true, default: 'Delhi Public School, Sector-4, Bokaro' },
    className: { type: String, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: {
      type: [QuestionTypeSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: 'At least one question type is required',
      },
    },
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    additionalInstructions: { type: String, trim: true },
    uploadedContent: { type: String },
    uploadedFileName: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'] as AssignmentStatus[],
      default: 'pending',
    },
    generatedPaper: { type: GeneratedPaperSchema },
    jobId: { type: String },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient querying
AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ createdAt: -1 });

export const Assignment = mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema);
