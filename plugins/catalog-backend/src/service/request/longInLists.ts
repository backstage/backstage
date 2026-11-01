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

/*
 * Decides how long `$in` lists in a filter are matched on PostgreSQL. This
 * module only inspects the filter; the SQL is emitted by
 * `applyPredicateEntityFilterToQuery`.
 *
 * Background: a short list is matched per candidate row, with a correlated
 * `EXISTS (... value = ANY(list))`. Each such probe restarts an index scan
 * that sorts the list again, so its cost grows with the list length, and the
 * planner underestimates it badly. With long lists, such as the ownership
 * claims of a user in conditional permission policies, that multiplies into
 * entities times list length and pages can take minutes.
 *
 * Long lists are therefore matched as a set of entity IDs that is computed
 * once per query, in one of two forms:
 *
 * - JOIN: the set is a derived table that is LEFT JOINed onto the candidate
 *   rows, and the condition becomes `alias.entity_id IS NOT NULL`. The planner
 *   can drive the query from the set, which is fast when the list decides
 *   which entities match (the owned entities page, late pages of a small kind
 *   such as battery scenario 20 for groups). It can also be anti-joined when
 *   negated (scenario 18).
 * - IN: the condition becomes `entity_id IN (SELECT ...)`, a hashed set that
 *   is checked per row. This keeps the candidate rows in their order, so an
 *   ordered and limited page can still stop early. That matters when another
 *   condition is more selective than the list (scenario 12) or when the list
 *   is an alternative to a broad condition (scenario 19); the JOIN form makes
 *   the planner join and sort the whole catalog there.
 *
 * Neither form is best everywhere, so the choice is made per list from the
 * shape of the filter alone, see `chooseLongInForm`. When changing the
 * threshold or the rule, re-measure at least scenarios 12, 13, 14, 18, 19, 20
 * and 21 and the owned entities page of the query battery, with and without
 * permissions and with several claim lists, see
 * `src/tests/performance/query-battery/queries.md`. The shortcuts in
 * `slim-profile.md` next to it depend on both, and are invalid for such a
 * change.
 *
 * Facets and counts with a disjunction or a negation do not use this; they
 * compile the whole filter into set operations, see
 * `applySetEntityFilterToQuery`.
 */

import {
  FilterPredicate,
  FilterPredicatePrimitive,
  FilterPredicateValue,
} from '@backstage/filter-predicates';

/**
 * The number of values in an `$in` list at which, on PostgreSQL, the
 * condition is matched as a set computed once per query rather than per row.
 * Shorter lists produce exactly the same SQL as before sets were introduced.
 */
export const IN_SUBQUERY_MIN_VALUES = 10;

/**
 * The fields whose single values usually match a large share of the catalog,
 * and that therefore do not narrow down a filter much on their own.
 */
const BROAD_FIELDS = new Set(['kind', 'spec.type', 'spec.lifecycle']);

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
 * Returns the number of values in an `$in` list for a field value, including
 * relation `targetRef` lists, or 0 if the value is not such a list.
 */
export function countInValues(value: FilterPredicateValue): number {
  if (!isObject(value)) {
    return 0;
  }
  if ('$in' in value && Array.isArray(value.$in)) {
    return value.$in.length;
  }
  if ('$contains' in value && isObject(value.$contains)) {
    const targetRef = Object.entries(value.$contains).find(
      ([k]) => k.toLowerCase() === 'targetref',
    )?.[1];
    if (isObject(targetRef) && Array.isArray(targetRef.$in)) {
      return targetRef.$in.length;
    }
  }
  return 0;
}

/**
 * Whether a field value is an `$in` list long enough to be matched as a set.
 */
export function isLongInList(value: FilterPredicateValue): boolean {
  return countInValues(value) >= IN_SUBQUERY_MIN_VALUES;
}

/**
 * Identifies a distinct list, so that a list that appears several times in a
 * filter is only joined once.
 */
export function longInListId(key: string, value: FilterPredicateValue): string {
  return `${key}\0${JSON.stringify(value)}`;
}

/**
 * Whether a filter only matches entities that have one of a few specific
 * values in a field that is not one of the broad ones.
 */
function isNarrowFilter(filter: unknown): boolean {
  if (!isObject(filter) || '$not' in filter) {
    return false;
  }
  if ('$all' in filter) {
    return Array.isArray(filter.$all) && filter.$all.some(isNarrowFilter);
  }
  if ('$any' in filter) {
    return (
      Array.isArray(filter.$any) &&
      filter.$any.length > 0 &&
      filter.$any.every(isNarrowFilter)
    );
  }
  return Object.entries(filter).some(([keyAnyCase, value]) => {
    const key = keyAnyCase.toLowerCase();
    if (isPrimitive(value)) {
      return !BROAD_FIELDS.has(key);
    }
    if (!isObject(value)) {
      return false;
    }
    if ('$in' in value && Array.isArray(value.$in)) {
      return (
        !BROAD_FIELDS.has(key) && value.$in.length < IN_SUBQUERY_MIN_VALUES
      );
    }
    if ('$contains' in value && isObject(value.$contains)) {
      const targetRef = Object.entries(value.$contains).find(
        ([k]) => k.toLowerCase() === 'targetref',
      )?.[1];
      return (
        typeof targetRef === 'string' ||
        (isObject(targetRef) &&
          countInValues(value as FilterPredicateValue) < IN_SUBQUERY_MIN_VALUES)
      );
    }
    return false;
  });
}

