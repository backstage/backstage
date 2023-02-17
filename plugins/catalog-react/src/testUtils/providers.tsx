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

import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  EntityListContext,
  EntityListContextProps,
} from '../hooks/useEntityListProvider';
import {
  DefaultEntityFilters,
  EntityFilterContext,
  EntityFilterContextProps,
} from '../hooks/useEntityFilter';
import {
  EntityStreamContext,
  EntityStreamContextProps,
} from '../hooks/useEntityStreamProvider';

/** @public */
export function MockEntityListContextProvider<
  T extends DefaultEntityFilters = DefaultEntityFilters,
>(
  props: PropsWithChildren<{
    value?: Partial<EntityListContextProps<T>>;
  }>,
) {
  const { children, value } = props;

  // Provides a default implementation that stores filter state, for testing components that
  // reflect filter state.
  const [filters, setFilters] = useState<T>(value?.filters ?? ({} as T));

  const updateFilters = useCallback(
    (update: Partial<T> | ((prevFilters: T) => Partial<T>)) => {
      setFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [],
  );

  // Memoize the default values since pickers have useEffect triggers on these; naively defaulting
  // below with `?? <X>` breaks referential equality on subsequent updates.
  const defaultValues = useMemo(
    () => ({
      entities: [],
      backendEntities: [],
      queryParameters: {},
    }),
    [],
  );

  const resolvedValue: EntityListContextProps<T> = useMemo(
    () => ({
      entities: value?.entities ?? defaultValues.entities,
      backendEntities: value?.backendEntities ?? defaultValues.backendEntities,
      updateFilters: value?.updateFilters ?? updateFilters,
      filters,
      loading: value?.loading ?? false,
      queryParameters: value?.queryParameters ?? defaultValues.queryParameters,
      error: value?.error,
    }),
    [value, defaultValues, filters, updateFilters],
  );

  const filterContext: EntityFilterContextProps<T> = useMemo(
    () => ({
      updateFilters: value?.updateFilters ?? updateFilters,
      filters,
      queryParameters: value?.queryParameters ?? defaultValues.queryParameters,
      entityFilter: () => false,
      backendEntityFilter: () => false,
    }),
    [filters, updateFilters, defaultValues, value],
  );

  return (
    <EntityFilterContext.Provider value={filterContext}>
      <EntityListContext.Provider value={resolvedValue}>
        {children}
      </EntityListContext.Provider>
    </EntityFilterContext.Provider>
  );
}

/** @public */
export function MockEntityStreamContextProvider<
  T extends DefaultEntityFilters = DefaultEntityFilters,
>(
  props: PropsWithChildren<{
    value?: Partial<EntityStreamContextProps> &
      Partial<EntityFilterContextProps<T>>;
  }>,
) {
  const { children, value } = props;

  // Provides a default implementation that stores filter state, for testing components that
  // reflect filter state.
  const [filters, setFilters] = useState<T>(value?.filters ?? ({} as T));

  const updateFilters = useCallback(
    (update: Partial<T> | ((prevFilters: T) => Partial<T>)) => {
      setFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [],
  );

  // Memoize the default values since pickers have useEffect triggers on these; naively defaulting
  // below with `?? <X>` breaks referential equality on subsequent updates.
  const defaultValues = useMemo(
    () => ({
      entities: [],
      backendEntities: [],
      queryParameters: {},
    }),
    [],
  );

  const resolvedValue: EntityStreamContextProps = useMemo(
    () => ({
      entities: value?.entities ?? defaultValues.entities,
      backendEntities: value?.backendEntities ?? defaultValues.backendEntities,
      loading: value?.loading ?? false,
      error: value?.error,
      hasMoreData: false,
      count: (value?.entities ?? defaultValues.entities).length,
      getEntities: async () => ({
        hasMoreData: false,
        count: (value?.entities ?? defaultValues.entities).length,
        data: value?.entities ?? defaultValues.entities,
      }),
    }),
    [value, defaultValues],
  );

  const filterContext: EntityFilterContextProps<T> = useMemo(
    () => ({
      updateFilters: value?.updateFilters ?? updateFilters,
      filters,
      queryParameters: value?.queryParameters ?? defaultValues.queryParameters,
      entityFilter: () => false,
      backendEntityFilter: () => false,
    }),
    [filters, updateFilters, defaultValues, value],
  );

  return (
    <EntityFilterContext.Provider value={filterContext}>
      <EntityStreamContext.Provider value={resolvedValue}>
        {children}
      </EntityStreamContext.Provider>
    </EntityFilterContext.Provider>
  );
}
