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
  CATALOG_FILTER_EXISTS,
  CatalogApi,
  EntityFilterQuery,
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
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError, NotImplementedError } from '@backstage/errors';
import { JsonObject, JsonValue } from '@backstage/types';

function pick(obj: JsonObject, key: string): JsonValue | undefined {
  const parts = key.split('.');

  return parts.reduce((acc, part, index) => {
    if (!acc) {
      return acc;
    }
    if (typeof acc === 'object' && acc !== null && !Array.isArray(acc)) {
      const value = acc[part];
      if (value) {
        return value;
      }
      const rest = parts.slice(index).join('.');
      const restValue = acc[rest];
      if (restValue) {
        return restValue;
      }
    }
    return undefined;
  }, obj as JsonValue | undefined);
}

function filterCompare(
  expected: (string | symbol) | (string | symbol)[],
  value: JsonValue,
) {
  const expect = (Array.isArray(expected) ? expected : [expected]).map(e =>
    e.toString().toLocaleLowerCase('en-US'),
  );
  return expect.includes(String(value).toLocaleLowerCase('en-US'));
}

function createFilter(
  filterOrFilters?: EntityFilterQuery,
): (entity: Entity) => boolean {
  if (!filterOrFilters) {
    return () => true;
  }
  const filters = Array.isArray(filterOrFilters)
    ? filterOrFilters
    : [filterOrFilters];

  return entity => {
    return filters.some(filter => {
      for (const [key, expectedValue] of Object.entries(filter)) {
        const entityValue = pick(entity, key);
        if (entityValue === undefined) {
          return false;
        }
        if (expectedValue === CATALOG_FILTER_EXISTS) {
          continue;
        }
        if (!filterCompare(expectedValue, entityValue)) {
          return false;
        }
      }
      return true;
    });
  };
}

/**
 * Implements a VERY basic fake catalog client that stores entities in memory.
 * It has severely limited functionality, and is only useful under certain
 * circumstances in tests.
 *
 * @public
 */
export class InMemoryCatalogClient implements CatalogApi {
  #entities: Entity[];
  #entitiesByRef: Map<string, Entity>;

  constructor(options?: { entities?: Entity[] }) {
    this.#entities = options?.entities?.slice() ?? [];
    this.#entitiesByRef = new Map(
      this.#entities.map(e => [stringifyEntityRef(e), e]),
    );
  }

  async getEntities(
    request?: GetEntitiesRequest | undefined,
  ): Promise<GetEntitiesResponse> {
    const filter = createFilter(request?.filter);
    return { items: this.#entities.filter(filter) };
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
  ): Promise<GetEntitiesByRefsResponse> {
    const filter = createFilter(request.filter);
    return {
      items: request.entityRefs
        .map(ref => this.#entitiesByRef.get(ref))
        .filter(e => (e ? filter(e) : true)),
    };
  }

  async queryEntities(
    request?: QueryEntitiesRequest | undefined,
  ): Promise<QueryEntitiesResponse> {
    if (request && 'cursor' in request) {
      return { items: [], pageInfo: {}, totalItems: 0 };
    }
    const filter = createFilter(request?.filter);
    // TODO(Rugvip): Pagination
    return {
      items: this.#entities.filter(filter),
      pageInfo: {},
      totalItems: this.#entities.length,
    };
  }

  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
  ): Promise<GetEntityAncestorsResponse> {
    const entity = this.#entitiesByRef.get(request.entityRef);
    if (!entity) {
      throw new NotFoundError(`Entity with ref ${request.entityRef} not found`);
    }
    return {
      items: [{ entity, parentEntityRefs: [] }],
      rootEntityRef: request.entityRef,
    };
  }

  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
  ): Promise<Entity | undefined> {
    return this.#entitiesByRef.get(
      stringifyEntityRef(parseEntityRef(entityRef)),
    );
  }

  async removeEntityByUid(uid: string): Promise<void> {
    const index = this.#entities.findIndex(e => e.metadata.uid === uid);
    if (index !== -1) {
      const entity = this.#entities[index];
      this.#entitiesByRef.delete(stringifyEntityRef(entity));
      this.#entities.splice(index, 1);
    }
  }

  async refreshEntity(_entityRef: string): Promise<void> {}

  async getEntityFacets(
    request: GetEntityFacetsRequest,
  ): Promise<GetEntityFacetsResponse> {
    const filter = createFilter(request.filter);
    const filteredEntities = this.#entities.filter(filter);
    const facets = Object.fromEntries(
      request.facets.map(facet => {
        const facetValues = new Map<string, number>();
        for (const entity of filteredEntities) {
          const value = pick(entity, facet);
          if (value) {
            facetValues.set(
              String(value),
              (facetValues.get(String(value)) ?? 0) + 1,
            );
          }
        }
        const counts = Array.from(facetValues.entries()).map(
          ([value, count]) => ({ value, count }),
        );
        return [facet, counts];
      }),
    );
    return {
      facets,
    };
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
