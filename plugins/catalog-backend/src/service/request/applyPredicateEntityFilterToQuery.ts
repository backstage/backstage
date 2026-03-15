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

import {
  FilterPredicate,
  FilterPredicatePrimitive,
  FilterPredicateValue,
} from '@backstage/filter-predicates';
import { InputError } from '@backstage/errors';
import { Knex } from 'knex';

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

// Alias used for the search table in EXISTS subqueries, to avoid ambiguity
// when the outer query is also on the search table (e.g. facets queries).
const S = 'search_flt';

/**
 * Creates an EXISTS subquery base against the search table, correlated on
 * entity_id with the outer query's entity id field.
 */
function searchExists(knex: Knex, onEntityIdField: string): Knex.QueryBuilder {
  return knex(`search as ${S}`)
    .select(knex.raw('1'))
    .whereRaw('?? = ??', [`${S}.entity_id`, onEntityIdField]);
}

export function applyPredicateEntityFilterToQuery(options: {
  filter: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  // We do not support top-level primitives; all matching happens through objects
  if (!isObject(filter)) {
    const actual = JSON.stringify(filter);
    throw new InputError(
      `Invalid filter predicate: top-level primitive values are not supported. Wrap the value in a field expression, e.g. { "kind": ${actual} }`,
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
      return targetQuery.andWhereRaw('1 = 1');
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
    return targetQuery.andWhereRaw('1 = 1');
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
    return targetQuery.whereExists(
      searchExists(knex, onEntityIdField)
        .where(`${S}.key`, key)
        .where(`${S}.value`, String(value).toLocaleLowerCase('en-US')),
    );
  }

  if (isObject(value)) {
    if ('$exists' in value) {
      const subquery = searchExists(knex, onEntityIdField).where(
        `${S}.key`,
        key,
      );
      return value.$exists
        ? targetQuery.whereExists(subquery)
        : targetQuery.whereNotExists(subquery);
    }

    if ('$in' in value) {
      const values = value.$in.map(v => String(v).toLocaleLowerCase('en-US'));
      return targetQuery.whereExists(
        searchExists(knex, onEntityIdField)
          .where(`${S}.key`, key)
          .whereIn(`${S}.value`, values),
      );
    }

    if ('$hasPrefix' in value) {
      const prefix = value.$hasPrefix.toLocaleLowerCase('en-US');
      const escaped = prefix.replace(/[%_\\]/g, c => `\\${c}`);
      return targetQuery.whereExists(
        searchExists(knex, onEntityIdField)
          .where(`${S}.key`, key)
          .andWhereRaw('?? like ? escape ?', [
            `${S}.value`,
            `${escaped}%`,
            '\\',
          ]),
      );
    }

    if ('$contains' in value) {
      const target = value.$contains;

      // If the target is a primitive, match on the special array syntax.
      //
      // FROM: `{ "a": { "$contains": "b" } }`
      //
      // TO:   `{ "a": "b" }`
      //
      // The search table does not actually show us that "a" was an array to
      // begin with, so this can mistakenly also match on an object that had a
      // "b" key with a primitive value. We'll consider that an acceptable
      // tradeoff though.
      if (isPrimitive(target)) {
        return targetQuery.whereExists(
          searchExists(knex, onEntityIdField)
            .where(`${S}.key`, key)
            .where(`${S}.value`, String(target).toLocaleLowerCase('en-US')),
        );
      }

      // Object form of $contains - currently only supports relation-style
      // objects with "type" and optional "targetRef" keys.
      //
      // FROM: `{ "relations": { "$contains": { "type": "ownedBy", "targetRef": "group:default/team-a" } } }`
      //
      // TO:   search for key = "relations.ownedby" AND value = "group:default/team-a"
      if (isObject(target)) {
        if (key === 'relations') {
          return applyContainsRelation({
            target,
            targetQuery,
            onEntityIdField,
            knex,
          });
        }

        throw new InputError(
          `Object form of $contains is not supported for field "${key}"`,
        );
      }

      const actual = JSON.stringify(target);
      throw new InputError(
        `Unsupported $contains target for field "${key}": ${actual}`,
      );
    }
  }

  const actual = JSON.stringify(value);
  throw new InputError(
    `Invalid filter predicate value for field "${key}": expected a primitive value, $exists, $in, $hasPrefix, or $contains operator, but got ${actual}`,
  );
}

/**
 * Handles expressions on the form
 *
 * ```
 * {
 *   "relations": {
 *     "$contains": {
 *       "type": "ownedBy",
 *       "targetRef": "group:default/team-a"
 *     }
 *   }
 * }
 * ```
 *
 * which map onto the search table's special `relation.<type>: <targetRef>`
 * syntax.
 *
 * Only the keys "type" and "targetRef" are supported. The "type" key is
 * required. If "targetRef" is omitted, it becomes an existence check for any
 * relation of that type. The "targetRef" value can be a string or an `$in`
 * array.
 */
function applyContainsRelation(options: {
  target: Record<string, unknown>;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { target: rawTarget, targetQuery, onEntityIdField, knex } = options;

  function parseStringOrIn(value: unknown): string[] {
    if (typeof value === 'string') {
      return [value.toLocaleLowerCase('en-US')];
    }
    if (
      isObject(value) &&
      Object.keys(value).length === 1 &&
      '$in' in value &&
      Array.isArray(value.$in) &&
      value.$in.every((v): v is string => typeof v === 'string')
    ) {
      if (value.$in.length === 0) {
        throw new InputError(
          `Empty "$in" array for $contains on "relations" is not allowed`,
        );
      }
      return value.$in.map(v => v.toLocaleLowerCase('en-US'));
    }
    const actual = JSON.stringify(value);
    throw new InputError(
      `Unsupported value in $contains for "relations": expected a string or { "$in": [strings] }, but got ${actual}`,
    );
  }

  let type: string | undefined;
  let targetRef: string[] | undefined;

  for (const [rawKey, value] of Object.entries(rawTarget)) {
    const key = rawKey.toLocaleLowerCase('en-US');

    if (key === 'type') {
      if (type !== undefined) {
        throw new InputError(
          `Duplicate key "${rawKey}" in $contains for "relations"`,
        );
      }
      if (typeof value !== 'string') {
        throw new InputError(
          `The $contains operator for "relations" requires a "type" string property`,
        );
      }
      type = value;
    } else if (key === 'targetref') {
      if (targetRef !== undefined) {
        throw new InputError(
          `Duplicate key "${rawKey}" in $contains for "relations"`,
        );
      }
      targetRef = parseStringOrIn(value);
    } else {
      throw new InputError(
        `Unsupported key "${rawKey}" in $contains for "relations". Only "type" and "targetRef" are supported`,
      );
    }
  }

  if (!type) {
    throw new InputError(
      `The $contains operator for "relations" requires a "type" string property`,
    );
  }

  const subquery = searchExists(knex, onEntityIdField).where(
    `${S}.key`,
    `relations.${type.toLocaleLowerCase('en-US')}`,
  );

  if (targetRef) {
    subquery.whereIn(`${S}.value`, targetRef);
  }

  return targetQuery.whereExists(subquery);
}
