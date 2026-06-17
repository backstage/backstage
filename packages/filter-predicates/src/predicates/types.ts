/*
 * Copyright 2025 The Backstage Authors
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

import { JsonValue } from '@backstage/types';

/**
 * Represents future additions to the set of filter predicate operators.
 *
 * @remarks
 *
 * If you write code that explicitly inspects filter predicate expressions, you
 * should be ready for the appearance of such operators and deliberately
 * gracefully fail to match them.
 *
 * @public
 */
export type UnknownFilterPredicateOperator = {
  [KOperator in `$${string}`]: JsonValue;
} & {
  [KOperator in '$all' | '$any' | '$not']: never;
};

/**
 * A filter predicate that can be evaluated against a value.
 *
 * @remarks
 *
 * A predicate is always an object at the root. The most basic use case is to
 * declare keys that are dot-separated paths into a structured data value, and
 * values that all need to match the corresponding property value in the data.
 *
 * The equality test is case-insensitive and numbers are converted to strings,
 * i.e. `"Component"` and `"component"` are considered equal, and so are `7` and
 * `"7"`.
 *
 * Example that matches catalog entity components that are of type `service`:
 *
 * ```json
 * {
 *   "kind": "Component",
 *   "spec.type": "service"
 * }
 * ```
 *
 * The special keys `$all`, `$any`, and `$not` are logical operators that can be
 * used to combine multiple predicates or negate their result. These must be
 * used standalone, i.e. they cannot be combined with other matchers.
 *
 * Example:
 *
 * ```json
 * {
 *   "$all": [
 *     {
 *       "kind": "Component"
 *     },
 *     {
 *       "$any": [{ "spec.type": "service" }, { "spec.type": "website" }]
 *     }
 *   ]
 * }
 * ```
 *
 * Objects with the special keys `$exists`, `$in`, and `$contains` are value
 * operators that can be used to perform more advanced matching against property
 * values than just equality.
 *
 * Example:
 *
 * ```json
 * {
 *   "filter": {
 *     "kind": "Component",
 *     "spec.type": { "$in": ["service", "website"] },
 *     "metadata.annotations.github.com/project-slug": { $exists: true }
 *   }
 * }
 * ```
 *
 * @public
 */
export type FilterPredicate =
  | FilterPredicateExpression
  | FilterPredicatePrimitive
  | {
      /**
       * Asserts that all of the given predicates must be true.
       */
      $all: FilterPredicate[];
    }
  | {
      /**
       * Asserts that at least one of the given predicates must be true.
       */
      $any: FilterPredicate[];
    }
  | {
      /**
       * Asserts that the given predicate must not be true.
       */
      $not: FilterPredicate;
    }
  | UnknownFilterPredicateOperator;

/**
 * A filter predicate expression that matches against one or more object
 * properties.
 *
 * @remarks
 *
 * Each key of a record is a dot-separated path into the entity structure, e.g.
 * `metadata.name`.
 *
 * The values are filter predicates that are evaluated against the value of the
 * property at the given path.
 *
 * For values that are given as primitives, the equality test is
 * case-insensitive and numbers are converted to strings, i.e. `"Component"` and
 * `"component"` are considered equal, and so are `7` and `"7"`.
 *
 * @public
 */
export type FilterPredicateExpression = {
  [KPath in string]: FilterPredicateValue;
} & {
  [KPath in `$${string}`]: never;
};

/**
 * Represents future additions to the set of filter predicate value matchers.
 *
 * @remarks
 *
 * If you write code that explicitly inspects filter predicate expressions, you
 * should be ready for the appearance of such matchers and deliberately
 * gracefully fail to match them.
 *
 * @public
 */
export type UnknownFilterPredicateValueMatcher = {
  [KMatcher in `$${string}`]: JsonValue;
} & {
  [KMatcher in '$exists' | '$in' | '$contains' | '$hasPrefix']: never;
};

/**
 * A filter predicate value that can be used to match against a property value.
 *
 * @public
 */
export type FilterPredicateValue =
  | FilterPredicatePrimitive
  | {
      /**
       * Asserts that the property exists and has any value (`true`) - or not
       * (`false`).
       */
      $exists: boolean;
    }
  | {
      /**
       * Asserts that the property value is any one of the given possible
       * values.
       */
      $in: FilterPredicatePrimitive[];
    }
  | {
      /**
       * Asserts that the property value is an array, and that at least one of
       * its elements matches the given predicate.
       */
      $contains: FilterPredicate;
    }
  | {
      /**
       * Asserts that the property value is string, and that it starts with the given string.
       */
      $hasPrefix: string;
    }
  | UnknownFilterPredicateValueMatcher;

/**
 * A primitive value that can be used in filter predicates.
 *
 * @public
 */
export type FilterPredicatePrimitive = string | number | boolean;
