/*
 * Copyright 2024 The Backstage Authors
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

import { EntityFilter } from '@backstage/plugin-catalog-node';
import { FilterPredicate } from '@backstage/filter-predicates';

/**
 * Type guard to check if a filter is an EntitiesSearchFilter
 */
function isEntitiesSearchFilter(
  filter: EntityFilter,
): filter is { key: string; values?: string[] } {
  return 'key' in filter;
}

/**
 * Type guard to check if a filter is an allOf filter
 */
function isAllOfFilter(
  filter: EntityFilter,
): filter is { allOf: EntityFilter[] } {
  return 'allOf' in filter;
}

/**
 * Type guard to check if a filter is an anyOf filter
 */
function isAnyOfFilter(
  filter: EntityFilter,
): filter is { anyOf: EntityFilter[] } {
  return 'anyOf' in filter;
}

/**
 * Type guard to check if a filter is a not filter
 */
function isNotFilter(filter: EntityFilter): filter is { not: EntityFilter } {
  return 'not' in filter;
}

/**
 * Converts an EntityFilter to a FilterPredicate.
 *
 * EntityFilter format (old):
 * - { allOf: EntityFilter[] }
 * - { anyOf: EntityFilter[] }
 * - { not: EntityFilter }
 * - { key: string, values?: string[] }
 *
 * FilterPredicate format (new):
 * - { $all: FilterPredicate[] }
 * - { $any: FilterPredicate[] }
 * - { $not: FilterPredicate }
 * - { [field]: value | { $in: value[] } | { $exists: boolean } }
 *
 * @param filter - The EntityFilter to convert
 * @returns The equivalent FilterPredicate
 * @public
 */
export function convertEntityFilterToPredicate(
  filter: EntityFilter,
): FilterPredicate {
  // Handle allOf -> $all
  if (isAllOfFilter(filter)) {
    return {
      $all: filter.allOf.map(f => convertEntityFilterToPredicate(f)),
    };
  }

  // Handle anyOf -> $any
  if (isAnyOfFilter(filter)) {
    return {
      $any: filter.anyOf.map(f => convertEntityFilterToPredicate(f)),
    };
  }

  // Handle not -> $not
  if (isNotFilter(filter)) {
    return {
      $not: convertEntityFilterToPredicate(filter.not),
    };
  }

  // Handle EntitiesSearchFilter -> field expression
  if (isEntitiesSearchFilter(filter)) {
    const { key, values } = filter;

    if (!values || values.length === 0) {
      return { [key]: { $exists: true } } as FilterPredicate;
    }

    if (values.length === 1) {
      return { [key]: values[0] } as FilterPredicate;
    }

    return { [key]: { $in: values } } as FilterPredicate;
  }

  throw new Error(`Unsupported EntityFilter format: ${JSON.stringify(filter)}`);
}
