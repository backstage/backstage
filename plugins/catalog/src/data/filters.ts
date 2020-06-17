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
import { AllServicesCount } from '../components/CatalogFilter/AllServicesCount';
import {
  CatalogFilterGroup,
  CatalogFilterItem,
} from '../components/CatalogFilter/CatalogFilter';
import { StarredCount } from '../components/CatalogFilter/StarredCount';

export enum EntityFilterType {
  ALL = 'ALL',
  STARRED = 'STARRED',
  OWNED = 'OWNED',
  TYPE = 'TYPE',
}

export const filterGroups: CatalogFilterGroup[] = [
  {
    name: 'Personal',
    items: [
      {
        id: EntityFilterType.OWNED,
        label: 'Owned',
        count: 0,
        icon: SettingsIcon,
      },
      {
        id: EntityFilterType.STARRED,
        label: 'Starred',
        count: StarredCount,
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
        label: 'All Entities',
        count: AllServicesCount,
      },
    ],
  },
];

type EntityFilter = (entity: Entity, options: EntityFilterOptions) => boolean;

type EntityFilterOptions = {
  isStarred?: boolean;
  type?: string;
};

export const entityFilters: Record<string, EntityFilter> = {
  [EntityFilterType.OWNED]: () => false,
  [EntityFilterType.ALL]: () => true,
  [EntityFilterType.STARRED]: (_, { isStarred }) => !!isStarred,
  [EntityFilterType.TYPE]: (e, { type }) => (e.spec as any)?.type === type,
};

export const defaultFilter: CatalogFilterItem = filterGroups[0].items[0];
