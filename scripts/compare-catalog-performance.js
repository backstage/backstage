#!/usr/bin/env node
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Compares catalog performance test timings against a baseline recorded on
// master. Both inputs are JSON lines of `{ name, durationMs }`, as written by
// the tests when PERFORMANCE_RESULTS_FILE is set.
//
// Usage: compare-catalog-performance.js <current.jsonl> <baseline.jsonl>
//
// Environment:
//   REGRESSION_RATIO       slowdown factor that counts as a regression (default 1.5)
//   REGRESSION_MIN_MS      minimum absolute slowdown in ms to count (default 2000)
//   FAIL_ON_REGRESSION     set to "true" to exit non-zero on regressions
//   GITHUB_STEP_SUMMARY    if set, a markdown report is appended to this file

const fs = require('node:fs');

const ratioLimit = Number(process.env.REGRESSION_RATIO || 1.5);
const minMs = Number(process.env.REGRESSION_MIN_MS || 2000);

function load(file) {
  const result = new Map();
  if (!fs.existsSync(file)) {
    return result;
  }
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (line.trim()) {
      const { name, durationMs } = JSON.parse(line);
      // Keep the fastest sample if a test was recorded more than once
      result.set(name, Math.min(durationMs, result.get(name) ?? Infinity));
    }
  }
  return result;
}

function main() {
  const [currentFile, baselineFile] = process.argv.slice(2);
  if (!currentFile || !baselineFile) {
    throw new Error(
      'Usage: compare-catalog-performance.js <current> <baseline>',
    );
  }
  const current = load(currentFile);
  const baseline = load(baselineFile);
  if (current.size === 0) {
    throw new Error(`No timings found in ${currentFile}`);
  }

  const rows = [];
  let regressions = 0;
  for (const [name, now] of [...current].sort()) {
    const before = baseline.get(name);
    if (before === undefined) {
      rows.push(`| ${name} | - | ${now} | new |`);
      continue;
    }
    const ratio = now / before;
    const regressed = ratio > ratioLimit && now - before > minMs;
    if (regressed) {
      regressions += 1;
      console.log(
        `::warning title=Catalog performance regression::${name} took ${now}ms, baseline ${before}ms (${ratio.toFixed(
          2,
        )}x)`,
      );
    }
    rows.push(
      `| ${name} | ${before} | ${now} | ${ratio.toFixed(2)}x${
        regressed ? ' :warning: slower' : ''
      } |`,
    );
  }

  const report = [
    '## Catalog performance vs master',
    '',
    baseline.size === 0
      ? '_No baseline found; showing current timings only._'
      : `Flagged when slower by more than ${ratioLimit}x and ${minMs}ms. Timings are noisy on shared runners.`,
    '',
    '| Test | Baseline (ms) | Current (ms) | Change |',
    '| --- | ---: | ---: | --- |',
    ...rows,
    '',
  ].join('\n');

  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
  }
  if (regressions > 0 && process.env.FAIL_ON_REGRESSION === 'true') {
    process.exit(1);
  }
}

main();