/**
 * Whether a filter can match entities through a condition other than a long
 * `$in` list or the absence of a field.
 */
function isBroadFilter(filter: unknown): boolean {
  if (!isObject(filter) || '$not' in filter) {
    return false;
  }
  if ('$all' in filter || '$any' in filter) {
    const list = '$all' in filter ? filter.$all : filter.$any;
    return Array.isArray(list) && list.some(isBroadFilter);
  }
  return Object.values(filter).some(
    value =>
      !isLongInList(value as FilterPredicateValue) &&
      !(isObject(value) && '$exists' in value && !value.$exists),
  );
}

/**
 * Where a long `$in` list sits in the filter, as far as choosing its form is
 * concerned.
 */
type LongInContext = {
  /** Whether the list is inside a `$not` */
  negated: boolean;
  /** Whether a sibling of the list in some `$all` narrows down the result */
  narrowed: boolean;
  /** Whether a sibling of the list in some `$any` matches broadly */
  alternated: boolean;
};

/**
 * The rule that picks the form of a long `$in` list, see the top of this file.
 *
 * - Inside a `$not`: always JOIN. A negated `IN` set can not be planned as an
 *   anti-join, and was rescanned once per row instead (scenario 18 with a
 *   claim that owns a large share of the catalog: 40 ms became 5.9 s).
 * - Next to a narrow condition in an `$all`: IN. The other condition already
 *   picks few entities, and joining the whole set first is wasted work
 *   (scenario 12 with a large claim list: 2.4 s as IN, 36 s as JOIN).
 * - Next to a broad condition in an `$any`: IN. Most entities match the broad
 *   branch, so a page can stop early while walking in order (scenario 19:
 *   about 10 ms as IN, 2.5 s as JOIN).
 * - Otherwise: JOIN (the owned entities page: 1.7-3 s became 13-177 ms;
 *   scenario 20 for groups: 22.7 s became 0.35 s).
 */
function chooseLongInForm(context: LongInContext): 'join' | 'in' {
  if (context.negated) {
    return 'join';
  }
  if (context.narrowed || context.alternated) {
    return 'in';
  }
  return 'join';
}

/**
 * A long `$in` list that is to be matched in the JOIN form.
 */
export type JoinedLongInList = {
  /** The field expression object that contains the list */
  filter: object;
  /** The field key, as written in the filter */
  keyAnyCase: string;
  value: FilterPredicateValue;
};

/**
 * Finds the long `$in` lists of a filter that are to be matched in the JOIN
 * form, in the order they appear. All other long lists use the IN form.
 */
export function findJoinedLongInLists(
  filter: FilterPredicate,
): JoinedLongInList[] {
  const result: JoinedLongInList[] = [];

  const visit = (node: unknown, context: LongInContext) => {
    if (!isObject(node)) {
      return;
    }
    if ('$not' in node) {
      visit(node.$not, { ...context, negated: true });
      return;
    }
    if ('$all' in node || '$any' in node) {
      const isAll = '$all' in node;
      const list = isAll ? node.$all : node.$any;
      if (!Array.isArray(list)) {
        return;
      }
      list.forEach((child, index) => {
        const siblings = list.filter((_, i) => i !== index);
        visit(
          child,
          isAll
            ? {
                ...context,
                narrowed: context.narrowed || siblings.some(isNarrowFilter),
              }
            : {
                ...context,
                alternated: context.alternated || siblings.some(isBroadFilter),
              },
        );
      });
      return;
    }

    // A field expression; its other keys act as `$all` siblings of the list
    const entries = Object.entries(node);
    for (const [keyAnyCase, value] of entries) {
      if (!isLongInList(value as FilterPredicateValue)) {
        continue;
      }
      const narrowed =
        context.narrowed ||
        entries.some(
          ([k, v]) => k !== keyAnyCase && isNarrowFilter({ [k]: v }),
        );
      if (chooseLongInForm({ ...context, narrowed }) === 'join') {
        result.push({
          filter: node,
          keyAnyCase,
          value: value as FilterPredicateValue,
        });
      }
    }
  };

  visit(filter, { negated: false, narrowed: false, alternated: false });
  return result;
}
