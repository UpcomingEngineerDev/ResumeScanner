/**
 * Extract text from resume files (PDF, DOCX, images).
 * PDF/DOCX run on server; image OCR can run client or server.
 */

/// <reference path="../types/node-globals.d.ts" />
import mammoth from 'mammoth';

// pdf-parse is CJS; use require in Node (API routes only)
function getPdfParse(): (buf: Buffer) => Promise<{ text?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('pdf-parse') as (buf: Buffer) => Promise<{ text?: string }>;
  } catch {
    throw new Error('pdf-parse is not available. Ensure it is installed.');
  }
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return '';
  }
  const type = String(mimeType || '').toLowerCase();

  if (type === 'application/pdf') {
    try {
      const pdfParse = getPdfParse();
      const data = await pdfParse(buffer);
      const text = data?.text ?? '';
      return String(text).replace(/\s+/g, ' ').trim();
    } catch (err) {
      console.error('PDF parse error:', err);
      throw new Error('Failed to parse PDF. The file may be corrupted or password-protected.');
    }
  }

  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/msword'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result?.value ?? '';
      return String(text).replace(/\s+/g, ' ').trim();
    } catch (err) {
      console.error('DOCX parse error:', err);
      throw new Error('Failed to parse Word document.');
    }
  }

  return '';
}

export function extractKeywordsFromText(text: string): string[] {
  const input = String(text ?? '');
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'it', 'its', 'i', 'we', 'you', 'they', 'he', 'she',
  ]);
  const words = input
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const w of words) {
    if (!seen.has(w)) {
      seen.add(w);
      unique.push(w);
    }
  }
  return unique;
}

export function extractJobKeywords(jobDescription: string): string[] {
  const raw = String(jobDescription ?? '');
  const keywords = extractKeywordsFromText(raw);
  return keywords
    .filter((k) => k.length >= 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, 80);
}
