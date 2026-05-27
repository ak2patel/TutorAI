// ============================================
// PDF Text Extraction Service
// Extracts text content from uploaded PDF files
// ============================================

// pdf-parse types are incomplete, so we use require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

/**
 * Extracts text from a PDF buffer
 */
export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();

    if (!text || text.length === 0) {
      throw new Error('No text content found in PDF');
    }

    // Limit text to prevent token overflow (roughly 4 chars per token)
    const MAX_CHARS = 32000; // ~8000 tokens
    if (text.length > MAX_CHARS) {
      return text.substring(0, MAX_CHARS) + '\n\n[Content truncated for processing]';
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No text content')) {
      throw error;
    }
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Extracts text from plain text file buffer
 */
export const extractTextFromFile = async (
  buffer: Buffer,
  mimeType: string
): Promise<string> => {
  if (mimeType === 'application/pdf') {
    return extractTextFromPdf(buffer);
  }

  // For text files, just convert buffer to string
  if (mimeType.startsWith('text/')) {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
};
