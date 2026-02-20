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

function isPrimitive(value: unknown): value is FilterPredicatePrimitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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
export function applyPredicateEntityFilterToQuery(options: {
  filter: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  // We do not support top-level primitives; all matching happens through objects
  if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
    throw new InputError(
      `Invalid filter predicate: top-level primitive values are not supported. ` +
        `Wrap the value in a field expression, e.g. { "kind": ${JSON.stringify(
          filter,
        )} }`,
    );
  }

  if ('$not' in filter) {
    return targetQuery.andWhereNot(inner =>
      applyPredicateEntityFilterToQuery({
        filter: filter.$not,
        targetQuery: inner,
        onEntityIdField,
        knex,
      }),
    );
  }

  if ('$all' in filter) {
    if (filter.$all.length === 0) {
      return targetQuery.andWhereRaw('1 = 0');
    }
    return targetQuery.andWhere(outer => {
      for (const subFilter of filter.$all) {
        outer.andWhere(inner =>
          applyPredicateEntityFilterToQuery({
            filter: subFilter,
            targetQuery: inner,
            onEntityIdField,
            knex,
          }),
        );
      }
    });
  }

  if ('$any' in filter) {
    if (filter.$any.length === 0) {
      return targetQuery.andWhereRaw('1 = 0');
    }
    return targetQuery.andWhere(outer => {
      for (const subFilter of filter.$any) {
        outer.orWhere(inner =>
          applyPredicateEntityFilterToQuery({
            filter: subFilter,
            targetQuery: inner,
            onEntityIdField,
            knex,
          }),
        );
      }
    });
  }

  // Treat the filter as a field expression like { "kind": "component" } or { "spec.type": { "$in": ["service", "website"] } }
  if (Object.keys(filter).length === 0) {
    return targetQuery;
  }
  return targetQuery.andWhere(inner => {
    for (const [keyAnyCase, value] of Object.entries(filter)) {
      applyFieldCondition({
        key: keyAnyCase.toLocaleLowerCase('en-US'),
        value,
        targetQuery: inner,
        onEntityIdField,
        knex,
      });
    }
  });
}

/**
 * Applies a single { key: value } filter to the target query.
 */
function applyFieldCondition(options: {
  key: string;
  value: FilterPredicateValue;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { key, value, targetQuery, onEntityIdField, knex } = options;

  if (isPrimitive(value)) {
    const matchQuery = knex<DbSearchRow>('search')
      .select('search.entity_id')
      .where({
        key,
        value: String(value).toLocaleLowerCase('en-US'),
      });
    return targetQuery.andWhere(onEntityIdField, 'in', matchQuery);
  }

  if (isObject(value)) {
    if ('$exists' in value) {
      const existsQuery = knex<DbSearchRow>('search')
        .select('search.entity_id')
        .where({ key });
      if (value.$exists) {
        return targetQuery.andWhere(onEntityIdField, 'in', existsQuery);
      }
      return targetQuery.andWhere(onEntityIdField, 'not in', existsQuery);
    }

    if ('$in' in value) {
      const values = (value.$in as FilterPredicatePrimitive[]).map(v =>
        String(v).toLocaleLowerCase('en-US'),
      );
      const matchQuery = knex<DbSearchRow>('search')
        .select('search.entity_id')
        .where({ key })
        .whereIn('value', values);
      return targetQuery.andWhere(onEntityIdField, 'in', matchQuery);
    }

    if ('$hasPrefix' in value) {
      const prefix = (value.$hasPrefix as string).toLocaleLowerCase('en-US');
      const escaped = prefix.replace(/[%_\\]/g, c => `\\${c}`);
      const matchQuery = knex<DbSearchRow>('search')
        .select('search.entity_id')
        .where({ key })
        .andWhereRaw('?? like ? escape ?', ['value', `${escaped}%`, '\\']);
      return targetQuery.andWhere(onEntityIdField, 'in', matchQuery);
    }
  }

  throw new InputError(
    `Invalid filter predicate value for field "${key}": expected a primitive value, $exists, $in, or $hasPrefix operator, but got ${JSON.stringify(
      value,
    )}`,
  );
}
