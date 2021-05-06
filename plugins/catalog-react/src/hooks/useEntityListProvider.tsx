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
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAsyncFn, useDebounce } from 'react-use';
import {
  Control,
  FieldValues,
  useForm,
  UseFormMethods,
  useWatch,
} from 'react-hook-form';
import { useApi } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { reduceCatalogFilters, reduceEntityFilters } from '../utils';
import { catalogApiRef } from '../api';
import {
  EntityFilter,
  FilterEnvironment,
  FilterOptions,
  MapFormToFilters,
} from '../types';
import { useOwnUser } from './useOwnUser';
import { useStarredEntities } from './useStarredEntities';

type EntityListContextProps = {
  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
   */
  backendEntities: Entity[];

  filters: EntityFilter[];

  registerFilter: <T extends FieldValues>(
    options: FilterOptions<T>,
  ) => Pick<UseFormMethods<T>, 'register' | 'control'>;

  loading: boolean;
  error?: Error;
};

const EntityListContext = createContext<EntityListContextProps | undefined>(
  undefined,
);

export type EntityListProviderProps = {
  staticFilters?: EntityFilter[];
  defaultValues?: FieldValues;
};

export const EntityListProvider = ({
  defaultValues,
  staticFilters,
  children,
}: PropsWithChildren<EntityListProviderProps>) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();

  const filterEnv: FilterEnvironment = useMemo(
    () => ({
      user,
      isStarredEntity,
    }),
    [user, isStarredEntity],
  );

  const { register, control, setValue } = useForm({ defaultValues });
  const values = useWatch({ control });

  const [mappers, setMappers] = useState<MapFormToFilters<any>[]>([]);
  const filters: EntityFilter[] = useMemo(
    () =>
      // TODO(timbonicus): store reduced backend filters and deep-compare to avoid re-fetching on frontend filter changes
      mappers
        .map(mapper => mapper(values, filterEnv))
        .concat(staticFilters ?? [])
        .filter(Boolean) as EntityFilter[],
    [mappers, staticFilters, values, filterEnv],
  );

  const [entities, setEntities] = useState<Entity[]>([]);
  const [backendEntities, setBackendEntities] = useState<Entity[]>([]);

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
      reduceEntityFilters(filters),
    );
    setEntities(resolvedEntities);
  }, [backendEntities, filterEnv, filters]);

  function registerFilter<T extends FieldValues>(
    options: FilterOptions<T>,
  ): Pick<UseFormMethods<T>, 'register' | 'control'> {
    setMappers(prevMappers => [...prevMappers, options.mapFormToFilters]);
    if (options.defaultValues) {
      const filterDefaults = options.defaultValues(defaultValues as T);
      for (const [key, value] of Object.entries(filterDefaults)) {
        setValue(key, value);
      }
    }
    return { register, control: control as Control<T> };
  }

  return (
    <EntityListContext.Provider
      value={{
        entities,
        filters,
        backendEntities,
        registerFilter,
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
