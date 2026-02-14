import { NextRequest, NextResponse } from 'next/server';
import { sendReportEmail } from '@/lib/emailService';
import type { ReportData } from '@/lib/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const reportData = body?.reportData as ReportData | undefined;

    if (!email) {
      return NextResponse.json(
        { error: 'Please enter your email address.' },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (!reportData || typeof reportData.atsScore !== 'number') {
      return NextResponse.json(
        { error: 'Invalid report data. Please run the analysis again.' },
        { status: 400 }
      );
    }

    const result = await sendReportEmail(email, reportData);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Send report error:', e);
    return NextResponse.json(
      { error: 'Failed to send report. Please try again.' },
      { status: 500 }
    );
  }
}
