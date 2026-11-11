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
 * Pairs of extension data that a deferred plugin stub can recreate, keyed by
 * the ID of a data ref whose value is a filter function, with the ID of the
 * data ref that holds the filter predicate the function was created from.
 *
 * @remarks
 *
 * A function can't be stored in a build-time manifest. When an extension
 * outputs both data refs of a pair, the manifest stores the predicate, and
 * the stub outputs a function that is created from it with
 * `filterPredicateToFilterFunction` from `@backstage/filter-predicates`. The
 * extension that outputs the pair must create the function the same way.
 *
 * Only the pairs listed here are recreated. Any other function output
 * prevents a plugin from being deferred, unless the extension is moved to the
 * sync entry point of the plugin package.
 */
export const PREDICATE_FUNCTION_DATA_PAIRS: ReadonlyMap<string, string> =
  new Map([
    // From the entity blueprints in @backstage/plugin-catalog-react
    ['catalog.entity-filter-function', 'catalog.entity-filter-predicate'],
  ]);
