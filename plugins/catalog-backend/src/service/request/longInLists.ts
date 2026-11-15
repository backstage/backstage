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
 * Background: a list is matched per candidate row by default, with a
 * correlated `EXISTS (... value = ANY(list))`. Each such probe restarts an
 * index scan that sorts the list again, so its cost grows with the list
 * length, and the planner underestimates it badly. With long lists, such as
 * the ownership claims of a user in conditional permission policies, that
 * multiplies into entities times list length and pages can take minutes.
 *
 * On a small page, a probe of a list of `IN_SUBQUERY_MIN_VALUES` values or
 * more therefore hashes the list instead, see `hashedProbeMinValues`, which
 * makes each probe cost about the same whatever the list length. Elsewhere,
 * only lists of `INDIRECT_IN_MIN_VALUES` values or more are hashed: on a deep
 * page or a stream with a shorter list, PostgreSQL can build the matching set
 * once from the index on the values, which beats even the hashed probe (with
 * 40 claims, scenario 13 took 0.43 s that way and 1.1 s with hashed probes).
 *
 * Where even a hashed probe costs more, long lists are matched as a set of
 * entity IDs that is computed once per query, in one of two forms:
 *
 * - JOIN: the set is a derived table, joined with a LEFT JOIN onto the
 *   candidate rows, and the condition becomes `alias.entity_id IS NOT NULL`.
 *   The planner can drive the query from the set, which is fast when the list
 *   decides which entities match, as on the owned entities page. It can also
 *   be anti-joined when negated (scenario 18).
 * - IN: the condition becomes `entity_id IN (SELECT ...)`, a hashed set that
 *   is checked per row. This keeps the candidate rows in their order, so an
 *   ordered and limited page can still stop early, and its cost does not
 *   depend on the planner estimating the size of the set well.
 *
 * Building a set costs time up front, while a per-row probe only costs time
 * for the rows it checks. So sets are used only where the probe is known to
 * cost more, see `chooseLongInForm`:
 *
 * - A list that is a direct condition of the filter, reached from the root
 *   through `$all` only, decides which entities match. It is a set from
 *   `IN_SUBQUERY_MIN_VALUES` values: IN when a sibling condition is narrower,
 *   otherwise JOIN (the owned entities page: 6.6 s became 3.7 s at 174 claims,
 *   3.4 s became 0.35 s at 40).
 * - A list inside an `$any` or a `$not`, such as the claims of a conditional
 *   permission policy, is a set only from `INDIRECT_IN_MIN_VALUES` values, and
 *   never on a page of up to 100 entities, where the hashed probe stops early
 *   (late pages of scenario 20 with 174 claims: 1.7-2.4 s as a set, 0.46 s
 *   probed). It is IN, or JOIN when negated, since only a join can become an
 *   anti-join. With 174 claims this took deep pages of datasets from over
 *   30 s to 5 s and permissioned streams from 40 s to 9 s. Shorter lists, and
 *   JOIN sets in these places, were slower than the probe: a JOIN set whose
 *   size the planner underestimated took scenario 14 with 40 claims from 2.6 s
 *   to 25 s.
 *
 * When changing the thresholds or the rule, re-measure at least scenarios 1,
 * 3, 7, 12, 13, 14, 15, 18, 19, 20 and 21 and the owned entities page of the
 * query battery, with and without permissions and with several claim lists,
 * see `src/tests/performance/query-battery/queries.md`. The shortcuts in
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
 * The number of values at which a list that is not a direct condition of the
 * filter, but sits inside an `$any` or a `$not`, is matched as a set. Shorter
 * such lists keep the per-row probe, whose cost only stands out for very long
 * lists.
 */
export const INDIRECT_IN_MIN_VALUES = 100;

/**
 * The fields whose single values usually match a large share of the catalog,
 * and that therefore do not narrow down a filter much on their own.
 *
 * Broad means few distinct values, not that every entity has the field. For
 * example `metadata.name` is on every entity but is nearly unique, so a list
 * of names narrows a filter well.
 */
const BROAD_FIELDS = new Set([
  'kind',
  'metadata.namespace',
  'spec.type',
  'spec.lifecycle',
]);

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
 * Whether a field value is an `$in` list that is to be matched as a set.
 *
 * Lists on the broad fields are always matched per row. Each of their values
 * matches a large share of the catalog, so a set of them is close to the
 * whole catalog and expensive to build, while the per-row probe stays cheap
 * since such lists are short in practice. Battery scenario 21 excluding 32
 * types on a production-sized catalog took 0.74 s probed per row, 1.1 s as
 * IN and 3.2 s as JOIN for a stream page; the same list on a UI page took
 * 45-87 ms per row and 0.6-1 s in either set form.
 */
