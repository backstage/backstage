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
import qs from 'qs';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import useMountedState from 'react-use/lib/useMountedState';
import {
  EntityErrorFilter,
  EntityKindFilter,
  EntityLifecycleFilter,
  EntityNamespaceFilter,
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTextFilter,
  EntityTypeFilter,
  UserListFilter,
} from '../filters';
import { EntityFilter } from '../types';
import { reduceEntityFilters } from '../utils';

/** @public */
export type DefaultEntityFilters = {
  kind?: EntityKindFilter;
  type?: EntityTypeFilter;
  user?: UserListFilter;
  owners?: EntityOwnerFilter;
  lifecycles?: EntityLifecycleFilter;
  tags?: EntityTagFilter;
  text?: EntityTextFilter;
  orphan?: EntityOrphanFilter;
  error?: EntityErrorFilter;
  namespace?: EntityNamespaceFilter;
};

/** @public */
export type EntityFilterContextProps<
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

  entityFilter: (entity: Entity) => boolean;

  backendEntityFilter: (entity: Entity) => boolean;
};

/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export const EntityFilterContext = createContext<
  EntityFilterContextProps<any> | undefined
>(undefined);

/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export const EntityFilterProvider = <
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
>({
  children,
}: PropsWithChildren<{}>) => {
  const isMounted = useMountedState();
  const [requestedFilters, setRequestedFilters] = useState<EntityFilters>(
    {} as EntityFilters,
  );

  // We use react-router's useLocation hook so updates from external sources trigger an update to
  // the queryParameters in outputState. Updates from this hook use replaceState below and won't
  // trigger a useLocation change; this would instead come from an external source, such as a manual
  // update of the URL or two catalog sidebar links with different catalog filters.
  const location = useLocation();
  const queryParameters = useMemo(
    () =>
      (qs.parse(location.search, {
        ignoreQueryPrefix: true,
      }).filters ?? {}) as Record<string, string | string[]>,
    [location],
  );

  const entityFilter = useMemo(() => {
    const compacted = compact(Object.values(requestedFilters));
    return reduceEntityFilters(compacted);
  }, [requestedFilters]);

  const backendEntityFilter = useMemo(() => {
    const compacted = compact(
      Object.values(requestedFilters).filter(
        (value: EntityFilter) => !!value?.getCatalogFilters,
      ),
    );
    return reduceEntityFilters(compacted);
  }, [requestedFilters]);

  useEffect(() => {
    if (isMounted()) {
      const queryParams = Object.keys(requestedFilters).reduce(
        (params, key) => {
          const filter = requestedFilters[key as keyof EntityFilters] as
            | EntityFilter
            | undefined;
          if (filter?.toQueryValue) {
            params[key] = filter.toQueryValue();
          }
          return params;
        },
        {} as Record<string, string | string[]>,
      );
      const newParams = qs.stringify(
        { ...queryParameters, filters: queryParams },
        { addQueryPrefix: true, arrayFormat: 'repeat' },
      );
      const newUrl = `${window.location.pathname}${newParams}`;
      // We use direct history manipulation since useSearchParams and
      // useNavigate in react-router-dom cause unnecessary extra rerenders.
      // Also make sure to replace the state rather than pushing, since we
      // don't want there to be back/forward slots for every single filter
      // change.
      window.history?.replaceState(null, document.title, newUrl);
    }
  }, [isMounted, queryParameters, requestedFilters]);

  const updateFilters = useCallback(
    (
      update:
        | Partial<EntityFilter>
        | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
    ) => {
      setRequestedFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        if (!isEqual({ ...prevFilters, ...newFilters }, prevFilters)) {
          return { ...prevFilters, ...newFilters };
        }
        return prevFilters;
      });
    },
    [],
  );

  const value = useMemo(() => {
    return {
      filters: requestedFilters,
      updateFilters,
      entityFilter,
      backendEntityFilter,
      queryParameters,
    };
  }, [
    updateFilters,
    queryParameters,
    requestedFilters,
    entityFilter,
    backendEntityFilter,
  ]);

  return (
    <EntityFilterContext.Provider value={value}>
      {children}
    </EntityFilterContext.Provider>
  );
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityFilterProvider}.
 * @public
 */
export function useEntityFilter<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
>(): EntityFilterContextProps<EntityFilters> {
  const context = useContext(EntityFilterContext);
  if (!context)
    throw new Error('useEntityFilter must be used within EntityFilterProvider');
  return context;
}
