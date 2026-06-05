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

import { GeneratedTemplate } from './TemplateGenerationService';
import { WELL_KNOWN_ACTIONS } from './wellKnownActions';

const KNOWN_ACTION_IDS = new Set(WELL_KNOWN_ACTIONS.map(a => a.id));

/**
 * @public
 */
export interface ValidationResult {
  ok: boolean;
  warnings: string[];
}

/**
 * Semantic checks on a generated template that go beyond zod's
 * structural validation:
 * - referenced step ids in `spec.output` expressions must exist
 * - `fetch:template` should typically be the first step (advisory)
 * - `publish:*` steps should come before `catalog:register` (advisory)
 *
 * Failures are surfaced as warnings, not exceptions — the router decides
 * whether to surface them to the caller.
 *
 * @public
 */
export class TemplateValidator {
  check(template: GeneratedTemplate): ValidationResult {
    const warnings: string[] = [];
    const stepIds = new Set(template.spec.steps.map(s => s.id));

    // 1. Step references inside ${{ steps.X.* }} must resolve to declared step ids.
    // Created fresh per call so concurrent invocations don't share lastIndex state.
    const refRegex = /\$\{\{\s*steps\.([a-zA-Z0-9_-]+)\./g;
    for (const step of template.spec.steps) {
      for (const refId of extractStepRefs(step.input, refRegex)) {
        if (!stepIds.has(refId)) {
          warnings.push(
            `step '${step.id}' references unknown step '${refId}' in its input`,
          );
        }
      }
    }
    if (template.spec.output) {
      for (const refId of extractStepRefs(template.spec.output, refRegex)) {
        if (!stepIds.has(refId)) {
          warnings.push(`spec.output references unknown step '${refId}'`);
        }
      }
    }

    // 2. Action ids must be in the curated catalog (zod already enforces this
    //    at the type level, but we double-check in case the schema gets relaxed).
    for (const step of template.spec.steps) {
      if (!KNOWN_ACTION_IDS.has(step.action)) {
        warnings.push(`step '${step.id}' uses unknown action '${step.action}'`);
      }
    }

    // 3. Ordering hints (advisory).
    const firstAction = template.spec.steps[0]?.action;
    if (firstAction && !firstAction.startsWith('fetch:')) {
      warnings.push(
        `first step uses '${firstAction}'; templates typically start with a fetch:* step to populate the workspace`,
      );
    }
    const publishIdx = template.spec.steps.findIndex(s =>
      s.action.startsWith('publish:'),
    );
    const registerIdx = template.spec.steps.findIndex(
      s => s.action === 'catalog:register',
    );
    if (publishIdx >= 0 && registerIdx >= 0 && publishIdx > registerIdx) {
      warnings.push(
        `catalog:register appears before publish:*; the published repo URL is normally registered after publishing`,
      );
    }

    return { ok: warnings.length === 0, warnings };
  }
}

function extractStepRefs(value: unknown, regex: RegExp): string[] {
  const out: string[] = [];
  visit(value, v => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(regex)) {
        out.push(m[1]);
      }
    }
  });
  return out;
}

function visit(value: unknown, fn: (v: unknown) => void): void {
  fn(value);
  if (Array.isArray(value)) {
    for (const v of value) visit(v, fn);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      visit(v, fn);
    }
  }
}
