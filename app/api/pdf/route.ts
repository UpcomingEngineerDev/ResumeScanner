import { NextRequest, NextResponse } from 'next/server';
import { generateReportPDF } from '@/lib/generatePDF';
import type { ReportData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reportData = body?.reportData as ReportData | undefined;

    if (!reportData || typeof reportData.atsScore !== 'number') {
      return NextResponse.json(
        { error: 'Invalid report data.' },
        { status: 400 }
      );
    }

    const pdfBytes = await generateReportPDF(reportData);
    return new NextResponse(new Uint8Array(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume-analysis-report.pdf"',
      },
    });
  } catch (e) {
    console.error('PDF generation error:', e);
    return NextResponse.json(
      { error: 'Failed to generate PDF.' },
      { status: 500 }
    );
  }
}
