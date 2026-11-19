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
import { whereInArray } from '../../database/util';
import { searchExists, SEARCH_FLT_ALIAS as S } from './searchSubquery';
import {
  findLongInLists,
  hashedProbeMinValues,
  isLongInList,
  LongInForm,
  longInListId,
} from './longInLists';

function isPrimitive(value: unknown): value is FilterPredicatePrimitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Rejects primitives, and operator objects that are not exactly one of
 * `{ $all: [...] }`, `{ $any: [...] }` or `{ $not: ... }`.
 */
export function assertObjectPredicate(filter: FilterPredicate): void {
  if (!isObject(filter)) {
    const actual = JSON.stringify(filter);
    throw new InputError(
      `Invalid filter predicate: top-level primitive values are not supported. Wrap the value in a field expression, e.g. { "kind": ${actual} }`,
    );
  }

  const entries = Object.entries(filter);
  if (entries.some(([key]) => key.startsWith('$'))) {
    const [[key, value]] = entries;
    const valid =
      entries.length === 1 &&
      (key === '$not' ||
        ((key === '$all' || key === '$any') && Array.isArray(value)));
    if (!valid) {
      throw new InputError(
        `Invalid filter predicate: operators must be a single $all or $any with an array, or $not, but got ${JSON.stringify(
          filter,
        )}`,
      );
    }
  }
}

// Counts the sets joined onto each root query, to keep their aliases unique
const inSetCounts = new WeakMap<Knex.QueryBuilder, number>();

/**
 * The long `$in` lists of a filter that are matched as sets, see
 * `longInLists.ts`.
 */
type InSets = {
  /** The joined set alias per distinct list */
  aliases: Map<string, string>;
  /** The form per key of the field expressions whose lists are sets */
  forms: WeakMap<object, Map<string, LongInForm>>;
  /**
   * The number of values from which a list that is probed per row is hashed,
   * see `hashedProbeMinValues`
   */
  hashFrom: number;
};

const NO_IN_SETS: InSets = {
  aliases: new Map(),
  forms: new WeakMap(),
  hashFrom: hashedProbeMinValues({ smallPage: false }),
};

/**
 * Finds the long `$in` lists of a filter that are matched as sets, and joins
 * one set of entity IDs per distinct list in the JOIN form onto the root
 * query, as a derived table that is joined with a LEFT JOIN onto the
 * candidate rows. This happens up front, since knex compiles the joins before
 * it runs the where clause callbacks.
 */
function joinLongInSets(options: {
  filter: FilterPredicate;
  rootQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
  smallPage: boolean;
}): InSets {
  const { rootQuery, onEntityIdField, knex, smallPage } = options;
  const inSets: InSets = {
    aliases: new Map(),
    forms: new WeakMap(),
    hashFrom: hashedProbeMinValues({ smallPage }),
  };

  for (const { filter, keyAnyCase, value, form } of findLongInLists(
    options.filter,
    { smallPage },
  )) {
    const forms = inSets.forms.get(filter) ?? new Map<string, LongInForm>();
    forms.set(keyAnyCase, form);
    inSets.forms.set(filter, forms);

    const key = keyAnyCase.toLowerCase();
    const id = longInListId(key, value);
    if (form === 'join' && !inSets.aliases.has(id)) {
      const index = (inSetCounts.get(rootQuery) ?? 0) + 1;
      inSetCounts.set(rootQuery, index);
      const alias = `in_set_${index}`;
      const setQuery = knex(`search as ${S}`)
        .distinct(`${S}.entity_id`)
        .whereNotNull(`${S}.entity_id`);
      applyFieldCondition(setQuery, key, value);
      rootQuery.leftJoin(
        setQuery.as(alias),
        `${alias}.entity_id`,
        onEntityIdField,
      );
      inSets.aliases.set(id, alias);
    }
  }

  return inSets;
}

