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
import { valueAtPath } from './valueAtPath';

/**
 * Convert a filter predicate to a filter function that can be used to filter items.
 *
 * @internal
 */
export function filterPredicateToFilterFunction<T extends JsonValue>(
  filterPredicate: FilterPredicate,
): (value: T) => boolean {
  return value => evaluateFilterPredicate(filterPredicate, value);
}

/**
 * Evaluate a filter predicate against a value.
 *
 * @internal
 */
function evaluateFilterPredicate(
  filter: FilterPredicate,
  value: JsonValue,
): boolean {
  if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
    return valuesAreEqual(value, filter);
  }

  if ('$all' in filter) {
    return filter.$all.every(f => evaluateFilterPredicate(f, value));
  }
  if ('$any' in filter) {
    return filter.$any.some(f => evaluateFilterPredicate(f, value));
  }
  if ('$not' in filter) {
    return !evaluateFilterPredicate(filter.$not, value);
  }

  for (const filterKey in filter) {
    if (!Object.hasOwn(filter, filterKey)) {
      continue;
    }
    if (filterKey.startsWith('$')) {
      return false;
    }
    if (
      !evaluatePredicateValue(filter[filterKey], valueAtPath(value, filterKey))
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluate a single value against a predicate value.
 *
 * @internal
 */
function evaluatePredicateValue(
  filter: FilterPredicateValue,
  value: JsonValue | undefined,
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

  return false;
}

function valuesAreEqual(
  a: JsonValue | undefined,
  b: JsonValue | undefined,
): boolean {
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
