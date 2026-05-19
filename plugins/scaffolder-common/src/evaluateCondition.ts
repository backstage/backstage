/*
 * Copyright 2025 The Backstage Authors
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

function resolveValue(
  token: string,
  formState: Record<string, JsonValue>,
): JsonValue | undefined {
  const stringMatch = token.match(/^(['"])(.*)\1$/);
  if (stringMatch) {
    return stringMatch[2];
  }

  if (/^-?\d+(\.\d+)?$/.test(token)) {
    return Number(token);
  }

  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === 'null' || token === 'undefined') return undefined;

  const parts = token.split('.');
  if (parts[0] !== 'parameters') return undefined;

  let current: JsonValue | undefined = formState;
  for (const part of parts.slice(1)) {
    if (
      current === undefined ||
      current === null ||
      typeof current !== 'object' ||
      Array.isArray(current)
    ) {
      return undefined;
    }
    current = (current as Record<string, JsonValue>)[part];
  }
  return current;
}

function isTruthy(value: JsonValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return !!value;
}

function evaluateExpression(
  expression: string,
  formState: Record<string, JsonValue>,
): JsonValue | undefined {
  const comparisonMatch = expression.match(
    /^([^\s=!]+(?:\.[^\s=!]+)*|'[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|true|false|null|undefined)\s*(===|!==|==|!=)\s*([^\s=!]+(?:\.[^\s=!]+)*|'[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|true|false|null|undefined)$/,
  );
  if (comparisonMatch) {
    const left = resolveValue(comparisonMatch[1].trim(), formState);
    const op = comparisonMatch[2];
    const right = resolveValue(comparisonMatch[3].trim(), formState);
    switch (op) {
      case '===':
        return left === right;
      case '!==':
        return left !== right;
      case '==':
        // eslint-disable-next-line eqeqeq
        return left == right;
      case '!=':
        // eslint-disable-next-line eqeqeq
        return left != right;
      default:
        return undefined;
    }
  }

  if (expression.startsWith('!')) {
    const value = resolveValue(expression.slice(1).trim(), formState);
    return !isTruthy(value);
  }

  return resolveValue(expression, formState);
}

/**
 * Evaluates a step-level `if` condition against the current form state.
 * Supports `${{ parameters.field === 'value' }}` syntax for comparisons,
 * simple truthiness checks, and boolean/negation expressions.
 *
 * @public
 */
export function evaluateCondition(
  condition: string | boolean | undefined,
  formState: Record<string, JsonValue>,
): boolean {
  if (condition === undefined || condition === null) return true;
  if (typeof condition === 'boolean') return condition;

  const trimmed = condition.trim();
  if (!trimmed) return true;

  const match = trimmed.match(/^\$\{\{([\s\S]*)\}\}$/);
  const expression = match ? match[1].trim() : trimmed;

  if (!expression) return true;

  return isTruthy(evaluateExpression(expression, formState));
}
