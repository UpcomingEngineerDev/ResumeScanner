'use client';

import { motion } from 'framer-motion';
import type { AnalysisResult, SectionSuggestion } from '@/lib/types';

type ReportCardProps = {
  result: AnalysisResult;
};

const sectionLabels: Record<string, string> = {
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
};

function getSectionLabel(sectionKey: unknown): string {
  const key = typeof sectionKey === 'string' ? sectionKey.toLowerCase() : '';
  return sectionLabels[key] ?? (key || 'Section');
}

export default function ReportCard({ result }: ReportCardProps) {
  const matched = Array.isArray(result.matchedKeywords) ? result.matchedKeywords : [];
  const missing = Array.isArray(result.missingKeywords) ? result.missingKeywords : [];
  const skillGaps = Array.isArray(result.skillGaps) ? result.skillGaps : [];
  const formattingIssues = Array.isArray(result.formattingIssues) ? result.formattingIssues : [];
  const sectionSuggestions = Array.isArray(result.sectionSuggestions) ? result.sectionSuggestions : [];

  const atsScore = typeof result.atsScore === 'number' ? result.atsScore : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Report Summary</h2>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between">
            <span className="text-gray-600">ATS Score</span>
            <span className="font-medium">{atsScore}%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Matched Keywords</span>
            <span className="font-medium">{matched.length}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Missing Keywords</span>
            <span className="font-medium">{missing.length}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Skill Gaps</span>
            <span className="font-medium">{skillGaps.length}</span>
          </li>
        </ul>
        {formattingIssues.length > 0 && (
          <div className="mt-4 rounded-lg bg-orange-50 p-3">
            <h3 className="text-sm font-semibold text-orange-800">Formatting Issues</h3>
            <ul className="mt-1 list-inside list-disc text-sm text-orange-700">
              {formattingIssues.map((issue, i) => (
                <li key={i}>{String(issue)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Section-wise Suggestions
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          What to add or improve in each section for a stronger match.
        </p>
        <div className="space-y-6">
          {sectionSuggestions.map((sec, index) => (
            <SectionBlock key={`${String(sec.section)}-${index}`} section={sec} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SectionBlock({ section }: { section: SectionSuggestion }) {
  const label = getSectionLabel(section.section);
  const missing = Array.isArray(section.missing) ? section.missing : [];
  const improvements = Array.isArray(section.improvements) ? section.improvements : [];
  const examples = Array.isArray(section.examples) ? section.examples : [];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <h3 className="font-semibold text-gray-900">{label}</h3>
      {missing.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium uppercase text-gray-500">Missing</p>
          <p className="text-sm text-gray-700">
            {missing.map((m) => String(m)).join(', ') || '—'}
          </p>
        </div>
      )}
      <div className="mt-2">
        <p className="text-xs font-medium uppercase text-gray-500">Improvements</p>
        <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
          {improvements.length > 0 ? (
            improvements.map((imp, i) => <li key={i}>{String(imp)}</li>)
          ) : (
            <li>Review and align this section with the job description.</li>
          )}
        </ul>
      </div>
      <div className="mt-2">
        <p className="text-xs font-medium uppercase text-gray-500">Examples</p>
        <ul className="mt-1 list-inside list-disc text-sm text-brand-600">
          {examples.length > 0 ? (
            examples.map((ex, i) => <li key={i}>{String(ex)}</li>)
          ) : (
            <li>Use action verbs and quantify impact where possible.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
