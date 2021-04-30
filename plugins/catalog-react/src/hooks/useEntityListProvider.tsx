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
import { EntityFilter, FilterEnvironment } from '../types';
import { useOwnUser } from './useOwnUser';
import { useStarredEntities } from './useStarredEntities';

type EntityListContextProps = {
  /**
   * The list of currently registered filters. This includes filters passed in as defaults, plus
   * any added with `setFilter`.
   */
  filters: EntityFilter[];

  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
   */
  backendEntities: Entity[];

  /**
   * Add a filter for the entity list. Overwrites any existing filter with the same id.
   */
  addFilter: (filter: EntityFilter) => void;

  /**
   * Remove a filter by id. Does nothing if the filter has not been added.
   */
  removeFilter: (id: string) => void;

  loading: boolean;
  error?: Error;
};

const EntityListContext = createContext<EntityListContextProps | undefined>(
  undefined,
);

export type EntityListProviderProps = {
  initialFilter?: EntityFilter;
  initialFilters?: EntityFilter[];
};

export const EntityListProvider = ({
  initialFilter,
  initialFilters,
  children,
}: PropsWithChildren<EntityListProviderProps>) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();

  // Join initial filters from either prop and filter out undefined
  const resolvedInitialFilters = [initialFilter, initialFilters]
    .flat()
    .filter(Boolean) as EntityFilter[];
  const [filters, setFilters] = useState<EntityFilter[]>(
    resolvedInitialFilters,
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
      .getEntities({ filter: reduceCatalogFilters(filters) })
      .then(response => response.items);
    setBackendEntities(items);
  }, [filters, catalogApi]);

  // Slight debounce on the catalog-backend call, to prevent eager refresh on multiple programmatic
  // filter changes.
  useDebounce(refresh, 10, [filters]);

  // Apply frontend filters
  useEffect(() => {
    const resolvedEntities = (backendEntities ?? []).filter(
      reduceEntityFilters(filters, filterEnv),
    );
    setEntities(resolvedEntities);
  }, [backendEntities, filterEnv, filters]);

  const addFilter = useCallback(
    (filter: EntityFilter) =>
      setFilters(prevFilters => [
        ...prevFilters.filter(f => f.id !== filter.id),
        filter,
      ]),
    [],
  );

  const removeFilter = useCallback(
    (id: string) =>
      setFilters(prevFilters => prevFilters.filter(f => f.id !== id)),
    [],
  );

  return (
    <EntityListContext.Provider
      value={{
        filters,
        entities,
        backendEntities,
        addFilter: addFilter,
        removeFilter: removeFilter,
        loading,
        error,
      }}
    >
      {children}
    </EntityListContext.Provider>
  );
};

export function useEntityListProvider(): EntityListContextProps {
  const context = useContext(EntityListContext);
  if (!context)
    throw new Error(
      'useEntityListProvider must be used within EntityListProvider',
    );
  return context;
}
