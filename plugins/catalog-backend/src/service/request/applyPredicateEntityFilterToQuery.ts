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
  FilterPredicate,
  FilterPredicatePrimitive,
  FilterPredicateValue,
} from '@backstage/filter-predicates';
import { InputError } from '@backstage/errors';
import { Knex } from 'knex';
import { DbSearchRow } from '../../database/tables';

function isAllPredicate(
  filter: FilterPredicate,
): filter is { $all: FilterPredicate[] } {
  return typeof filter === 'object' && filter !== null && '$all' in filter;
}

function isAnyPredicate(
  filter: FilterPredicate,
): filter is { $any: FilterPredicate[] } {
  return typeof filter === 'object' && filter !== null && '$any' in filter;
}

function isNotPredicate(
  filter: FilterPredicate,
): filter is { $not: FilterPredicate } {
  return typeof filter === 'object' && filter !== null && '$not' in filter;
}

function isPrimitive(value: unknown): value is FilterPredicatePrimitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function isExistsValue(
  value: FilterPredicateValue,
): value is { $exists: boolean } {
  return typeof value === 'object' && value !== null && '$exists' in value;
}

function isInValue(
  value: FilterPredicateValue,
): value is { $in: FilterPredicatePrimitive[] } {
  return typeof value === 'object' && value !== null && '$in' in value;
}

function isFieldExpression(filter: FilterPredicate): boolean {
  if (typeof filter !== 'object' || filter === null) {
    return false;
  }
  // Not a logical operator
  return !('$all' in filter || '$any' in filter || '$not' in filter);
}

/**
 * example generated query
 * Selects all non-null final entities that:
 *
 * - Are of kind "component"
 * - Have spec.type = "service"
 * - Are owned by either:
 *   - backend-team
 *   - platform-team
 * - Are NOT in experimental lifecycle
 *
 * Results are ordered by entity_ref in ascending order.
 *
 * SQL Reference:
 * ```
 * SELECT final_entities.*
 * FROM final_entities
 * WHERE final_entities.final_entity IS NOT NULL
 *   AND final_entities.entity_id IN (
 *     SELECT entity_id FROM search WHERE key = 'kind' AND value = 'component'
 *   )
 *   AND final_entities.entity_id IN (
 *     SELECT entity_id FROM search WHERE key = 'spec.type' AND value = 'service'
 *   )
 *   AND (
 *     final_entities.entity_id IN (
 *       SELECT entity_id FROM search WHERE key = 'spec.owner' AND value = 'backend-team'
 *     )
 *     OR
 *     final_entities.entity_id IN (
 *       SELECT entity_id FROM search WHERE key = 'spec.owner' AND value = 'platform-team'
 *     )
 *   )
 *   AND final_entities.entity_id NOT IN (
 *     SELECT entity_id FROM search WHERE key = 'spec.lifecycle' AND value = 'experimental'
 *   )
 * ORDER BY final_entities.entity_ref ASC;
 * ```
 */

function applyPredicateInStrategy(
  filter: FilterPredicate,
  targetQuery: Knex.QueryBuilder,
  onEntityIdField: string,
  knex: Knex,
  negate: boolean,
): Knex.QueryBuilder {
  // Handle $not
  if (isNotPredicate(filter)) {
    return applyPredicateInStrategy(
      filter.$not,
      targetQuery,
      onEntityIdField,
      knex,
      !negate,
    );
  }

  // Handle $all (AND)
  if (isAllPredicate(filter)) {
    // Empty $all array is vacuous truth - matches all entities
    if (filter.$all.length === 0) {
      if (negate) {
        return targetQuery.andWhere(knex.raw('1 = 0'));
      }
      return targetQuery;
    }

    return targetQuery[negate ? 'andWhereNot' : 'andWhere'](
      function allFilter() {
        for (const subFilter of filter.$all) {
          this.andWhere(subQuery =>
            applyPredicateInStrategy(
              subFilter,
              subQuery,
              onEntityIdField,
              knex,
              false,
            ),
          );
        }
      },
    );
  }

  // Handle $any (OR)
  if (isAnyPredicate(filter)) {
    // Empty $any array matches nothing
    if (filter.$any.length === 0) {
      if (negate) {
        return targetQuery;
      }
      return targetQuery.andWhere(knex.raw('1 = 0'));
    }

    return targetQuery[negate ? 'andWhereNot' : 'andWhere'](
      function anyFilter() {
        for (const subFilter of filter.$any) {
          this.orWhere(subQuery =>
            applyPredicateInStrategy(
              subFilter,
              subQuery,
              onEntityIdField,
              knex,
              false,
            ),
          );
        }
      },
    );
  }

  // Reject primitives at the top level. Matching by value without specifying
  // a field key is ambiguous and should not be allowed.
  if (isPrimitive(filter)) {
    throw new InputError(
      `Invalid filter predicate: top-level primitive values are not supported. ` +
        `Wrap the value in a field expression, e.g. { "kind": ${JSON.stringify(
          filter,
        )} }`,
    );
  }

  // Handle field expressions like { "kind": "component" } or { "spec.type": { "$in": ["service", "website"] } }
  if (isFieldExpression(filter)) {
    return targetQuery[negate ? 'andWhereNot' : 'andWhere'](
      function fieldFilter() {
        for (const [key, value] of Object.entries(filter)) {
          const normalizedKey = key.toLowerCase();

          if (isExistsValue(value)) {
            // Handle $exists
            const existsQuery = knex<DbSearchRow>('search')
              .select('search.entity_id')
              .where({ key: normalizedKey });

            if (value.$exists) {
              this.andWhere(onEntityIdField, 'in', existsQuery);
            } else {
              this.andWhere(onEntityIdField, 'not in', existsQuery);
            }
          } else if (isInValue(value)) {
            // Handle $in
            const values = value.$in.map(v => String(v).toLowerCase());
            const matchQuery = knex<DbSearchRow>('search')
              .select('search.entity_id')
              .where({ key: normalizedKey })
              .whereIn('value', values);
            this.andWhere(onEntityIdField, 'in', matchQuery);
          } else if (isPrimitive(value)) {
            // Handle direct value match
            const matchQuery = knex<DbSearchRow>('search')
              .select('search.entity_id')
              .where({
                key: normalizedKey,
                value: String(value).toLowerCase(),
              });
            this.andWhere(onEntityIdField, 'in', matchQuery);
          } else {
            // Reject unsupported/invalid predicate values
            throw new InputError(
              `Invalid filter predicate value for field "${key}": expected a primitive value, $exists, or $in operator, but got ${JSON.stringify(
                value,
              )}`,
            );
          }
        }
      },
    );
  }

  return targetQuery;
}

export function applyPredicateEntityFilterToQuery(options: {
  filter: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  return applyPredicateInStrategy(
    filter,
    targetQuery,
    onEntityIdField,
    knex,
    false,
  );
}
