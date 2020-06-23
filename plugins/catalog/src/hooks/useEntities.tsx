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

import {
  EntityGroup,
  entityFilters,
  entityTypeFilter,
  labeledEntityTypes,
} from '../data/filters';
import { useApi, identityApiRef } from '@backstage/core';
import { catalogApiRef } from '..';
import { useStarredEntities } from './useStarredEntites';
import { Entity } from '@backstage/catalog-model';
import useStaleWhileRevalidate from 'swr';
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

export type EntitiesByFilter = Record<EntityGroup, Entity[] | undefined>;

type UseEntities = {
  selectedFilter: EntityGroup | undefined;
  setSelectedFilter: (f: EntityGroup) => void;
  error: Error | null;
  toggleStarredEntity: any;
  isStarredEntity: (e: Entity) => boolean;
  entitiesByFilter: EntitiesByFilter;
  loading: boolean;
  selectedTypeFilter: string;
  selectTypeFilter: (id: string) => void;
};

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
  const {
    data: entities,
    error,
  } = useStaleWhileRevalidate('catalog/getEntities', async () =>
    catalogApi.getEntities(),
  );

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

  const buildMatchingEntities = useCallback(
    (excludeFilterGroupId?: string): Entity[] => {
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
    },
    [entities?.filter, filterGroups, selectedFilterKeys],
  );
  const buildStates = useCallback((): {
    [filterGroupId: string]: FilterGroupStates;
  } => {
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
    if (!entities || !filterGroups.length) {
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
      for (const [filterId, filterFn] of Object.entries(filterGroup.filters)) {
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
  }, [
    buildMatchingEntities,
    entities,
    error,
    filterGroups,
    selectedFilterKeys,
  ]);

  useEffect(() => {
    setFilterGroupStates(buildStates());
    setMatchingEntities(buildMatchingEntities());
  }, [
    entities,
    error,
    filterGroups,
    selectedFilterKeys,
    buildStates,
    buildMatchingEntities,
  ]);

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
    [selectedFilterKeys],
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

/**
 * Hook that exposes the relevant data and operations for a single filter
 * group.
 */
/*
export const useEntityFilterGroup = (
  filterGroupId: string,
  filterGroup: FilterGroup,
): EntityFilterGroupOutput<Entity> => {
  const groupsContext = useContext(filterGroupsContext);
  if (!groupsContext) {
    throw new Error('You must be inside an EntityFilterGroupsProvider');
  }

  useEffect(() => {
    groupsContext.register(filterGroupId, filterGroup);
    return () => groupsContext.unregister(filterGroupId);
  }, []);

  const state = groupsContext.getFilterGroup(filterGroupId);
  if (!state) {
    return null;
  }

  const {} = state;

  const [filterFuncs, setFilterFuncs] = useState<FilterDefinition<Entity>>(
    filterFunctions,
  );

  // and
  // Object.entries(filterFuncs).filter(([_, {isSelected}]) => isSelected).map(([_, {filterFunction}]) => filterFunction).reduce((acc, func) => (acc.filter(func)), entities)

  return {
    selectItems: (functionNames: Array<any>) => {
      const selectedFilterFunctions = Object.fromEntries(
        Object.entries(filterFunctions).map(([key, { filterFunction }]) => [
          key,
          { isSelected: functionNames.includes(key), filterFunction },
        ]),
      );
      setFilterFuncs(selectedFilterFunctions);
    },
    filteredItems: entities.filter(entity =>
      Object.entries(filterFuncs)
        .filter(([_, { isSelected }]) => isSelected)
        .map(([_, { filterFunction }]) => filterFunction)
        .map(filter => filter(entity))
        .some(v => v === true),
    ),
    states: Object.keys(filterFuncs).reduce(
      (acc, val) => ({
        ...acc,
        [val]: {
          ...filterFuncs[val],
          count: entities.filter(filterFuncs[val].filterFunction).length,
        },
      }),
      {} as OutputState,
    ),
  };
};
*/

export const useUser = () => {
  const indentityApi = useApi(identityApiRef);
  const userId = indentityApi.getUserId();
  return { userId };
};

export const useEntities = (): UseEntities => {
  const [selectedFilter, setSelectedFilter] = useState<
    EntityGroup | undefined
  >();
  const catalogApi = useApi(catalogApiRef);
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const { data: entities, error } = useStaleWhileRevalidate(
    ['catalog/all', entityFilters[selectedFilter ?? EntityGroup.ALL]],
    async () => catalogApi.getEntities(),
  );

  const { userId } = useUser();

  const [selectedTypeFilter, selectTypeFilter] = useState<string>(
    labeledEntityTypes[0].id,
  );

  const entitiesByFilter = useMemo(() => {
    const filterEntities = (
      ents: Entity[] | undefined,
      filterId: EntityGroup,
      isStarred: (e: Entity) => boolean,
      user: string,
    ) => {
      return ents
        ?.filter((e: Entity) =>
          entityFilters[filterId](e, {
            isStarred: isStarred(e),
            userId: user,
          }),
        )
        .filter(e => entityTypeFilter(e, selectedTypeFilter));
    };
    const data = Object.keys(EntityGroup).reduce(
      (res, key) => ({
        ...res,
        [key]: filterEntities(
          entities,
          key as EntityGroup,
          isStarredEntity,
          userId,
        ),
      }),
      {} as EntitiesByFilter,
    );
    return data;
  }, [entities, isStarredEntity, userId, selectedTypeFilter]);

  return {
    selectedFilter,
    setSelectedFilter,
    error,
    toggleStarredEntity,
    isStarredEntity,
    entitiesByFilter,
    loading: entities === undefined,
    selectedTypeFilter,
    selectTypeFilter,
  };
};
