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
import { FilterPredicate, FilterPredicateValue } from './types';
import { getJsonValueAtPath } from './getJsonValueAtPath';

/**
 * Options for filter predicate evaluation.
 *
 * @public
 */
export interface FilterPredicateOptions {
  /**
   * Custom value resolver that overrides the default dot-path lookup.
   *
   * @remarks
   *
   * When provided, this function is called for each key in a filter expression
   * to resolve the value from the target object. If not provided, the default
   * {@link getJsonValueAtPath} is used.
   *
   * The resolver may return an array to indicate a multi-value field (e.g.
   * relations). When an array is returned, the filter value is tested against
   * each element and succeeds if ANY element matches.
   *
   * Return `undefined` to indicate that the key does not exist on the target.
   */
  resolveValue?: (target: unknown, key: string) => unknown;
}

/**
 * Evaluate a filter predicate against a value.
 *
 * @public
 */
export function evaluateFilterPredicate(
  predicate: FilterPredicate,
  value: unknown,
  options?: FilterPredicateOptions,
): boolean {
  if (
    typeof predicate !== 'object' ||
    predicate === null ||
    Array.isArray(predicate)
  ) {
    return valuesAreEqual(value, predicate);
  }

  if ('$all' in predicate) {
    return predicate.$all.every(f =>
      evaluateFilterPredicate(f, value, options),
    );
  }
  if ('$any' in predicate) {
    return predicate.$any.some(f => evaluateFilterPredicate(f, value, options));
  }
  if ('$not' in predicate) {
    return !evaluateFilterPredicate(predicate.$not, value, options);
  }

  const resolve = options?.resolveValue;

  for (const filterKey in predicate) {
    if (!Object.hasOwn(predicate, filterKey)) {
      continue;
    }
    if (filterKey.startsWith('$')) {
      return false;
    }

    if (resolve) {
      const resolved = resolve(value, filterKey);
      if (!evaluateResolvedValue(predicate[filterKey], resolved)) {
        return false;
      }
    } else {
      const resolved = getJsonValueAtPath(value as JsonValue, filterKey);
      if (!evaluateFilterPredicateValue(predicate[filterKey], resolved)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Convert a filter predicate to a filter function.
 *
 * @public
 */
export function filterPredicateToFilterFunction<T = unknown>(
  predicate: FilterPredicate,
  options?: FilterPredicateOptions,
): (value: T) => boolean {
  return value => evaluateFilterPredicate(predicate, value, options);
}

/**
 * Evaluates a resolved value against a filter. When the resolved value is an
 * array (multi-value field), the filter succeeds if ANY element matches —
 * mirroring the semantics of multi-row keys in the catalog search table.
 */
function evaluateResolvedValue(
  filter: FilterPredicateValue,
  resolved: unknown,
): boolean {
  if (Array.isArray(resolved)) {
    // For $exists, check if the array has any elements
    if (
      typeof filter === 'object' &&
      filter !== null &&
      !Array.isArray(filter) &&
      '$exists' in filter
    ) {
      return filter.$exists ? resolved.length > 0 : resolved.length === 0;
    }
    // For $contains, delegate directly since it expects an array
    if (
      typeof filter === 'object' &&
      filter !== null &&
      !Array.isArray(filter) &&
      '$contains' in filter
    ) {
      return evaluateFilterPredicateValue(filter, resolved);
    }
    // For all other matchers, succeed if ANY element matches
    return resolved.some(v => evaluateFilterPredicateValue(filter, v));
  }
  return evaluateFilterPredicateValue(filter, resolved);
}

/**
 * Evaluate a single value against a filter predicate value.
 *
 * @internal
 */
function evaluateFilterPredicateValue(
  filter: FilterPredicateValue,
  value: unknown,
): boolean {
  if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
    return valuesAreEqual(value, filter);
  }

  if ('$contains' in filter) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.some(v => evaluateFilterPredicate(filter.$contains, v));
  }
  if ('$in' in filter) {
    return filter.$in.some(search => valuesAreEqual(value, search));
  }
  if ('$exists' in filter) {
    if (filter.$exists === true) {
      return value !== undefined;
    }
    return value === undefined;
  }
  if ('$hasPrefix' in filter) {
    if (typeof value !== 'string') {
      return false;
    }
    return value
      .toLocaleUpperCase('en-US')
      .startsWith(filter.$hasPrefix.toLocaleUpperCase('en-US'));
  }

  return false;
}

function valuesAreEqual(a: unknown, b: unknown): boolean {
  if (a === null || b === null) {
    return false;
  }
  if (a === b) {
    return true;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.toLocaleUpperCase('en-US') === b.toLocaleUpperCase('en-US');
  }
  if (typeof a === 'number' || typeof b === 'number') {
    return String(a) === String(b);
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => valuesAreEqual(v, b[i]));
  }
  return false;
}
