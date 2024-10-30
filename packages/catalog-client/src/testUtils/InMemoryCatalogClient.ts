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
  DEFAULT_NAMESPACE,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError, NotImplementedError } from '@backstage/errors';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { traverse } from '../../../../plugins/catalog-backend/src/database/operations/stitcher/buildEntitySearch';

function buildEntitySearch(entity: Entity) {
  const rows = traverse(entity);

  if (entity.metadata?.name) {
    rows.push({
      key: 'metadata.name',
      value: entity.metadata.name.toLocaleLowerCase('en-US'),
    });
  }
  if (entity.metadata?.namespace) {
    rows.push({
      key: 'metadata.namespace',
      value: entity.metadata.namespace.toLocaleLowerCase('en-US'),
    });
  }
  if (entity.metadata?.uid) {
    rows.push({
      key: 'metadata.uid',
      value: entity.metadata.uid.toLocaleLowerCase('en-US'),
    });
  }

  if (!entity.metadata.namespace) {
    rows.push({ key: 'metadata.namespace', value: DEFAULT_NAMESPACE });
  }

  // Visit relations
  for (const relation of entity.relations ?? []) {
    rows.push({
      key: `relations.${relation.type.toLocaleLowerCase('en-US')}`,
      value: relation.targetRef.toLocaleLowerCase('en-US'),
    });
  }

  return rows;
}

function createFilter(
  filterOrFilters?: EntityFilterQuery,
): (entity: Entity) => boolean {
  if (!filterOrFilters) {
    return () => true;
  }

  const filters = [filterOrFilters].flat();

  return entity => {
    const rows = buildEntitySearch(entity);

    return filters.some(filter => {
      for (const [key, expectedValue] of Object.entries(filter)) {
        const searchValues = rows
          .filter(row => row.key === key.toLocaleLowerCase('en-US'))
          .map(row => row.value?.toString().toLocaleLowerCase('en-US'));

        if (searchValues.length === 0) {
          return false;
        }
        if (expectedValue === CATALOG_FILTER_EXISTS) {
          continue;
        }
        if (
          !searchValues?.includes(
            String(expectedValue).toLocaleLowerCase('en-US'),
          )
        ) {
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

  constructor(options?: { entities?: Entity[] }) {
    this.#entities = options?.entities?.slice() ?? [];
  }

  async getEntities(
    request?: GetEntitiesRequest,
  ): Promise<GetEntitiesResponse> {
    const filter = createFilter(request?.filter);
    return { items: this.#entities.filter(filter) };
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
  ): Promise<GetEntitiesByRefsResponse> {
    const filter = createFilter(request.filter);
    const refMap = this.#createEntityRefMap();
    return {
      items: request.entityRefs
        .map(ref => refMap.get(ref))
        .map(e => (e && filter(e) ? e : undefined)),
    };
  }

  async queryEntities(
    request?: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    if (request && 'cursor' in request) {
      return { items: [], pageInfo: {}, totalItems: 0 };
    }
    const filter = createFilter(request?.filter);
    const items = this.#entities.filter(filter);
    // TODO(Rugvip): Pagination
    return {
      items,
      pageInfo: {},
      totalItems: items.length,
    };
  }

  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
  ): Promise<GetEntityAncestorsResponse> {
    const entity = this.#createEntityRefMap().get(request.entityRef);
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
    return this.#createEntityRefMap().get(
      stringifyEntityRef(parseEntityRef(entityRef)),
    );
  }

  async removeEntityByUid(uid: string): Promise<void> {
    const index = this.#entities.findIndex(e => e.metadata.uid === uid);
    if (index !== -1) {
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
          const rows = buildEntitySearch(entity);
          const value = rows.find(
            row => row.key === facet.toLocaleLowerCase('en-US'),
          )?.value;
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

  #createEntityRefMap() {
    return new Map(this.#entities.map(e => [stringifyEntityRef(e), e]));
  }
}
