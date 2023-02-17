/*
 * Copyright 2020 The Backstage Authors
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
import { compact, isEqual } from 'lodash';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { catalogApiRef } from '../api';
import { reduceCatalogFilters } from '../utils';
import { useApi } from '@backstage/core-plugin-api';
import {
  DefaultEntityFilters,
  EntityFilterContext,
  EntityFilterProvider,
  useEntityFilter,
} from './useEntityFilter';

/** @public */
export type EntityListContextProps<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
> = {
  /**
   * The currently registered filters, adhering to the shape of DefaultEntityFilters or an extension
   * of that default (to add custom filter types).
   */
  filters: EntityFilters;

  /**
   * Update one or more of the registered filters. Optional filters can be set to `undefined` to
   * reset the filter.
   */
  updateFilters: (
    filters:
      | Partial<EntityFilters>
      | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
  ) => void;

  /**
   * Filter values from query parameters.
   */
  queryParameters: Partial<Record<keyof EntityFilters, string | string[]>>;

  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
   */
  backendEntities: Entity[];

  loading: boolean;
  error?: Error;
};

/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export const EntityListContext = createContext<
  EntityListContextProps<any> | undefined
>(undefined);

type OutputState<EntityFilters extends DefaultEntityFilters> = {
  appliedFilters: EntityFilters;
  entities: Entity[];
  backendEntities: Entity[];
};

/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export const EntityListProvider = <
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
>({
  children,
}: PropsWithChildren<{}>) => {
  const {
    entityFilter,
    filters: requestedFilters,
    updateFilters,
    queryParameters,
  } = useEntityFilter<EntityFilters>();
  const catalogApi = useApi(catalogApiRef);

  const [outputState, setOutputState] = useState<OutputState<EntityFilters>>(
    () => {
      return {
        appliedFilters: {} as EntityFilters,
        entities: [],
        backendEntities: [],
      };
    },
  );

  // The main async filter worker. Note that while it has a lot of dependencies
  // in terms of its implementation, the triggering only happens (debounced)
  // based on the requested filters changing.
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      const compacted = compact(Object.values(requestedFilters));
      const backendFilter = reduceCatalogFilters(compacted);
      const previousBackendFilter = reduceCatalogFilters(
        compact(Object.values(outputState.appliedFilters)),
      );

      // TODO(mtlewis): currently entities will never be requested unless
      // there's at least one filter, we should allow an initial request
      // to happen with no filters.
      if (!isEqual(previousBackendFilter, backendFilter)) {
        // TODO(timbonicus): should limit fields here, but would need filter
        // fields + table columns
        const response = await catalogApi.getEntities({
          filter: backendFilter,
        });
        setOutputState({
          appliedFilters: requestedFilters,
          backendEntities: response.items,
          entities: response.items.filter(entityFilter),
        });
      } else {
        setOutputState({
          appliedFilters: requestedFilters,
          backendEntities: outputState.backendEntities,
          entities: outputState.backendEntities.filter(entityFilter),
        });
      }
    },
    [catalogApi, queryParameters, requestedFilters, outputState],
    { loading: true },
  );

  // Slight debounce on the refresh, since (especially on page load) several
  // filters will be calling this in rapid succession.
  useDebounce(refresh, 10, [requestedFilters]);

  const value = useMemo(
    () => ({
      filters: outputState.appliedFilters,
      entities: outputState.entities,
      backendEntities: outputState.backendEntities,
      updateFilters,
      queryParameters,
      loading,
      error,
    }),
    [outputState, updateFilters, queryParameters, loading, error],
  );

  return (
    <EntityFilterProvider>
      <EntityListContext.Provider value={value}>
        {children}
      </EntityListContext.Provider>
    </EntityFilterProvider>
  );
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityListProvider}.
 * @public
 */
export function useEntityList<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
>(): EntityListContextProps<EntityFilters> {
  const context = useContext(EntityListContext);
  const filterContext = useContext(EntityFilterContext);
  if (!context || !filterContext)
    throw new Error(
      'useEntityList must be used within EntityListProvider and EntityFilterProvider',
    );
  return context;
}
