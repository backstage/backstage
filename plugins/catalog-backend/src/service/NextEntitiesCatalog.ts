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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { InputError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import {
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntityAncestryResponse,
  EntityFilter,
  EntitiesSearchFilter,
  EntitiesBaseRequest,
  EntitiesCursorRequest,
  Cursor,
  PageInfo,
} from '../catalog/types';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';

function addCondition(
  queryBuilder: Knex.QueryBuilder,
  db: Knex,
  filter: EntitiesSearchFilter,
  negate: boolean = false,
) {
  // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
  // make a lot of sense. However, it had abysmal performance on sqlite
  // when datasets grew large, so we're using IN instead.
  const matchQuery = db<DbSearchRow>('search')
    .select('entity_id')
    .where({ key: filter.key.toLowerCase() })
    .andWhere(function keyFilter() {
      if (filter.values) {
        if (filter.values.length === 1) {
          this.where({ value: filter.values[0].toLowerCase() });
        } else {
          this.andWhere(
            'value',
            'in',
            filter.values.map(v => v.toLowerCase()),
          );
        }
      }
    });
  queryBuilder.andWhere('entity_id', negate ? 'not in' : 'in', matchQuery);
}

function isEntitiesSearchFilter(
  filter: EntitiesSearchFilter | EntityFilter,
): filter is EntitiesSearchFilter {
  return filter.hasOwnProperty('key');
}

function isOrEntityFilter(
  filter: { anyOf: EntityFilter[] } | EntityFilter,
): filter is { anyOf: EntityFilter[] } {
  return filter.hasOwnProperty('anyOf');
}

function isNegationEntityFilter(
  filter: { not: EntityFilter } | EntityFilter,
): filter is { not: EntityFilter } {
  return filter.hasOwnProperty('not');
}

function parseFilter(
  filter: EntityFilter,
  query: Knex.QueryBuilder,
  db: Knex,
  negate: boolean = false,
): Knex.QueryBuilder {
  if (isEntitiesSearchFilter(filter)) {
    return query.andWhere(function filterFunction() {
      addCondition(this, db, filter, negate);
    });
  }

  if (isNegationEntityFilter(filter)) {
    return parseFilter(filter.not, query, db, !negate);
  }

  return query[negate ? 'andWhereNot' : 'andWhere'](function filterFunction() {
    if (isOrEntityFilter(filter)) {
      for (const subFilter of filter.anyOf ?? []) {
        this.orWhere(subQuery => parseFilter(subFilter, subQuery, db));
      }
    } else {
      for (const subFilter of filter.allOf ?? []) {
        this.andWhere(subQuery => parseFilter(subFilter, subQuery, db));
      }
    }
  });
}

export class NextEntitiesCatalog implements EntitiesCatalog {
  constructor(
    private readonly database: Knex,
    private readonly properties: {
      defaultLimit: number;
      defaultSortField: string;
    } = {
      defaultLimit: Number.MAX_SAFE_INTEGER,
      defaultSortField: 'metadata.uid',
    },
  ) {}

  async entities(request: EntitiesRequest = {}): Promise<EntitiesResponse> {
    const db = this.database;

    const limit = request?.limit || this.properties.defaultLimit;

    const cursor: Omit<Cursor, 'sortFieldId' | 'previousPage'> & {
      sortFieldId?: string;
      previousPage?: number;
    } = {
      sortField: this.properties.defaultSortField,
      sortFieldOrder: 'asc',
      isPrevious: false,
      ...parseCursorFromRequest(request),
    };

    const isFetchingBackwards = cursor.isPrevious;

    /**
     * all the pages are only used for quickly
     * detecting the initial batch of items
     * when navigating backwards without performing
     * extra operations on the database.
     */
    let currentPage = 1;
    if (cursor.previousPage) {
      currentPage = isFetchingBackwards
        ? cursor.previousPage - 1
        : cursor.previousPage + 1;
    }

    const entitiesQuery = db<DbFinalEntitiesRow & { sort_field: string }>(
      'final_entities',
    );
    if (cursor.filter) {
      parseFilter(cursor.filter, entitiesQuery, db);
    }

    const orderSubquery = db('search')
      .select('value')
      .where('entity_id', db.ref('final_entities.entity_id'))
      .andWhere('key', cursor.sortField)
      .as('sort_field');

    // TODO: move final_entities to use entity_ref
    entitiesQuery
      .select('final_entities.*', orderSubquery)
      .whereNotNull('final_entities.final_entity');

    if (cursor.sortFieldId) {
      entitiesQuery.andWhere(
        'sort_field',
        cursor.isPrevious ? '<' : '>',
        cursor.sortFieldId,
      );
    }

    entitiesQuery.orderBy(
      'sort_field',
      isFetchingBackwards
        ? invertOrder(cursor.sortFieldOrder)
        : cursor.sortFieldOrder,
    );

    entitiesQuery.limit(isFetchingBackwards ? limit : limit + 1);

    const rows = await (cursor.isPrevious
      ? db
          .select('*')
          .from(entitiesQuery)
          .orderBy('sort_field', cursor.sortFieldOrder)
      : entitiesQuery);
    const pageInfo: PageInfo = {};

    const hasMoreResults = isFetchingBackwards || rows.length > limit;

    // only do this when fetching forward
    if (rows.length > limit) {
      rows.length -= 1;
    }

    if (hasMoreResults) {
      pageInfo.nextCursor = encodeCursor({
        ...cursor,
        sortFieldId: rows[rows.length - 1].sort_field,
        previousPage: currentPage,
        isPrevious: false,
      });
    }
    if (rows.length > 0 && currentPage > 1) {
      pageInfo.prevCursor = encodeCursor({
        ...cursor,
        sortFieldId: rows[0].sort_field,
        previousPage: currentPage,
        isPrevious: true,
      });
    }

    const entities = rows
      .map(e => JSON.parse(e.final_entity!))
      .map(e => (request?.fields ? request.fields(e) : e));

    return {
      entities,
      pageInfo,
    };
  }

  async removeEntityByUid(uid: string): Promise<void> {
    await this.database<DbRefreshStateRow>('refresh_state')
      .where('entity_id', uid)
      .delete();
  }

  async entityAncestry(rootRef: string): Promise<EntityAncestryResponse> {
    const [rootRow] = await this.database<DbRefreshStateRow>('refresh_state')
      .leftJoin<DbFinalEntitiesRow>('final_entities', {
        'refresh_state.entity_id': 'final_entities.entity_id',
      })
      .where('refresh_state.entity_ref', '=', rootRef)
      .select({
        entityJson: 'final_entities.final_entity',
      });

    if (!rootRow) {
      throw new NotFoundError(`No such entity ${rootRef}`);
    }

    const rootEntity = JSON.parse(rootRow.entityJson) as Entity;
    const seenEntityRefs = new Set<string>();
    const todo = new Array<Entity>();
    const items = new Array<{ entity: Entity; parentEntityRefs: string[] }>();

    for (
      let current: Entity | undefined = rootEntity;
      current;
      current = todo.pop()
    ) {
      const currentRef = stringifyEntityRef(current);
      seenEntityRefs.add(currentRef);

      const parentRows = await this.database<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      )
        .innerJoin<DbRefreshStateRow>('refresh_state', {
          'refresh_state_references.source_entity_ref':
            'refresh_state.entity_ref',
        })
        .innerJoin<DbFinalEntitiesRow>('final_entities', {
          'refresh_state.entity_id': 'final_entities.entity_id',
        })
        .where('refresh_state_references.target_entity_ref', '=', currentRef)
        .select({
          parentEntityRef: 'refresh_state.entity_ref',
          parentEntityJson: 'final_entities.final_entity',
        });

      const parentRefs: string[] = [];
      for (const { parentEntityRef, parentEntityJson } of parentRows) {
        parentRefs.push(parentEntityRef);
        if (!seenEntityRefs.has(parentEntityRef)) {
          seenEntityRefs.add(parentEntityRef);
          todo.push(JSON.parse(parentEntityJson));
        }
      }

      items.push({
        entity: current,
        parentEntityRefs: parentRefs,
      });
    }

    return {
      rootEntityRef: stringifyEntityRef(rootEntity),
      items,
    };
  }

  async batchAddOrUpdateEntities(): Promise<never> {
    throw new Error('Not implemented');
  }
}

