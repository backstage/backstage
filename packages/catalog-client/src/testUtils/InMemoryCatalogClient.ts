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
  QueryLocationsInitialRequest,
  QueryLocationsRequest,
  QueryLocationsResponse,
  StreamEntitiesRequest,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import {
  CompoundEntityRef,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  InputError,
  NotFoundError,
  NotImplementedError,
} from '@backstage/errors';
import {
  FilterPredicate,
  FilterPredicateExpression,
  FilterPredicateValue,
} from '@backstage/filter-predicates';
import lodash from 'lodash';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { buildEntitySearch } from '../../../../plugins/catalog-backend/src/database/operations/stitcher/buildEntitySearch';
import type {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';
import { DEFAULT_STREAM_ENTITIES_LIMIT } from '../constants.ts';

function makeCursor(data: Record<string, unknown>): string {
  return btoa(JSON.stringify(data));
}

function parseCursor(cursor: string): Record<string, unknown> {
  return JSON.parse(atob(cursor));
}

// CATALOG_FILTER_EXISTS is a Symbol that doesn't survive JSON serialization,
// so we swap it with a sentinel string when encoding/decoding cursors.
const FILTER_EXISTS_SENTINEL = '\0CATALOG_FILTER_EXISTS';

function serializeFilterValue(v: unknown): unknown {
  if (v === CATALOG_FILTER_EXISTS) return FILTER_EXISTS_SENTINEL;
  if (Array.isArray(v)) {
    return v.map(x =>
      x === CATALOG_FILTER_EXISTS ? FILTER_EXISTS_SENTINEL : x,
    );
  }
  return v;
}

function deserializeFilterValue(v: unknown): unknown {
  if (v === FILTER_EXISTS_SENTINEL) return CATALOG_FILTER_EXISTS;
  if (Array.isArray(v)) {
    return v.map(x =>
      x === FILTER_EXISTS_SENTINEL ? CATALOG_FILTER_EXISTS : x,
    );
  }
  return v;
}

function serializeFilter(filter?: EntityFilterQuery): any[] | undefined {
  if (!filter) return undefined;
  return [filter]
    .flat()
    .map(f =>
      Object.fromEntries(
        Object.entries(f).map(([k, v]) => [k, serializeFilterValue(v)]),
      ),
    );
}

function deserializeFilter(filter?: any[]): EntityFilterQuery | undefined {
  if (!filter) return undefined;
  return filter.map(
    f =>
      Object.fromEntries(
        Object.entries(f).map(([k, v]: [string, any]) => [
          k,
          deserializeFilterValue(v),
        ]),
      ) as Record<string, string | symbol | (string | symbol)[]>,
  );
}

function createFilter(
  filterOrFilters?: EntityFilterQuery,
): (entity: Entity) => boolean {
  if (!filterOrFilters) {
    return () => true;
  }

  const filters = [filterOrFilters].flat();

  return entity => {
    const rows = buildEntitySearch('', entity);

    return filters.some(filter => {
      for (const [key, expectedValue] of Object.entries(filter)) {
        const searchValues = rows
          .filter(row => row.key === key.toLowerCase())
          .map(row => row.value?.toString().toLowerCase());

        if (searchValues.length === 0) {
          return false;
        }
        if (expectedValue === CATALOG_FILTER_EXISTS) {
          continue;
        }
        if (Array.isArray(expectedValue)) {
          return expectedValue.some(value =>
            searchValues?.includes(String(value).toLowerCase()),
          );
        }
        if (!searchValues?.includes(String(expectedValue).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  };
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type SearchRow = ReturnType<typeof buildEntitySearch>[number];

function fieldPredicate(
  key: string,
  value: FilterPredicateValue,
): FilterPredicate {
  const predicate: FilterPredicateExpression = {};
  predicate[key] = value;
  return predicate;
}

// Translates a filter predicate into an equivalent one without $contains,
// following the backend's applyPredicateEntityFilterToQuery. This runs once up
// front so that unsupported predicates are rejected regardless of the data,
// just like in the backend.
function translateQuery(predicate: FilterPredicate): FilterPredicate {
  if (!isObject(predicate)) {
    const actual = JSON.stringify(predicate);
    throw new InputError(
      `Invalid filter predicate: top-level primitive values are not supported. Wrap the value in a field expression, e.g. { "kind": ${actual} }`,
    );
  }
  if ('$not' in predicate) {
    return { $not: translateQuery(predicate.$not) };
  }
  if ('$all' in predicate) {
    return { $all: predicate.$all.map(translateQuery) };
  }
  if ('$any' in predicate) {
    return { $any: predicate.$any.map(translateQuery) };
  }
  return {
    $all: Object.entries(predicate).map(([key, value]) =>
      translateQueryField(key.toLowerCase(), value),
    ),
  };
}

function translateQueryField(
  key: string,
  value: FilterPredicateValue,
): FilterPredicate {
  if (
    isPrimitive(value) ||
    (isObject(value) &&
      ('$exists' in value || '$in' in value || '$hasPrefix' in value))
  ) {
    return fieldPredicate(key, value);
  }

  if (isObject(value) && '$contains' in value) {
    const target: unknown = value.$contains;

    // The search table has one row per array item, so this is plain equality
    if (isPrimitive(target)) {
      return fieldPredicate(key, target);
    }

    // { relations: { $contains: { type, targetRef } } } maps onto the
    // search table's relations.<type> keys
    if (key === 'relations' && isObject(target)) {
      return translateContainsRelation(target);
    }
  }

  throw new InputError(
    `Unsupported filter predicate value for field "${key}": ${JSON.stringify(
      value,
    )}`,
  );
}

function translateContainsRelation(
  target: Record<string, unknown>,
): FilterPredicate {
  const { type, targetRef, ...rest } = target;
  if (type === undefined || Object.keys(rest).length > 0) {
    throw new InputError(
      `The $contains operator for "relations" requires a "type" and optionally a "targetRef" property, but got ${JSON.stringify(
        target,
      )}`,
    );
  }

  const key = `relations.${String(type).toLowerCase()}`;
  if (targetRef === undefined) {
    return fieldPredicate(key, { $exists: true });
  }
  if (typeof targetRef === 'string') {
    return fieldPredicate(key, targetRef);
  }
  if (isObject(targetRef) && Array.isArray(targetRef.$in)) {
    return fieldPredicate(key, { $in: targetRef.$in.map(String) });
  }
  throw new InputError(
    `Unsupported "targetRef" in $contains for "relations": ${JSON.stringify(
      targetRef,
    )}`,
  );
}

// Evaluates a translated filter predicate against the search rows of an
// entity, matching the same way as the backend does against the search table.
function evaluateQuery(predicate: FilterPredicate, rows: SearchRow[]): boolean {
  if (!isObject(predicate)) {
    return false;
  }
  if ('$not' in predicate) {
    return !evaluateQuery(predicate.$not, rows);
  }
  if ('$all' in predicate) {
    return predicate.$all.every(p => evaluateQuery(p, rows));
  }
  if ('$any' in predicate) {
    return predicate.$any.some(p => evaluateQuery(p, rows));
  }
  return Object.entries(predicate).every(([key, value]) => {
    const values = rows
      .filter(row => row.key === key)
      .map(row => row.value?.toString().toLowerCase());
    if (isPrimitive(value)) {
      return values.includes(String(value).toLowerCase());
    }
    if (isObject(value) && '$exists' in value) {
      return value.$exists ? values.length > 0 : values.length === 0;
    }
    if (isObject(value) && '$in' in value) {
      return value.$in.some(v => values.includes(String(v).toLowerCase()));
    }
    if (isObject(value) && '$hasPrefix' in value) {
      const prefix = value.$hasPrefix.toLowerCase();
      return values.some(v => v?.startsWith(prefix));
    }
    // $contains and unsupported values never get here, since translateQuery
    // has already erased or rejected them
    return false;
  });
}

function createQueryFilter(
  query: FilterPredicate,
): (entity: Entity) => boolean {
  const translated = translateQuery(query);
  return entity => evaluateQuery(translated, buildEntitySearch('', entity));
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
    searchMap.set(entity, buildEntitySearch('', entity));
  }

  return [...entities].sort((a, b) => {
    const aRows = searchMap.get(a)!;
    const bRows = searchMap.get(b)!;

    for (const { field, order: dir } of orders) {
      const key = field.toLowerCase();
      const aRow = aRows.find(r => r.key.toLowerCase() === key);
      const bRow = bRows.find(r => r.key.toLowerCase() === key);
      const aValue =
        aRow?.value !== null && aRow?.value !== undefined
          ? String(aRow.value).toLowerCase()
          : null;
      const bValue =
        bRow?.value !== null && bRow?.value !== undefined
          ? String(bRow.value).toLowerCase()
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
    if (aRef < bRef) return -1;
    if (aRef > bRef) return 1;
    return 0;
  });
}

function applyFullTextFilter(
  entities: Entity[],
  fullTextFilter?: { term: string; fields?: string[] },
): Entity[] {
  if (!fullTextFilter?.term?.trim()) {
    return entities;
  }
  const term = fullTextFilter.term.trim().toLowerCase();
  const fields = fullTextFilter.fields?.map(f => f.toLowerCase());

  return entities.filter(entity => {
    const rows = buildEntitySearch('', entity);
    return rows.some(row => {
      if (fields?.length && !fields.includes(row.key.toLowerCase())) {
        return false;
      }
      if (row.value === null || row.value === undefined) return false;
      const value = String(row.value).toLowerCase();
      return value.includes(term);
    });
  });
}

/**
 * Implements a fake catalog client that stores entities in memory.
 * Supports filtering, ordering, pagination, full-text search, and field
 * projection for entity query methods. Query predicates are evaluated
 * against the same search rows as the backend, so field keys are
 * case-insensitive and relation shorthand such as `relations.hasMember`
 * is supported. Location and validation methods
 * throw {@link @backstage/errors#NotImplementedError}.
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
    let items = this.#entities.filter(filter);
    items = applyOrdering(items, request?.order);

    let offset = request?.offset ?? 0;
    let limit = request?.limit;

    if (request?.after) {
      try {
        const cursor = parseCursor(request.after);
        if (cursor.offset !== undefined) offset = cursor.offset as number;
        if (cursor.limit !== undefined) limit = cursor.limit as number;
      } catch {
        throw new InputError('Invalid cursor');
      }
    }

    if (offset > 0) {
      items = items.slice(offset);
    }
    if (limit !== undefined) {
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
    const queryFilter = request.query
      ? createQueryFilter(request.query)
      : undefined;
    const refMap = this.#createEntityRefMap();
    const items = request.entityRefs
      .map(ref => refMap.get(ref))
      .map(e =>
        e && filter(e) && (!queryFilter || queryFilter(e)) ? e : undefined,
      );
    return {
      items: request.fields
        ? items.map(e => (e ? applyFieldsFilter(e, request.fields) : undefined))
        : items,
    };
  }

  async queryEntities(
    request?: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    // Decode query parameters from cursor or from the request directly
    let filter: EntityFilterQuery | undefined;
    let query: FilterPredicate | undefined;
    let orderFields: EntityOrderQuery | undefined;
    let fullTextFilter: { term: string; fields?: string[] } | undefined;
    let offset: number;
    let limit: number | undefined;

    if (request && 'cursor' in request) {
      let c: Record<string, unknown>;
      try {
        c = parseCursor(request.cursor);
      } catch {
        throw new InputError('Invalid cursor');
      }
      filter = deserializeFilter(c.filter as any[]);
      query = c.query as FilterPredicate | undefined;
      orderFields = c.orderFields as EntityOrderQuery | undefined;
      fullTextFilter = c.fullTextFilter as typeof fullTextFilter;
      offset = c.offset as number;
      limit = request.limit;
    } else {
      filter = request?.filter;
      query = request?.query;
      orderFields = request?.orderFields;
      fullTextFilter = request?.fullTextFilter;
      offset = request?.offset ?? 0;
      limit = request?.limit;
    }

    // Apply filter
    let items = this.#entities.filter(createFilter(filter));

    // Apply predicate-based query filter
    if (query) {
      items = items.filter(createQueryFilter(query));
    }

    // Apply full-text filter, defaulting to the sort field or metadata.uid
    if (fullTextFilter) {
      const orderFieldsList = orderFields ? [orderFields].flat() : [];
      items = applyFullTextFilter(items, {
        ...fullTextFilter,
        fields: fullTextFilter.fields ?? [
          orderFieldsList[0]?.field ?? 'metadata.uid',
        ],
      });
    }

    items = applyOrdering(items, orderFields);

    const totalItems = items.length;

    // No pagination requested, return all items
    if (limit === undefined && offset === 0) {
      return {
        items: request?.fields
          ? items.map(e => applyFieldsFilter(e, request?.fields))
          : items,
        pageInfo: {},
        totalItems,
      };
    }

    const effectiveLimit = limit ?? totalItems;
    const pageItems = items.slice(offset, offset + effectiveLimit);

    const cursorBase = {
      filter: serializeFilter(filter),
      query,
      orderFields,
      fullTextFilter,
      totalItems,
    };
    const pageInfo: QueryEntitiesResponse['pageInfo'] = {};
    if (offset + effectiveLimit < totalItems) {
      pageInfo.nextCursor = makeCursor({
        ...cursorBase,
        offset: offset + effectiveLimit,
      });
    }
    if (offset > 0) {
      pageInfo.prevCursor = makeCursor({
        ...cursorBase,
        offset: Math.max(0, offset - effectiveLimit),
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
    let filteredEntities = this.#entities.filter(filter);
    if (request.query) {
      filteredEntities = filteredEntities.filter(
        createQueryFilter(request.query),
      );
    }
    const facets = Object.fromEntries(
      request.facets.map(facet => {
        const facetValues = new Map<string, number>();
        for (const entity of filteredEntities) {
          const rows = buildEntitySearch('', entity);
          // Use a Set to count each distinct value once per entity,
          // matching the backend's count(DISTINCT entity_id) behavior
          const uniqueValues = new Set(
            rows
              .filter(row => row.key.toLowerCase() === facet.toLowerCase())
              .map(row => row.original_value)
              .filter(v => v !== null && v !== undefined)
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

  async queryLocations(
    _request?: QueryLocationsRequest,
  ): Promise<QueryLocationsResponse> {
    throw new NotImplementedError('Method not implemented.');
  }

  async *streamLocations(
    _request?: QueryLocationsInitialRequest,
  ): AsyncIterable<Location[]> {
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

  async updateLocation(
    _id: string,
    _location: { type?: string; target: string },
  ): Promise<Location> {
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
