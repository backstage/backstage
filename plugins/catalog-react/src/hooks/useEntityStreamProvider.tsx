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
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { catalogApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { DefaultEntityFilters, useEntityFilter } from './useEntityFilter';
import { reduceCatalogFilters } from '../utils';
import { EntityOrderQuery } from '@backstage/catalog-client';

/**
 * @public
 */
export interface EntityPageOptions {
  to: number;
  from: number;
  search: {
    term: string;
    fields: string[];
  };
  sortBy?: EntityOrderQuery;
}

interface PageableEntityFilters {
  search: EntityPageOptions['search'];
  sortBy?: EntityPageOptions['sortBy'];
}

/** @public */
export type EntityStreamContextProps = {
  /**
   * The resolved list of catalog entities, after all filters are applied.
   */
  entities: Entity[];

  /**
   * Corollary to `useEntityListProvider`'s `backendEntities`.
   * Contains the resolved list of catalog entities as you would expect from the backend
   *  request that we're not making.
   */
  backendEntities: Entity[];

  loading: boolean;
  error?: Error;

  hasMoreData: boolean;

  getEntities: (pageConfig: EntityPageOptions) => Promise<{
    data: Entity[];
    hasMoreData: boolean;
    count: number;
  } | null>;

  count: number;
};

/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export const EntityStreamContext = createContext<
  EntityStreamContextProps | undefined
>(undefined);

/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export const EntityStreamProvider = <
  EntityFilters extends DefaultEntityFilters,
>({
  children,
}: PropsWithChildren<{}>) => {
  const catalogApi = useApi(catalogApiRef);
  const { entityFilter, filters } = useEntityFilter<EntityFilters>();
  const [limit] = useState(2);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [after, setAfter] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [appliedFilters, setAppliedFilters] = useState<EntityFilters>(
    {} as EntityFilters,
  );
  const [appliedPageFilters, setAppliedPageFilters] =
    useState<PageableEntityFilters>({} as PageableEntityFilters);

  const getEntities = useCallback(
    async ({ to, from, search, sortBy }: EntityPageOptions) => {
      try {
        setLoading(true);

        const countToRetrieve = to - from;

        let _after = after;
        let internalEntities = entities;

        const compacted = compact(Object.values(filters));
        const backendFilter = reduceCatalogFilters(compacted);
        const previousBackendFilter = reduceCatalogFilters(
          compact(Object.values(appliedFilters)),
        );
        if (
          !isEqual(backendFilter, previousBackendFilter) ||
          !isEqual(appliedPageFilters, { search, sortBy })
        ) {
          _after = '';
          internalEntities = [];
        }
        const rows = internalEntities.filter(entityFilter).slice(from, to);

        while (rows.length < countToRetrieve && _after !== undefined) {
          const cursorObj = _after
            ? {
                cursor: _after,
              }
            : {
                fullTextFilter: search,
                orderFields: sortBy ?? undefined,
              };
          const response = await catalogApi.queryEntities({
            filter: backendFilter,
            limit,
            ...cursorObj,
          });
          internalEntities = internalEntities.concat(response.items);
          _after = response.pageInfo.nextCursor;

          const newRows = internalEntities
            .filter(entityFilter)
            .slice(rows.length + from, to);
          rows.push(...newRows);
        }
        setAfter(_after);
        setEntities(internalEntities);

        setLoading(false);
        setAppliedFilters(filters);
        setAppliedPageFilters({ search, sortBy });

        return {
          data: rows,
          hasMoreData: !!_after,
          count: internalEntities.filter(entityFilter).length,
        };
      } catch (err) {
        setError(err);
        return null;
      }
    },
    [
      catalogApi,
      entities,
      entityFilter,
      limit,
      after,
      filters,
      appliedFilters,
      appliedPageFilters,
    ],
  );

  const value = useMemo(() => {
    const filteredEntities = entities.filter(entityFilter);
    return {
      entities: filteredEntities,
      backendEntities: entities,
      loading,
      error,
      getEntities,
      hasMoreData: !!after,
      count: filteredEntities.length,
    };
  }, [loading, error, after, getEntities, entities, entityFilter]);

  return (
    <EntityStreamContext.Provider value={value}>
      {children}
    </EntityStreamContext.Provider>
  );
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityStreamProvider}.
 * @public
 */
export function useEntityStream(): EntityStreamContextProps {
  const context = useContext(EntityStreamContext);
  if (!context)
    throw new Error('useEntityStream must be used within EntityStreamProvider');
  return context;
}
