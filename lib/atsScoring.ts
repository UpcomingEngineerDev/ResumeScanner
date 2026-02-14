import type { AnalysisResult, SectionSuggestion } from './types';
import { extractKeywordsFromText, extractJobKeywords } from './extractText';

function normalizeKeyword(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): AnalysisResult {
  const resumeKeywords = extractKeywordsFromText(resumeText);
  const resumeSet = new Set(resumeKeywords.map(normalizeKeyword));
  const jobKeywords = extractJobKeywords(`${jobTitle} ${jobDescription}`);
  const importantKeywords = jobKeywords.length > 0 ? jobKeywords : resumeKeywords.slice(0, 30);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of importantKeywords) {
    const n = normalizeKeyword(kw);
    if (resumeSet.has(n)) {
      matched.push(kw);
    } else {
      // Check partial match (e.g. "javascript" in resume, "javascript" in job)
      const hasPartial = Array.from(resumeSet).some((r) => r.includes(n) || n.includes(r));
      if (!hasPartial) missing.push(kw);
    }
  }

  const totalImportant = importantKeywords.length || 1;
  const score = Math.round((matched.length / totalImportant) * 100);
  const atsScore = Math.min(90, Math.max(0, score));

  let scoreCategory: 'excellent' | 'moderate' | 'needs_improvement' = 'needs_improvement';
  if (atsScore >= 80) scoreCategory = 'excellent';
  else if (atsScore >= 60) scoreCategory = 'moderate';

  const skillGaps = missing.slice(0, 15);
  const formattingIssues: string[] = [];
  if (resumeText.length < 200) formattingIssues.push('Resume content seems too short. Add more detail.');
  if (!resumeText.match(/\d/)) formattingIssues.push('Add measurable achievements (numbers, metrics).');
  if (!resumeText.toLowerCase().includes('experience') && !resumeText.toLowerCase().includes('work')) {
    formattingIssues.push('Consider adding an Experience or Work History section.');
  }

  const sections: SectionSuggestion[] = [
    buildSectionSuggestion('skills', resumeText, jobDescription, missing),
    buildSectionSuggestion('projects', resumeText, jobDescription, missing),
    buildSectionSuggestion('experience', resumeText, jobDescription, missing),
    buildSectionSuggestion('education', resumeText, jobDescription, missing),
    buildSectionSuggestion('certifications', resumeText, jobDescription, missing),
  ];

  const summary =
    scoreCategory === 'excellent'
      ? "Your resume aligns well with the job description. You're closer than you think—small tweaks can make it even stronger."
      : scoreCategory === 'moderate'
        ? 'Your resume has a solid foundation. Focus on the missing keywords and section suggestions to improve your match.'
        : 'There’s room to improve. Use the missing keywords and section suggestions below to tailor your resume for this role.';

  return {
    atsScore,
    scoreCategory,
    matchedKeywords: matched.slice(0, 50),
    missingKeywords: missing.slice(0, 30),
    skillGaps,
    formattingIssues,
    sectionSuggestions: sections,
    summary,
  };
}

function buildSectionSuggestion(
  section: SectionSuggestion['section'],
  resumeText: string,
  jobDesc: string,
  missing: string[]
): SectionSuggestion {
  const lowerResume = resumeText.toLowerCase();
  const sectionPatterns: Record<string, RegExp> = {
    skills: /(?:skills|technical skills|technologies)\s*[:\-]?\s*([^\n]+)/i,
    projects: /(?:projects|project experience)\s*[:\-]?\s*([^\n]+)/i,
    experience: /(?:experience|work history|employment)\s*[:\-]?\s*([^\n]+)/i,
    education: /(?:education|academic)\s*[:\-]?\s*([^\n]+)/i,
    certifications: /(?:certifications|certificates)\s*[:\-]?\s*([^\n]+)/i,
  };
  const re = sectionPatterns[section];
  const hasSection = re ? re.test(resumeText) : lowerResume.includes(section);
  const missingForSection = missing.slice(0, 5);
  const improvements: string[] = [];
  const examples: string[] = [];

  if (!hasSection && section === 'skills') {
    improvements.push('Add a dedicated Skills section with relevant technologies.');
    examples.push('Skills: JavaScript, React, Node.js, Python, SQL');
  }
  if (!hasSection && section === 'projects') {
    improvements.push('Include 1–2 relevant projects with outcomes.');
    examples.push('Built a REST API that reduced load time by 40%');
  }
  if (!hasSection && section === 'experience') {
    improvements.push('List roles with bullet points and action verbs.');
    examples.push('Designed and implemented features used by 10k+ users');
  }
  if (!hasSection && section === 'education') {
    improvements.push('Add Education with degree, institution, and year.');
    examples.push('B.Tech in Computer Science, XYZ University, 2024');
  }
  if (!hasSection && section === 'certifications') {
    improvements.push('Add certifications if relevant to the role.');
    examples.push('AWS Certified Developer, Google Cloud Professional');
  }
  if (missingForSection.length > 0 && improvements.length === 0) {
    improvements.push(`Incorporate keywords: ${missingForSection.join(', ')}`);
  }

  return {
    section,
    missing: missingForSection,
    improvements: improvements.length ? improvements : ['Review and align this section with the job description.'],
    examples: examples.length ? examples : ['Use action verbs and quantify impact where possible.'],
  };
}
