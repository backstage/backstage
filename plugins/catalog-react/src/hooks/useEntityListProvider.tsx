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

import { QueryEntitiesResponse } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { compact, isEqual } from 'lodash';
import qs from 'qs';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import useDebounce from 'react-use/esm/useDebounce';
import useMountedState from 'react-use/esm/useMountedState';
import { catalogApiRef } from '../api';
import {
  EntityErrorFilter,
  EntityKindFilter,
  EntityLifecycleFilter,
  EntityNamespaceFilter,
  EntityOrderFilter,
  EntityOrphanFilter,
  EntityOwnerFilter,
  EntityTagFilter,
  EntityTextFilter,
  EntityTypeFilter,
  EntityUserFilter,
  UserListFilter,
} from '../filters';
import { EntityFilter, EntityListPagination } from '../types';
import {
  reduceBackendCatalogFilters,
  reduceCatalogFilters,
  reduceEntityFilters,
} from '../utils/filters';

/** @public */
export type DefaultEntityFilters = {
  kind?: EntityKindFilter;
  type?: EntityTypeFilter;
  user?: UserListFilter | EntityUserFilter;
  owners?: EntityOwnerFilter;
  lifecycles?: EntityLifecycleFilter;
  tags?: EntityTagFilter;
  text?: EntityTextFilter;
  orphan?: EntityOrphanFilter;
  error?: EntityErrorFilter;
  namespace?: EntityNamespaceFilter;
  order?: EntityOrderFilter;
};

/** @public */
export type PaginationMode = 'cursor' | 'offset' | 'none';

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

  /**
   * Filter values from query parameters.
   */
  queryParameters: Partial<Record<keyof EntityFilters, string | string[]>>;

  loading: boolean;
  error?: Error;

  pageInfo?: {
    next?: () => void;
    prev?: () => void;
  };
  totalItems?: number;
  totalItemsLoading: boolean;
  limit: number;
  offset?: number;
  setLimit: (limit: number) => void;
  setOffset?: (offset: number) => void;
  paginationMode: PaginationMode;
};

// This context has support for multiple concurrent versions of this package.
// It is currently used in parallel with the old context in order to provide
// a smooth transition, but will eventually be the only context we use.
export const NewEntityListContext = createVersionedContext<{
  1: EntityListContextProps<any>;
}>('entity-list-context');

/**
 * Creates new context for entity listing and filtering.
 */
export const OldEntityListContext = createContext<
  EntityListContextProps<any> | undefined
>(undefined);

type BackendState = {
  backendEntities: Entity[];
  pageInfo?: QueryEntitiesResponse['pageInfo'];
  totalItems?: number;
};

/**
 * @public
 */
export type EntityListProviderProps = PropsWithChildren<{
  pagination?: EntityListPagination;
}>;

