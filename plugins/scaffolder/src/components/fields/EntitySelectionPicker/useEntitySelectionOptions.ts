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
import {
  matchesFilterIdentity,
  parseEntityRefCandidates,
} from './entityRefCandidates';
import {
  EntitySelectionOption,
  referenceLabel,
} from './entitySelectionOptions';

type Snapshot = {
  search: string;
  rows: EntitySelectionOption[];
  cursor?: string;
};

const EMPTY_SNAPSHOT: Snapshot = { search: '', rows: [] };

/** Identifies a filter by value, including its existence sentinels. */
function filterKeyOf(catalogFilter?: EntityFilterQuery) {
  return JSON.stringify(catalogFilter ?? null, (_key, value) =>
    typeof value === 'symbol' ? `@@${value.description}` : value,
  );
}

/** Publish a complete search result, never a mixture of independent lookups. */
export function useEntitySelectionOptions(props: {
  /** Load search results only while the popup is open. */
  enabled: boolean;
  catalogFilter?: EntityFilterQuery;
  defaultKind?: string;
  defaultNamespace?: string;
  allowMissingEntities: boolean;
  selectedEntityRefs: string[];
}) {
  const catalogApi = useApi(catalogApiRef);
  const presentationApi = useApi(entityPresentationApiRef);
  const { allowMissingEntities, enabled } = props;
  const [input, setInput] = useState({ text: '', revision: 0 });
  const searchText = input.text;
  const inputRef = useRef('');
  const [retryCount, setRetryCount] = useState(0);
  // Every request captures this counter; bumping it discards all in-flight work.
  const generation = useRef(0);
  const paging = useRef(false);
  const invalidate = useCallback(() => {
    paging.current = false;
    return ++generation.current;
  }, []);
  // Callers often pass inline filter objects, so depend on the filter's value.
  const filterKey = filterKeyOf(props.catalogFilter);
  const filterRef = useRef(props.catalogFilter);
  if (filterKeyOf(filterRef.current) !== filterKey)
    filterRef.current = props.catalogFilter;
  const catalogFilter = filterRef.current;
  const [state, setState] = useState<{
    /** The filter that produced the snapshot; rows are discarded when it changes. */
    filterKey: string;
    requestKey?: string;
    generation?: number;
    snapshot: Snapshot;
    status: 'loading' | 'idle' | 'error' | 'loadingMore';
    loadMoreError: boolean;
  }>({
    filterKey,
    snapshot: EMPTY_SNAPSHOT,
    status: 'loading',
    loadMoreError: false,
  });
  const snapshot =
    state.filterKey === filterKey ? state.snapshot : EMPTY_SNAPSHOT;
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const [selectedOptions, setSelectedOptions] = useState<
    EntitySelectionOption[]
  >([]);
  // Typed references are always resolved, even when missing ones are not offered.
  const refs = parseEntityRefCandidates(searchText, props);
  const refsKey = refs.join('\n');
  const requestKey = `${input.revision}\n${refsKey}`;

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

  /**
   * Resolve references against the catalog. One that exists but fails the
   * field's filter is marked unavailable, rather than offered or called missing.
   * An absent reference is unavailable unless missing references are allowed
   * and it fits the filter's identity constraints. Unavailable absent rows are
   * dropped unless `keepUnavailable` is set, as for saved values.
   */
  const lookup = useCallback(
    async (
      entityRefs: string[],
      keepUnavailable: boolean,
    ): Promise<EntitySelectionOption[]> => {
      if (!entityRefs.length) return [];
      const [matching, existing] = await Promise.all([
        catalogApi.getEntitiesByRefs({
          entityRefs,
          ...(catalogFilter ? { filter: catalogFilter } : {}),
        }),
        catalogFilter
          ? catalogApi.getEntitiesByRefs({ entityRefs })
          : undefined,
      ]);
      const rows = await Promise.all(
        entityRefs.map(async (ref, index): Promise<EntitySelectionOption> => {
          const match = matching.items[index];
          if (match) return present(match);
          const other = existing?.items[index];
          if (other) return { ...(await present(other)), unavailable: true };
          const row = { ref, label: referenceLabel(ref), missing: true };
          return allowMissingEntities &&
            matchesFilterIdentity(ref, catalogFilter)
            ? row
            : { ...row, unavailable: true };
        }),
      );
      return keepUnavailable
        ? rows
        : rows.filter(row => !(row.missing && row.unavailable));
    },
    [allowMissingEntities, catalogApi, catalogFilter, present],
  );

  const setSearchText = useCallback(
    (text: string) => {
      if (inputRef.current === text) return;
      inputRef.current = text;
      // Invalidate even before the next effect/debounce, including in-flight pages.
      invalidate();
      setInput(previous => ({ text, revision: previous.revision + 1 }));
    },
    [invalidate],
  );
  const retry = useCallback(() => {
    invalidate();
    setRetryCount(count => count + 1);
  }, [invalidate]);

  useEffect(() => {
    const current = invalidate();
    if (!enabled) return undefined;
    const search = searchText;
    const exactRefs = refsKey ? refsKey.split('\n') : [];
    setState(previous => ({
      ...previous,
      requestKey,
      generation: current,
      status: 'loading',
      loadMoreError: false,
    }));
    const load = async () => {
      try {
        const [result, exactRows] = await Promise.all([
          catalogApi.queryEntities({
            ...(catalogFilter ? { filter: catalogFilter } : {}),
            ...(search
              ? {
                  fullTextFilter: {
                    term: search,
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
          lookup(exactRefs, false),
        ]);
        const catalogRows = await Promise.all(result.items.map(present));
        // Both sources belong to this request. Prefer the catalog's presentation
        // for duplicates, keeping its ordering and avoiding duplicate choices.
        const rows = new Map(catalogRows.map(row => [row.ref, row]));
        for (const row of exactRows)
          if (!rows.has(row.ref)) rows.set(row.ref, row);
        if (current === generation.current)
          setState({
            filterKey,
            requestKey,
            generation: current,
            snapshot: {
              search,
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
    const timer = search ? setTimeout(load, 250) : undefined;
    if (!search) void load();
    return () => {
      clearTimeout(timer);
      invalidate();
    };
  }, [
    catalogApi,
    catalogFilter,
    enabled,
    filterKey,
    invalidate,
    lookup,
    present,
    refsKey,
    requestKey,
    retryCount,
    searchText,
  ]);

  const loadMore = useCallback(async () => {
    const { snapshot: loaded } = state;
    if (
      !enabled ||
      paging.current ||
      state.generation !== generation.current ||
      state.status !== 'idle' ||
      state.requestKey !== requestKey ||
      !loaded.cursor
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
        cursor: loaded.cursor,
        limit: 20,
      });
      const rows = await Promise.all(response.items.map(present));
      if (current !== generation.current) return;
      const merged = new Map(loaded.rows.map(row => [row.ref, row]));
      for (const row of rows)
        if (!merged.has(row.ref)) merged.set(row.ref, row);
      setState(previous => ({
        ...previous,
        snapshot: {
          ...loaded,
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
  }, [catalogApi, enabled, present, requestKey, state]);

  // Hydrate the closed control independently. These results never mutate the
  // displayed search snapshot, and changing selection never restarts a search.
  const selectionKey = props.selectedEntityRefs.join('\n');
  useEffect(() => {
    let cancelled = false;
    const entityRefs = selectionKey ? selectionKey.split('\n') : [];
    if (!entityRefs.length) {
      setSelectedOptions([]);
      return undefined;
    }
    // Until the lookup finishes, keep what is already known about each ref.
    setSelectedOptions(previous =>
      entityRefs.flatMap(ref => {
        const known =
          previous.find(item => item.ref === ref) ??
          snapshotRef.current.rows.find(item => item.ref === ref);
        return known ? [known] : [];
      }),
    );
    const load = async () => {
      try {
        // Saved values stay displayable and removable, but are marked
        // unavailable when they no longer match the filter.
        const rows = await lookup(entityRefs, true);
        if (!cancelled)
          setSelectedOptions(previous =>
            rows.map(row => {
              const known = previous.find(item => item.ref === row.ref);
              return row.missing && known
                ? { ...known, missing: true, unavailable: row.unavailable }
                : row;
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
  }, [lookup, selectionKey]);

  let loadingState = state.status;
  if (!enabled) {
    loadingState = 'idle';
  } else if (
    state.requestKey !== requestKey ||
    state.generation !== generation.current
  ) {
    loadingState = 'loading';
  }
  return {
    filterKey,
    snapshot,
    selectedOptions,
    searchText,
    setSearchText,
    retry,
    loadMore,
    loadingState,
    loading: loadingState === 'loading' || loadingState === 'loadingMore',
    hasMore: enabled && Boolean(snapshot.cursor),
    loadMoreError: state.loadMoreError,
  };
}
