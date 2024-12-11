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
import { Knex } from 'knex';
import { DbSearchRow } from '../../database/tables';

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

function isAndEntityFilter(
  filter: EntityFilter,
): filter is { allOf: EntityFilter[] } {
  return filter.hasOwnProperty('allOf');
}

function isNegationEntityFilter(
  filter: EntityFilter,
): filter is { not: EntityFilter } {
  return filter.hasOwnProperty('not');
}

/**
 * Applies filtering through a number of WHERE IN subqueries. Example:
 *
 * ```
 * SELECT * FROM final_entities
 * WHERE
 *   entity_id IN (
 *     SELECT entity_id FROM search
 *     WHERE key = 'kind' AND value = 'component'
 *   )
 *   AND entity_id IN (
 *     SELECT entity_id FROM search
 *     WHERE key = 'spec.lifecycle' AND value = 'production'
 *   )
 *   AND final_entities.final_entity IS NOT NULL
 * ```
 *
 * This strategy is a good all-rounder, in the sense that it has medium-good
 * performance on most queries on all database engines. However, it does not
 * scale well down to very short runtimes as well as the JOIN strategy.
 */
function applyInStrategy(
  filter: EntityFilter,
  targetQuery: Knex.QueryBuilder,
  onEntityIdField: string,
  knex: Knex,
  negate: boolean,
): Knex.QueryBuilder {
  if (isNegationEntityFilter(filter)) {
    return applyInStrategy(
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
    const matchQuery = knex<DbSearchRow>('search')
      .select('search.entity_id')
      .where({ key })
      .andWhere(function keyFilter() {
        if (values?.length === 1) {
          this.where({ value: values.at(0) });
        } else if (values) {
          this.andWhere('value', 'in', values);
        }
      });
    return targetQuery.andWhere(
      onEntityIdField,
      negate ? 'not in' : 'in',
      matchQuery,
    );
  }

  return targetQuery[negate ? 'andWhereNot' : 'andWhere'](
    function filterFunction() {
      if (isOrEntityFilter(filter)) {
        for (const subFilter of filter.anyOf ?? []) {
          this.orWhere(subQuery =>
            applyInStrategy(subFilter, subQuery, onEntityIdField, knex, false),
          );
        }
      } else {
        for (const subFilter of filter.allOf ?? []) {
          this.andWhere(subQuery =>
            applyInStrategy(subFilter, subQuery, onEntityIdField, knex, false),
          );
        }
      }
    },
  );
}

/**
 * Applies filtering through a number of JOINs with the search table. Example:
 *
 * ```
 * SELECT * FROM final_entities
 * LEFT OUTER JOIN search AS filter_0
 *   ON filter_0.entity_id = final_entities.entity_id
 *   AND filter_0.key = 'kind'
 * LEFT OUTER JOIN search AS filter_1
 *   ON filter_1.entity_id = final_entities.entity_id
 *   AND filter_1.key = 'spec.lifecycle'
 * WHERE (filter_0.value = 'component' AND filter_1.value = 'production')
 *   AND final_entities.final_entity IS NOT NULL
 * ```
 *
 * This strategy has very good performance on nested medium complexity queries
 * on pg, but can be slow on sqlite. It also has much larger variance than the
 * IN strategy: for small page sizes (< 500 or so, depending on circumstances)
 * it generates a fast plan, but then at some threshold switches over to scans
 * which suddenly lead to much worse performance than IN. Therefore it can be
 * important to pick carefully between the strategies.
 */
function applyJoinStrategy(
  filter: EntityFilter,
  targetQuery: Knex.QueryBuilder,
  onEntityIdField: string,
): Knex.QueryBuilder {
  // First we traverse the entire query tree to gather up all of the unique keys
  // that are tested against, and make sure to make an outer join on the search
  // table for each of them. As we do so, collect the table aliases made along
  // the way. In the end, this map may contain for example
  // `{ 'kind': 'filter_0', 'spec.lifecycle': 'filter_1' }`
  const keyToSearchTableAlias = new Map<string, string>();
  function recursiveMakeJoinAliases(filterNode: EntityFilter) {
    if (isNegationEntityFilter(filterNode)) {
      recursiveMakeJoinAliases(filterNode.not);
    } else if (isOrEntityFilter(filterNode)) {
      filterNode.anyOf.forEach(recursiveMakeJoinAliases);
    } else if (isAndEntityFilter(filterNode)) {
      filterNode.allOf.forEach(recursiveMakeJoinAliases);
    } else {
      const key = filterNode.key.toLowerCase();
      if (!keyToSearchTableAlias.has(key)) {
        const alias = `filter_${keyToSearchTableAlias.size}`;
        keyToSearchTableAlias.set(key, alias);
        targetQuery.leftOuterJoin({ [alias]: 'search' }, inner =>
          inner
            .on(`${alias}.entity_id`, onEntityIdField)
            .andOnVal(`${alias}.key`, key),
        );
      }
    }
  }
  recursiveMakeJoinAliases(filter);

  // Then we traverse the query tree again, this time building up the actual
  // WHERE query based on values from the aliases above
  function recursiveBuildQuery(
    queryBuilder: Knex.QueryBuilder,
    filterNode: EntityFilter,
  ) {
    if (isNegationEntityFilter(filterNode)) {
      queryBuilder.whereNot(inner =>
        recursiveBuildQuery(inner, filterNode.not),
      );
    } else if (isOrEntityFilter(filterNode)) {
      // This extra nesting is needed to make sure that the ORs are grouped
      // separately and not "leak" next to ANDs in the caller's query.
      queryBuilder.andWhere(inner => {
        for (const subFilter of filterNode.anyOf) {
          inner.orWhere(inner2 => recursiveBuildQuery(inner2, subFilter));
        }
      });
    } else if (isAndEntityFilter(filterNode)) {
      for (const subFilter of filterNode.allOf) {
        queryBuilder.andWhere(inner => recursiveBuildQuery(inner, subFilter));
      }
    } else {
      const key = filterNode.key.toLowerCase();
      const values = filterNode.values?.map(v => v.toLowerCase());
      const column = `${keyToSearchTableAlias.get(key)}.value`;
      if (!values) {
        queryBuilder.whereNotNull(column);
      } else if (values.length === 1) {
        // Null check needed since NULL = 'string' evaluates to NULL, not FALSE
        queryBuilder.whereNotNull(column).andWhere(column, values[0]);
      } else {
        queryBuilder.whereIn(column, values);
      }
    }
  }
  recursiveBuildQuery(targetQuery, filter);

  return targetQuery;
}

// The actual exported function
export function applyEntityFilterToQuery(options: {
  filter: EntityFilter;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
  strategy?: 'in' | 'join';
}): Knex.QueryBuilder {
  const {
    filter,
    targetQuery,
    onEntityIdField,
    knex,
    strategy = 'in',
  } = options;
  if (strategy === 'in') {
    return applyInStrategy(filter, targetQuery, onEntityIdField, knex, false);
  } else if (strategy === 'join') {
    return applyJoinStrategy(filter, targetQuery, onEntityIdField);
  }
  throw new Error(`Unsupported filtering strategy ${strategy}`);
}
