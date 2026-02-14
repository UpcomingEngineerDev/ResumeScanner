'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Upcoming Engineer */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              About Upcoming Engineer
            </h3>
            <p className="text-sm leading-relaxed">
              We empower engineering students to become industry-ready professionals.
              From resume optimization to career guidance, we&apos;re here to support
              your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-white">
                  ATS Analyzer
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="transition hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Career Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Career Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition hover:text-white">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Job Search Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@upcomingengineer.com" className="transition hover:text-white">
                  hello@upcomingengineer.com
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 transition hover:text-white"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} Upcoming Engineer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
