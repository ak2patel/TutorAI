import type { IAssignment, IGeneratedPaper } from '../types';

// ============================================
// Prompt Construction Service
// Converts assignment config into a structured LLM prompt
// ============================================

const DIFFICULTY_DISTRIBUTION = {
  easy: 0.3,
  moderate: 0.4,
  challenging: 0.3,
};

/**
 * Builds a structured prompt for the LLM to generate a question paper
 */
export const buildPrompt = (assignment: IAssignment): string => {
  const sectionDescriptions = assignment.questionTypes
    .map((qt, index) => {
      const sectionLetter = String.fromCharCode(65 + index); // A, B, C, ...
      return `- Section ${sectionLetter}: "${qt.type}" — ${qt.numberOfQuestions} questions, ${qt.marksPerQuestion} marks each`;
    })
    .join('\n');

  const difficultyGuidance = `
Distribute difficulty across questions approximately:
- Easy: ~${Math.round(DIFFICULTY_DISTRIBUTION.easy * 100)}%
- Moderate: ~${Math.round(DIFFICULTY_DISTRIBUTION.moderate * 100)}%
- Challenging: ~${Math.round(DIFFICULTY_DISTRIBUTION.challenging * 100)}%`;

  const contentContext = assignment.uploadedContent
    ? `\n\nREFERENCE MATERIAL (use this as the knowledge base for generating questions):\n${assignment.uploadedContent.substring(0, 8000)}`
    : '';

  const additionalContext = assignment.additionalInstructions
    ? `\n\nADDITIONAL INSTRUCTIONS FROM TEACHER:\n${assignment.additionalInstructions}`
    : '';

  return `You are an expert exam paper creator. Generate a complete, well-structured question paper based on the following specifications.

ASSIGNMENT DETAILS:
- Institution: ${assignment.institution || 'Delhi Public School, Sector-4, Bokaro'}
- Subject: ${assignment.subject}
- Class: ${assignment.className || '5th'}
- Topic/Chapter: ${assignment.topic || assignment.subject}
- Total Questions: ${assignment.totalQuestions}
- Total Marks: ${assignment.totalMarks}
- Duration: Calculate appropriate duration based on total marks (e.g., 45 min for 20 marks, 3 hours for 100 marks)

SECTIONS:
${sectionDescriptions}

${difficultyGuidance}
${contentContext}
${additionalContext}

RESPONSE FORMAT — You MUST respond with ONLY valid JSON matching this exact schema (no markdown, no explanation):

${JSON.stringify(getOutputSchema(), null, 2)}

IMPORTANT RULES:
1. Questions must be relevant to the subject and topic
2. Each question must have exactly the marks specified for its section
3. Question numbering must be sequential across the entire paper (1, 2, 3, ... not restarting per section)
4. For MCQ questions, provide exactly 4 options labeled (a), (b), (c), (d)
5. Difficulty must be one of: "Easy", "Moderate", "Challenging"
6. Include an answer key with concise but complete answers
7. The generalInstructions should include "All questions are compulsory unless stated otherwise."
8. DO NOT include any text outside the JSON object`;
};

/**
 * Returns the expected JSON output schema description
 */
const getOutputSchema = (): Record<string, unknown> => ({
  institutionName: "string — full institution name",
  subject: "string — subject name",
  className: "string — class/grade",
  duration: "string — e.g. '45 minutes' or '3 hours'",
  totalMarks: "number — total marks",
  generalInstructions: "string — exam instructions",
  sections: [
    {
      title: "string — e.g. 'Section A'",
      type: "string — e.g. 'Multiple Choice Questions'",
      instruction: "string — e.g. 'Attempt all questions. Each question carries 1 mark'",
      marksPerQuestion: "number",
      questions: [
        {
          questionNumber: "number — sequential across paper",
          text: "string — the question text",
          options: ["string — only for MCQ, 4 options"],
          difficulty: "string — Easy | Moderate | Challenging",
          marks: "number",
        },
      ],
    },
  ],
  answerKey: [
    {
      questionNumber: "number",
      answer: "string — concise but complete answer",
    },
  ],
});

/**
 * Parses the LLM response into a structured IGeneratedPaper
 * Handles both clean JSON and JSON wrapped in markdown code blocks
 */
export const parseGeneratedPaper = (rawResponse: string): IGeneratedPaper => {
  let jsonString = rawResponse.trim();

  // Remove markdown code block wrappers if present
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  try {
    const parsed = JSON.parse(jsonString) as IGeneratedPaper;

    // Basic validation
    if (!parsed.institutionName || !parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid paper structure: missing required fields');
    }

    if (parsed.sections.length === 0) {
      throw new Error('Paper must have at least one section');
    }

    for (const section of parsed.sections) {
      if (!section.questions || section.questions.length === 0) {
        throw new Error(`Section "${section.title}" has no questions`);
      }
    }

    return parsed;
  } catch (error) {
    // Try to extract JSON from response if nested in text
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as IGeneratedPaper;
      } catch {
        // Fall through to error
      }
    }

    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
