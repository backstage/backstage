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
  DefaultEntityFilters,
  EntityListContext,
  EntityListContextProps,
} from '../hooks/useEntityListProvider';

/** @public */
export const MockEntityListContextProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value?: Partial<EntityListContextProps>;
}>) => {
  // Provides a default implementation that stores filter state, for testing components that
  // reflect filter state.
  const [filters, setFilters] = useState<DefaultEntityFilters>(
    value?.filters ?? {},
  );

  const updateFilters = useCallback(
    (
      update:
        | Partial<DefaultEntityFilters>
        | ((
            prevFilters: DefaultEntityFilters,
          ) => Partial<DefaultEntityFilters>),
    ) => {
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

  const resolvedValue: EntityListContextProps = useMemo(
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

  return (
    <EntityListContext.Provider value={resolvedValue}>
      {children}
    </EntityListContext.Provider>
  );
};