function encodeCursor(cursor: Cursor) {
  const json = JSON.stringify(cursor);
  return Buffer.from(json, 'utf8').toString('base64');
}

function parseCursorFromRequest(request: EntitiesRequest): Partial<Cursor> {
  if (isEntitiesBaseRequest(request)) {
    const { fields, ...cursor } = request;
    return cursor;
  }
  if (isEntitiesCursorRequest(request)) {
    try {
      const json = Buffer.from(request.cursor, 'base64').toString('utf8');
      const cursor = JSON.parse(json);
      // TODO(vinzscam): validate the shit
      return cursor as unknown as Cursor;
    } catch {
      throw new InputError('Malformed cursor, could not be parsed');
    }
  }
  return {};
}

function isEntitiesBaseRequest(
  input: EntitiesRequest | undefined,
): input is EntitiesBaseRequest {
  // TODO(vinzscam) expand this
  return !isEntitiesCursorRequest(input);
}

function isEntitiesCursorRequest(
  input: EntitiesRequest | undefined,
): input is EntitiesCursorRequest {
  // TODO(vinzscam) expand this
  return input?.hasOwnProperty('cursor') ?? false;
}

function invertOrder(order: Cursor['sortFieldOrder']) {
  return order === 'asc' ? 'desc' : 'asc';
}
