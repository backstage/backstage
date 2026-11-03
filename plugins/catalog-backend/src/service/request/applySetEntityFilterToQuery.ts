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

import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import {
  applyFieldCondition,
  assertObjectPredicate,
  isObject,
} from './applyPredicateEntityFilterToQuery';
import { SEARCH_FLT_ALIAS as S } from './searchSubquery';

type SetSql = Knex.QueryBuilder | Knex.Raw;

// A set of entity IDs, either `sql` itself or its complement U - `sql`.
// A null `sql` is the empty set.
type EntitySet = { comp: boolean; sql: SetSql | null };

function isAbsence(value: unknown): boolean {
  return isObject(value) && value.$exists === false;
}

/**
 * Whether the filter contains a disjunction or a negation after negations are
 * pushed down to the field conditions.
 */
export function needsSetFilter(
  filter: FilterPredicate,
  negated = false,
): boolean {
  assertObjectPredicate(filter);

  if ('$not' in filter) {
    return needsSetFilter(filter.$not, !negated);
  }
  if ('$any' in filter) {
    return (
      (!negated && filter.$any.length > 1) ||
      filter.$any.some(f => needsSetFilter(f, negated))
    );
  }
  if ('$all' in filter) {
    return (
      (negated && filter.$all.length > 1) ||
      filter.$all.some(f => needsSetFilter(f, negated))
    );
  }
  const values = Object.values(filter);
  return (
    (negated && values.length > 1) ||
    values.some(value => negated !== isAbsence(value))
  );
}

/**
 * Applies the filter as set operations on entity IDs rather than correlated
 * EXISTS conditions. Only for PostgreSQL queries that visit the whole filtered
 * set, since it prevents LIMIT from stopping early.
 */
export function applySetEntityFilterToQuery(options: {
  filter: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;

  const { comp, sql } = compileSet(knex, filter);
  if (!sql) {
    return comp ? targetQuery : targetQuery.andWhereRaw('1 = 0');
  }
  const matches = knex
    .select(knex.raw('1'))
    .from(knex.raw('? as fset', [sql]))
    // Matches the collation of the entity_id indexes
    .whereRaw('?? collate "default" = ??', ['fset.entity_id', onEntityIdField]);
  return comp
    ? targetQuery.whereNotExists(matches)
    : targetQuery.whereExists(matches);
}

function compileSet(knex: Knex, filter: FilterPredicate): EntitySet {
  assertObjectPredicate(filter);

  if ('$not' in filter) {
    const inner = compileSet(knex, filter.$not);
    return { comp: !inner.comp, sql: inner.sql };
  }
  if ('$any' in filter) {
    const parts = filter.$any.map(f => compileSet(knex, f));
    const plain = parts.filter(p => !p.comp).map(p => p.sql);
    const comps = parts.filter(p => p.comp).map(p => p.sql);
    if (comps.length === 0) {
      return { comp: false, sql: union(knex, plain) };
    }
    // P u (U - C1) u (U - C2) = U - ((C1 n C2) - P)
    return {
      comp: true,
      sql: except(knex, intersect(knex, comps), union(knex, plain)),
    };
  }
  if ('$all' in filter) {
    return combineAll(
      knex,
      filter.$all.map(f => compileSet(knex, f)),
    );
  }
  // A field object is an AND of its single-field conditions
  return combineAll(
    knex,
    Object.entries(filter).map(([key, value]) => {
      // Byte-wise collation makes sorting and deduplicating the IDs cheap
      const sql = knex(`search as ${S}`).select(
        knex.raw('?? collate "C" as entity_id', [`${S}.entity_id`]),
      );
      const present = applyFieldCondition(sql, key.toLowerCase(), value);
      return { comp: !present, sql };
    }),
  );
}

function combineAll(knex: Knex, parts: EntitySet[]): EntitySet {
  const plain = parts.filter(p => !p.comp).map(p => p.sql);
  const comps = parts.filter(p => p.comp).map(p => p.sql);
  if (plain.length === 0) {
    return { comp: true, sql: union(knex, comps) };
  }
  return {
    comp: false,
    sql: except(knex, intersect(knex, plain), union(knex, comps)),
  };
}

function union(knex: Knex, sets: Array<SetSql | null>): SetSql | null {
  const nonEmpty = sets.filter((s): s is SetSql => s !== null);
  if (nonEmpty.length <= 1) {
    return nonEmpty[0] ?? null;
  }
  return knex.raw(`(${nonEmpty.map(() => '?').join(' union ')})`, nonEmpty);
}

function intersect(knex: Knex, sets: Array<SetSql | null>): SetSql | null {
  if (sets.some(s => s === null)) {
    return null;
  }
  if (sets.length === 1) {
    return sets[0];
  }
  return knex.raw(`(${sets.map(() => '?').join(' intersect ')})`, sets);
}

function except(
  knex: Knex,
  from: SetSql | null,
  remove: SetSql | null,
): SetSql | null {
  if (!from || !remove) {
    return from;
  }
  return knex.raw('(? except ?)', [from, remove]);
}
