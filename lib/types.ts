export type AnalysisResult = {
  atsScore: number;
  scoreCategory: 'excellent' | 'moderate' | 'needs_improvement';
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: string[];
  formattingIssues: string[];
  sectionSuggestions: SectionSuggestion[];
  summary: string;
};

export type SectionSuggestion = {
  section: 'skills' | 'projects' | 'experience' | 'education' | 'certifications';
  missing: string[];
  improvements: string[];
  examples: string[];
};

export type ReportData = AnalysisResult & {
  jobTitle: string;
  fileName: string;
  analyzedAt: string;
};
