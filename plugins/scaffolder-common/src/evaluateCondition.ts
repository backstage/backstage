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
import { JsonValue } from '@backstage/types';
import { createTemplateRenderer, type TemplateContext } from 'nunjitsu';

const conditionRenderer = createTemplateRenderer();

/**
 * Evaluates a parameter step's `when` condition using Nunjitsu.
 *
 * Conditions may use `${{ ... }}` delimiters or contain a bare expression.
 * Undefined, empty, and invalid conditions keep the step visible so that its
 * parameters are still validated. Empty arrays are treated as false, matching
 * action step conditions.
 *
 * @internal
 */
export function evaluateCondition(
  condition: string | boolean | undefined,
  formState: Record<string, JsonValue>,
): boolean {
  if (condition === undefined || condition === null) {
    return true;
  }
  if (typeof condition === 'boolean') {
    return condition;
  }

  const expression = condition.trim();
  if (!expression) {
    return true;
  }

  try {
    const source = expression.startsWith('${{')
      ? expression
      : `\${{ ${expression} }}`;
    const result = conditionRenderer.renderValue(source, {
      // Nunjitsu validates and copies optional JSON properties at runtime.
      parameters: formState as TemplateContext,
    });
    return Array.isArray(result) ? result.length > 0 : !!result;
  } catch {
    // Invalid conditions must not bypass parameter validation.
    return true;
  }
}
