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
 * Evaluate a filter predicate against a value.
 *
 * @public
 */
export function evaluateFilterPredicate(
  predicate: FilterPredicate,
  value: unknown,
): boolean {
  if (
    typeof predicate !== 'object' ||
    predicate === null ||
    Array.isArray(predicate)
  ) {
    return valuesAreEqual(value, predicate);
  }

  if ('$all' in predicate) {
    return predicate.$all.every(f => evaluateFilterPredicate(f, value));
  }
  if ('$any' in predicate) {
    return predicate.$any.some(f => evaluateFilterPredicate(f, value));
  }
  if ('$not' in predicate) {
    return !evaluateFilterPredicate(predicate.$not, value);
  }

  for (const filterKey in predicate) {
    if (!Object.hasOwn(predicate, filterKey)) {
      continue;
    }
    if (filterKey.startsWith('$')) {
      return false;
    }
    if (
      !evaluateFilterPredicateValue(
        predicate[filterKey],
        getJsonValueAtPath(value as JsonValue, filterKey),
      )
    ) {
      return false;
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
): (value: T) => boolean {
  return value => evaluateFilterPredicate(predicate, value);
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
