'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAREER_TIPS = [
  'Tailor your resume for every application.',
  'Use measurable achievements with numbers.',
  'Highlight relevant technical skills for the role.',
  'Use action verbs like Designed, Built, Optimized.',
  'Keep your resume to one or two pages.',
  'Include keywords from the job description.',
  'Proofread carefully—typos cost opportunities.',
  'Lead with your strongest accomplishments.',
];

export default function LoaderWithTips() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % CAREER_TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="h-16 w-16 rounded-full border-4 border-brand-200 border-t-brand-600"
      />
      <p className="text-center text-lg font-medium text-gray-700">
        Analyzing your resume...
      </p>
      <p className="text-center text-sm text-gray-500">
        We&apos;re comparing your resume with the job description. This may take a moment.
      </p>
      <div className="min-h-[4rem] w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-brand-50 p-4 text-center text-sm font-medium text-brand-800"
          >
            💡 {CAREER_TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
