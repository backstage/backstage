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
  useMemo,
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
  FilterEnvironment,
  UserListFilter,
} from '../types';
import { useOwnUser } from './useOwnUser';
import { useStarredEntities } from './useStarredEntities';
import { compact } from 'lodash';

export type DefaultEntityFilters = {
  kind?: EntityKindFilter;
  type?: EntityTypeFilter;
  user?: UserListFilter;
  tags?: EntityTagFilter;
};

type EntityListContextProps<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters
> = {
  /**
   * The list of currently registered filters. This includes filters passed in as defaults, plus
   * any added with `setFilter`.
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
   * TODO(timbonicush) fix docs
   */
  updateFilters: (filters: Partial<EntityFilters>) => void;

  loading: boolean;
  error?: Error;
};

const EntityListContext = createContext<
  EntityListContextProps<any> | undefined
>(undefined);

export type EntityListProviderProps<
  EntityFilters extends DefaultEntityFilters
> = {
  initialFilters?: EntityFilters;
};

export const EntityListProvider = <EntityFilters extends DefaultEntityFilters>({
  initialFilters,
  children,
}: PropsWithChildren<EntityListProviderProps<EntityFilters>>) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();

  const [filters, setFilters] = useState<EntityFilters>(
    initialFilters ?? ({} as EntityFilters),
  );
  // TODO(timbonicus): store reduced backend filters and deep-compare to avoid re-fetching on frontend filter changes

  const [entities, setEntities] = useState<Entity[]>([]);
  const [backendEntities, setBackendEntities] = useState<Entity[]>([]);

  const filterEnv: FilterEnvironment = useMemo(
    () => ({
      user,
      isStarredEntity,
    }),
    [user, isStarredEntity],
  );

  const [{ loading, error }, refresh] = useAsyncFn(async () => {
    // TODO(timbonicus): should limit fields here, but would need filter fields + table columns
    const items = await catalogApi
      .getEntities({
        filter: reduceCatalogFilters(compact(Object.values(filters))),
      })
      .then(response => response.items);
    setBackendEntities(items);
  }, [filters, catalogApi]);

  // Slight debounce on the catalog-backend call, to prevent eager refresh on multiple programmatic
  // filter changes.
  useDebounce(refresh, 10, [filters]);

  // Apply frontend filters
  useEffect(() => {
    const resolvedEntities = (backendEntities ?? []).filter(
      reduceEntityFilters(compact(Object.values(filters)), filterEnv),
    );
    setEntities(resolvedEntities);
  }, [backendEntities, filterEnv, filters]);

  const updateFilters = useCallback(
    (patch: Partial<EntityFilter>) =>
      setFilters(prevFilters => ({ ...prevFilters, ...patch })),
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
