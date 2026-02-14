'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type JobInputProps = {
  jobTitle: string;
  jobDescription: string;
  onJobTitleChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  error?: string;
};

export default function JobInput({
  jobTitle,
  jobDescription,
  onJobTitleChange,
  onJobDescriptionChange,
  error,
}: JobInputProps) {
  const [expanded, setExpanded] = useState(!!jobDescription);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-gray-700">
        Job Title / Job Description
      </label>
      <p className="text-xs text-gray-500">
        Enter the role you&apos;re applying for or paste the full job description so we can
        match your resume to what employers are looking for.
      </p>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => onJobTitleChange(e.target.value)}
        placeholder="e.g. Software Engineer, Frontend Developer"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
        >
          {expanded ? 'Collapse' : 'Add full job description'}
          <svg
            className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expanded && (
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the full job description here for better keyword matching..."
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </motion.div>
  );
}
