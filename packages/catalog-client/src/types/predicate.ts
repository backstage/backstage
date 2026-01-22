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

/**
 * A predicate-based filter supporting logical operators.
 *
 * @remarks
 *
 * This provides a more expressive filter syntax compared to the traditional
 * EntityFilterQuery. It supports:
 * - Logical operators: $all (AND), $any (OR), $not (negation)
 * - Value operators: $exists, $in
 * - Direct field matching with primitive values
 *
 * @example
 * ```typescript
 * // Match all service components
 * {
 *   $all: [
 *     { kind: 'component' },
 *     { 'spec.type': 'service' }
 *   ]
 * }
 *
 * // Match components owned by specific teams
 * {
 *   $all: [
 *     { kind: 'component' },
 *     { 'spec.owner': { $in: ['backend-team', 'platform-team'] } }
 *   ]
 * }
 *
 * // Match non-production services
 * {
 *   $all: [
 *     { kind: 'component' },
 *     { 'spec.type': 'service' },
 *     { $not: { 'spec.lifecycle': 'production' } }
 *   ]
 * }
 * ```
 *
 * @public
 */
export type EntityPredicate =
  | EntityPredicateAll
  | EntityPredicateAny
  | EntityPredicateNot
  | boolean
  | number
  | string
  | { [key: string]: EntityPredicateValue };

/**
 * All conditions must match (AND logic).
 *
 * @public
 */
export interface EntityPredicateAll {
  $all: Array<EntityPredicate>;
}

/**
 * At least one condition must match (OR logic).
 *
 * @public
 */
export interface EntityPredicateAny {
  $any: Array<EntityPredicate>;
}

/**
 * Negates the condition.
 *
 * @public
 */
export interface EntityPredicateNot {
  $not: EntityPredicate;
}

/**
 * Value for a field predicate.
 *
 * @public
 */
export type EntityPredicateValue =
  | EntityPredicateExists
  | EntityPredicateIn
  | boolean
  | number
  | string;

/**
 * Check if field exists.
 *
 * @public
 */
export interface EntityPredicateExists {
  $exists: boolean;
}

/**
 * Match any value in array.
 *
 * @public
 */
export interface EntityPredicateIn {
  $in: Array<string | number | boolean>;
}
