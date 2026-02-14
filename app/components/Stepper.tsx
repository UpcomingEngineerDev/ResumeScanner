'use client';

import { motion } from 'framer-motion';

const STEPS = [
  { id: 1, label: 'Resume Analysis', short: 'Analysis' },
  { id: 2, label: 'Report Generation', short: 'Report' },
  { id: 3, label: 'Suggestions & Improvements', short: 'Suggestions' },
];

type StepperProps = {
  currentStep: number;
};

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          return (
            <li
              key={step.id}
              className={`flex flex-1 items-center ${index < STEPS.length - 1 ? 'pr-4 sm:pr-8' : ''}`}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.05 : 1,
                    backgroundColor: isComplete
                      ? 'var(--tw-gradient-from)'
                      : isCurrent
                        ? '#2563eb'
                        : '#e5e7eb',
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm
                    ${isComplete ? 'border-brand-600 bg-brand-600 text-white' : ''}
                    ${isCurrent ? 'border-brand-600 bg-brand-600 text-white' : ''}
                    ${!isComplete && !isCurrent ? 'border-gray-300 bg-gray-100 text-gray-500' : ''}
                  `}
                >
                  {isComplete ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <span
                  className={`mt-2 hidden text-center text-sm font-medium sm:block
                    ${isCurrent ? 'text-brand-600' : isComplete ? 'text-gray-700' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
                <span className={`mt-2 text-center text-xs sm:hidden ${isCurrent ? 'text-brand-600' : 'text-gray-400'}`}>
                  {step.short}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`ml-0 flex-1 border-t-2 transition sm:ml-4 ${
                    isComplete ? 'border-brand-600' : 'border-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
