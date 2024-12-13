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

// The actual exported function
export function applyEntityFilterToQuery(options: {
  filter: EntityFilter;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
  strategy?: 'in' | 'join';
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  return applyInStrategy(filter, targetQuery, onEntityIdField, knex, false);
}
