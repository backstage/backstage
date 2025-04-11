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

/**
 * Looks up a value by path in a nested object structure.
 *
 * @remarks
 *
 * The path should be a dot-separated string of keys to traverse. The traversal
 * will tolerate object keys containing dots, and will keep searching until a
 * value has been found or all matching keys have been traversed.
 *
 * This lookup does not traverse into arrays, returning `undefined` instead.
 *
 * @internal
 */
export function valueAtPath(
  value: JsonValue | undefined,
  path: string,
): JsonValue | undefined {
  if (!path) {
    return undefined;
  }
  if (
    value === undefined ||
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return undefined;
  }

  for (const valueKey in value) {
    if (!Object.hasOwn(value, valueKey)) {
      continue;
    }
    if (valueKey === path) {
      if (value[valueKey] !== undefined) {
        return value[valueKey];
      }
    }
    if (path.startsWith(`${valueKey}.`)) {
      const found = valueAtPath(
        value[valueKey],
        path.slice(valueKey.length + 1),
      );
      if (found !== undefined) {
        return found;
      }
    }
  }

  return undefined;
}
