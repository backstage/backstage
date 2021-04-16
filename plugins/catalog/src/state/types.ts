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

import { Entity, UserEntity } from '@backstage/catalog-model';

export type EntityFilterType = 'field' | 'owned' | 'starred' | 'all';

export type EntityFieldFilter = {
  type: 'field';
  field: string;
  values: string[];
};

export type EntityFilter =
  | EntityFieldFilter
  | { type: 'owned' }
  | { type: 'starred' };

export type EntityListState = {
  loading: boolean;
  error?: Error;
  orgName: string | undefined;
  isCatalogEmpty: boolean;
  entities: Entity[];
  entityTypes: string[];
  availableTags: string[];
  ownUser: UserEntity | undefined;
  starredEntities: string[]; // name of entity
  clientFilters: Record<string, EntityFilter>; // keyed by an id
  matchingEntities: Entity[];
};
