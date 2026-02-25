#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const prNumber = process.argv[2];
const description = process.argv.slice(3).join(' ');

if (!prNumber || !description) {
  console.error('Usage: yarn patch-pr <pr-number> <description>');
  process.exit(1);
}

const patchFilePath = path.join(__dirname, `pr-${prNumber}.txt`);
fs.writeFileSync(patchFilePath, description);
