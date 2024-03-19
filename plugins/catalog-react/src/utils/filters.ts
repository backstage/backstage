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
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTextFilter,
  EntityUserFilter,
  UserListFilter,
} from '../filters';

export interface CatalogFilters {
  filter: Record<string, string | symbol | (string | symbol)[]>;
  fullTextFilter?: {
    term: string;
  };
}

function isEntityTextFilter(t: EntityFilter): t is EntityTextFilter {
  return !!(t as EntityTextFilter).getFullTextFilters;
}

export function reduceCatalogFilters(filters: EntityFilter[]): CatalogFilters {
  const condensedFilters = filters.reduce<CatalogFilters['filter']>(
    (compoundFilter, filter) => {
      return {
        ...compoundFilter,
        ...(filter.getCatalogFilters ? filter.getCatalogFilters() : {}),
      };
    },
    {},
  );

  const fullTextFilter = filters.find(isEntityTextFilter)?.getFullTextFilters();
  return { filter: condensedFilters, fullTextFilter };
}

/**
 * This function computes and returns an object containing the filters to be sent
 * to the backend. Any filter coming from `EntityKindFilter` and `EntityTypeFilter`, together
 * with custom filter set by the adopters is allowed. This function is used by `EntityListProvider`
 * and it won't be needed anymore in the future once pagination is implemented, as all the filters
 * will be applied backend-side.
 */
export function reduceBackendCatalogFilters(filters: EntityFilter[]) {
  const backendCatalogFilters: Record<
    string,
    string | symbol | (string | symbol)[]
  > = {};

  filters.forEach(filter => {
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
      return;
    }
    Object.assign(backendCatalogFilters, filter.getCatalogFilters?.() || {});
  });

  return backendCatalogFilters;
}

export function reduceEntityFilters(
  filters: EntityFilter[],
): (entity: Entity) => boolean {
  return (entity: Entity) =>
    filters.every(
      filter => !filter.filterEntity || filter.filterEntity(entity),
    );
}
