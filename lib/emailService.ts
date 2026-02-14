import type { ReportData } from './types';
import { generateReportPDF } from './generatePDF';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@upcomingengineer.com';
const FROM_NAME = 'Upcoming Engineer';

export async function sendReportEmail(
  to: string,
  reportData: ReportData
): Promise<{ success: boolean; error?: string }> {
  try {
    const pdfBytes = await generateReportPDF(reportData);
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    if (!RESEND_API_KEY && !process.env.SMTP_HOST && !process.env.SMTP_USER) {
      return {
        success: false,
        error: 'Email is not configured. Add RESEND_API_KEY or SMTP settings to .env.local',
      };
    }

    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [to],
          subject: 'Hi, This is your resume analysis result!',
          html: getEmailBody(),
          attachments: [
            {
              filename: 'resume-analysis-report.pdf',
              content: base64Pdf,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data?.message || 'Failed to send email' };
      }
      return { success: true };
    }

    // Fallback: Nodemailer if RESEND not configured
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: 'Hi, This is your resume analysis result!',
      text: getEmailBodyPlain(),
      html: getEmailBody(),
      attachments: [
        { filename: 'resume-analysis-report.pdf', content: Buffer.from(pdfBytes) },
      ],
    });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

function getEmailBody(): string {
  return `
    <p>Hi,</p>
    <p>This is your resume analysis result!</p>
    <p>Please find your detailed report attached.</p>
    <p>We're excited to support your career journey.</p>
    <p>— Team Upcoming Engineer</p>
  `.replace(/\s+/g, ' ').trim();
}

function getEmailBodyPlain(): string {
  return `Hi,\nThis is your resume analysis result!\nPlease find your detailed report attached.\nWe're excited to support your career journey.\n— Team Upcoming Engineer`;
}
