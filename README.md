# ATS Resume Analyzer

**A Product of Upcoming Engineer**

A production-ready, full-stack web application that helps engineering students optimize their resumes for Applicant Tracking Systems (ATS). Built with Next.js (App Router), React, and Tailwind CSS.

## Features

- **Resume upload** — PDF, DOC, DOCX, PNG, JPG, JPEG, SVG (max 10MB)
- **Job title / job description** — Single-line + expandable textarea
- **3-step analysis flow** — Resume Analysis → Report Generation → Suggestions
- **ATS score** — Formula: (Matched Keywords / Total Important Keywords) × 100
- **Loading experience** — Animated loader with rotating career tips
- **Section-wise suggestions** — Skills, Projects, Experience, Education, Certifications
- **PDF download** — Full report with cover page and branding
- **Email report** — Send report PDF to any email (Resend or SMTP)

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, React Dropzone, Framer Motion
- **Backend:** Next.js API Routes
- **Libraries:** pdf-lib, pdf-parse, Mammoth, Tesseract.js (images), Resend / Nodemailer

## Run the app locally

In your terminal (from the project folder):

```bash
cd /Users/sineekumari/Documents/GitHub/ResumeScanner
npm install
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

If you use **nvm**: run `nvm use` (or `nvm install` if needed) before `npm install`.

---

## Make it live (deploy to the internet)

### Option A: Vercel (recommended, free tier)

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New… → Project** and import `ResumeScanner` (or your repo name).
4. Leave **Framework Preset** as Next.js; click **Deploy**.
5. After deploy, your app is live at `https://your-project.vercel.app`.

**Optional – env vars for email:** In the Vercel project → **Settings → Environment Variables**, add:
- `RESEND_API_KEY` for Resend (reports are sent from **info@upcomingengineer.com** by default; set `FROM_EMAIL` to override), or
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` for SMTP.

Redeploy after adding variables.

### Option B: Run production build on your machine

```bash
npm run build
npm start
```

Then open [http://localhost:3000](http://localhost:3000). To expose it on the internet you’d use a tunnel (e.g. ngrok) or a host that runs Node.

---

## Environment variables (optional)

Copy `.env.example` to `.env.local` and add (for local dev or Vercel):

- `RESEND_API_KEY` — For sending emails via [Resend](https://resend.com)
- `FROM_EMAIL` — Sender address (default: **info@upcomingengineer.com**)

Or use SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Project Structure

```
/app
  page.tsx           # Main analyzer page
  layout.tsx
  globals.css
  /components        # Navbar, Footer, FileUpload, JobInput, Stepper, etc.
  /api
    /analyze         # POST: analyze resume
    /send-report     # POST: email report
    /pdf             # POST: generate and return PDF
/lib
  extractText.ts     # PDF/DOCX text extraction
  atsScoring.ts     # ATS score and suggestions
  generatePDF.ts     # PDF report generation
  emailService.ts   # Resend / Nodemailer
  types.ts
```

## Security & Validation

- File type and size validation (10MB max)
- Basic rate limiting on `/api/analyze`
- Input sanitization and length limits
- Environment variables for secrets

---

*Empowering engineering students to become industry-ready. — Upcoming Engineer*
