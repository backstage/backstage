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

import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import { applyPredicateEntityFilterToQuery } from './applyPredicateEntityFilterToQuery';

export function applyEntityFilterToQuery(options: {
  filter?: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  if (!filter) {
    return targetQuery;
  }

  return applyPredicateEntityFilterToQuery({
    filter,
    targetQuery,
    onEntityIdField,
    knex,
  });
}
