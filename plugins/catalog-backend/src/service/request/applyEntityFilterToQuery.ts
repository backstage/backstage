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

import {
  EntitiesSearchFilter,
  EntityFilter,
} from '@backstage/plugin-catalog-node';
import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import { applyPredicateEntityFilterToQuery } from './applyPredicateEntityFilterToQuery';
import { searchExists, SEARCH_FLT_ALIAS } from './searchSubquery';

function isEntitiesSearchFilter(
  filter: EntitiesSearchFilter | EntityFilter,
): filter is EntitiesSearchFilter {
  return filter.hasOwnProperty('key');
}

function isOrEntityFilter(
  filter: EntityFilter,
): filter is { anyOf: EntityFilter[] } {
  return filter.hasOwnProperty('anyOf');
}

function isNegationEntityFilter(
  filter: EntityFilter,
): filter is { not: EntityFilter } {
  return filter.hasOwnProperty('not');
}

/**
 * Applies filtering through correlated EXISTS subqueries. Example:
 *
 * ```
 * SELECT * FROM final_entities
 * WHERE
 *   EXISTS (
 *     SELECT 1 FROM search AS search_flt
 *     WHERE search_flt.entity_id = final_entities.entity_id
 *       AND key = 'kind' AND value = 'component'
 *   )
 *   AND EXISTS (
 *     SELECT 1 FROM search AS search_flt
 *     WHERE search_flt.entity_id = final_entities.entity_id
 *       AND key = 'spec.lifecycle' AND value = 'production'
 *   )
 *   AND final_entities.final_entity IS NOT NULL
 * ```
 *
 * The EXISTS strategy enables efficient semi-join plans, particularly on
 * PostgreSQL with large datasets, since the database can stop scanning as
 * soon as the first matching row is found.
 */
function applyExistsStrategy(
  filter: EntityFilter,
  targetQuery: Knex.QueryBuilder,
  onEntityIdField: string,
  knex: Knex,
  negate: boolean,
): Knex.QueryBuilder {
  if (isNegationEntityFilter(filter)) {
    return applyExistsStrategy(
      filter.not,
      targetQuery,
      onEntityIdField,
      knex,
      !negate,
    );
  }

  if (isEntitiesSearchFilter(filter)) {
    const key = filter.key.toLowerCase();
    const values = filter.values?.map(v => v.toLowerCase());
    const subquery = searchExists(knex, onEntityIdField)
      .where(`${SEARCH_FLT_ALIAS}.key`, key)
      .andWhere(function keyFilter() {
        if (values?.length === 1) {
          this.where(`${SEARCH_FLT_ALIAS}.value`, values.at(0));
        } else if (values) {
          this.whereIn(`${SEARCH_FLT_ALIAS}.value`, values);
        }
      });
    return negate
      ? targetQuery.whereNotExists(subquery)
      : targetQuery.whereExists(subquery);
  }

  return targetQuery[negate ? 'andWhereNot' : 'andWhere'](
    function filterFunction() {
      if (isOrEntityFilter(filter)) {
        for (const subFilter of filter.anyOf ?? []) {
          this.orWhere(subQuery =>
            applyExistsStrategy(
              subFilter,
              subQuery,
              onEntityIdField,
              knex,
              false,
            ),
          );
        }
      } else {
        for (const subFilter of filter.allOf ?? []) {
          this.andWhere(subQuery =>
            applyExistsStrategy(
              subFilter,
              subQuery,
              onEntityIdField,
              knex,
              false,
            ),
          );
        }
      }
    },
  );
}

// The actual exported function
export function applyEntityFilterToQuery(options: {
  filter?: EntityFilter;
  query?: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, query, targetQuery, onEntityIdField, knex } = options;

  let result = targetQuery;

  if (filter) {
    result = applyExistsStrategy(filter, result, onEntityIdField, knex, false);
  }

  if (query) {
    result = applyPredicateEntityFilterToQuery({
      filter: query,
      targetQuery: result,
      onEntityIdField,
      knex,
    });
  }

  return result;
}