/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export const EntityListProvider = <EntityFilters extends DefaultEntityFilters>(
  props: EntityListProviderProps,
) => {
  const isMounted = useMountedState();
  const catalogApi = useApi(catalogApiRef);
  const [requestedFilters, setRequestedFilters] = useState<EntityFilters>(
    {} as EntityFilters,
  );

  // We use react-router's useLocation hook so updates from external sources trigger an update to
  // the queryParameters in outputState. Updates from this hook use replaceState below and won't
  // trigger a useLocation change; this would instead come from an external source, such as a manual
  // update of the URL or two catalog sidebar links with different catalog filters.
  const location = useLocation();

  let paginationMode: PaginationMode = 'none';
  if (props.pagination === true) {
    paginationMode = 'cursor';
  } else if (typeof props.pagination === 'object') {
    paginationMode = props.pagination.mode ?? 'cursor';
  }
  const paginationLimit =
    typeof props.pagination === 'object' ? props.pagination.limit ?? 20 : 20;

  const {
    queryParameters,
    cursor: initialCursor,
    offset: initialOffset,
    limit: initialLimit,
  } = useMemo(() => {
    const parsed = qs.parse(location.search, {
      ignoreQueryPrefix: true,
      arrayLimit: 10000,
    });

    let limit = paginationLimit;
    if (typeof parsed.limit === 'string') {
      const queryLimit = Number.parseInt(parsed.limit, 10);
      if (!isNaN(queryLimit)) {
        limit = queryLimit;
      }
    }

    const offset =
      typeof parsed.offset === 'string' && paginationMode === 'offset'
        ? Number.parseInt(parsed.offset, 10)
        : undefined;

    return {
      queryParameters: (parsed.filters ?? {}) as Record<
        string,
        string | string[]
      >,
      cursor:
        typeof parsed.cursor === 'string' && paginationMode === 'cursor'
          ? parsed.cursor
          : undefined,
      offset:
        paginationMode === 'offset' && offset && !isNaN(offset)
          ? offset
          : undefined,
      limit,
    };
  }, [paginationMode, location.search, paginationLimit]);

  const [cursor, setCursor] = useState(initialCursor);
  const [offset, setOffset] = useState<number | undefined>(initialOffset);
  const [limit, setLimit] = useState(initialLimit);

  const [backendState, setBackendState] = useState<BackendState>({
    backendEntities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  // Tracks the params of the last API call so identical requests are
  // skipped even when requestedFilters changes (e.g. a label change
  // or a frontend-only filter addition).
  const lastFetchParamsRef = useRef<unknown>(undefined);
  // Generation counter — only the most recent fetch updates state,
  // so out-of-order responses from overlapping requests are discarded.
  const fetchGenRef = useRef(0);

  // Adjusted filters remove the owners filter for user/group kinds,
  // since ownership is not meaningful for those entity types.
  const adjustedFilters = useMemo(() => {
    const kindValue = requestedFilters.kind?.value?.toLocaleLowerCase('en-US');
    return kindValue === 'user' || kindValue === 'group'
      ? { ...requestedFilters, owners: undefined }
      : requestedFilters;
  }, [requestedFilters]);

  const refresh = async () => {
    const compacted = compact(Object.values(adjustedFilters));

    let fetchParams: unknown;
    let doFetch: () => Promise<BackendState>;

    if (paginationMode !== 'none') {
      if (cursor) {
        fetchParams = { cursor, limit };
        doFetch = async () => {
          const response = await catalogApi.queryEntities({
            cursor,
            limit,
            totalItems: 'exclude',
          });
          return {
            backendEntities: response.items,
            pageInfo: response.pageInfo,
          };
        };
      } else {
        const backendFilter = reduceCatalogFilters(compacted);
        fetchParams = { ...backendFilter, limit, offset };
        doFetch = async () => {
          const response = await catalogApi.queryEntities({
            ...backendFilter,
            limit,
            offset,
            totalItems: 'exclude',
          });
          return {
            backendEntities: response.items,
            pageInfo: response.pageInfo,
          };
        };
      }
    } else {
      const backendFilter = reduceBackendCatalogFilters(compacted);
      const { orderFields } = reduceCatalogFilters(compacted);
      fetchParams = { filter: backendFilter, order: orderFields };
      doFetch = async () => {
        const response = await catalogApi.getEntities({
          filter: backendFilter,
          order: orderFields,
        });
        return { backendEntities: response.items };
      };
    }

    // No filters registered yet — wait for filter components to
    // call updateFilters before making the first request.
    // Exception: a cursor in the URL is a self-contained page reference
    // that doesn't need filter state to be valid.
    if (
      compacted.length === 0 &&
      lastFetchParamsRef.current === undefined &&
      !cursor
    ) {
      setLoading(false);
      return;
    }

    if (isEqual(fetchParams, lastFetchParamsRef.current)) {
      return;
    }
    lastFetchParamsRef.current = fetchParams;

    const gen = ++fetchGenRef.current;
    setLoading(true);
    setError(undefined);

    try {
      const result = await doFetch();
      if (gen === fetchGenRef.current) {
        setBackendState(result);
      }
    } catch (e) {
      if (gen === fetchGenRef.current) {
        // Clear the ref so the same params can be retried, and so
        // a response discarded due to a concurrent request (gen mismatch)
        // doesn't permanently block fetching those params again.
        lastFetchParamsRef.current = undefined;
        setError(e as Error);
      }
    } finally {
      if (gen === fetchGenRef.current) {
        setLoading(false);
      }
    }
  };

  // Slight debounce on the refresh, since (especially on page load)
  // several filters will be calling updateFilters in rapid succession.
  useDebounce(refresh, 10, [adjustedFilters, cursor, limit, offset]);

  // Fetch the total count separately, only when filters change. This is
  // decoupled from the main list fetch so that page navigation doesn't
  // re-run the expensive count query, and so that the count can arrive
  // asynchronously without blocking the list response.
  const [{ value: totalItems, loading: totalItemsLoading }, refreshCount] =
    useAsyncFn(async () => {
      if (paginationMode === 'none') {
        return undefined;
      }
      const compacted = compact(Object.values(adjustedFilters));
      if (compacted.length === 0) {
        return undefined;
      }
      const backendFilter = reduceCatalogFilters(compacted);
      try {
        const response = await catalogApi.queryEntities({
          ...backendFilter,
          limit: 0,
        });
        return response.totalItems;
      } catch {
        return undefined;
      }
    }, [catalogApi, paginationMode, adjustedFilters]);

  useDebounce(refreshCount, 10, [adjustedFilters]);

  // Frontend filtering — synchronous, no debounce needed. Updates
  // instantly when requestedFilters or backendEntities change.
  const entities = useMemo(() => {
    const compacted = compact(Object.values(adjustedFilters));
    const entityFilter = reduceEntityFilters(compacted);
    return backendState.backendEntities.filter(entityFilter);
  }, [adjustedFilters, backendState.backendEntities]);

  // Sync filter state to URL query parameters. We use direct history
  // manipulation since useSearchParams and useNavigate in
  // react-router-dom cause unnecessary extra rerenders. Also make sure
  // to replace the state rather than pushing, since we don't want
  // there to be back/forward slots for every single filter change.
  useEffect(() => {
    if (!isMounted() || Object.keys(requestedFilters).length === 0) {
      return;
    }
    const queryParams = Object.keys(requestedFilters).reduce((params, key) => {
      const filter = requestedFilters[key as keyof EntityFilters] as
        | EntityFilter
        | undefined;
      if (filter?.toQueryValue) {
        params[key] = filter.toQueryValue();
      }
      return params;
    }, {} as Record<string, string | string[]>);

    const oldParams = qs.parse(location.search, {
      ignoreQueryPrefix: true,
      arrayLimit: 10000,
    });
    const newParams = qs.stringify(
      {
        ...oldParams,
        filters: queryParams,
        ...(paginationMode === 'none' ? {} : { cursor, limit, offset }),
      },
      { addQueryPrefix: true, arrayFormat: 'repeat' },
    );
    const newUrl = `${window.location.pathname}${newParams}`;
    window.history?.replaceState(null, document.title, newUrl);
  }, [
    cursor,
    isMounted,
    limit,
    location.search,
    offset,
    requestedFilters,
    paginationMode,
  ]);

  const updateFilters = useCallback(
    (
      update:
        | Partial<EntityFilter>
        | ((prevFilters: EntityFilters) => Partial<EntityFilters>),
    ) => {
      // changing filters will affect pagination, so we need to reset
      // the cursor and start from the first page.
      // TODO(vinzscam): this is currently causing issues at page reload
      // where the state is not kept. Unfortunately we need to rethink
      // the way filters work in order to fix this.
      if (paginationMode === 'cursor') {
        setCursor(undefined);
      } else if (paginationMode === 'offset') {
        // Same thing with offset
        setOffset(0);
      }
      setRequestedFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [paginationMode],
  );

  const pageInfo = useMemo(() => {
    if (paginationMode !== 'cursor') {
      return undefined;
    }

    const prevCursor = backendState.pageInfo?.prevCursor;
    const nextCursor = backendState.pageInfo?.nextCursor;
    return {
      prev: prevCursor ? () => setCursor(prevCursor) : undefined,
      next: nextCursor ? () => setCursor(nextCursor) : undefined,
    };
  }, [paginationMode, backendState.pageInfo]);

  const value = useMemo(
    () => ({
      filters: requestedFilters,
      entities,
      backendEntities: backendState.backendEntities,
      updateFilters,
      queryParameters,
      loading,
      error,
      pageInfo,
      totalItems:
        paginationMode === 'none'
          ? entities.length
          : totalItems ?? backendState.totalItems,
      totalItemsLoading: paginationMode !== 'none' && totalItemsLoading,
      limit,
      offset,
      setLimit,
      setOffset,
      paginationMode,
    }),
    [
      requestedFilters,
      entities,
      backendState,
      totalItems,
      totalItemsLoading,
      updateFilters,
      queryParameters,
      loading,
      error,
      pageInfo,
      paginationMode,
      limit,
      offset,
      setLimit,
      setOffset,
    ],
  );

  return (
    <OldEntityListContext.Provider value={value}>
      <NewEntityListContext.Provider
        value={createVersionedValueMap({ 1: value })}
      >
        {props.children}
      </NewEntityListContext.Provider>
    </OldEntityListContext.Provider>
  );
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityListProvider}.
 * @public
 */
export function useEntityList<
  EntityFilters extends DefaultEntityFilters = DefaultEntityFilters,
>(): EntityListContextProps<EntityFilters> {
  const versionedHolder = useVersionedContext<{
    1: EntityListContextProps<any>;
  }>('entity-list-context');
  const oldContext = useContext(OldEntityListContext);

  if (versionedHolder) {
    const value = versionedHolder.atVersion(1);
    if (!value) {
      throw new Error('EntityListContext v1 not available');
    }
    return value;
  }

  if (oldContext) {
    return oldContext;
  }

  throw new Error('useEntityList must be used within EntityListProvider');
}
