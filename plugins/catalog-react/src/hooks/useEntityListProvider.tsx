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
import {
  EntityFilter,
  EntityListPagination,
  TextFilterFieldsConfig,
} from '../types';
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
  limit: number;
  offset?: number;
  setLimit: (limit: number) => void;
  setOffset?: (offset: number) => void;
  paginationMode: PaginationMode;

  textFilterFields?: TextFilterFieldsConfig;
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

type OutputState<EntityFilters extends DefaultEntityFilters> = {
  appliedFilters: EntityFilters;
  appliedCursor?: string;
  entities: Entity[];
  backendEntities: Entity[];
  pageInfo?: QueryEntitiesResponse['pageInfo'];
  totalItems?: number;
  offset?: number;
  limit?: number;
};

/**
 * @public
 */
export type EntityListProviderProps = PropsWithChildren<{
  pagination?: EntityListPagination;
  textFilterFields?: TextFilterFieldsConfig;
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

  const getPaginationMode = (): PaginationMode => {
    if (props.pagination === true) {
      return 'cursor';
    }
    return typeof props.pagination === 'object'
      ? props.pagination.mode ?? 'cursor'
      : 'none';
  };

  const paginationMode = getPaginationMode();
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

  const [outputState, setOutputState] = useState<OutputState<EntityFilters>>(
    () => {
      return {
        appliedFilters: {} as EntityFilters,
        entities: [],
        backendEntities: [],
        pageInfo: {},
        offset,
        limit,
      };
    },
  );

  // The main async filter worker. Note that while it has a lot of dependencies
  // in terms of its implementation, the triggering only happens (debounced)
  // based on the requested filters changing.
  const [{ value: resolvedValue, loading, error }, refresh] = useAsyncFn(
    async () => {
      const kindValue =
        requestedFilters.kind?.value?.toLocaleLowerCase('en-US');
      const adjustedFilters =
        kindValue === 'user' || kindValue === 'group'
          ? { ...requestedFilters, owners: undefined }
          : requestedFilters;
      const compacted = compact(Object.values(adjustedFilters));
      const entityFilter = reduceEntityFilters(compacted);

      if (paginationMode !== 'none') {
        if (cursor) {
          if (cursor !== outputState.appliedCursor) {
            const response = await catalogApi.queryEntities({
              cursor,
              limit,
            });
            return {
              appliedFilters: requestedFilters,
              appliedCursor: cursor,
              backendEntities: response.items,
              entities: response.items.filter(entityFilter),
              pageInfo: response.pageInfo,
              totalItems: response.totalItems,
            };
          }
          const entities = outputState.backendEntities.filter(entityFilter);
          return {
            appliedFilters: requestedFilters,
            appliedCursor: outputState.appliedCursor,
            backendEntities: outputState.backendEntities,
            entities,
            pageInfo: outputState.pageInfo,
            totalItems: outputState.totalItems,
            limit: outputState.limit,
            offset: outputState.offset,
          };
        }

        const backendFilter = reduceCatalogFilters(compacted);
        const previousBackendFilter = reduceCatalogFilters(
          compact(Object.values(outputState.appliedFilters)),
        );

        if (
          (paginationMode === 'offset' &&
            (outputState.limit !== limit || outputState.offset !== offset)) ||
          !isEqual(previousBackendFilter, backendFilter)
        ) {
          const response = await catalogApi.queryEntities({
            ...backendFilter,
            limit,
            offset,
          });
          return {
            appliedFilters: requestedFilters,
            backendEntities: response.items,
            entities: response.items.filter(entityFilter),
            pageInfo: response.pageInfo,
            totalItems: response.totalItems,
            limit,
            offset,
          };
        }
        const entities = outputState.backendEntities.filter(entityFilter);
        return {
          appliedFilters: requestedFilters,
          backendEntities: outputState.backendEntities,
          entities,
          pageInfo: outputState.pageInfo,
          totalItems: outputState.totalItems,
          limit: outputState.limit,
          offset: outputState.offset,
        };
      }

      const backendFilter = reduceBackendCatalogFilters(compacted);
      const { orderFields } = reduceCatalogFilters(compacted);
      const previousBackendFilter = reduceBackendCatalogFilters(
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
          order: orderFields,
        });
        const entities = response.items.filter(entityFilter);
        return {
          appliedFilters: requestedFilters,
          backendEntities: response.items,
          entities,
          totalItems: entities.length,
        };
      }
      const entities = outputState.backendEntities.filter(entityFilter);
      return {
        appliedFilters: requestedFilters,
        backendEntities: outputState.backendEntities,
        entities,
        totalItems: entities.length,
      };
    },
    [
      catalogApi,
      queryParameters,
      requestedFilters,
      outputState,
      cursor,
      paginationMode,
      limit,
      offset,
    ],
    { loading: true },
  );

  // Slight debounce on the refresh, since (especially on page load) several
  // filters will be calling this in rapid succession.
  useDebounce(refresh, 10, [requestedFilters, cursor, limit, offset]);

  useEffect(() => {
    if (resolvedValue === undefined) {
      return;
    }
    setOutputState(resolvedValue);
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
      // We use direct history manipulation since useSearchParams and
      // useNavigate in react-router-dom cause unnecessary extra rerenders.
      // Also make sure to replace the state rather than pushing, since we
      // don't want there to be back/forward slots for every single filter
      // change.
      window.history?.replaceState(null, document.title, newUrl);
    }
  }, [
    cursor,
    isMounted,
    limit,
    location.search,
    offset,
    requestedFilters,
    resolvedValue,
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

    const prevCursor = outputState.pageInfo?.prevCursor;
    const nextCursor = outputState.pageInfo?.nextCursor;
    return {
      prev: prevCursor ? () => setCursor(prevCursor) : undefined,
      next: nextCursor ? () => setCursor(nextCursor) : undefined,
    };
  }, [paginationMode, outputState.pageInfo]);

  const value = useMemo(
    () => ({
      filters: outputState.appliedFilters,
      entities: outputState.entities,
      backendEntities: outputState.backendEntities,
      updateFilters,
      queryParameters,
      loading,
      error,
      pageInfo,
      totalItems: outputState.totalItems,
      limit,
      offset,
      setLimit,
      setOffset,
      paginationMode,
      textFilterFields: props.textFilterFields,
    }),
    [
      outputState,
      updateFilters,
      queryParameters,
      loading,
      error,
      pageInfo,
      limit,
      offset,
      paginationMode,
      setLimit,
      setOffset,
      props.textFilterFields,
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