export function applyPredicateEntityFilterToQuery(options: {
  filter: FilterPredicate;
  targetQuery: Knex.QueryBuilder;
  onEntityIdField: string;
  knex: Knex;
  /**
   * The sets for long `$in` lists. Computed by the outermost call and passed
   * along to the nested ones. Only PostgreSQL matches long lists as sets;
   * other databases always match per row.
   */
  inSets?: InSets;
  /**
   * Match long `$in` lists per row even on PostgreSQL. Use when the query is
   * already narrowed to a few rows, where building the sets would only add
   * work.
   */
  matchLongInListsPerRow?: boolean;
  /**
   * Whether the query is a small page, which can stop early. Lists that are
   * not direct conditions of the filter are then probed per row, and even
   * shorter long lists are hashed in those probes, see `longInLists.ts`.
   */
  smallPage?: boolean;
}): Knex.QueryBuilder {
  const { filter, targetQuery, onEntityIdField, knex } = options;
  const inSets =
    options.inSets ??
    (knex.client.config.client === 'pg' && !options.matchLongInListsPerRow
      ? joinLongInSets({
          filter,
          rootQuery: targetQuery,
          onEntityIdField,
          knex,
          smallPage: Boolean(options.smallPage),
        })
      : NO_IN_SETS);

  assertObjectPredicate(filter);

  if ('$not' in filter) {
    return targetQuery.andWhereNot(inner =>
      applyPredicateEntityFilterToQuery({
        filter: filter.$not,
        targetQuery: inner,
        onEntityIdField,
        knex,
        inSets,
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
            inSets,
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
            inSets,
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
      const alias =
        isLongInList(keyAnyCase, value) &&
        inSets.aliases.get(longInListId(keyAnyCase.toLowerCase(), value));
      if (alias) {
        // A long list whose set of entity IDs was joined onto the candidate
        // rows up front, see `joinLongInSets`. A list that is joined for one
        // condition reuses that set wherever else it appears, which costs
        // nothing more.
        inner.whereNotNull(`${alias}.entity_id`);
        continue;
      }
      if (inSets.forms.get(filter)?.get(keyAnyCase) === 'in') {
        // A long list in the IN form: an uncorrelated set that is computed
        // once per query and hashed, instead of probing the list once per
        // candidate row. See `longInLists.ts` for when each form is used.
        const subquery = knex(`search as ${S}`)
          .select(`${S}.entity_id`)
          .whereNotNull(`${S}.entity_id`);
        applyFieldCondition(subquery, keyAnyCase.toLowerCase(), value);
        inner.whereIn(onEntityIdField, subquery);
        continue;
      }
      const subquery = searchExists(knex, onEntityIdField);
      if (
        applyFieldCondition(
          subquery,
          keyAnyCase.toLowerCase(),
          value,
          inSets.hashFrom,
        )
      ) {
        inner.whereExists(subquery);
      } else {
        inner.whereNotExists(subquery);
      }
    }
  });
}

/**
 * Applies a single { key: value } filter to a query on the search table,
 * aliased as `SEARCH_FLT_ALIAS`. Returns false if the matching entities are
 * those without such rows.
 */
export function applyFieldCondition(
  searchQuery: Knex.QueryBuilder,
  key: string,
  value: FilterPredicateValue,
  hashFrom: number = Infinity,
): boolean {
  if (isPrimitive(value)) {
    searchQuery
      .where(`${S}.key`, key)
      .where(`${S}.value`, String(value).toLowerCase());
    return true;
  }

  if (isObject(value)) {
    if ('$exists' in value) {
      searchQuery.where(`${S}.key`, key);
      return Boolean(value.$exists);
    }

    if ('$in' in value) {
      const values = value.$in.map(v => String(v).toLowerCase());
      searchQuery.where(`${S}.key`, key);
      whereValueIn(searchQuery, values, hashFrom);
      return true;
    }

    if ('$hasPrefix' in value) {
      const prefix = value.$hasPrefix.toLowerCase();
      const escaped = prefix.replace(/[%_\\]/g, c => `\\${c}`);
      searchQuery
        .where(`${S}.key`, key)
        .andWhereRaw('?? like ? escape ?', [`${S}.value`, `${escaped}%`, '\\']);
      return true;
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
        searchQuery
          .where(`${S}.key`, key)
          .where(`${S}.value`, String(target).toLowerCase());
        return true;
      }

      // Object form of $contains - currently only supports relation-style
      // objects with "type" and optional "targetRef" keys.
      //
      // FROM: `{ "relations": { "$contains": { "type": "ownedBy", "targetRef": "group:default/team-a" } } }`
      //
      // TO:   search for key = "relations.ownedby" AND value = "group:default/team-a"
      if (isObject(target)) {
        if (key === 'relations') {
          applyContainsRelation(searchQuery, target, hashFrom);
          return true;
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
function applyContainsRelation(
  searchQuery: Knex.QueryBuilder,
  rawTarget: Record<string, unknown>,
  hashFrom: number = Infinity,
): void {
  function parseStringOrIn(value: unknown): string[] {
    if (typeof value === 'string') {
      return [value.toLowerCase()];
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
      return value.$in.map(v => v.toLowerCase());
    }
    const actual = JSON.stringify(value);
    throw new InputError(
      `Unsupported value in $contains for "relations": expected a string or { "$in": [strings] }, but got ${actual}`,
    );
  }

  let type: string | undefined;
  let targetRef: string[] | undefined;

  for (const [rawKey, value] of Object.entries(rawTarget)) {
    const key = rawKey.toLowerCase();

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

  searchQuery.where(`${S}.key`, `relations.${type.toLowerCase()}`);

  if (targetRef) {
    whereValueIn(searchQuery, targetRef, hashFrom);
  }
}

/**
 * Matches the value of the search rows against a list.
 *
 * A list of at least `hashFrom` values is matched in a form that only applies
 * to a per-row probe, that is a correlated subquery on the search table. As an
 * index condition, `value = ANY(list)` makes each probe sort the list again,
 * which costs about 0.4 ms for 100 values and multiplies by the number of
 * candidate rows. Comparing an expression instead keeps the list out of the
 * index condition, so the probe looks up the rows of the entity by key and
 * checks their values against a hash of the list that PostgreSQL builds once
 * per query.
 *
 * The `OFFSET 0` keeps PostgreSQL from turning the probe into an uncorrelated
 * hashed set of entity IDs, which it may do for an `EXISTS` inside an `OR`.
 * Such a set could not use the index on the values, and would read every row
 * of the key instead.
 */
function whereValueIn(
  searchQuery: Knex.QueryBuilder,
  values: string[],
  hashFrom: number,
) {
  const client = (searchQuery as any).client;
  if (values.length >= hashFrom && client.config.client === 'pg') {
    searchQuery
      .whereRaw("(?? || '') = ANY(?::text[])", [`${S}.value`, values])
      .offset(client.raw('0'));
  } else {
    searchQuery.where(whereInArray(`${S}.value`, values));
  }
}
