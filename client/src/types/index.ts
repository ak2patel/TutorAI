// ============================================
// Shared TypeScript types for Frontend
// Mirrored from Backend
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
  id: string; // Mongoose transforms _id to id
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
  uploadedFileName?: string;
  status: AssignmentStatus;
  generatedPaper?: IGeneratedPaper;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
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
  data: T;
  error?: string;
  message?: string;
}
