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

import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
} from './extensionData';
import {
  FilterPredicate,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { Entity } from '@backstage/catalog-model';
import { AppNode } from '@backstage/frontend-plugin-api';

export function* resolveEntityFilterData(
  filter: ((entity: Entity) => boolean) | FilterPredicate | string | undefined,
  config: { filter?: FilterPredicate | string },
  node: AppNode,
) {
  if (typeof config.filter === 'string') {
    // eslint-disable-next-line no-console
    console.warn(
      `DEPRECATION WARNING: Using a string-based filter in the configuration for '${node.spec.id}' is deprecated. Use an entity predicate object instead.`,
    );
    yield entityFilterExpressionDataRef(config.filter);
  } else if (config.filter) {
    yield entityFilterFunctionDataRef(
      filterPredicateToFilterFunction(config.filter),
    );
  } else if (typeof filter === 'function') {
    yield entityFilterFunctionDataRef(filter);
  } else if (typeof filter === 'string') {
    // eslint-disable-next-line no-console
    console.warn(
      `DEPRECATION WARNING: Using a string as the default filter for '${node.spec.id}' is deprecated. Use an entity predicate object instead.`,
    );
    yield entityFilterExpressionDataRef(filter);
  } else if (filter) {
    yield entityFilterFunctionDataRef(filterPredicateToFilterFunction(filter));
  }
}
