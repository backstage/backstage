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
import { DefaultEntityFilters } from '@backstage/plugin-catalog-react';

function isBackendFilter(f: any): f is { getCatalogFilters: () => any } {
  return typeof f?.getCatalogFilters === 'function';
}

function setBackendFilter(
  backendFilter: Record<string, any>,
  searchParams: URLSearchParams,
) {
  for (const [backendFilterName, backendFilterValue] of Object.entries(
    backendFilter,
  )) {
    if (Array.isArray(backendFilterValue)) {
      backendFilterValue.forEach(v =>
        searchParams.append(backendFilterName, v),
      );
    } else {
      searchParams.set(backendFilterName, backendFilterValue);
    }
  }
}

// Based on: https://github.com/backstage/backstage/blob/bfdf8a87264838aaff6607681375deb1c62f8538/plugins/catalog-react/src/utils/filters.ts#L48
export const setEnabledBackendFilters = (
  filters: DefaultEntityFilters,
  searchParams: URLSearchParams,
) => {
  Object.values(filters)
    .flatMap(f => {
      if (isBackendFilter(f)) {
        const backendFilter = f.getCatalogFilters();
        return backendFilter ? [backendFilter] : [];
      }
      return [];
    })
    .forEach(f => setBackendFilter(f, searchParams));
};
