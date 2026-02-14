/// <reference path="../types/pdf-lib.d.ts" />
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ReportData } from './types';

// Helvetica supports limited charset; sanitize to avoid PDF errors (ASCII printable only)
function sanitizeForPdf(str: string, maxLineLen = 90): string[] {
  const s = String(str ?? '')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const lines: string[] = [];
  for (const part of s.split('\n')) {
    let line = part.slice(0, maxLineLen);
    let rest = part.slice(maxLineLen);
    while (line.length > 0) {
      lines.push(line);
      line = rest.slice(0, maxLineLen);
      rest = rest.slice(maxLineLen);
    }
  }
  return lines.length > 0 ? lines : ['-'];
}

export async function generateReportPDF(data: ReportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  let y = pageHeight - margin;

  function addPage() {
    return doc.addPage([pageWidth, pageHeight]);
  }

  let currentPage = doc.addPage([pageWidth, pageHeight]);

  function drawText(
    text: string,
    size: number,
    opts: { bold?: boolean; color?: ReturnType<typeof rgb> } = {}
  ) {
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? rgb(0.1, 0.1, 0.1);
    const lines = sanitizeForPdf(text);
    for (const line of lines) {
      if (y < margin + 20) {
        currentPage = addPage();
        y = pageHeight - margin;
      }
      const safeLine = line.trim() || ' ';
      currentPage.drawText(safeLine, {
        x: margin,
        y,
        size,
        font: f,
        color,
      });
      y -= size + 4;
    }
  }

  const atsScore = typeof data.atsScore === 'number' ? data.atsScore : 0;
  const jobTitle = String(data.jobTitle ?? 'Not specified');
  const fileName = String(data.fileName ?? 'Resume');
  const analyzedAt = String(data.analyzedAt ?? new Date().toISOString());
  const scoreCategory = String(data.scoreCategory ?? 'needs_improvement').replace('_', ' ');
  const summary = String(data.summary ?? 'Review your report below.');

  // Cover page (ASCII-only for compatibility)
  y = pageHeight - margin;
  drawText('ATS Resume Analysis Report', 22, { bold: true, color: rgb(0.15, 0.39, 0.92) });
  y -= 20;
  drawText(`Job: ${jobTitle}`, 12);
  drawText(`Resume: ${fileName}`, 12);
  drawText(`Analyzed: ${analyzedAt}`, 12);
  y -= 24;
  drawText(`ATS Score: ${atsScore}%`, 28, { bold: true });
  drawText(`Category: ${scoreCategory}`, 14);
  y -= 32;
  drawText(summary, 11);
  y -= 40;
  drawText('- Team Upcoming Engineer', 10, { color: rgb(0.4, 0.4, 0.4) });

  // Summary page
  y = pageHeight - margin;
  currentPage = addPage();
  drawText('Analysis Summary', 18, { bold: true });
  y -= 24;
  const matched = Array.isArray(data.matchedKeywords) ? data.matchedKeywords : [];
  const missing = Array.isArray(data.missingKeywords) ? data.missingKeywords : [];
  const skillGaps = Array.isArray(data.skillGaps) ? data.skillGaps : [];
  const formattingIssues = Array.isArray(data.formattingIssues) ? data.formattingIssues : [];
  const sectionSuggestions = Array.isArray(data.sectionSuggestions) ? data.sectionSuggestions : [];

  drawText(`Matched Keywords (${matched.length})`, 12, { bold: true });
  drawText(matched.slice(0, 20).map(String).join(', ') || 'None', 10);
  y -= 16;
  drawText(`Missing Keywords (${missing.length})`, 12, { bold: true });
  drawText(missing.slice(0, 20).map(String).join(', ') || 'None', 10);
  y -= 16;
  drawText('Skill Gaps', 12, { bold: true });
  drawText(skillGaps.map(String).join(', ') || 'None', 10);
  y -= 16;
  drawText('Formatting Issues', 12, { bold: true });
  drawText(formattingIssues.map(String).join('\n') || 'None', 10);
  y -= 24;

  for (const sec of sectionSuggestions) {
    if (y < margin + 80) {
      currentPage = addPage();
      y = pageHeight - margin;
    }
    const secName = String(sec.section ?? 'general');
    const missingArr = Array.isArray(sec.missing) ? sec.missing : [];
    const improvementsArr = Array.isArray(sec.improvements) ? sec.improvements : [];
    const examplesArr = Array.isArray(sec.examples) ? sec.examples : [];
    drawText(`Section: ${secName}`, 14, { bold: true });
    drawText(`Missing: ${missingArr.map(String).join(', ') || '-'}`, 10);
    drawText('Improvements: ' + improvementsArr.map(String).join('; '), 10);
    drawText('Examples: ' + examplesArr.map(String).join('; '), 10);
    y -= 28;
  }

  const lastPage = doc.getPage(doc.getPageCount() - 1);
  lastPage.drawText('- Upcoming Engineer | ATS Resume Analyzer', {
    x: margin,
    y: 30,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  return doc.save();
}
