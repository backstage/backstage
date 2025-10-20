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
  EntityOrderQuery,
  EntityFilterSet,
  EntityFilterSets,
  EntityFilterQuery,
} from '@backstage/catalog-client';

export interface CatalogFilters {
  filter: EntityFilterQuery;
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
 * Partition EntityFilter catalog filters into two groups: those that return multiple filter sets, and those that return
 * a single filter set.
 *
 * For those that return a single filter set, merge them all into one
 */
function partitionFilterSets(
  filters: EntityFilter[],
): [EntityFilterSet, EntityFilterSets[]] {
  return filters
    .map(filter => (filter.getCatalogFilters ? filter.getCatalogFilters() : {}))
    .reduce<[EntityFilterSet, EntityFilterSets[]]>(
      ([filterSet, filterSets], filterQuery) => {
        if (Array.isArray(filterQuery)) {
          return [filterSet, [...filterSets, filterQuery]];
        }

        return [{ ...filterSet, ...filterQuery }, filterSets];
      },
      [{}, []],
    );
}

/**
 * Merge a matrix of filter sets into an array of filter sets.
 */
function mergeFilterSets(
  initialFilterSet: EntityFilterSet,
  filterSetsArray: EntityFilterSets[],
): EntityFilterSets {
  return filterSetsArray.reduce(
    (filterSets, currentFilterSets) => {
      return filterSets
        .map(filterSet => {
          return currentFilterSets.map(currentFilterSet => {
            return { ...filterSet, ...currentFilterSet };
          });
        })
        .flat();
    },
    [initialFilterSet],
  );
}

export function reduceCatalogFilters(filters: EntityFilter[]): CatalogFilters {
  const fullTextFilter = filters.find(isEntityTextFilter)?.getFullTextFilters();

  const orderFields = filters.find(isEntityOrderFilter)?.getOrderFilters() || [
    {
      field: 'metadata.name',
      order: 'asc',
    },
  ];

  const [entityFilterSet, entityFilterSets] = partitionFilterSets(filters);

  // None of the EntityFilters returned multiple filter sets, return the merged single filter set.
  if (entityFilterSets.length === 0) {
    return { filter: entityFilterSet, fullTextFilter, orderFields };
  }

  return {
    filter: mergeFilterSets(entityFilterSet, entityFilterSets),
    fullTextFilter,
    orderFields,
  };
}

/**
 * This function computes and returns an object containing the filters to be sent
 * to the backend. Any filter coming from `EntityKindFilter` and `EntityTypeFilter`, together
 * with custom filter set by the adopters is allowed. This function is used by `EntityListProvider`
 * and it won't be needed anymore in the future once pagination is implemented, as all the filters
 * will be applied backend-side.
 */
export function reduceBackendCatalogFilters(filters: EntityFilter[]) {
  const filteredFilters = filters.filter(filter => {
    if (
      filter instanceof EntityTagFilter ||
      filter instanceof EntityOwnerFilter ||
      filter instanceof EntityLifecycleFilter ||
      filter instanceof EntityNamespaceFilter ||
      filter instanceof EntityUserFilter ||
      filter instanceof EntityOrphanFilter ||
      filter instanceof EntityTextFilter ||
      filter instanceof UserListFilter
    ) {
      return false;
    }
    return true;
  });

  const [entityFilterSet, entityFilterSets] =
    partitionFilterSets(filteredFilters);

  // None of the EntityFilters returned multiple filter sets, return the merged single filter set.
  if (entityFilterSets.length === 0) {
    return entityFilterSet;
  }

  return mergeFilterSets(entityFilterSet, entityFilterSets);
}

export function reduceEntityFilters(
  filters: EntityFilter[],
): (entity: Entity) => boolean {
  return (entity: Entity) =>
    filters.every(
      filter => !filter.filterEntity || filter.filterEntity(entity),
    );
}
