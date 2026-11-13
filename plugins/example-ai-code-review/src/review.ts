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

import { JsonObject } from '@backstage/types';

export type Severity = 'info' | 'warning' | 'error';

export type ReviewFinding = {
  file: string;
  line?: number;
  severity: Severity;
  comment: string;
};

export type ReviewResult = {
  summary: string;
  findings: ReviewFinding[];
};

// Anthropic via OpenAI-compatible gateways requires every object schema to
// set `additionalProperties: false`.
export const reviewSchema: JsonObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          severity: { type: 'string', enum: ['info', 'warning', 'error'] },
          comment: { type: 'string' },
        },
        required: ['file', 'severity', 'comment'],
      },
    },
  },
  required: ['summary', 'findings'],
};

const severities = ['info', 'warning', 'error'];

/** Model output is untrusted, so validate it rather than casting. */
export function parseReviewResult(value: unknown): ReviewResult {
  const root = value as { summary?: unknown; findings?: unknown } | null;
  if (
    !root ||
    typeof root.summary !== 'string' ||
    !Array.isArray(root.findings)
  ) {
    throw new Error('The model returned an unexpected review format');
  }
  const findings: ReviewFinding[] = [];
  for (const raw of root.findings) {
    if (
      raw &&
      typeof raw.file === 'string' &&
      typeof raw.comment === 'string' &&
      severities.includes(raw.severity)
    ) {
      findings.push({
        file: raw.file,
        line: typeof raw.line === 'number' ? raw.line : undefined,
        severity: raw.severity,
        comment: raw.comment,
      });
    }
  }
  return { summary: root.summary, findings };
}
