/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';

export type EntityFilter = {
  /**
   * Get filters to add to the catalog-backend request. These are a dot-delimited field with
   * value(s) to accept, extracted on the backend by parseEntityFilterParams. For example:
   *   { field: 'kind', values: ['component'] }
   *   { field: 'metadata.name', values: ['component-1', 'component-2'] }
   */
  getCatalogFilters?: () => Record<string, string | string[]>;

  /**
   * Filter entities on the frontend after a catalog-backend request. This function will be called
   * with each backend-resolved entity. This is used when frontend information is required for
   * filtering, such as a user's starred entities.
   *
   * @param entity
   * @param env
   */
  filterEntity?: (entity: Entity) => boolean;

  /**
   * Serialize the filter value to a string for query params. The UI component responsible for
   * handling this filter should retrieve this from useEntityListProvider.queryParameters. The
   * value restored should be in the precedence: queryParameters > initialValue prop > default.
   */
  toQueryValue?: () => string | string[];
};

export type UserListFilterKind = 'owned' | 'starred' | 'all';
