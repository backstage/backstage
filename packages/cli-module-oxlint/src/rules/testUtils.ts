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

import type { Rule } from 'eslint';

/**
 * Wraps an oxlint rule that uses `createOnce` so it can be tested with
 * ESLint's `RuleTester`, which only understands `create`.
 *
 * Also handles the oxlint `before()` visitor hook by running it at the
 * start of each `Program` visit, which approximates oxlint's per-file
 * lifecycle in ESLint's single-file test runner.
 */
export function adaptRule(rule: any): Rule.RuleModule {
  if (rule.createOnce && !rule.create) {
    return {
      ...rule,
      create(context: Rule.RuleContext) {
        const visitors = rule.createOnce(context);
        if (visitors && typeof visitors.before === 'function') {
          const { before, ...rest } = visitors;
          let skipped = false;
          // Wrap every visitor to skip if before() returned false
          const wrapped: Record<string, Function> = {};
          wrapped.Program = (node: any) => {
            skipped = before() === false;
            if (!skipped && rest.Program) {
              rest.Program(node);
            }
          };
          for (const [key, fn] of Object.entries(rest)) {
            if (key !== 'Program' && typeof fn === 'function') {
              wrapped[key] = (...args: any[]) => {
                if (!skipped) {
                  (fn as Function)(...args);
                }
              };
            }
          }
          return wrapped;
        }
        return visitors;
      },
    };
  }
  return rule;
}
