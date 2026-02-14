/**
 * Extract text from resume files (PDF, DOCX, images).
 * PDF/DOCX run on server; image OCR can run client or server.
 */

/// <reference path="../types/node-globals.d.ts" />
import mammoth from 'mammoth';

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
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = (typeof (pdfParseModule as unknown as { default?: (buf: Buffer) => Promise<{ text?: string }> }).default === 'function'
        ? (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text?: string }> }).default
        : pdfParseModule) as (buf: Buffer) => Promise<{ text?: string }>;
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
      let trimmed = String(text).replace(/\s+/g, ' ').trim();
      if (trimmed.length > 0) return trimmed;
      try {
        const result2 = await mammoth.extractRawText({ buffer: new Uint8Array(buffer) });
        trimmed = String(result2?.value ?? '').replace(/\s+/g, ' ').trim();
      } catch {
        // ignore
      }
      if (trimmed.length > 0) return trimmed;
      throw new Error('Document appears empty or could not be read.');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('empty') || message.includes('could not be read')) {
        throw new Error('Could not read this Word file. Please save your resume as PDF or .docx (Word 2007+) and try again.');
      }
      console.error('Word parse error:', err);
      throw new Error(
        'Could not read this Word file. Please save your resume as PDF or .docx (Word 2007+) and try again. Old .doc (97-2003) format is not supported.'
      );
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
