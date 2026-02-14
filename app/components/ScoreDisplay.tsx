'use client';

import { motion } from 'framer-motion';
import type { AnalysisResult } from '@/lib/types';

type ScoreDisplayProps = {
  result: AnalysisResult;
};

const categoryConfig = {
  excellent: {
    label: 'Excellent Match',
    color: 'text-accent-600',
    bg: 'bg-accent-50',
    ring: 'stroke-accent-500',
  },
  moderate: {
    label: 'Moderate Match',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'stroke-amber-500',
  },
  needs_improvement: {
    label: 'Needs Improvement',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    ring: 'stroke-orange-500',
  },
};

export default function ScoreDisplay({ result }: ScoreDisplayProps) {
  const category = result.scoreCategory && categoryConfig[result.scoreCategory]
    ? result.scoreCategory
    : 'needs_improvement';
  const config = categoryConfig[category];
  const score = Math.min(100, Math.max(0, Number(result.atsScore) || 0));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900">ATS Score</h2>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-around">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={config.ring}
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              style={{
                strokeDasharray: circumference,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900"
            >
              {score}%
            </motion.span>
          </div>
        </div>
        <div className={`rounded-lg px-4 py-2 ${config.bg}`}>
          <p className={`font-medium ${config.color}`}>{config.label}</p>
          <p className="mt-2 max-w-sm text-sm text-gray-600">{result.summary ?? ''}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-green-50/50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Matched Keywords</h3>
          <p className="mt-1 text-xs text-gray-500">
            {(result.matchedKeywords ?? []).length} found in your resume
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(result.matchedKeywords ?? []).slice(0, 12).map((kw) => (
              <span
                key={kw}
                className="rounded bg-accent-100 px-2 py-0.5 text-xs text-accent-800"
              >
                {kw}
              </span>
            ))}
            {(result.matchedKeywords ?? []).length > 12 && (
              <span className="text-xs text-gray-500">
                +{(result.matchedKeywords ?? []).length - 12} more
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-amber-50/50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Missing Keywords</h3>
          <p className="mt-1 text-xs text-gray-500">
            Consider adding these from the job description
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(result.missingKeywords ?? []).slice(0, 12).map((kw) => (
              <span
                key={kw}
                className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
              >
                {kw}
              </span>
            ))}
            {(result.missingKeywords ?? []).length > 12 && (
              <span className="text-xs text-gray-500">
                +{(result.missingKeywords ?? []).length - 12} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
