'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/octet-stream': ['.doc', '.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
};

type FileUploadProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

export default function FileUpload({ file, onFileChange, error }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    accept: ACCEPTED,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message || 'Invalid file';
      onFileChange(null);
    },
  });

  const removeFile = () => onFileChange(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700">
        Upload your resume
      </label>
      <p className="text-xs text-gray-500">
        PDF, DOC, DOCX, PNG, JPG, JPEG, or SVG. Max 10MB.
      </p>
      <div
        {...getRootProps()}
        className={`
          flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50'}
          ${isDragActive ? 'border-brand-500 bg-brand-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-accent-100 px-4 py-2 text-accent-700">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-sm text-gray-500 underline hover:text-red-600"
            >
              Remove file
            </button>
          </div>
        ) : (
          <>
            <svg
              className="mb-2 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-center text-sm text-gray-600">
              {isDragActive
                ? 'Drop your resume here'
                : 'Drag & drop your resume here, or click to browse'}
            </p>
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </motion.div>
  );
}
