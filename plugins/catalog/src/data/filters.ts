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
import { CatalogFilterGroup } from '../components/CatalogFilter/CatalogFilter';

export enum EntityGroup {
  ALL = 'ALL',
  STARRED = 'STARRED',
  OWNED = 'OWNED',
}

export const filterGroups: CatalogFilterGroup[] = [
  {
    name: 'Personal',
    items: [
      {
        id: EntityGroup.OWNED,
        label: 'Owned',
        icon: SettingsIcon,
      },
      {
        id: EntityGroup.STARRED,
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
        id: EntityGroup.ALL,
        label: 'All',
      },
    ],
  },
];

type EntityFilter = (entity: Entity, options: EntityFilterOptions) => boolean;

export type EntityFilterOptions = {
  isStarred: (entity: Entity) => boolean;
  userId: string;
};

export const entityFilters: Record<string, EntityFilter> = {
  [EntityGroup.OWNED]: (e, { userId }) => e.spec?.owner === userId,
  [EntityGroup.ALL]: () => true,
  [EntityGroup.STARRED]: (e, { isStarred }) => isStarred(e),
};
