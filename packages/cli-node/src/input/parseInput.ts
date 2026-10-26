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

function coerceValue(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return value;
}

/**
 * Parses repeatable `key=value` CLI inputs into an object.
 *
 * @public
 */
export function parseKeyValuePairs(
  pairs: string[] | undefined,
): Record<string, unknown> | undefined {
  if (!pairs || pairs.length === 0) return undefined;

  const result: Record<string, unknown> = {};
  for (const pair of pairs) {
    if (pair.trimStart().startsWith('{')) {
      throw new Error(
        'JSON object input is not supported; use repeatable key=value flags',
      );
    }
    const separator = pair.indexOf('=');
    if (separator <= 0) {
      throw new Error(
        `Invalid "key=value" pair: "${pair}" (expected format: key=value)`,
      );
    }
    result[pair.slice(0, separator)] = coerceValue(pair.slice(separator + 1));
  }

  return result;
}

/**
 * Parses a comma-separated CLI input into a list of non-empty strings.
 *
 * @public
 */
export function parseCommaSeparatedList(
  value: string | undefined,
): string[] | undefined {
  if (!value) return undefined;
  if (value.trimStart().startsWith('[')) {
    throw new Error(
      'JSON list input is not supported; use comma-separated values',
    );
  }

  const items = value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}
