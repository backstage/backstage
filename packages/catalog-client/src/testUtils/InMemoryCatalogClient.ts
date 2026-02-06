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
  EntityOrderQuery,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  GetEntitiesRequest,
  GetEntitiesResponse,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  GetLocationsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  StreamEntitiesRequest,
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
import lodash from 'lodash';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { traverse } from '../../../../plugins/catalog-backend/src/database/operations/stitcher/buildEntitySearch';
import type {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';
import { DEFAULT_STREAM_ENTITIES_LIMIT } from '../constants.ts';

function makeCursor(data: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function parseCursor(cursor: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
}

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
        if (Array.isArray(expectedValue)) {
          return expectedValue.some(value =>
            searchValues?.includes(String(value).toLocaleLowerCase('en-US')),
          );
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

// Resolves a dot-separated field path against an entity, handling keys that
// themselves contain dots (e.g. annotation keys like "backstage.io/orphan").
// This matches the backend's parseEntityTransformParams implementation.
function getPathArrayAndValue(
  input: Entity,
  field: string,
): [string[], unknown] {
  return field.split('.').reduce(
    ([pathArray, inputSubset], pathPart, index, fieldParts) => {
      if (lodash.hasIn(inputSubset, pathPart)) {
        return [pathArray.concat(pathPart), (inputSubset as any)[pathPart]];
      } else if (fieldParts[index + 1] !== undefined) {
        fieldParts[index + 1] = `${pathPart}.${fieldParts[index + 1]}`;
        return [pathArray, inputSubset];
      }
      return [pathArray, undefined];
    },
    [[] as string[], input as unknown],
  );
}

function applyFieldsFilter(entity: Entity, fields?: string[]): Entity {
  if (!fields?.length) {
    return entity;
  }
  const output: Record<string, any> = {};
  for (const field of fields) {
    const [pathArray, value] = getPathArrayAndValue(entity, field);
    if (value !== undefined) {
      lodash.set(output, pathArray, value);
    }
  }
  return output as Entity;
}

function applyOrdering(entities: Entity[], order?: EntityOrderQuery): Entity[] {
  if (!order) {
    return entities;
  }
  const orders = [order].flat();
  if (orders.length === 0) {
    return entities;
  }

  const searchMap = new Map<Entity, Array<{ key: string; value: unknown }>>();
  for (const entity of entities) {
    searchMap.set(entity, buildEntitySearch(entity));
  }

  return [...entities].sort((a, b) => {
    const aRows = searchMap.get(a)!;
    const bRows = searchMap.get(b)!;

    for (const { field, order: dir } of orders) {
      const key = field.toLocaleLowerCase('en-US');
      const aRow = aRows.find(r => r.key.toLocaleLowerCase('en-US') === key);
      const bRow = bRows.find(r => r.key.toLocaleLowerCase('en-US') === key);
      const aValue =
        aRow?.value != null
          ? String(aRow.value).toLocaleLowerCase('en-US')
          : null;
      const bValue =
        bRow?.value != null
          ? String(bRow.value).toLocaleLowerCase('en-US')
          : null;

      if (aValue === null && bValue === null) continue;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) return dir === 'asc' ? -1 : 1;
      if (aValue > bValue) return dir === 'asc' ? 1 : -1;
    }

    // Stable tie-breaker by entity ref, matching backend behavior
    const aRef = stringifyEntityRef(a);
    const bRef = stringifyEntityRef(b);
    return aRef < bRef ? -1 : aRef > bRef ? 1 : 0;
  });
}

function applyFullTextFilter(
  entities: Entity[],
  fullTextFilter?: { term: string; fields?: string[] },
): Entity[] {
  if (!fullTextFilter?.term?.trim()) {
    return entities;
  }
  const term = fullTextFilter.term.trim().toLocaleLowerCase('en-US');
  const fields = fullTextFilter.fields?.map(f => f.toLocaleLowerCase('en-US'));

  return entities.filter(entity => {
    const rows = buildEntitySearch(entity);
    return rows.some(row => {
      if (
        fields?.length &&
        !fields.includes(row.key.toLocaleLowerCase('en-US'))
      ) {
        return false;
      }
      const value =
        row.value != null ? String(row.value).toLocaleLowerCase('en-US') : null;
      return value != null && value.includes(term);
    });
  });
}

/**
 * Implements a fake catalog client that stores entities in memory.
 * Supports filtering, ordering, pagination, full-text search, and field
 * projection for entity query methods. Location and validation methods
 * throw {@link @backstage/errors#NotImplementedError}.
 *
 * @public
 */
export class InMemoryCatalogClient implements CatalogApi {
  #entities: Entity[];
  #queryCache = new Map<string, Entity[]>();
  #nextQueryId = 0;

  constructor(options?: { entities?: Entity[] }) {
    this.#entities = options?.entities?.slice() ?? [];
  }

  async getEntities(
    request?: GetEntitiesRequest,
  ): Promise<GetEntitiesResponse> {
    const filter = createFilter(request?.filter);
    let items = this.#entities.filter(filter);
    items = applyOrdering(items, request?.order);

    let offset = request?.offset ?? 0;
    let limit = request?.limit;

    if (request?.after) {
      try {
        const cursor = parseCursor(request.after);
        if (cursor.offset != null) offset = cursor.offset as number;
        if (cursor.limit != null) limit = cursor.limit as number;
      } catch {
        // ignore invalid cursor
      }
    }

    if (offset > 0) {
      items = items.slice(offset);
    }
    if (limit != null) {
      items = items.slice(0, limit);
    }

    return {
      items: request?.fields
        ? items.map(e => applyFieldsFilter(e, request.fields))
        : items,
    };
  }

  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
  ): Promise<GetEntitiesByRefsResponse> {
    const filter = createFilter(request.filter);
    const refMap = this.#createEntityRefMap();
    const items = request.entityRefs
      .map(ref => refMap.get(ref))
      .map(e => (e && filter(e) ? e : undefined));
    return {
      items: request.fields
        ? items.map(e => (e ? applyFieldsFilter(e, request.fields) : undefined))
        : items,
    };
  }

  async queryEntities(
    request?: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    if (request && 'cursor' in request) {
      const cursorData = parseCursor(request.cursor);
      const { id, offset, totalItems } = cursorData as {
        id: string;
        offset: number;
        totalItems: number;
      };
      const cachedItems = this.#queryCache.get(id);
      if (!cachedItems) {
        return { items: [], pageInfo: {}, totalItems: 0 };
      }
      const limit = request.limit ?? cachedItems.length;
      const pageItems = cachedItems.slice(offset, offset + limit);

      const pageInfo: QueryEntitiesResponse['pageInfo'] = {};
      if (offset + limit < totalItems) {
        pageInfo.nextCursor = makeCursor({
          id,
          offset: offset + limit,
          totalItems,
        });
      }
      if (offset > 0) {
        pageInfo.prevCursor = makeCursor({
          id,
          offset: Math.max(0, offset - limit),
          totalItems,
        });
      }

      return {
        items: request.fields
          ? pageItems.map(e => applyFieldsFilter(e, request.fields))
          : pageItems,
        totalItems,
        pageInfo,
      };
    }

    const filter = createFilter(request?.filter);
    let items = this.#entities.filter(filter);

    // Resolve full-text filter default fields to match catalog backend behavior:
    // when no fields are specified, search the first sort field, or metadata.uid
    if (request?.fullTextFilter) {
      const orderFields = request.orderFields
        ? [request.orderFields].flat()
        : [];
      items = applyFullTextFilter(items, {
        ...request.fullTextFilter,
        fields: request.fullTextFilter.fields ?? [
          orderFields[0]?.field ?? 'metadata.uid',
        ],
      });
    }

    items = applyOrdering(items, request?.orderFields);

    const totalItems = items.length;
    const offset = request?.offset ?? 0;
    const limit = request?.limit;

    // No pagination requested, return all items
    if (limit == null && offset === 0) {
      return {
        items: request?.fields
          ? items.map(e => applyFieldsFilter(e, request?.fields))
          : items,
        pageInfo: {},
        totalItems,
      };
    }

    const effectiveLimit = limit ?? totalItems;

    // Cache the full result set for cursor-based pagination
    const id = String(this.#nextQueryId++);
    this.#queryCache.set(id, items);

    const pageItems = items.slice(offset, offset + effectiveLimit);

    const pageInfo: QueryEntitiesResponse['pageInfo'] = {};
    if (offset + effectiveLimit < totalItems) {
      pageInfo.nextCursor = makeCursor({
        id,
        offset: offset + effectiveLimit,
        totalItems,
      });
    }
    if (offset > 0) {
      pageInfo.prevCursor = makeCursor({
        id,
        offset: Math.max(0, offset - effectiveLimit),
        totalItems,
      });
    }

    return {
      items: request?.fields
        ? pageItems.map(e => applyFieldsFilter(e, request?.fields))
        : pageItems,
      totalItems,
      pageInfo,
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
          // Use a Set to count each distinct value once per entity,
          // matching the backend's count(DISTINCT entity_id) behavior
          const uniqueValues = new Set(
            rows
              .filter(
                row =>
                  row.key.toLocaleLowerCase('en-US') ===
                  facet.toLocaleLowerCase('en-US'),
              )
              .map(row => row.value)
              .filter(v => v != null)
              .map(v => String(v)),
          );
          for (const value of uniqueValues) {
            facetValues.set(value, (facetValues.get(value) ?? 0) + 1);
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

  async getLocations(_request?: {}): Promise<GetLocationsResponse> {
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

  async analyzeLocation(
    _location: AnalyzeLocationRequest,
  ): Promise<AnalyzeLocationResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  async *streamEntities(
    request?: StreamEntitiesRequest,
  ): AsyncIterable<Entity[]> {
    let cursor: string | undefined = undefined;
    const limit = request?.pageSize ?? DEFAULT_STREAM_ENTITIES_LIMIT;
    do {
      const res = await this.queryEntities(
        cursor ? { ...request, limit, cursor } : { ...request, limit },
      );

      yield res.items;

      cursor = res.pageInfo.nextCursor;
    } while (cursor);
  }

  #createEntityRefMap() {
    return new Map(this.#entities.map(e => [stringifyEntityRef(e), e]));
  }
}
