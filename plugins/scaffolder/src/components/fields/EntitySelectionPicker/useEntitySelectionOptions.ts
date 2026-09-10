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
} from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { entityRefCandidates } from './entityRefCandidates';
import {
  EntitySelectionOption,
  referenceLabel,
} from './entitySelectionOptions';

type Snapshot = {
  search: string;
  rows: EntitySelectionOption[];
  cursor?: string;
};

/** Publish a complete search result, never a mixture of independent lookups. */
export function useEntitySelectionOptions(props: {
  catalogFilter?: EntityFilterQuery;
  defaultKind?: string;
  defaultNamespace?: string;
  allowMissingEntities: boolean;
  selectedEntityRefs: string[];
}) {
  const catalogApi = useApi(catalogApiRef);
  const presentationApi = useApi(entityPresentationApiRef);
  const { catalogFilter } = props;
  const [input, setInput] = useState({ text: '', revision: 0 });
  const searchText = input.text;
  const inputRef = useRef('');
  const [retryCount, setRetryCount] = useState(0);
  const generation = useRef(0);
  const paging = useRef(false);
  const [state, setState] = useState<{
    requestKey?: string;
    generation?: number;
    snapshot: Snapshot;
    status: 'loading' | 'idle' | 'error' | 'loadingMore';
    loadMoreError: boolean;
  }>({
    snapshot: { search: '', rows: [] },
    status: 'loading',
    loadMoreError: false,
  });
  const [selectedOptions, setSelectedOptions] = useState<
    EntitySelectionOption[]
  >([]);
  const refs = props.allowMissingEntities
    ? entityRefCandidates(searchText, props)
    : [];
  const requestKey = JSON.stringify({
    search: searchText,
    revision: input.revision,
    refs,
  });

  const present = useCallback(
    async (entity: Entity): Promise<EntitySelectionOption> => {
      const presentation = await presentationApi.forEntity(entity).promise;
      return {
        ref: stringifyEntityRef(entity),
        entity,
        label: presentation.primaryTitle,
        presentation,
      };
    },
    [presentationApi],
  );

  const setSearchText = useCallback((text: string) => {
    if (inputRef.current === text) return;
    inputRef.current = text;
    // Invalidate even before the next effect/debounce, including in-flight pages.
    ++generation.current;
    paging.current = false;
    setInput(previous => ({ text, revision: previous.revision + 1 }));
  }, []);
  const retry = useCallback(() => {
    ++generation.current;
    paging.current = false;
    setRetryCount(count => count + 1);
  }, []);

  useEffect(() => {
    const requestGeneration = generation;
    const current = ++generation.current;
    paging.current = false;
    const request = JSON.parse(requestKey) as {
      search: string;
      refs: string[];
    };
    setState(previous => ({
      ...previous,
      requestKey,
      status: 'loading',
      loadMoreError: false,
    }));
    const load = async () => {
      try {
        const [result, exact] = await Promise.all([
          catalogApi.queryEntities({
            ...(catalogFilter ? { filter: catalogFilter } : {}),
            ...(request.search
              ? {
                  fullTextFilter: {
                    term: request.search,
                    fields: [
                      'metadata.name',
                      'kind',
                      'spec.profile.displayName',
                      'metadata.title',
                    ],
                  },
                }
              : {}),
            limit: 20,
            orderFields: [{ field: 'metadata.name', order: 'asc' }],
            totalItems: 'exclude',
          }),
          request.refs.length
            ? catalogApi.getEntitiesByRefs({ entityRefs: request.refs })
            : { items: [] },
        ]);
        const [catalogRows, exactRows] = await Promise.all([
          Promise.all(result.items.map(present)),
          Promise.all(
            request.refs.map(async (ref, index) =>
              exact.items[index]
                ? present(exact.items[index]!)
                : { ref, label: referenceLabel(ref), missing: true },
            ),
          ),
        ]);
        // Both sources belong to this request. Prefer the catalog's presentation
        // for duplicates, keeping its ordering and avoiding duplicate choices.
        const rows = new Map(catalogRows.map(row => [row.ref, row]));
        for (const row of exactRows)
          if (!rows.has(row.ref)) rows.set(row.ref, row);
        if (current === generation.current)
          setState({
            requestKey,
            generation: current,
            snapshot: {
              search: request.search,
              rows: [...rows.values()],
              cursor: result.pageInfo.nextCursor,
            },
            status: 'idle',
            loadMoreError: false,
          });
      } catch {
        if (current === generation.current)
          setState(previous => ({ ...previous, status: 'error' }));
      }
    };
    // Debounce typing, but load the initial/unfiltered list immediately.
    const timer = request.search ? setTimeout(load, 250) : undefined;
    if (!request.search) void load();
    return () => {
      clearTimeout(timer);
      ++requestGeneration.current;
    };
  }, [catalogApi, catalogFilter, present, requestKey, retryCount]);

  const loadMore = useCallback(async () => {
    const { snapshot } = state;
    if (
      paging.current ||
      state.generation !== generation.current ||
      state.status !== 'idle' ||
      state.requestKey !== requestKey ||
      !snapshot.cursor
    )
      return;
    const current = generation.current;
    paging.current = true;
    setState(previous => ({
      ...previous,
      status: 'loadingMore',
      loadMoreError: false,
    }));
    try {
      const response = await catalogApi.queryEntities({
        cursor: snapshot.cursor,
        limit: 20,
      });
      const rows = await Promise.all(response.items.map(present));
      if (current !== generation.current) return;
      const merged = new Map(snapshot.rows.map(row => [row.ref, row]));
      for (const row of rows)
        if (!merged.has(row.ref)) merged.set(row.ref, row);
      setState(previous => ({
        ...previous,
        snapshot: {
          ...snapshot,
          rows: [...merged.values()],
          cursor: response.pageInfo.nextCursor,
        },
        status: 'idle',
      }));
    } catch {
      if (current === generation.current)
        setState(previous => ({
          ...previous,
          status: 'idle',
          loadMoreError: true,
        }));
    } finally {
      if (current === generation.current) paging.current = false;
    }
  }, [catalogApi, present, requestKey, state]);

  // Hydrate the closed control independently. These results never mutate the
  // displayed search snapshot, and changing selection never restarts a search.
  const selectionKey = JSON.stringify(props.selectedEntityRefs);
  useEffect(() => {
    let cancelled = false;
    const entityRefs = JSON.parse(selectionKey) as string[];
    if (!entityRefs.length) {
      setSelectedOptions([]);
      return undefined;
    }
    const load = async () => {
      try {
        const response = await catalogApi.getEntitiesByRefs({ entityRefs });
        const rows = await Promise.all(
          entityRefs.map(async (ref, index) =>
            response.items[index]
              ? present(response.items[index]!)
              : { ref, label: referenceLabel(ref), missing: true },
          ),
        );
        if (!cancelled)
          setSelectedOptions(previous =>
            rows.map(row => {
              const known = previous.find(item => item.ref === row.ref);
              return row.missing && known ? { ...known, missing: true } : row;
            }),
          );
      } catch {
        // Keep the last known presentation if hydration fails.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [catalogApi, present, selectionKey]);

  const loadingState =
    state.requestKey !== requestKey ? 'loading' : state.status;
  return {
    snapshot: state.snapshot,
    selectedOptions,
    searchText,
    setSearchText,
    retry,
    loadMore,
    loadingState,
    loading: loadingState === 'loading' || loadingState === 'loadingMore',
    hasMore: Boolean(state.snapshot.cursor),
    loadMoreError: state.loadMoreError,
  };
}
