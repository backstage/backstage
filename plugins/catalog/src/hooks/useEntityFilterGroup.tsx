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

import { EntityGroup } from '../data/filters';
import { useApi } from '@backstage/core';
import { catalogApiRef } from '..';
import { Entity } from '@backstage/catalog-model';
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useAsync } from 'react-use';

export type EntitiesByFilter = Record<EntityGroup, Entity[] | undefined>;

export type FilterGroup = {
  filters: {
    [key: string]: (entity: Entity) => boolean;
  };
};

export type FilterGroupState = {
  filters: {
    [key: string]: {
      isSelected: boolean;
      matchCount: number;
    };
  };
};

export type FilterGroupStatesReady = {
  type: 'ready';
  state: FilterGroupState;
};

export type FilterGroupStatesError = {
  type: 'error';
  error: Error;
};

export type FilterGroupStatesLoading = {
  type: 'loading';
};

export type FilterGroupStates =
  | FilterGroupStatesReady
  | FilterGroupStatesError
  | FilterGroupStatesLoading;

export type FilterGroupsContext = {
  register: (filterGroupId: string, filterGroup: FilterGroup) => void;
  unregister: (filterGroupId: string) => void;
  setSelectedFilters: (filterGroupId: string, filters: string[]) => void;
  filterGroupStates: { [filterGroupId: string]: FilterGroupStates };
  matchingEntities: Entity[];
};

/**
 * The context that maintains shared state for all visible filter groups.
 */
export const filterGroupsContext = createContext<FilterGroupsContext>(
  {} as FilterGroupsContext,
);

/**
 * Implementation of the shared filter groups state.
 */
export const EntityFilterGroupsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: entities, error } = useAsync(() => catalogApi.getEntities());

  const [filterGroups, setFilterGroups] = useState<{
    [filterGroupId: string]: FilterGroup;
  }>({});
  const [filterGroupStates, setFilterGroupStates] = useState<{
    [filterGroupId: string]: FilterGroupStates;
  }>({});
  const [selectedFilterKeys, setSelectedFilterKeys] = useState<Set<string>>(
    new Set(),
  );
  const [matchingEntities, setMatchingEntities] = useState<Entity[]>([]);

  useEffect(() => {
    function buildStates(): { [filterGroupId: string]: FilterGroupStates } {
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
        const otherMatchingEntities = buildMatchingEntities(filterGroupId);
        const groupState: FilterGroupState = { filters: {} };
        for (const [filterId, filterFn] of Object.entries(
          filterGroup.filters,
        )) {
          const isSelected = selectedFilterKeys.has(
            `${filterGroupId}.${filterId}`,
          );
          const matchCount = otherMatchingEntities.filter(entity =>
            filterFn(entity),
          ).length;
          groupState.filters[filterId] = { isSelected, matchCount };
        }
        result[filterGroupId] = { type: 'ready', state: groupState };
      }

      return result;
    }

    function buildMatchingEntities(excludeFilterGroupId?: string): Entity[] {
      // Build one filter fn per filter group
      const allFilters: ((entity: Entity) => boolean)[] = [];
      for (const [filterGroupId, filterGroup] of Object.entries(filterGroups)) {
        if (excludeFilterGroupId === filterGroupId) {
          continue;
        }

        // Pick out all of the filter functions in the group that are actually
        // selected
        const groupFilters: ((entity: Entity) => boolean)[] = [];
        for (const [filterId, filterFn] of Object.entries(
          filterGroup.filters,
        )) {
          if (selectedFilterKeys.has(`${filterGroupId}.${filterId}`)) {
            groupFilters.push(filterFn);
          }
        }

        // Need to match any of the selected filters in the group - if there is
        // any at all
        if (groupFilters.length) {
          allFilters.push(entity => groupFilters.some(fn => fn(entity)));
        }
      }

      // All filter groups that had any checked filters need to match. Note that
      // every() always returns true for an empty array.
      return (
        entities?.filter(entity => allFilters.every(fn => fn(entity))) ?? []
      );
    }

    setFilterGroupStates(buildStates());
    setMatchingEntities(buildMatchingEntities());
  }, [entities, error, filterGroups, selectedFilterKeys]);

  const register = useCallback(
    (filterGroupId: string, filterGroup: FilterGroup) => {
      setFilterGroups(oldGroups => ({
        ...oldGroups,
        [filterGroupId]: filterGroup,
      }));
    },
    [],
  );

  const unregister = useCallback((filterGroupId: string) => {
    setFilterGroups(oldGroups => {
      const copy = { ...oldGroups };
      delete copy[filterGroupId];
      return copy;
    });
    setFilterGroupStates(oldStates => {
      const copy = { ...oldStates };
      delete copy[filterGroupId];
      return copy;
    });
  }, []);

  const setSelectedFilters = useCallback(
    (filterGroupId: string, filters: string[]) => {
      const result = new Set<string>();
      for (const key of selectedFilterKeys) {
        if (!key.startsWith(`${filterGroupId}.`)) {
          result.add(key);
        }
      }
      for (const key of filters) {
        result.add(`${filterGroupId}.${key}`);
      }
      setSelectedFilterKeys(result);
    },
    [setSelectedFilterKeys],
  );

  const state: FilterGroupsContext = {
    register,
    unregister,
    setSelectedFilters,
    filterGroupStates,
    matchingEntities,
  };

  return (
    <filterGroupsContext.Provider value={state}>
      {children}
    </filterGroupsContext.Provider>
  );
};

type EntityFilterGroupOutput = {
  state: FilterGroupStates;
  selectItems: (filters: string[]) => void;
};

/**
 * Hook that exposes the relevant data and operations for a single filter
 * group.
 */
export const useEntityFilterGroup = (
  filterGroupId: string,
  filterGroup: FilterGroup,
): EntityFilterGroupOutput => {
  const groupsContext = useContext(filterGroupsContext);
  if (!groupsContext) {
    throw new Error('You must be inside an EntityFilterGroupsProvider');
  }

  useEffect(() => {
    groupsContext.register(filterGroupId, filterGroup);
    return () => groupsContext.unregister(filterGroupId);
  }, []);

  const selectItems = useCallback(
    (filters: string[]) => {
      groupsContext.setSelectedFilters(filterGroupId, filters);
    },
    [groupsContext, filterGroupId],
  );

  let state = groupsContext.filterGroupStates[filterGroupId];
  if (!state) {
    state = { type: 'loading' };
  }

  return { state, selectItems };
};
