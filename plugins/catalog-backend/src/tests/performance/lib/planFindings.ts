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

import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/** One query plan invariant violation, or a known check that now passes. */
export interface PlanFinding {
  /** The name of the test that ran the check. */
  test: string;
  /** What was violated, or why a known check is reported. */
  rule: string;
  /** A compact, indented rendering of the plan. */
  planSummary: string;
  /** True if the violation is a documented known issue. */
  known: boolean;
  /** True if a known check no longer finds any violation. */
  nowPassing?: boolean;
}

/**
 * With `PERFORMANCE_PLAN_CHECKS=report`, plan invariant violations are
 * appended to `PERFORMANCE_PLAN_FINDINGS_FILE` as JSON lines instead of
 * failing the test. Anything else, including unset, fails on violations.
 */
export function planChecksReportOnly(): boolean {
  return process.env.PERFORMANCE_PLAN_CHECKS === 'report';
}

function appendFinding(finding: PlanFinding) {
  const file = process.env.PERFORMANCE_PLAN_FINDINGS_FILE;
  if (!file) {
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(finding)}\n`);
}

/**
 * Applies the outcome of a set of plan checks.
 *
 * In report mode, each violation is recorded as a finding, and a `known`
 * check that found nothing is recorded as now passing; nothing throws. In
 * strict mode, any violation throws, including those of known checks.
 *
 * Correctness assertions must not go through here; they always fail.
 */
export function applyPlanCheckResult(options: {
  test: string;
  label: string;
  violations: string[];
  known?: boolean;
  planSummary: string;
  /** Extra detail appended to the error message in strict mode. */
  details: string;
}) {
  const { test, label, violations, planSummary } = options;
  const known = Boolean(options.known);

  if (!planChecksReportOnly()) {
    if (violations.length) {
      throw new Error(
        `${label} plan violates${
          known ? ' (known issue)' : ''
        }: ${violations.join('; ')}\n${options.details}`,
      );
    }
    return;
  }

  for (const violation of violations) {
    appendFinding({
      test,
      rule: `${label}: ${violation}`,
      planSummary,
      known,
    });
  }
  if (known && !violations.length) {
    appendFinding({
      test,
      rule: `${label}: known issue no longer reproduces`,
      planSummary,
      known: true,
      nowPassing: true,
    });
  }
}
