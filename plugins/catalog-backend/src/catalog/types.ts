/*
 * Copyright 2020 The Backstage Authors
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

import { Entity, EntityRelationSpec } from '@backstage/catalog-model';

/**
 * A filter expression for entities.
 *
 * Any (at least one) of the outer sets must match, within which all of the
 * individual filters must match.
 */
export type EntityFilter = {
  anyOf: { allOf: (EntitiesSearchFilter | EntityFilter)[] }[];
};

/**
 * A pagination rule for entities.
 */
export type EntityPagination = {
  limit?: number;
  offset?: number;
  after?: string;
};

/**
 * Matches rows in the entities_search table.
 */
export type EntitiesSearchFilter = {
  /**
   * The key to match on.
   *
   * Matches are always case insensitive.
   */
  key: string;

  /**
   * Match on plain equality of values.
   *
   * If undefined, this factor is not taken into account. Otherwise, match on
   * values that are equal to any of the given array items. Matches are always
   * case insensitive.
   */
  matchValueIn?: string[];

  /**
   * Match on existence of key.
   */
  matchValueExists?: boolean;
};

export type PageInfo =
  | {
      hasNextPage: false;
    }
  | {
      hasNextPage: true;
      endCursor: string;
    };

export type EntitiesRequest = {
  filter?: EntityFilter;
  fields?: (entity: Entity) => Entity;
  pagination?: EntityPagination;
};

export type EntitiesResponse = {
  entities: Entity[];
  pageInfo: PageInfo;
};

/** @deprecated This was part of the legacy catalog engine */
export type EntityUpsertRequest = {
  entity: Entity;
  relations: EntityRelationSpec[];
};

/** @deprecated This was part of the legacy catalog engine */
export type EntityUpsertResponse = {
  entityId: string;
  entity?: Entity;
};

/** @public */
export type EntityAncestryResponse = {
  rootEntityRef: string;
  items: Array<{
    entity: Entity;
    parentEntityRefs: string[];
  }>;
};

/** @public */
export type EntitiesCatalog = {
  /**
   * Fetch entities.
   *
   * @param request - Request options
   */
  entities(request?: EntitiesRequest): Promise<EntitiesResponse>;

  /**
   * Removes a single entity.
   *
   * @param uid - The metadata.uid of the entity
   */
  removeEntityByUid(uid: string): Promise<void>;

  /**
   * Writes a number of entities efficiently to storage.
   *
   * @deprecated This method was part of the legacy catalog engine an will be removed.
   *
   * @param requests - The entities and their relations
   * @param options.locationId - The location that they all belong to (default none)
   * @param options.dryRun - Whether to throw away the results (default false)
   * @param options.outputEntities - Whether to return the resulting entities (default false)
   */
  batchAddOrUpdateEntities?(
    requests: EntityUpsertRequest[],
    options?: {
      locationId?: string;
      dryRun?: boolean;
      outputEntities?: boolean;
    },
  ): Promise<EntityUpsertResponse[]>;

  /**
   * Returns the full ancestry tree upward along reference edges.
   *
   * @param entityRef - An entity reference to the root of the tree
   */
  entityAncestry(entityRef: string): Promise<EntityAncestryResponse>;
};
