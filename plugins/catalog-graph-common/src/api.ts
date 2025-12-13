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

import type { Entity } from '@backstage/catalog-model';
import type { EntityFilterQuery } from '@backstage/catalog-client';

/**
 * Query request for fetching a catalog graph
 *
 * @public
 */
export type GraphQueryRequest = {
  rootEntityRefs: string[];
  maxDepth?: number;
  relations?: string[];
  fields?: string[];
  filter?: EntityFilterQuery;
};

/**
 * URI template for querying the catalog graph by query parameters.
 *
 * @public
 */
export const catalogGraphApiSpec = {
  path: '/graph/by-query',
  urlTemplate:
    '/graph/by-query{?rootEntityRefs,maxDepth,relations,fields,filter*}',
};

/**
 * Result of a graph query, as returned by the backend.
 *
 * @public
 */
export interface GraphQueryResult {
  /** The entities in the graph */
  entities: Entity[];

  /**
   * Whether the graph was cut off due to the limitEntities setting, or if the
   * depth was greater than the maxDepth setting.
   */
  cutoff: boolean;
}
