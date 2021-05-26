/*
 * Copyright 2020 Spotify AB
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

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAsyncFn, useDebounce } from 'react-use';
import { useApi } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { reduceCatalogFilters, reduceEntityFilters } from '../utils';
import { catalogApiRef } from '../api';
import {
  EntityFilter,
  EntityKindFilter,
  EntityTagFilter,
  EntityTypeFilter,
  UserListFilter,
} from '../types';
import { compact, isEqual } from 'lodash';

export type DefaultEntityFilters = {
  kind?: EntityKindFilter;
  type?: EntityTypeFilter;
  user?: UserListFilter;
  tags?: EntityTagFilter;
};

export type EntityListContextProps<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters
> = {
  /**
   * The currently registered filters, adhering to the shape of DefaultEntityFilters or an extension
   * of that default (to add custom filter types).
   */
  filters: EntityFilters;

  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
   */
  backendEntities: Entity[];

  /**
   * Update one or more of the registered filters. Optional filters can be set to `undefined` to
   * reset the filter.
   */
  updateFilters: (
    filters:
      | Partial<EntityFilters>
      | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
  ) => void;

  loading: boolean;
  error?: Error;
};

export const EntityListContext = createContext<
  EntityListContextProps<any> | undefined
>(undefined);

export const EntityListProvider = <EntityFilters extends DefaultEntityFilters>({
  children,
}: PropsWithChildren<{}>) => {
  const catalogApi = useApi(catalogApiRef);

  const [filters, setFilters] = useState<EntityFilters>({} as EntityFilters);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [backendEntities, setBackendEntities] = useState<Entity[]>([]);

  // Store resolved catalog-backend filters and deep compare on filter updates, to avoid refetching
  // when only frontend filters change
  const [backendFilters, setBackendFilters] = useState<
    Record<string, string | string[]>
  >(reduceCatalogFilters(compact(Object.values(filters))));

  useEffect(() => {
    const newBackendFilters = reduceCatalogFilters(
      compact(Object.values(filters)),
    );
    if (!isEqual(newBackendFilters, backendFilters)) {
      setBackendFilters(newBackendFilters);
    }
  }, [backendFilters, filters]);

  const [{ loading, error }, refresh] = useAsyncFn(async () => {
    // TODO(timbonicus): should limit fields here, but would need filter fields + table columns
    const items = await catalogApi
      .getEntities({
        filter: backendFilters,
      })
      .then(response => response.items);
    setBackendEntities(items);
  }, [backendFilters, catalogApi]);

  // Slight debounce on the catalog-backend call, to prevent eager refresh on multiple programmatic
  // filter changes.
  useDebounce(refresh, 10, [backendFilters]);

  // Apply frontend filters
  useEffect(() => {
    const resolvedEntities = (backendEntities ?? []).filter(
      reduceEntityFilters(compact(Object.values(filters))),
    );
    setEntities(resolvedEntities);
  }, [backendEntities, filters]);

  const updateFilters = useCallback(
    (
      update:
        | Partial<EntityFilter>
        | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
    ) => {
      if (typeof update === 'function') {
        setFilters(prevFilters => ({ ...prevFilters, ...update(prevFilters) }));
      } else {
        setFilters(prevFilters => ({ ...prevFilters, ...update }));
      }
    },
    [],
  );

  return (
    <EntityListContext.Provider
      value={{
        filters,
        entities,
        backendEntities,
        updateFilters,
        loading,
        error,
      }}
    >
      {children}
    </EntityListContext.Provider>
  );
};

export function useEntityListProvider<
  EntityFilters extends DefaultEntityFilters
>(): EntityListContextProps<EntityFilters> {
  const context = useContext(EntityListContext);
  if (!context)
    throw new Error(
      'useEntityListProvider must be used within EntityListProvider',
    );
  return context;
}
