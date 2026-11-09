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
// Usage: compare-catalog-performance.js <current.jsonl> <baseline.jsonl> [plan-findings.jsonl [baseline-plan-findings.jsonl]]
//
// The optional third file holds query plan findings as JSON lines of
// `{ test, rule, planSummary, known, nowPassing? }`, as written by the tests
// when PERFORMANCE_PLAN_FINDINGS_FILE is set. The fourth holds the findings
// recorded with the baseline; findings in it, matched on test and rule, are not
// reported as new. Findings never affect the exit code.
//
// Only actionable changes are shown by default: timing regressions, findings
// that are not in the baseline, and known issues that now pass. Everything else
// is collapsed.
//
// Environment:
//   REGRESSION_RATIO       slowdown factor that counts as a regression (default 1.5)
//   REGRESSION_MIN_MS      minimum absolute slowdown in ms to count (default 2000)
//   FAIL_ON_REGRESSION     set to "true" to exit non-zero on regressions
//   GITHUB_STEP_SUMMARY    if set, a markdown report is appended to this file

const fs = require('node:fs');

const ratioLimit = Number(process.env.REGRESSION_RATIO || 1.5);
const minMs = Number(process.env.REGRESSION_MIN_MS || 2000);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function load(file) {
  const samples = new Map();
  if (!fs.existsSync(file)) {
    return samples;
  }
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (line.trim()) {
      const { name, durationMs } = JSON.parse(line);
      samples.set(name, [...(samples.get(name) ?? []), durationMs]);
    }
  }
  // Use the median if a test was recorded more than once
  return new Map([...samples].map(([name, values]) => [name, median(values)]));
}

function loadFindings(file) {
  if (!file || !fs.existsSync(file)) {
    return [];
  }
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

const findingKey = f => `${f.test}\n${f.rule}`;

const collapsed = (summary, body) =>
  [
    `<details><summary>${summary}</summary>`,
    '',
    ...body,
    '',
    '</details>',
    '',
  ].join('\n');

const findingDetails = f =>
  collapsed(`${f.test}: ${f.rule}`, ['```', f.planSummary, '```']);

// Only actionable findings are shown by default: new findings that are not in
// the baseline, and known issues that now pass. Known issues and findings that
// are already in the baseline are collapsed. Returns the markdown, and the
// number of actionable findings.
function planFindingsReport(findings, baselineFindings) {
  const inBaseline = new Set((baselineFindings ?? []).map(findingKey));
  const fresh = findings.filter(
    f => !f.known && !inBaseline.has(findingKey(f)),
  );
  const existing = findings.filter(
    f => !f.known && inBaseline.has(findingKey(f)),
  );
  const known = findings.filter(f => f.known && !f.nowPassing);
  const passing = findings.filter(f => f.known && f.nowPassing);

  for (const f of fresh) {
    console.log(
      `::warning title=Query plan check::${f.test}: ${f.rule}`.replace(
        /\n/g,
        ' ',
      ),
    );
  }
  for (const f of passing) {
    console.log(`::notice title=Known plan issue fixed::${f.test}: ${f.rule}`);
  }

  const section = (title, items, note) =>
    items.length === 0
      ? []
      : [
          `### ${title} (${items.length})`,
          '',
          note,
          '',
          ...items.map(findingDetails),
        ];
  const hidden = (title, items) =>
    items.length === 0
      ? []
      : [collapsed(`${title} (${items.length})`, items.map(findingDetails))];

  const lines = [
    '## Query plan findings',
    '',
    baselineFindings === undefined
      ? '_No baseline findings found; every finding that is not a known issue counts as new._'
      : 'Plan check violations do not fail the job.',
    '',
    ...section(
      'New findings',
      fresh,
      'Not a known issue, and not in the baseline. Fix the query, or add a documented known issue.',
    ),
    ...section(
      'Known issues that now pass',
      passing,
      'These no longer reproduce. Remove them from the known issues in the tests.',
    ),
    ...hidden('Findings already in the baseline', existing),
    ...hidden('Known issues', known),
  ];
  return {
    report: lines.join('\n'),
    actionable: fresh.length + passing.length,
  };
}

function main() {
  const [currentFile, baselineFile, findingsFile, baselineFindingsFile] =
    process.argv.slice(2);
  if (!currentFile || !baselineFile) {
    throw new Error(
      'Usage: compare-catalog-performance.js <current> <baseline> [findings] [baseline-findings]',
    );
  }
  const current = load(currentFile);
  const baseline = load(baselineFile);
  if (current.size === 0) {
    throw new Error(`No timings found in ${currentFile}`);
  }

  const regressedRows = [];
  const otherRows = [];
  for (const [name, now] of [...current].sort()) {
    const before = baseline.get(name);
    if (before === undefined) {
      otherRows.push(`| ${name} | - | ${now} | new |`);
      continue;
    }
    const ratio = now / before;
    const regressed = ratio > ratioLimit && now - before > minMs;
    const row = `| ${name} | ${before} | ${now} | ${ratio.toFixed(2)}x${
      regressed ? ' :warning: slower' : ''
    } |`;
    if (regressed) {
      console.log(
        `::warning title=Catalog performance regression::${name} took ${now}ms, baseline ${before}ms (${ratio.toFixed(
          2,
        )}x)`,
      );
      regressedRows.push(row);
    } else {
      otherRows.push(row);
    }
  }
  const regressions = regressedRows.length;
  const tableHeader = [
    '| Test | Baseline (ms) | Current (ms) | Change |',
    '| --- | ---: | ---: | --- |',
  ];

  const findings = findingsFile ? loadFindings(findingsFile) : undefined;
  const baselineFindings =
    baselineFindingsFile && fs.existsSync(baselineFindingsFile)
      ? loadFindings(baselineFindingsFile)
      : undefined;
  const planReport = findings
    ? planFindingsReport(findings, baselineFindings)
    : undefined;

  const report = [
    '## Catalog performance vs master',
    '',
    baseline.size === 0
      ? '_No baseline found; showing current timings only._'
      : `Flagged when slower by more than ${ratioLimit}x and ${minMs}ms. Timings are noisy on shared runners.`,
    '',
    ...(regressions + (planReport?.actionable ?? 0) === 0
      ? ['**No actionable changes.**', '']
      : []),
    ...(regressions
      ? ['### Timing regressions', '', ...tableHeader, ...regressedRows, '']
      : []),
    ...(otherRows.length
      ? [
          collapsed(`Timings without a regression (${otherRows.length})`, [
            ...tableHeader,
            ...otherRows,
          ]),
        ]
      : []),
    ...(planReport ? [planReport.report, ''] : []),
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
