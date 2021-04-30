/*
 * Copyright 2021 Spotify AB
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
import { isOwnerOf } from './utils';

export type FilterEnvironment = {
  user: UserEntity | undefined;
  isStarredEntity: (entity: Entity) => boolean;
  // kind? types?
};

export type EntityFilter = {
  /**
   * A unique identifier for this filter; used to manage filter registration and lookup in the
   * useEntityListProvider hook.
   */
  id: string;

  /**
   * Get filters to add to the catalog-backend request. These are a dot-delimited field with
   * value(s) to accept, extracted on the backend by parseEntityFilterParams. For example:
   *   { field: 'kind', values: ['component'] }
   *   { field: 'metadata.name', values: ['component-1', 'component-2'] }
   */
  getCatalogFilters?: () => Record<string, string | string[]>;

  /**
   * Filter entities on the frontend after a catalog-backend request. This function will be called
   * with each backend-resolved entity. This is used when frontend information is required for
   * filtering, such as a user's starred entities.
   *
   * @param entity
   * @param env
   */
  filterEntity?: (entity: Entity, env: FilterEnvironment) => boolean;
};

export class EntityKindFilter implements EntityFilter {
  id = 'kind';
  private readonly kind: string;

  constructor(kind: string) {
    this.kind = kind;
  }

  getCatalogFilters(): Record<string, string | string[]> {
    return { kind: this.kind };
  }
}

export class EntityTypeFilter implements EntityFilter {
  id = 'type';
  private readonly type: string;

  constructor(type: string) {
    this.type = type;
  }
  getCatalogFilters(): Record<string, string | string[]> {
    return { 'spec.type': this.type };
  }
}

export class UserOwnedEntityFilter implements EntityFilter {
  id = 'owned';
  private readonly user: UserEntity | undefined;

  constructor(user: UserEntity | undefined) {
    this.user = user;
  }

  filterEntity(entity: Entity) {
    return this.user !== undefined && isOwnerOf(this.user, entity);
  }
}

export class UserStarredEntityFilter implements EntityFilter {
  id = 'starred';
  private readonly isStarredEntity: (entity: Entity) => boolean;

  constructor(isStarredEntity: (entity: Entity) => boolean) {
    this.isStarredEntity = isStarredEntity;
  }

  filterEntity(entity: Entity) {
    return this.isStarredEntity(entity);
  }
}
