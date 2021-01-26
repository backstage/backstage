/*
 * Copyright 2020 Spotify AB
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
import { useApi } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { filterGroupsContext, FilterGroupsContext } from './context';
import {
  EntityFilterFn,
  FilterGroup,
  FilterGroupState,
  FilterGroupStates,
} from './types';

/**
 * Implementation of the shared filter groups state.
 */
export const EntityFilterGroupsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const state = useProvideEntityFilters();
  return (
    <filterGroupsContext.Provider value={state}>
      {children}
    </filterGroupsContext.Provider>
  );
};

// The hook that implements the actual context building
function useProvideEntityFilters(): FilterGroupsContext {
  const catalogApi = useApi(catalogApiRef);
  const [{ value: entities, error }, doReload] = useAsyncFn(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: 'Component' },
    });
    return response.items;
  });

  const filterGroups = useRef<{
    [filterGroupId: string]: FilterGroup;
  }>({});
  const selectedFilterKeys = useRef<{
    [filterGroupId: string]: Set<string>;
  }>({});
  const selectedTags = useRef<string[]>([]);
  const [filterGroupStates, setFilterGroupStates] = useState<{
    [filterGroupId: string]: FilterGroupStates;
  }>({});
  const [matchingEntities, setMatchingEntities] = useState<Entity[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isCatalogEmpty, setCatalogEmpty] = useState<boolean>(false);

  useEffect(() => {
    doReload();
  }, [doReload]);

  const rebuild = useCallback(() => {
    setFilterGroupStates(
      buildStates(
        filterGroups.current,
        selectedFilterKeys.current,
        selectedTags.current,
        entities,
        error,
      ),
    );
    setMatchingEntities(
      buildMatchingEntities(
        filterGroups.current,
        selectedFilterKeys.current,
        selectedTags.current,
        entities,
      ),
    );
    setAvailableTags(collectTags(entities));
    setCatalogEmpty(entities !== undefined && entities.length === 0);
  }, [entities, error]);

  const register = useCallback(
    (
      filterGroupId: string,
      filterGroup: FilterGroup,
      initialSelectedFilterIds?: string[],
    ) => {
      filterGroups.current[filterGroupId] = filterGroup;
      selectedFilterKeys.current[filterGroupId] = new Set(
        initialSelectedFilterIds ?? [],
      );
      rebuild();
    },
    [rebuild],
  );

  const unregister = useCallback(
    (filterGroupId: string) => {
      delete filterGroups.current[filterGroupId];
      delete selectedFilterKeys.current[filterGroupId];
      rebuild();
    },
    [rebuild],
  );

  const setGroupSelectedFilters = useCallback(
    (filterGroupId: string, filters: string[]) => {
      selectedFilterKeys.current[filterGroupId] = new Set(filters);
      rebuild();
    },
    [rebuild],
  );

  const setSelectedTags = useCallback(
    (tags: string[]) => {
      selectedTags.current = tags;
      rebuild();
    },
    [rebuild],
  );

  const reload = useCallback(async () => {
    await doReload();
  }, [doReload]);

  return {
    register,
    unregister,
    setGroupSelectedFilters,
    setSelectedTags,
    reload,
    loading: !error && !entities,
    error,
    filterGroupStates,
    matchingEntities,
    availableTags,
    isCatalogEmpty,
  };
}

// Given all filter groups and what filters are actually selected, along with
// the loading state for entities, generate the state of each individual filter
function buildStates(
  filterGroups: { [filterGroupId: string]: FilterGroup },
  selectedFilterKeys: { [filterGroupId: string]: Set<string> },
  selectedTags: string[],
  entities?: Entity[],
  error?: Error,
): { [filterGroupId: string]: FilterGroupStates } {
  // On error - all entries are an error state
  if (error) {
    return Object.fromEntries(
      Object.keys(filterGroups).map(filterGroupId => [
        filterGroupId,
        { type: 'error', error },
      ]),
    );
  }

  // On startup - all entries are a loading state
  if (!entities) {
    return Object.fromEntries(
      Object.keys(filterGroups).map(filterGroupId => [
        filterGroupId,
        { type: 'loading' },
      ]),
    );
  }

  const result: { [filterGroupId: string]: FilterGroupStates } = {};
  for (const [filterGroupId, filterGroup] of Object.entries(filterGroups)) {
    const otherMatchingEntities = buildMatchingEntities(
      filterGroups,
      selectedFilterKeys,
      selectedTags,
      entities,
      filterGroupId,
    );
    const groupState: FilterGroupState = { filters: {} };
    for (const [filterId, filterFn] of Object.entries(filterGroup.filters)) {
      const isSelected = !!selectedFilterKeys[filterGroupId]?.has(filterId);
      const matchCount = otherMatchingEntities.filter(entity =>
        filterFn(entity),
      ).length;
      groupState.filters[filterId] = { isSelected, matchCount };
    }
    result[filterGroupId] = { type: 'ready', state: groupState };
  }

  return result;
}

// Given all entites, find all possible tags and provide them in a sorted list.
function collectTags(entities?: Entity[]): string[] {
  const tags = new Set<string>();
  (entities || []).forEach(e => {
    if (e.metadata.tags) {
      e.metadata.tags.forEach(t => tags.add(t));
    }
  });
  return Array.from(tags).sort();
}

// Given all filter groups and what filters are actually selected, extract all
// entities that match all those filter groups.
function buildMatchingEntities(
  filterGroups: { [filterGroupId: string]: FilterGroup },
  selectedFilterKeys: { [filterGroupId: string]: Set<string> },
  selectedTags: string[],
  entities?: Entity[],
  excludeFilterGroupId?: string,
): Entity[] {
  // Build one filter fn per filter group
  const allFilters: EntityFilterFn[] = [];
  for (const [filterGroupId, filterGroup] of Object.entries(filterGroups)) {
    if (excludeFilterGroupId === filterGroupId) {
      continue;
    }

    // Pick out all of the filter functions in the group that are actually
    // selected
    const groupFilters: EntityFilterFn[] = [];
    for (const [filterId, filterFn] of Object.entries(filterGroup.filters)) {
      if (!!selectedFilterKeys[filterGroupId]?.has(filterId)) {
        groupFilters.push(filterFn);
      }
    }

    // Need to match any of the selected filters in the group - if there is
    // any at all
    if (groupFilters.length) {
      allFilters.push(entity => groupFilters.some(fn => fn(entity)));
    }
  }

  // Filter by tags, if at least one tag is selected. Include all entities
  // that have at least one of the selected tags
  if (selectedTags.length > 0) {
    allFilters.push(
      entity =>
        !!entity.metadata.tags &&
        entity.metadata.tags.some(t => selectedTags.includes(t)),
    );
  }

  // All filter groups that had any checked filters need to match. Note that
  // every() always returns true for an empty array.
  return entities?.filter(entity => allFilters.every(fn => fn(entity))) ?? [];
}
