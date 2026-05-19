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

/**
 * Asserts that the value is a JSON object shallowly.
 */
export function isJsonObject(value?: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Asserts that the value is a JSON object recursively containing only JSON safe
 * values and no circular references.
 */
export function isJsonObjectDeep(value: unknown): value is JsonObject {
  if (!isJsonObject(value)) {
    return false;
  }
  const seen = new Set<unknown>();
  return Object.values(value).every(v => isJsonValueDeep(v, seen));
}

function isJsonValueDeep(value: unknown, seen: Set<unknown>): boolean {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (typeof value !== 'object') {
    return false;
  }
  if (seen.has(value)) {
    return false;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.every(v => isJsonValueDeep(v, seen));
  }
  if (isJsonObject(value)) {
    return Object.values(value).every(v => isJsonValueDeep(v, seen));
  }
  return false;
}
