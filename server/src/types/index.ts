// ============================================
// Shared TypeScript types for VedaAI
// Used by both server models and API responses
// ============================================

export interface IQuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface IQuestion {
  questionNumber: number;
  text: string;
  options?: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
}

export interface ISection {
  title: string;
  type: string;
  instruction: string;
  marksPerQuestion: number;
  questions: IQuestion[];
}

export interface IAnswer {
  questionNumber: number;
  answer: string;
}

export interface IGeneratedPaper {
  institutionName: string;
  subject: string;
  className: string;
  duration: string;
  totalMarks: number;
  generalInstructions: string;
  sections: ISection[];
  answerKey?: IAnswer[];
}

export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IAssignment {
  _id?: string;
  title: string;
  subject: string;
  topic?: string;
  institution?: string;
  className?: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  uploadedContent?: string;
  uploadedFileName?: string;
  status: AssignmentStatus;
  generatedPaper?: IGeneratedPaper;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API request/response types
export interface CreateAssignmentRequest {
  title: string;
  subject: string;
  topic?: string;
  institution?: string;
  className?: string;
  dueDate: string;
  questionTypes: IQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket event types
export interface GenerationStatusEvent {
  assignmentId: string;
  status: AssignmentStatus;
  message?: string;
}
