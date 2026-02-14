'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur"
    >
      <nav className="container-custom flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-brand-600"
        >
          <span className="rounded-lg bg-brand-100 px-2 py-0.5">Upcoming Engineer</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-700">ATS Resume Analyzer</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-600"
          >
            Home
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-600"
          >
            How it works
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
