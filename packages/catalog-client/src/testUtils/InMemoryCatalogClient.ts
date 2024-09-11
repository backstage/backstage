/*
 * Copyright 2024 The Backstage Authors
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
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  GetEntitiesRequest,
  GetEntitiesResponse,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import {
  CompoundEntityRef,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError, NotImplementedError } from '@backstage/errors';

/**
 * Implements a VERY basic fake catalog client that stores entities in memory.
 * It has severely limited functionality, and is only useful under certain
 * circumstances in tests.
 *
 * @public
 */
export class InMemoryCatalogClient implements CatalogApi {
  #entities: Entity[];

  constructor(options?: { entities?: Entity[] }) {
    this.#entities = options?.entities ?? [];
  }

  async getEntities(
    _request?: GetEntitiesRequest,
  ): Promise<GetEntitiesResponse> {
    // TODO(freben): Fields, filters etc
    return { items: this.#entities };
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
  ): Promise<GetEntitiesByRefsResponse> {
    const entitiesByRef = new Map<string, Entity>();
    for (const entity of this.#entities) {
      entitiesByRef.set(stringifyEntityRef(entity), entity);
    }

    const items = request.entityRefs.map(candidateRef =>
      entitiesByRef.get(candidateRef),
    );

    // TODO(freben): Fields, filters etc
    return { items };
  }

  async queryEntities(
    _request?: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    // TODO(freben): Fields, filters etc
    return {
      items: this.#entities,
      totalItems: this.#entities.length,
      pageInfo: {},
    };
  }

  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
  ): Promise<GetEntityAncestorsResponse> {
    const entity = this.#entities.find(
      e => stringifyEntityRef(e) === request.entityRef,
    );
    if (!entity) {
      throw new NotFoundError(`Entity with ref ${request.entityRef} not found`);
    }
    return {
      rootEntityRef: request.entityRef,
      items: [{ entity, parentEntityRefs: [] }],
    };
  }

  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
  ): Promise<Entity | undefined> {
    const ref =
      typeof entityRef === 'string' ? entityRef : stringifyEntityRef(entityRef);
    return this.#entities.find(e => stringifyEntityRef(e) === ref);
  }

  async removeEntityByUid(uid: string): Promise<void> {
    this.#entities = this.#entities.filter(e => e.metadata.uid !== uid);
  }

  async refreshEntity(_entityRef: string): Promise<void> {}

  async getEntityFacets(
    _request: GetEntityFacetsRequest,
  ): Promise<GetEntityFacetsResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  async getLocationById(_id: string): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  async getLocationByRef(_locationRef: string): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  async addLocation(
    _location: AddLocationRequest,
  ): Promise<AddLocationResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  async removeLocationById(_id: string): Promise<void> {
    throw new NotImplementedError('Method not implemented.');
  }

  async getLocationByEntity(
    _entityRef: string | CompoundEntityRef,
  ): Promise<Location | undefined> {
    throw new NotImplementedError('Method not implemented.');
  }

  async validateEntity(
    _entity: Entity,
    _locationRef: string,
  ): Promise<ValidateEntityResponse> {
    throw new NotImplementedError('Method not implemented.');
  }
}
