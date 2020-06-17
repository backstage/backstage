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
import { useState, useMemo } from 'react';
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

  const indentityApi = useApi(identityApiRef);
  const userId = indentityApi.getUserId();

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
