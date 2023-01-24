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

import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { InputError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { get, countBy, identity, isEqual } from 'lodash';
import { Logger } from 'winston';
import {
  Cursor,
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntitiesSearchFilter,
  EntityAncestryResponse,
  EntityFacetsRequest,
  EntityFacetsResponse,
  EntityFilter,
  EntityPagination,
  EntitySortField,
  PaginatedEntitiesRequest,
  PaginatedEntitiesResponse,
} from '../catalog/types';
import {
  DbFinalEntitiesRow,
  DbPageInfo,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import {
  isPaginatedEntitiesCursorRequest,
  isPaginatedEntitiesInitialRequest,
} from './util';

const defaultSortField: EntitySortField = {
  field: 'metadata.uid',
  order: 'asc',
};

function parsePagination(input?: EntityPagination): {
  limit?: number;
  offset?: number;
} {
  if (!input) {
    return {};
  }

  let { limit, offset } = input;

  if (input.after !== undefined) {
    let cursor;
    try {
      const json = Buffer.from(input.after, 'base64').toString('utf8');
      cursor = JSON.parse(json);
    } catch {
      throw new InputError('Malformed after cursor, could not be parsed');
    }
    if (cursor.limit !== undefined) {
      if (!Number.isInteger(cursor.limit)) {
        throw new InputError('Malformed after cursor, limit was not an number');
      }
      limit = cursor.limit;
    }
    if (cursor.offset !== undefined) {
      if (!Number.isInteger(cursor.offset)) {
        throw new InputError('Malformed after cursor, offset was not a number');
      }
      offset = cursor.offset;
    }
  }

  return { limit, offset };
}

function stringifyPagination(input: { limit: number; offset: number }) {
  const json = JSON.stringify({ limit: input.limit, offset: input.offset });
  const base64 = Buffer.from(json, 'utf8').toString('base64');
  return base64;
}

function addCondition(
  queryBuilder: Knex.QueryBuilder,
  db: Knex,
  filter: EntitiesSearchFilter,
  negate: boolean = false,
  entityIdField = 'entity_id',
) {
  // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
  // make a lot of sense. However, it had abysmal performance on sqlite
  // when datasets grew large, so we're using IN instead.
  const matchQuery = db<DbSearchRow>('search')
    .select(entityIdField)
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
  queryBuilder.andWhere(entityIdField, negate ? 'not in' : 'in', matchQuery);
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
  entityIdField = 'entity_id',
): Knex.QueryBuilder {
  if (isEntitiesSearchFilter(filter)) {
    return query.andWhere(function filterFunction() {
      addCondition(this, db, filter, negate, entityIdField);
    });
  }

  if (isNegationEntityFilter(filter)) {
    return parseFilter(filter.not, query, db, !negate, entityIdField);
  }

  return query[negate ? 'andWhereNot' : 'andWhere'](function filterFunction() {
    if (isOrEntityFilter(filter)) {
      for (const subFilter of filter.anyOf ?? []) {
        this.orWhere(subQuery =>
          parseFilter(subFilter, subQuery, db, false, entityIdField),
        );
      }
    } else {
      for (const subFilter of filter.allOf ?? []) {
        this.andWhere(subQuery =>
          parseFilter(subFilter, subQuery, db, false, entityIdField),
        );
      }
    }
  });
}

export class DefaultEntitiesCatalog implements EntitiesCatalog {
  private readonly database: Knex;
  private readonly logger: Logger;

  constructor(options: { database: Knex; logger: Logger }) {
    this.database = options.database;
    this.logger = options.logger;
  }

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;

    let entitiesQuery =
      db<DbFinalEntitiesRow>('final_entities').select('final_entities.*');
    if (request?.filter) {
      entitiesQuery = parseFilter(request.filter, entitiesQuery, db);
    }

    // TODO: move final_entities to use entity_ref
    entitiesQuery = entitiesQuery
      .whereNotNull('final_entities.final_entity')
      .orderBy('entity_id', 'asc');

    const { limit, offset } = parsePagination(request?.pagination);
    if (limit !== undefined) {
      entitiesQuery = entitiesQuery.limit(limit + 1);
    }
    if (offset !== undefined) {
      entitiesQuery = entitiesQuery.offset(offset);
    }

    let rows = await entitiesQuery;

    let pageInfo: DbPageInfo;
    if (limit === undefined || rows.length <= limit) {
      pageInfo = { hasNextPage: false };
    } else {
      rows = rows.slice(0, -1);
      pageInfo = {
        hasNextPage: true,
        endCursor: stringifyPagination({
          limit,
          offset: (offset ?? 0) + limit,
        }),
      };
    }

    let entities: Entity[] = rows.map(e => JSON.parse(e.final_entity!));

    if (request?.fields) {
      entities = entities.map(e => request.fields!(e));
    }

    // TODO(freben): This is added as a compatibility guarantee, until we can be
    // sure that all adopters have re-stitched their entities so that the new
    // targetRef field is present on them, and that they have stopped consuming
    // the now-removed old field
    // TODO(jhaals): Remove this in April 2022
    for (const entity of entities) {
      if (entity.relations) {
        for (const relation of entity.relations as any) {
          if (!relation.targetRef && relation.target) {
            // This is the case where an old-form entity, not yet stitched with
            // the updated code, was in the database
            relation.targetRef = stringifyEntityRef(relation.target);
          } else if (!relation.target && relation.targetRef) {
            // This is the case where a new-form entity, stitched with the
            // updated code, was in the database but we still want to produce
            // the old data shape as well for compatibility reasons
            relation.target = parseEntityRef(relation.targetRef);
          }
        }
      }
    }

    return {
      entities,
      pageInfo,
    };
  }

  async paginatedEntities(
    request?: PaginatedEntitiesRequest,
  ): Promise<PaginatedEntitiesResponse> {
    const db = this.database;
    const limit = request?.limit ?? 20;

    const cursor: Omit<Cursor, 'sortFieldValues'> & {
      sortFieldValues?: (string | null)[];
    } = {
      sortFields: [defaultSortField],
      isPrevious: false,
      ...parseCursorFromRequest(request),
    };

    const isFetchingBackwards = cursor.isPrevious;

    if (cursor.sortFields.length > 1) {
      this.logger.warn(`Only one sort field is supported, ignoring the rest`);
    }

    const sortField: EntitySortField = {
      ...defaultSortField,
      ...cursor.sortFields[0],
    };

    const [prevItemSortFieldValue, prevItemUid] = cursor.sortFieldValues || [];

    const dbQuery = db('search')
      .join('final_entities', 'search.entity_id', 'final_entities.entity_id')
      .where('search.key', sortField.field);

    if (cursor.filter) {
      parseFilter(cursor.filter, dbQuery, db, false, 'search.entity_id');
    }

    const normalizedQueryByName = cursor.query?.trim();
    if (normalizedQueryByName) {
      dbQuery.andWhereLike(
        'value',
        `%${normalizedQueryByName.toLocaleLowerCase('en-US')}%`,
      );
    }

    const countQuery = dbQuery.clone();

    const isOrderingDescending = sortField.order === 'desc';

    if (prevItemSortFieldValue) {
      dbQuery.andWhere(
        'value',
        isFetchingBackwards !== isOrderingDescending ? '<' : '>',
        prevItemSortFieldValue,
      );
      dbQuery.orWhere(function nested() {
        this.where('value', '=', prevItemSortFieldValue).andWhere(
          'search.entity_id',
          isFetchingBackwards !== isOrderingDescending ? '<' : '>',
          prevItemUid,
        );
      });
    }

    dbQuery
      .orderBy([
        {
          column: 'value',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
        },
        {
          column: 'search.entity_id',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
        },
      ])
      // fetch an extra item to check if there are more items.
      .limit(isFetchingBackwards ? limit : limit + 1);

    countQuery.count('search.entity_id', { as: 'count' });

    const [rows, [{ count }]] = await Promise.all([
      dbQuery,
      // for performance reasons we invoke the countQuery
      // only on the first request.
      // The result is then embedded into the cursor
      // for subsequent requests.
      typeof cursor.totalItems === 'undefined'
        ? countQuery
        : [{ count: cursor.totalItems }],
    ]);

    const totalItems = Number(count);

    if (isFetchingBackwards) {
      rows.reverse();
    }
    const hasMoreResults =
      limit > 0 && (isFetchingBackwards || rows.length > limit);

    // discard the extra item only when fetching forward.
    if (rows.length > limit) {
      rows.length -= 1;
    }

    const isInitialRequest = cursor.firstSortFieldValues === undefined;

    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];

    const firstSortFieldValues = cursor.firstSortFieldValues || [
      firstRow?.value,
      firstRow?.entity_id,
    ];

    const nextCursor = hasMoreResults
      ? encodeCursor({
          ...cursor,
          sortFieldValues: sortFieldsFromRow(lastRow),
          firstSortFieldValues,
          isPrevious: false,
          totalItems,
        })
      : undefined;

    const prevCursor =
      !isInitialRequest &&
      rows.length > 0 &&
      !isEqual(sortFieldsFromRow(firstRow), cursor.firstSortFieldValues)
        ? encodeCursor({
            ...cursor,
            sortFieldValues: sortFieldsFromRow(firstRow),
            firstSortFieldValues: cursor.firstSortFieldValues,
            isPrevious: true,
            totalItems,
          })
        : undefined;

    const entities = rows
      .map(e => JSON.parse(e.final_entity!))
      .map(e => (request?.fields ? request.fields(e) : e));

    return { entities, prevCursor, nextCursor, totalItems };
  }

  async removeEntityByUid(uid: string): Promise<void> {
    // Clear the hashed state of the immediate parents of the deleted entity.
    // This makes sure that when they get reprocessed, their output is written
    // down again. The reason for wanting to do this, is that if the user
    // deletes entities that ARE still emitted by the parent, the parent
    // processing will still generate the same output hash as always, which
    // means it'll never try to write down the children again (it assumes that
    // they already exist). This means that without the code below, the database
    // never "heals" from accidental deletes.
    await this.database<DbRefreshStateRow>('refresh_state')
      .update({
        result_hash: 'child-was-deleted',
      })
      .whereIn('entity_ref', function parents(builder) {
        return builder
          .from<DbRefreshStateRow>('refresh_state')
          .innerJoin<DbRefreshStateReferencesRow>('refresh_state_references', {
            'refresh_state_references.target_entity_ref':
              'refresh_state.entity_ref',
          })
          .where('refresh_state.entity_id', '=', uid)
          .select('refresh_state_references.source_entity_ref');
      });

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

  async facets(request: EntityFacetsRequest): Promise<EntityFacetsResponse> {
    const { entities } = await this.entities({
      filter: request.filter,
      authorizationToken: request.authorizationToken,
    });

    const facets: EntityFacetsResponse['facets'] = {};

    for (const facet of request.facets) {
      const values = entities
        .map(entity => {
          const relationsPrefix = 'relations.';
          if (facet.startsWith(relationsPrefix)) {
            const type = facet
              .substring(relationsPrefix.length)
              .toLocaleLowerCase('en-US');

            return entity.relations
              ?.filter(r => r.type.toLocaleLowerCase('en-US') === type)
              .map(o => o.targetRef);
          }
          // TODO(freben): Generalize this code to handle any field that may
          // have dots in its key?
          if (facet.startsWith('metadata.annotations.')) {
            return entity.metadata.annotations?.[
              facet.substring('metadata.annotations.'.length)
            ];
          } else if (facet.startsWith('metadata.labels.')) {
            return entity.metadata.labels?.[
              facet.substring('metadata.labels.'.length)
            ];
          }
          return get(entity, facet);
        })
        .flatMap(field => {
          if (typeof field === 'string') {
            return [field];
          } else if (Array.isArray(field)) {
            return field.filter(i => typeof i === 'string');
          }
          return [];
        })
        .sort();

      const counts = countBy(values, identity);

      facets[facet] = Object.entries(counts).map(([value, count]) => ({
        value,
        count,
      }));
    }

    return { facets };
  }
}

function encodeCursor(cursor: Cursor) {
  const json = JSON.stringify(cursor);
  return Buffer.from(json, 'utf8').toString('base64');
}

function parseCursorFromRequest(
  request?: PaginatedEntitiesRequest,
): Partial<Cursor> {
  if (isPaginatedEntitiesInitialRequest(request)) {
    const { filter, sortFields = [defaultSortField], query } = request;
    return { filter, sortFields, query };
  }
  if (isPaginatedEntitiesCursorRequest(request)) {
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

function invertOrder(order: EntitySortField['order']) {
  return order === 'asc' ? 'desc' : 'asc';
}

function sortFieldsFromRow(row: DbSearchRow) {
  return [row.value, row.entity_id];
}
