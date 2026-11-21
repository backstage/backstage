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
export interface Scorecard {
  entityRef: string;
  score: number;
  checks: Array<{ name: string; passed: boolean }>;
}

export const CHECK_NAMES = ['Has an owner', 'Has a description', 'Has docs'];

/** Derives a stable fake scorecard from the entity ref, no backend needed. */
export function getScorecard(entityRef: string): Scorecard {
  const seed = Array.from(entityRef).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  const checks = CHECK_NAMES.map((name, i) => ({
    name,
    passed: (seed >> i) % 2 === 0,
  }));
  const passed = checks.filter(c => c.passed).length;
  return {
    entityRef,
    score: Math.round((passed / checks.length) * 100),
    checks,
  };
}
