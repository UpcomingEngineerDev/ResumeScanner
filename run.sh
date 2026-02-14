#!/bin/sh
# Run the ATS Resume Analyzer app locally
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node/npm not found. Install Node.js from https://nodejs.org or run: nvm use"
  exit 1
fi
npm install
npm run dev
