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
import { EntityFilterType, entityFilters } from '../data/filters';
import { useApi, identifyApiRef } from '@backstage/core';
import { catalogApiRef } from '..';
import { useStarredEntities } from './useStarredEntites';
import { Entity } from '@backstage/catalog-model';
import useStaleWhileRevalidate from 'swr';

export type EntitiesByFilter = Record<EntityFilterType, Entity[] | undefined>;

type UseEntities = {
  selectedFilter: EntityFilterType | undefined;
  setSelectedFilter: (f: EntityFilterType) => void;
  error: Error | null;
  toggleStarredEntity: any;
  isStarredEntity: (e: Entity) => boolean;
  entitiesByFilter: EntitiesByFilter;
};

export const useEntities = (): UseEntities => {
  const [selectedFilter, setSelectedFilter] = useState<
    EntityFilterType | undefined
  >();
  const catalogApi = useApi(catalogApiRef);
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const { data: entities, error } = useStaleWhileRevalidate(
    ['catalog/all', entityFilters[selectedFilter ?? EntityFilterType.ALL]],
    async () => catalogApi.getEntities(),
  );

  const indentityApi = useApi(identifyApiRef);
  const userId = indentityApi.getUserId();

  const entitiesByFilter = useMemo(() => {
    const filterEntities = (
      ents: Entity[] | undefined,
      filterId: EntityFilterType,
      isStarred: (e: Entity) => boolean,
      user: string,
    ) => {
      return ents?.filter((e: Entity) =>
        entityFilters[filterId](e, {
          isStarred: isStarred(e),
          userId: user,
        }),
      );
    };
    const data = Object.keys(EntityFilterType).reduce(
      (res, key) => ({
        ...res,
        [key]: filterEntities(
          entities,
          key as EntityFilterType,
          isStarredEntity,
          userId,
        ),
      }),
      {} as EntitiesByFilter,
    );
    return data;
  }, [entities, isStarredEntity, userId]);

  return {
    selectedFilter,
    setSelectedFilter,
    error,
    toggleStarredEntity,
    isStarredEntity,
    entitiesByFilter,
  };
};
