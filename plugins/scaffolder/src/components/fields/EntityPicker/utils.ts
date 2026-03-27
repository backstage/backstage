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
import {
  type EntityFilterQuery,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';

type FilterQueryValue = string | { exists?: boolean } | string[];

function convertOpsValues(
  value: Exclude<FilterQueryValue, Array<any>>,
): string | symbol | undefined {
  if (value !== null && typeof value === 'object') {
    return value.exists ? CATALOG_FILTER_EXISTS : undefined;
  }
  return value?.toString();
}

function convertSchemaFiltersToQuery(
  schemaFilters: Record<string, FilterQueryValue>,
): Exclude<EntityFilterQuery, Array<any>> {
  const query: EntityFilterQuery = {};

  for (const [key, value] of Object.entries(schemaFilters)) {
    if (Array.isArray(value)) {
      query[key] = value;
    } else {
      const converted = convertOpsValues(value);
      if (converted !== undefined) {
        query[key] = converted;
      }
    }
  }

  return query;
}

/**
 * Builds an {@link EntityFilterQuery} from a `catalogFilter` value provided
 * via `ui:options` in a scaffolder field schema.
 *
 * Filter values are converted as follows:
 * - `string` values are passed through as-is.
 * - `string[]` values are passed through as-is (multi-value match).
 * - `{ exists: true }` is replaced with the `CATALOG_FILTER_EXISTS` symbol.
 * - `{ exists: false }`, `{}`, and `null` values are silently omitted from
 *   the resulting query (they carry no meaningful filter semantics and would
 *   otherwise produce invalid filter entries).
 *
 * Accepts a single filter object, an array of filter objects (OR semantics),
 * or `undefined`. Returns `undefined` when the input is falsy.
 */
export function buildCatalogFilter(
  catalogFilter:
    | Record<string, FilterQueryValue>
    | Record<string, FilterQueryValue>[]
    | undefined,
): EntityFilterQuery | undefined {
  if (!catalogFilter) {
    return undefined;
  }

  if (Array.isArray(catalogFilter)) {
    return catalogFilter.map(convertSchemaFiltersToQuery);
  }

  return convertSchemaFiltersToQuery(catalogFilter);
}
