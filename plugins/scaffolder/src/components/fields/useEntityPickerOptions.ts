/*
 * Copyright 2026 The Backstage Authors
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

import { EntityFilterQuery } from '@backstage/catalog-client';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityPresentationApiRef,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { LoadingState } from '@backstage/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';

const ENTITY_PICKER_SEARCH_FIELDS = [
  'metadata.name',
  'kind',
  'spec.profile.displayName',
  'metadata.title',
];

type EntityPickerOptionsState = {
  entities: Entity[];
  selectedEntities: Entity[];
  /** References covered by the latest successful selected-entity lookup. */
  resolvedSelectedEntityRefs: string[];
  entityRefToPresentation: Map<string, EntityRefPresentationSnapshot>;
  loading: boolean;
  loadingState: LoadingState;
  searchText: string;
  setSearchText: (value: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  loadMoreError: boolean;
  retry: () => void;
  initialResultIsOnlyOption: boolean;
};

export function useEntityPickerOptions(options: {
  catalogFilter?: EntityFilterQuery;
  enabled?: boolean;
  selectedEntityRefs: string[];
}): EntityPickerOptionsState {
  const { catalogFilter, enabled = true } = options;
  const catalogApi = useApi(catalogApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const [searchText, setSearchTextState] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<{
    generation?: number;
    entities: Entity[];
    entityRefToPresentation: Map<string, EntityRefPresentationSnapshot>;
    nextCursor?: string;
    loadMoreError?: boolean;
    loadingState: LoadingState;
    initialResultIsOnlyOption: boolean;
  }>({
    entities: [],
    entityRefToPresentation: new Map(),
    loadingState: enabled ? 'loading' : 'idle',
    initialResultIsOnlyOption: false,
  });
  const [selectedState, setSelectedState] = useState<{
    entities: Entity[];
    resolvedRefs?: string[];
    entityRefToPresentation: Map<string, EntityRefPresentationSnapshot>;
  }>({ entities: [], entityRefToPresentation: new Map() });
  const requestGeneration = useRef(0);
  const selectedRequestGeneration = useRef(0);
  const searchTextRef = useRef('');
  const nextLoadMoreRequest = useRef(0);
  const activeLoadMoreRequest = useRef<number>();

  const presentEntities = useCallback(
    async (entities: Entity[]) =>
      new Map<string, EntityRefPresentationSnapshot>(
        await Promise.all(
          entities.map(
            async entity =>
              [
                stringifyEntityRef(entity),
                await entityPresentationApi.forEntity(entity).promise,
              ] as const,
          ),
        ),
      ),
    [entityPresentationApi],
  );

  const setSearchText = useCallback((value: string) => {
    searchTextRef.current = value;
    setSearchTextState(value);
  }, []);

  useDebounce(() => setDebouncedSearchText(searchText), 250, [searchText]);

  useEffect(() => {
    const generation = ++requestGeneration.current;
    activeLoadMoreRequest.current = undefined;
    if (!enabled) {
      setState({
        entities: [],
        entityRefToPresentation: new Map(),
        loadingState: 'idle',
        initialResultIsOnlyOption: false,
      });
      return;
    }

    setState(previous => ({
      ...previous,
      loadingState: debouncedSearchText ? 'filtering' : 'loading',
      loadMoreError: false,
    }));

    catalogApi
      .queryEntities({
        ...(catalogFilter ? { filter: catalogFilter } : {}),
        ...(debouncedSearchText
          ? {
              fullTextFilter: {
                term: debouncedSearchText,
                fields: ENTITY_PICKER_SEARCH_FIELDS,
              },
            }
          : {}),
        limit: 20,
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      })
      .then(async response => {
        const entityRefToPresentation = await presentEntities(response.items);

        if (generation === requestGeneration.current) {
          setState({
            generation,
            entities: response.items,
            entityRefToPresentation,
            nextCursor: response.pageInfo.nextCursor,
            loadingState: 'idle',
            initialResultIsOnlyOption:
              debouncedSearchText === '' &&
              response.items.length === 1 &&
              !response.pageInfo.nextCursor,
          });
        }
      })
      .catch(() => {
        if (generation === requestGeneration.current) {
          setState(previous => ({ ...previous, loadingState: 'error' }));
        }
      });
  }, [
    catalogApi,
    catalogFilter,
    debouncedSearchText,
    enabled,
    presentEntities,
    retryCount,
  ]);

  const loadMore = useCallback(() => {
    if (
      !enabled ||
      debouncedSearchText !== searchTextRef.current ||
      state.generation !== requestGeneration.current ||
      !state.nextCursor ||
      state.loadingState !== 'idle' ||
      activeLoadMoreRequest.current !== undefined
    ) {
      return;
    }

    const generation = requestGeneration.current;
    const cursor = state.nextCursor;
    const loadMoreRequest = ++nextLoadMoreRequest.current;
    activeLoadMoreRequest.current = loadMoreRequest;
    setState(previous => ({
      ...previous,
      loadingState: 'loadingMore',
      loadMoreError: false,
    }));
    catalogApi
      .queryEntities({
        cursor,
        limit: 20,
      })
      .then(async response => {
        const presentations = await presentEntities(response.items);
        if (activeLoadMoreRequest.current !== loadMoreRequest) {
          return;
        }
        activeLoadMoreRequest.current = undefined;
        if (generation === requestGeneration.current) {
          setState(previous => ({
            ...previous,
            entities: [...previous.entities, ...response.items],
            entityRefToPresentation: new Map([
              ...previous.entityRefToPresentation,
              ...presentations,
            ]),
            nextCursor: response.pageInfo.nextCursor,
            loadingState: 'idle',
          }));
        }
      })
      .catch(() => {
        if (activeLoadMoreRequest.current !== loadMoreRequest) {
          return;
        }
        activeLoadMoreRequest.current = undefined;
        if (generation === requestGeneration.current) {
          setState(previous => ({
            ...previous,
            loadingState: 'idle',
            loadMoreError: true,
          }));
        }
      });
  }, [
    catalogApi,
    debouncedSearchText,
    enabled,
    presentEntities,
    state.generation,
    state.loadingState,
    state.nextCursor,
  ]);

  const selectedEntityRefsKey = JSON.stringify(options.selectedEntityRefs);
  useEffect(() => {
    const generation = ++selectedRequestGeneration.current;
    const entityRefs = JSON.parse(selectedEntityRefsKey) as string[];
    if (!enabled || entityRefs.length === 0) {
      setSelectedState({
        entities: [],
        entityRefToPresentation: new Map(),
      });
      return;
    }

    setSelectedState(previous => ({ ...previous, resolvedRefs: undefined }));

    catalogApi
      .getEntitiesByRefs({ entityRefs })
      .then(async response => {
        const entities = response.items.filter(
          (item): item is Entity => item !== undefined,
        );
        const entityRefToPresentation = await presentEntities(entities);
        if (generation === selectedRequestGeneration.current) {
          setSelectedState({
            entities,
            entityRefToPresentation,
            resolvedRefs: entityRefs,
          });
        }
      })
      .catch(() => {
        if (generation === selectedRequestGeneration.current) {
          setSelectedState({
            entities: [],
            entityRefToPresentation: new Map(),
          });
        }
      });
  }, [catalogApi, enabled, presentEntities, selectedEntityRefsKey]);

  const entityRefToPresentation = useMemo(
    () =>
      new Map([
        ...state.entityRefToPresentation,
        ...selectedState.entityRefToPresentation,
      ]),
    [selectedState.entityRefToPresentation, state.entityRefToPresentation],
  );

  // Input can change and return to the active query before the debounce fires.
  // Keep that query's result (including errors) independently of the input.
  const loadingState =
    enabled && searchText !== debouncedSearchText
      ? 'filtering'
      : state.loadingState;

  return {
    entities: state.entities,
    selectedEntities: selectedState.entities,
    resolvedSelectedEntityRefs: selectedState.resolvedRefs ?? [],
    entityRefToPresentation,
    loading: loadingState !== 'idle' && loadingState !== 'error',
    loadingState,
    searchText,
    setSearchText,
    loadMore,
    hasMore: Boolean(state.nextCursor),
    loadMoreError: Boolean(state.loadMoreError),
    retry: () => setRetryCount(count => count + 1),
    initialResultIsOnlyOption:
      loadingState === 'idle' && !searchText && state.initialResultIsOnlyOption,
  };
}
