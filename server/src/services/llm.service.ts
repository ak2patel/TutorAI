import Groq from 'groq-sdk';
import { env } from '../config/env';
import type { IGeneratedPaper } from '../types';

// ============================================
// Groq LLM Service
// Uses Llama 3.3 70B via Groq for fast inference
// ============================================

let groqClient: Groq | null = null;

const getGroqClient = (): Groq => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return groqClient;
};

const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 8000;
const TEMPERATURE = 0.7;

/**
 * Sends a structured prompt to Groq and returns the raw text response
 */
export const generateWithGroq = async (prompt: string): Promise<string> => {
  const client = getGroqClient();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert exam paper creator for educational institutions. You always respond with valid JSON only, no markdown, no explanation text. Your papers are well-structured, pedagogically sound, and follow standard exam formatting conventions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    return content;
  } catch (error) {
    if (error instanceof Groq.APIError) {
      console.error(`Groq API error: ${error.status} ${error.message}`);
      throw new Error(`AI generation failed: ${error.message}`);
    }
    throw error;
  }
};