export function isLongInList(
  keyAnyCase: string,
  value: FilterPredicateValue,
): boolean {
  return (
    !BROAD_FIELDS.has(keyAnyCase.toLowerCase()) &&
    countInValues(value) >= IN_SUBQUERY_MIN_VALUES
  );
}

/**
 * Identifies a distinct list, so that a list that appears several times in a
 * filter is only joined once. Keys and values are matched case-insensitively,
 * so the ID ignores case and object key order.
 */
export function longInListId(key: string, value: FilterPredicateValue): string {
  return `${key.toLowerCase()}\0${JSON.stringify(normalizeForId(value))}`;
}

function normalizeForId(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeForId);
  }
  if (isObject(value)) {
    return Object.entries(value)
      .map(([k, v]) => [k.toLowerCase(), normalizeForId(v)] as const)
      .sort(([a], [b]) => a.localeCompare(b));
  }
  return value;
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

function countTrue(values: boolean[]): number {
  return values.reduce((count, value) => count + (value ? 1 : 0), 0);
}

/**
 * Where a long `$in` list sits in the filter, as far as choosing its form is
 * concerned.
 */
type LongInContext = {
  /** Whether the list is reached from the root through `$all` only */
  direct: boolean;
  /** Whether the list is inside a `$not` */
  negated: boolean;
  /** Whether a sibling of the list in some `$all` narrows down the result */
  narrowed: boolean;
};

/** How a long `$in` list is matched as a set, see the top of this file */
export type LongInForm = 'join' | 'in';

/**
 * A long `$in` list that is to be matched as a set.
 */
export type LongInList = {
  /** The field expression object that contains the list */
  filter: object;
  /** The field key, as written in the filter */
  keyAnyCase: string;
  value: FilterPredicateValue;
  form: LongInForm;
};

/**
 * The number of values from which a list that is probed per row is matched
 * against a hash of the list rather than as part of the index condition. See
 * the top of this file.
 */
export function hashedProbeMinValues(options: { smallPage: boolean }): number {
  return options.smallPage ? IN_SUBQUERY_MIN_VALUES : INDIRECT_IN_MIN_VALUES;
}

/**
 * The rule that picks how a long `$in` list is matched, or `undefined` to
 * keep the per-row probe. See the top of this file.
 */
function chooseLongInForm(
  context: LongInContext,
  value: FilterPredicateValue,
  smallPage: boolean,
): LongInForm | undefined {
  if (context.direct) {
    return context.narrowed ? 'in' : 'join';
  }
  if (smallPage || countInValues(value) < INDIRECT_IN_MIN_VALUES) {
    return undefined;
  }
  return context.negated ? 'join' : 'in';
}

/**
 * Finds the long `$in` lists of a filter that are to be matched as sets, in
 * the order they appear, with the form of each. All other lists are probed
 * per row.
 */
export function findLongInLists(
  filter: FilterPredicate,
  options?: { smallPage?: boolean },
): LongInList[] {
  const smallPage = Boolean(options?.smallPage);
  const result: LongInList[] = [];

  const visit = (node: unknown, context: LongInContext) => {
    if (!isObject(node)) {
      return;
    }
    if ('$not' in node) {
      visit(node.$not, { ...context, direct: false, negated: true });
      return;
    }
    if ('$any' in node) {
      if (Array.isArray(node.$any)) {
        for (const child of node.$any) {
          visit(child, { ...context, direct: false });
        }
      }
      return;
    }
    if ('$all' in node) {
      if (!Array.isArray(node.$all)) {
        return;
      }
      // Classify each child once, so that asking whether any sibling of a
      // child is narrow is a subtraction rather than a scan of the siblings
      const narrow = node.$all.map(isNarrowFilter);
      const total = countTrue(narrow);
      node.$all.forEach((child, index) => {
        const bySibling = total - (narrow[index] ? 1 : 0) > 0;
        visit(child, {
          ...context,
          narrowed: context.narrowed || bySibling,
        });
      });
      return;
    }

    // A field expression; its other keys act as `$all` siblings of the list
    const entries = Object.entries(node);
    const narrowEntries = entries.map(([k, v]) => isNarrowFilter({ [k]: v }));
    const narrowTotal = countTrue(narrowEntries);
    for (const [index, [keyAnyCase, value]] of entries.entries()) {
      if (!isLongInList(keyAnyCase, value as FilterPredicateValue)) {
        continue;
      }
      const narrowed =
        context.narrowed || narrowTotal - (narrowEntries[index] ? 1 : 0) > 0;
      const form = chooseLongInForm(
        { ...context, narrowed },
        value as FilterPredicateValue,
        smallPage,
      );
      if (form) {
        result.push({
          filter: node,
          keyAnyCase,
          value: value as FilterPredicateValue,
          form,
        });
      }
    }
  };

  visit(filter, { direct: true, negated: false, narrowed: false });
  return result;
}
