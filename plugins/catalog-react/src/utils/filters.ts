/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { EntityFilter } from '../types';
import {
  EntityLifecycleFilter,
  EntityNamespaceFilter,
  EntityOrderFilter,
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTextFilter,
  EntityUserFilter,
  UserListFilter,
} from '../filters';
import {
  convertFilterToPredicate,
  EntityOrderQuery,
} from '@backstage/catalog-client';
import { FilterPredicate } from '@backstage/filter-predicates';

export interface CatalogFilters {
  query?: FilterPredicate;
  fullTextFilter?: {
    term: string;
  };
  orderFields?: EntityOrderQuery;
}

function isEntityTextFilter(t: EntityFilter): t is EntityTextFilter {
  return !!(t as EntityTextFilter).getFullTextFilters;
}

function isEntityOrderFilter(t: EntityFilter): t is EntityOrderFilter {
  return !!(t as EntityOrderFilter).getOrderFilters;
}

/**
 * Combines predicates using `$all`, or returns `undefined` if there are none.
 */
export function combinePredicates(
  predicates: Array<FilterPredicate | undefined>,
): FilterPredicate | undefined {
  const defined = predicates.filter(
    (p): p is FilterPredicate => p !== undefined,
  );
  if (defined.length === 0) {
    return undefined;
  }
  return defined.length === 1 ? defined[0] : { $all: defined };
}

/**
 * Condenses the backend constraints of a set of filters into a single
 * predicate query. Filters that implement `getCatalogQuery` contribute only
 * through that method; others fall back to the deprecated
 * `getCatalogFilters`, which is converted to a predicate.
 */
function reduceBackendQuery(
  filters: EntityFilter[],
): FilterPredicate | undefined {
  const legacyFilter: Record<string, string | symbol | (string | symbol)[]> =
    {};
  const predicates: Array<FilterPredicate | undefined> = [];

  for (const f of filters) {
    if (f.getCatalogQuery) {
      predicates.push(f.getCatalogQuery());
    } else if (f.getCatalogFilters) {
      Object.assign(legacyFilter, f.getCatalogFilters());
    }
  }

  return combinePredicates([
    convertFilterToPredicate(legacyFilter),
    ...predicates,
  ]);
}

export function reduceCatalogFilters(filters: EntityFilter[]): CatalogFilters {
  const query = reduceBackendQuery(filters);

  const fullTextFilter = filters.find(isEntityTextFilter)?.getFullTextFilters();

  const orderFields = filters.find(isEntityOrderFilter)?.getOrderFilters() || [
    {
      field: 'metadata.name',
      order: 'asc',
    },
  ];
  return {
    ...(query !== undefined && { query }),
    fullTextFilter,
    orderFields,
  };
}

/**
 * This function computes and returns the filters to be sent to the backend
 * when not using pagination. Any filter coming from `EntityKindFilter` and
 * `EntityTypeFilter`, together with custom filters set by the adopters, is
 * allowed. The remaining builtin filters are applied frontend-side, so that
 * pickers can compute their available options from the backend response.
 */
export function reduceBackendCatalogFilters(
  filters: EntityFilter[],
): FilterPredicate | undefined {
  return reduceBackendQuery(
    filters.filter(
      filter =>
        !(
          filter instanceof EntityTagFilter ||
          filter instanceof EntityOwnerFilter ||
          filter instanceof EntityLifecycleFilter ||
          filter instanceof EntityNamespaceFilter ||
          filter instanceof EntityUserFilter ||
          filter instanceof EntityOrphanFilter ||
          filter instanceof EntityTextFilter ||
          filter instanceof UserListFilter
        ),
    ),
  );
}

export function reduceEntityFilters(
  filters: EntityFilter[],
): (entity: Entity) => boolean {
  return (entity: Entity) =>
    filters.every(
      filter => !filter.filterEntity || filter.filterEntity(entity),
    );
}
