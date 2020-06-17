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
import { storageApiRef, useApi } from '@backstage/core';

export enum EntityFilterType {
  ALL = 'ALL',
  STARRED = 'STARRED',
  OWNED = 'OWNED',
  TYPE_SERVICE = 'TYPE_SERVICE',
  TYPE_WEBSITE = 'TYPE_WEBSITE',
  TYPE_LIB = 'TYPE_LIB',
  TYPE_DOCUMENTATION = 'TYPE_DOCUMENTATION',
  TYPE_OTHER = 'TYPE_OTHER',
}

export const filterLevels: EntityFilterType[][] = [
  [EntityFilterType.TYPE_SERVICE],
  [EntityFilterType.OWNED],
];

const buildEntityKey = (component: Entity) =>
  `entity:${component.kind}:${component.metadata.namespace ?? 'default'}:${
    component.metadata.name
  }`;

const getAllStarredEntities = (): Set<string> => {
  const storageApi = useApi(storageApiRef);
  const settingsStore = storageApi.forBucket('settings');
  return new Set(settingsStore.get<string[]>('starredEntities') ?? []);
};

export const filterEntities = (
  entities: Entity[] | undefined,
  filterGroups: EntityFilterType[][],
): Entity[] => {
  if (!entities) return [];

  const starredEntities = getAllStarredEntities();
  return entities.filter(entity => {
    return !!filterGroups.every(group => {
      return !!group.every(filter => {
        return !!entityFilters[filter](entity, {
          isStarred: starredEntities.has(buildEntityKey(entity)),
        });
      });
    });
  });
};

type EntityFilterOptions = {
  isStarred?: boolean;
};

type EntityFilter = (entity: Entity, options: EntityFilterOptions) => boolean;

const typeFilterToTypeId = (
  typeFilter:
    | EntityFilterType.TYPE_SERVICE
    | EntityFilterType.TYPE_WEBSITE
    | EntityFilterType.TYPE_LIB
    | EntityFilterType.TYPE_DOCUMENTATION
    | EntityFilterType.TYPE_OTHER,
) => typeFilter.split('_')[1].toLowerCase();

export const entityFilters: Record<string, EntityFilter> = {
  [EntityFilterType.OWNED]: () => false,
  [EntityFilterType.STARRED]: (_, { isStarred }) => !!isStarred,
  [EntityFilterType.TYPE_SERVICE]: e =>
    (e.spec as any)?.type === typeFilterToTypeId(EntityFilterType.TYPE_SERVICE),
  [EntityFilterType.TYPE_WEBSITE]: e =>
    (e.spec as any)?.type === typeFilterToTypeId(EntityFilterType.TYPE_WEBSITE),
  [EntityFilterType.TYPE_LIB]: e =>
    (e.spec as any)?.type === typeFilterToTypeId(EntityFilterType.TYPE_LIB),
  [EntityFilterType.TYPE_DOCUMENTATION]: e =>
    (e.spec as any)?.type ===
    typeFilterToTypeId(EntityFilterType.TYPE_DOCUMENTATION),
  [EntityFilterType.TYPE_OTHER]: e =>
    (e.spec as any)?.type === typeFilterToTypeId(EntityFilterType.TYPE_OTHER),
};



//export const defaultFilter: CatalogFilterItem = filterGroups[0].items[0];
