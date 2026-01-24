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

/**
 * @public
 */
export type FilterValueWithLabel = { value: string; label: string };

/**
 * @public
 */
export type FilterValue = string | FilterValueWithLabel;

/**
 * Ensure a value is on object form, with a label.
 * Accepts undefined, a single value, or an array of values and returns the
 * expected result - a filter value/label or an array of such, if any.
 */
export function ensureFilterValueWithLabel<T extends FilterValue>(
  value: T | T[] | undefined,
): typeof value extends undefined
  ? undefined
  : typeof value extends ArrayLike<any>
  ? FilterValueWithLabel[]
  : FilterValueWithLabel {
  if (value === undefined) {
    return undefined as any;
  }

  if (Array.isArray(value)) {
    return value.map(
      v => ensureFilterValueWithLabel(v) as FilterValueWithLabel,
    ) as any;
  }

  if (typeof value === 'string') {
    return { value, label: value } as FilterValueWithLabel as any;
  }
  return value as FilterValueWithLabel as any;
}
