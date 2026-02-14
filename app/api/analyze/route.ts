import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromBuffer } from '@/lib/extractText';
import { analyzeResume } from '@/lib/atsScoring';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.svg'];

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const name = (file.name || '').toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

// Simple in-memory rate limit (use Redis in production)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 10;

function getClientId(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function checkRateLimit(id: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(id);
  if (!entry) {
    rateLimit.set(id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (now > entry.resetAt) {
    rateLimit.set(id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(getClientId(request))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File | null;
    const jobTitle = String(formData.get('jobTitle') || '').trim().slice(0, 500);
    const jobDescription = String(formData.get('jobDescription') || '').slice(0, 10000);

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Please upload a resume file.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be under 10MB.' },
        { status: 400 }
      );
    }
    if (!isAllowedFile(file)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use PDF, DOC, DOCX, PNG, JPG, or SVG.' },
        { status: 400 }
      );
    }
    if (!jobTitle && !jobDescription) {
      return NextResponse.json(
        { error: 'Please enter a job title or job description.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const imagePlaceholder = 'Resume text from image could not be extracted. Please use PDF or DOCX for best results.';
    let resumeText = '';
    if (mimeType.startsWith('image/')) {
      resumeText = imagePlaceholder;
      try {
        const Tesseract = (await import('tesseract.js')).default;
        const { data } = await Tesseract.recognize(buffer, 'eng');
        if (data?.text && data.text.trim().length > 50) resumeText = data.text.replace(/\s+/g, ' ').trim();
      } catch {
        // keep placeholder
      }
      if (resumeText === imagePlaceholder) {
        return NextResponse.json(
          { error: 'Could not extract text from image. Please use a PDF or DOCX resume for accurate analysis.' },
          { status: 400 }
        );
      }
    } else {
      resumeText = await extractTextFromBuffer(buffer, mimeType);
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the resume. Try a different file or format.' },
        { status: 400 }
      );
    }

    const analysis = analyzeResume(resumeText, jobTitle, jobDescription);
    return NextResponse.json({
      ...analysis,
      fileName: file.name,
      jobTitle: jobTitle || 'Not specified',
      analyzedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Analyze error:', e);
    const message = e instanceof Error ? e.message : 'Analysis failed. Please try again.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
