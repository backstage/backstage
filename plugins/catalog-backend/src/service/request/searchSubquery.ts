/*
 * Copyright 2026 The Backstage Authors
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

import { Knex } from 'knex';

/**
 * Alias used for the search table in EXISTS subqueries, to avoid ambiguity
 * when the outer query is also on the search table (e.g. facets queries).
 */
export const SEARCH_FLT_ALIAS = 'search_flt';

/**
 * Creates an EXISTS subquery base against the search table, correlated on
 * entity_id with the outer query's entity id field.
 */
export function searchExists(
  knex: Knex,
  onEntityIdField: string,
): Knex.QueryBuilder {
  return knex(`search as ${SEARCH_FLT_ALIAS}`)
    .select(knex.raw('1'))
    .whereRaw('?? = ??', [`${SEARCH_FLT_ALIAS}.entity_id`, onEntityIdField]);
}
