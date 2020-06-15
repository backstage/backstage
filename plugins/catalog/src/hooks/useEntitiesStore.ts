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
import { useState, useEffect } from 'react';
import { CatalogFilterItem } from '../components/CatalogFilter/CatalogFilter';
import {
  defaultFilter,
  EntityFilterType,
  entityFilters,
} from '../data/filters';
import { useApi } from '@backstage/core';
import { catalogApiRef } from '..';
import { useStarredEntities } from './useStarredEntites';
import { Entity } from '@backstage/catalog-model';
import useStaleWhileRevalidate from 'swr';

export const useEntitiesStore = () => {
  const [selectedFilter, setSelectedFilter] = useState<CatalogFilterItem>(
    defaultFilter,
  );
  const catalogApi = useApi(catalogApiRef);
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const { data: entities, error } = useStaleWhileRevalidate(
    ['catalog/all', entityFilters[selectedFilter.id]],
    async () => catalogApi.getEntities(),
  );
  const useUser = () => {
    const [user] = useState('tools@example.com');
    return user;
  };
  const userId = useUser();

  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [entitiesByFilter] = useState<Record<string, Entity[]>>(
    // Create an empty result for every filter by default
    Object.keys(EntityFilterType).reduce(
      (res, key) => ({ ...res, [key]: [] }),
      {},
    ),
  );
  useEffect(() => {
    // const dataByFilter = Object.keys(EntityFilterType).reduce(

    //   ,{});

    const data =
      entities?.filter((e: Entity) =>
        entityFilters[selectedFilter.id](e, {
          isStarred: isStarredEntity(e),
          userId,
        }),
      ) ?? [];
    setFilteredEntities(data);
  }, [
    entities,
    selectedFilter.id,
    isStarredEntity,
    userId,
    setFilteredEntities,
  ]);
  return {
    filteredEntities,
    selectedFilter,
    setSelectedFilter,
    error,
    toggleStarredEntity,
    isStarredEntity,
    entitiesByFilter,
  };
};
