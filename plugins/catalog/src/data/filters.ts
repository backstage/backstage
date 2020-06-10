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
  CatalogFilterGroup,
  CatalogFilterItem,
} from '../components/CatalogFilter/CatalogFilter';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import { StarredCount } from '../components/CatalogFilter/StarredCount';
import { AllServicesCount } from '../components/CatalogFilter/AllServicesCount';
import { FilterGroupItem } from '../types';
import { Entity } from '@backstage/catalog-model';

export const filterGroups: CatalogFilterGroup[] = [
  {
    name: 'Personal',
    items: [
      {
        id: FilterGroupItem.OWNED,
        label: 'Owned',
        count: 0,
        icon: SettingsIcon,
      },
      {
        id: FilterGroupItem.STARRED,
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
        id: FilterGroupItem.ALL,
        label: 'All Services',
        count: AllServicesCount,
      },
    ],
  },
];

type ResolverFunction = ({
  entitiesResolver,
  isStarredEntity,
}: {
  entitiesResolver: () => Promise<Entity[]>;
  isStarredEntity: (entity: Entity) => boolean;
}) => Promise<Entity[]>;

export const asyncEntityFilters: Record<FilterGroupItem, ResolverFunction> = {
  [FilterGroupItem.OWNED]: async () => [],
  [FilterGroupItem.ALL]: async ({ entitiesResolver: asyncFn }) => {
    return asyncFn();
  },
  [FilterGroupItem.STARRED]: async ({ entitiesResolver, isStarredEntity }) => {
    const allEntities = await entitiesResolver();

    return allEntities.filter(entity => isStarredEntity(entity));
  },
};

export const defaultFilter: CatalogFilterItem = filterGroups[0].items[0];
