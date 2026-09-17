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
  DefaultEntityFilters,
  EntityTextFilter,
  EntityOrderFilter,
} from '@backstage/plugin-catalog-react';
import type {
  StreamEntitiesRequest,
  EntityOrderQuery,
} from '@backstage/catalog-client';

function isBackendFilter(f: any): f is { getCatalogFilters: () => any } {
  return typeof f?.getCatalogFilters === 'function';
}

function isEntityTextFilter(f: any): f is EntityTextFilter {
  return typeof f?.getFullTextFilters === 'function';
}

function isEntityOrderFilter(f: any): f is EntityOrderFilter {
  return typeof f?.getOrderFilters === 'function';
}

function getBackendFilterObject(
  backendFilter: Record<string, any>,
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  for (const [backendFilterName, backendFilterValue] of Object.entries(
    backendFilter,
  )) {
    if (Array.isArray(backendFilterValue)) {
      if (backendFilterValue.length > 0) {
        result[backendFilterName] = backendFilterValue;
      }
    } else if (
      backendFilterValue !== undefined &&
      backendFilterValue !== null
    ) {
      result[backendFilterName] = backendFilterValue;
    }
  }

  return result;
}

/**
 * Converts entity filters to a StreamEntitiesRequest that can be used
 * with the catalogApi.streamEntities method.
 *
 * This extracts all enabled backend filters, full text filters, and order filters
 * and converts them to the appropriate format for streaming.
 *
 * @param filters - The entity filters from useEntityList
 * @returns A StreamEntitiesRequest object, or undefined if no filters are enabled
 */
export const toStreamRequest = (
  filters: DefaultEntityFilters,
): StreamEntitiesRequest | undefined => {
  const filterValues = Object.values(filters).filter(
    (f): f is NonNullable<typeof f> => f !== null && f !== undefined,
  );

  const backendFilters = filterValues
    .flatMap(f => {
      if (isBackendFilter(f)) {
        const backendFilter = f.getCatalogFilters();
        return backendFilter ? [backendFilter] : [];
      }
      return [];
    })
    .reduce((acc, f) => {
      return { ...acc, ...getBackendFilterObject(f) };
    }, {} as Record<string, string | string[]>);

  const fullTextFilter = filterValues
    .find(isEntityTextFilter)
    ?.getFullTextFilters();

  const orderFieldsFilter = filterValues.find(isEntityOrderFilter);
  const orderFields = orderFieldsFilter
    ? (orderFieldsFilter.getOrderFilters() as EntityOrderQuery)
    : undefined;

  const request: StreamEntitiesRequest = {};

  if (Object.keys(backendFilters).length > 0) {
    request.filter = backendFilters;
  }

  if (fullTextFilter) {
    request.fullTextFilter = fullTextFilter;
  }

  if (orderFields) {
    request.orderFields = orderFields;
  }

  // Return undefined if no filters, which means stream all entities
  return Object.keys(request).length > 0 ? request : undefined;
};
