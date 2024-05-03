/*
 * Copyright 2024 The Backstage Authors
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
/* eslint-disable no-nested-ternary */

import {
  compareSpecs,
  groupDiffsByEndpoint,
  Severity,
  getOperationsChangedLabel,
  getOperationsChanged,
} from '@useoptic/openapi-utilities';
import { GroupedDiffs } from '@useoptic/openapi-utilities/build/openapi3/group-diff';

/**
 * The below code is copied from https://github.com/opticdev/optic/blob/main/projects/optic/src/commands/ci/comment/common.ts#L82 for use
 *  with a security flow for forked repositories.
 */

type Comparison = {
  groupedDiffs: ReturnType<typeof groupDiffsByEndpoint>;
  results: Awaited<ReturnType<typeof compareSpecs>>['results'];
};

export type CiRunDetails = {
  completed: {
    warnings: string[];
    apiName: string;
    opticWebUrl?: string | null;
    comparison: Comparison;
    specUrl?: string | null;
    capture?: any;
  }[];
  warning?: { apiName: string; warning: string }[];
  failed: { apiName: string; error: string }[];
  noop: { apiName: string }[];
  severity: Severity;
};

const getChecksLabel = (
  results: CiRunDetails['completed'][number]['comparison']['results'],
  severity: Severity,
) => {
  const totalChecks = results.length;
  let failingChecks = 0;
  let exemptedFailingChecks = 0;

  for (const result of results) {
    if (result.passed) continue;
    if (result.severity < severity) continue;
    if (result.exempted) exemptedFailingChecks += 1;
    else failingChecks += 1;
  }

  const exemptedChunk =
    exemptedFailingChecks > 0 ? `, ${exemptedFailingChecks} exempted` : '';

  return failingChecks > 0
    ? `⚠️ **${failingChecks}**/**${totalChecks}** failed${exemptedChunk}`
    : totalChecks > 0
    ? `✅ **${totalChecks}** passed${exemptedChunk}`
    : `ℹ️ No automated checks have run`;
};

function getOperationsText(
  groupedDiffs: GroupedDiffs,
  options: { webUrl?: string | null; verbose: boolean; labelJoiner?: string },
) {
  const ops = getOperationsChanged(groupedDiffs);

  const operationsText = options.verbose
    ? [
        ...[...ops.added].map(o => `\`${o}\` (added)`),
        ...[...ops.changed].map(o => `\`${o}\` (changed)`),
        ...[...ops.removed].map(o => `\`${o}\` (removed)`),
      ].join('\n')
    : '';
  return `${getOperationsChangedLabel(groupedDiffs)}
    
      ${operationsText}
    `;
}

const getCaptureIssuesLabel = ({
  unmatchedInteractions,
  mismatchedEndpoints,
}: {
  unmatchedInteractions: number;
  mismatchedEndpoints: number;
}) => {
  return [
    ...(unmatchedInteractions
      ? [
          `🆕 ${unmatchedInteractions} undocumented path${
            unmatchedInteractions > 1 ? 's' : ''
          }`,
        ]
      : []),
    ...(mismatchedEndpoints
      ? [
          `⚠️  ${mismatchedEndpoints} mismatch${
            mismatchedEndpoints > 1 ? 'es' : ''
          }`,
        ]
      : []),
  ].join('\n');
};

const getBreakagesRow = (breakage: CiRunDetails['completed'][number]) => {
  return `
  - ${breakage.apiName}
  ${breakage.comparison.results.map(
    s => `
    - ${s.where}
      ${'```'}
      ${s.error}
      ${'```'}`,
  )}`;
};

const addSummaryLine = (items: any[] | number | undefined, label: string) => {
  const length = Array.isArray(items) ? items.length : items;
  if (!length) return '';
  let text = length === 1 ? `1 API` : `${length} APIs`;
  text += ` had ${label}`;
  return text;
};

export const generateCompareSummaryMarkdown = (
  commit: { sha: string },
  results: CiRunDetails,
  options: { verbose: boolean },
) => {
  const anyCompletedHasWarning = results.completed.some(
    s => s.warnings.length > 0,
  );
  const anyCompletedHasCapture = results.completed.some(s => s.capture);
  if (
    results.completed.length === 0 &&
    results.failed.length === 0 &&
    results.failed.length === 0
  ) {
    return `No API changes detected for commit (${commit.sha})`;
  }
  const breakages = results.completed
    .filter(s => s.comparison.results.some(e => !e.passed))
    .map(e => ({
      ...e,
      comparison: {
        ...e.comparison,
        results: e.comparison.results.filter(f => !f.passed),
      },
    }));
  const successfullyCompletedCount =
    results.completed.length - breakages.length;
  return `### Summary for commit (${commit.sha})

${addSummaryLine(results.noop, 'no changes')}

${addSummaryLine(breakages.length, 'breaking changes')}

${addSummaryLine(successfullyCompletedCount, 'non-breaking changes')}

${addSummaryLine(results.warning, 'warnings')}

${
  results.completed.length > 0
    ? `### APIs with Changes

<table>
<thead>
<tr>
<th>API</th>
<th>Changes</th>
<th>Rules</th>
${anyCompletedHasWarning ? '<th>Warnings</th>' : ''}
${anyCompletedHasCapture ? '<th>Tests</th>' : ''}
</tr>
</thead>
<tbody>
${results.completed
  .map(
    s =>
      `<tr>
<td>
${s.apiName}
</td>
<td>
${getOperationsText(s.comparison.groupedDiffs, {
  webUrl: s.opticWebUrl,
  verbose: options.verbose,
  labelJoiner: ',\n',
})}
</td>
<td>
${getChecksLabel(s.comparison.results, results.severity)}
</td>

${anyCompletedHasWarning ? `<td>${s.warnings.join('\n')}</td>` : ''}

${
  anyCompletedHasCapture
    ? `
<td>
${
  s.capture
    ? s.capture.success
      ? s.capture.mismatchedEndpoints || s.capture.unmatchedInteractions
        ? getCaptureIssuesLabel({
            unmatchedInteractions: s.capture.unmatchedInteractions,
            mismatchedEndpoints: s.capture.mismatchedEndpoints,
          })
        : `✅ ${s.capture.percentCovered}% coverage`
      : '❌ Failed to run'
    : ''
}
</td>
`
    : ''
}
</tr>`,
  )
  .join('\n')}
</tbody>
</table>`
    : ''
}

${
  results.failed.length > 0
    ? `### APIs with Errors

<table>
<thead>
<tr>
<th>API</th>
<th>Error</th>
</tr>
</thead>
<tbody>
${results.failed
  .map(
    s => `<tr>
<td>${s.apiName}</td>
<td>

${'```'}
${s.error}
${'```'}

</td>
</tr>`,
  )
  .join('\n')}
</tbody>
</table>
`
    : ''
}

${
  results.warning && results.warning.length
    ? `
### APIs with Warnings
<table>
<thead>
<tr>
<th>API</th>
<th>Warning</th>
</tr>
</thead>
<tbody>
      ${results.warning
        .map(e => `<tr><td>${e.apiName}</td><td>${e.warning}</td></tr>`)
        .join('\n')}
</tbody>
</table>`
    : ''
}
${
  breakages.length > 0
    ? `
### Routes with Breakages

${breakages.map(getBreakagesRow).join('\n')}
`
    : ''
}
`;
};
