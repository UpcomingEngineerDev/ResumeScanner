'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import JobInput from './components/JobInput';
import Stepper from './components/Stepper';
import LoaderWithTips from './components/LoaderWithTips';
import ScoreDisplay from './components/ScoreDisplay';
import ReportCard from './components/ReportCard';
import type { AnalysisResult } from '@/lib/types';
import type { ReportData } from '@/lib/types';

type Step = 1 | 2 | 3;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [jobError, setJobError] = useState('');
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const validate = () => {
    setUploadError('');
    setJobError('');
    if (!file) {
      setUploadError('Please upload your resume.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10MB.');
      return false;
    }
    if (!jobTitle.trim() && !jobDescription.trim()) {
      setJobError('Please enter a job title or job description.');
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    if (!validate()) return;
    setAnalysisError('');
    setLoading(true);
    setStep(2);
    try {
      const formData = new FormData();
      formData.append('resume', file!);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      let data: AnalysisResult & { error?: string; fileName?: string; jobTitle?: string; analyzedAt?: string } = {} as never;
      try {
        data = await res.json();
      } catch {
        setAnalysisError('Invalid response from server.');
        setStep(1);
        return;
      }
      if (!res.ok) {
        setAnalysisError(data.error || 'Analysis failed.');
        setStep(1);
        return;
      }
      const reportPayload: ReportData = {
        ...data,
        fileName: data.fileName ?? 'Resume',
        jobTitle: (data.jobTitle ?? jobTitle) || 'Not specified',
        analyzedAt: data.analyzedAt ?? new Date().toISOString(),
      };
      setResult(data);
      setReportData(reportPayload);
      setStep(3);
    } catch {
      setAnalysisError('Something went wrong. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const dataToUse = reportData ?? (result ? buildReportDataFromResult(result) : null);
    if (!dataToUse) return;
    setPdfLoading(true);
    setAnalysisError('');
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData: dataToUse }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        let err = 'Download failed';
        if (contentType.includes('json')) {
          try {
            const body = await res.json();
            err = body?.error ?? err;
          } catch {
            // keep default err
          }
        }
        setAnalysisError(err || 'Could not download PDF.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-analysis-report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setAnalysisError('Could not download PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  function buildReportDataFromResult(r: AnalysisResult): ReportData {
    return {
      ...r,
      fileName: 'Resume',
      jobTitle: jobTitle || 'Not specified',
      analyzedAt: new Date().toISOString(),
    };
  }

  const handleSendEmail = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    const dataToUse = reportData ?? (result ? buildReportDataFromResult(result) : null);
    if (!dataToUse) return;
    setEmailError('');
    setEmailSuccess(false);
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, reportData: dataToUse }),
      });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: 'Invalid response from server.' };
      }
      if (!res.ok) {
        setEmailError(data.error || 'Failed to send.');
        return;
      }
      setEmailSuccess(true);
    } catch {
      setEmailError('Failed to send. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobTitle('');
    setJobDescription('');
    setUploadError('');
    setJobError('');
    setStep(1);
    setResult(null);
    setReportData(null);
    setEmail('');
    setEmailError('');
    setEmailSuccess(false);
    setAnalysisError('');
  };

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          ATS Resume Analyzer
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          A Product of Upcoming Engineer
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          You&apos;re closer than you think. Let&apos;s optimize your resume for success.
        </p>
      </motion.section>

      <Stepper currentStep={step} />

      <div className="mx-auto mt-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {step === 1 && !loading && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="card space-y-6">
                <FileUpload
                  file={file}
                  onFileChange={(f) => {
                    setFile(f);
                    setUploadError('');
                  }}
                  error={uploadError}
                />
                <JobInput
                  jobTitle={jobTitle}
                  jobDescription={jobDescription}
                  onJobTitleChange={(v) => {
                    setJobTitle(v);
                    setJobError('');
                  }}
                  onJobDescriptionChange={(v) => {
                    setJobDescription(v);
                    setJobError('');
                  }}
                  error={jobError}
                />
                {analysisError && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {analysisError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-primary w-full sm:w-auto"
                >
                  Analyze Resume
                </button>
              </div>
            </motion.div>
          )}

          {loading && step === 2 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card"
            >
              <LoaderWithTips />
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <ScoreDisplay result={result} />
              <ReportCard result={result} />

              <div className="card space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Download & Share
                </h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                    className="btn-primary"
                  >
                    {pdfLoading ? 'Generating…' : 'Download Full Report (PDF)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Analyze Another Resume
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Email this report
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    We&apos;ll send the full report PDF to your inbox.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      placeholder="your@email.com"
                      className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={emailSending}
                      className="btn-primary"
                    >
                      {emailSending ? 'Sending…' : 'Send Report'}
                    </button>
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                  {emailSuccess && (
                    <p className="mt-2 text-sm text-accent-600">
                      Report sent! Check your inbox.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section id="how-it-works" className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          How it works
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              1
            </div>
            <h3 className="font-semibold text-gray-900">Upload & Describe</h3>
            <p className="mt-1 text-sm text-gray-600">
              Upload your resume and enter the job title or paste the job description.
            </p>
          </div>
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              2
            </div>
            <h3 className="font-semibold text-gray-900">We Analyze</h3>
            <p className="mt-1 text-sm text-gray-600">
              We extract keywords and compare your resume to ATS expectations.
            </p>
          </div>
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              3
            </div>
            <h3 className="font-semibold text-gray-900">Get Insights</h3>
            <p className="mt-1 text-sm text-gray-600">
              Receive your ATS score, missing keywords, and actionable suggestions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
