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
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import {
  CatalogFilterGroup,
  CatalogFilterItem,
} from '../components/CatalogFilter/CatalogFilter';

export enum EntityFilterType {
  ALL = 'ALL',
  STARRED = 'STARRED',
  OWNED = 'OWNED',
}

export const filterGroups: CatalogFilterGroup[] = [
  {
    name: 'Personal',
    items: [
      {
        id: EntityFilterType.OWNED,
        label: 'Owned',
        icon: SettingsIcon,
      },
      {
        id: EntityFilterType.STARRED,
        label: 'Starred',
        icon: StarIcon,
      },
    ],
  },
  {
    // TODO: Replace with Company name, read from app config.
    name: 'Company',
    items: [
      {
        id: EntityFilterType.ALL,
        label: 'All Services',
      },
    ],
  },
];

export const getCatalogFilterItemByType = (filterType: EntityFilterType) => {
  for (const group of filterGroups) {
    for (const filter of group.items) {
      if (filter.id === filterType) {
        return filter;
      }
    }
  }
  return null;
};

type EntityFilter = (entity: Entity, options: EntityFilterOptions) => boolean;

type EntityFilterOptions = Partial<{
  isStarred: boolean;
  userId: string;
}>;

type Owned = {
  owner: string;
};

export const entityFilters: Record<string, EntityFilter> = {
  [EntityFilterType.OWNED]: (e, { userId }) => {
    const owner = (e.spec! as Owned).owner;
    return owner === userId;
  },
  [EntityFilterType.ALL]: () => true,
  [EntityFilterType.STARRED]: (_, { isStarred }) => isStarred ?? false,
};

export const defaultFilter: CatalogFilterItem = filterGroups[0].items[0];
