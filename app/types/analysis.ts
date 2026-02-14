export interface AnalysisResult {
  atsScore: number;
  scoreCategory: 'excellent' | 'moderate' | 'needs_improvement';
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  sectionWeaknesses: Record<string, string[]>;
  formattingIssues: string[];
  sectionSuggestions: SectionSuggestion[];
  totalKeywords: number;
  matchedCount: number;
}

export interface SectionSuggestion {
  section: string;
  missing: string[];
  improvements: string[];
  examples: string[];
}

export const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
