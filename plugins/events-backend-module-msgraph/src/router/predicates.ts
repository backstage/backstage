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

import type { Change } from './types';

/**
 * A predicate function that tests a Change.
 * @internal
 */
export type Predicate = (change: Change) => boolean;

/**
 * A factory function that creates a Predicate with the given parameters.
 * @internal
 */
export type PredicateFactory<P extends unknown[] = unknown[]> = (
  ...params: P
) => Predicate;

/**
 * Creates a predicate that matches changes of the given type.
 * @param changeType - The change type to match, e.g. 'created', 'updated', 'deleted'.
 * @returns A predicate that matches changes of the given type.
 * @internal
 */
export const changeTypeIs: PredicateFactory<[string]> =
  (changeType: string) => (change: Change) =>
    change.changeType.toLowerCase() === changeType.toLowerCase();

/**
 * Creates a predicate that matches changes of the given resource type.
 * @param resourceType - The resource type to match, e.g. 'users', 'groups'.
 * @returns A predicate that matches changes of the given resource type.
 * @internal
 */
export const resourceTypeIs: PredicateFactory<[string]> =
  (resourceType: string) => (change: Change) =>
    change.resourceType.toLowerCase() === resourceType.toLowerCase();

/**
 * Creates a predicate that matches if all given predicates match.
 * @param predicates - The predicates to combine with logical AND.
 * @returns A predicate that matches if all given predicates match.
 * @internal
 */
export const and: PredicateFactory<[...Predicate[]]> =
  (...predicates: Predicate[]) =>
  (change: Change) =>
    predicates.every(p => p(change));

/**
 * Creates a predicate that matches if any of the given predicates match.
 * @param predicates - The predicates to combine with logical OR.
 * @returns A predicate that matches if any of the given predicates match.
 * @internal
 */
export const or: PredicateFactory<[...Predicate[]]> =
  (...predicates: Predicate[]) =>
  (change: Change) =>
    predicates.some(p => p(change));
