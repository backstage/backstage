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
import { chunk as lodashChunk, isEqual } from 'lodash';
import { z } from 'zod';
import {
  Cursor,
  EntitiesBatchRequest,
  EntitiesBatchResponse,
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntityAncestryResponse,
  EntityFacetsRequest,
  EntityFacetsResponse,
  EntityOrder,
  EntityPagination,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
} from '../catalog/types';
import {
  DbFinalEntitiesRow,
  DbPageInfo,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
  DbSearchRow,
} from '../database/tables';
import { Stitcher } from '../stitching/types';

import {
  isQueryEntitiesCursorRequest,
  isQueryEntitiesInitialRequest,
} from './util';
import {
  EntitiesSearchFilter,
  EntityFilter,
} from '@backstage/plugin-catalog-node';
import { LoggerService } from '@backstage/backend-plugin-api';

const defaultSortField: EntityOrder = {
  field: 'metadata.uid',
  order: 'asc',
};

const DEFAULT_LIMIT = 20;

function parsePagination(input?: EntityPagination): EntityPagination {
  if (!input) {
    return {};
  }

  let { limit, offset } = input;

  if (input.after === undefined) {
    return { limit, offset };
  }

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

  return { limit, offset };
}

function stringifyPagination(
  input: Required<Omit<EntityPagination, 'after'>>,
): string {
  const { limit, offset } = input;
  const json = JSON.stringify({ limit, offset });
  const base64 = Buffer.from(json, 'utf8').toString('base64');
  return base64;
}

function addCondition(
  queryBuilder: Knex.QueryBuilder,
  db: Knex,
  filter: EntitiesSearchFilter,
  negate: boolean = false,
  entityIdField = 'entity_id',
): void {
  const key = filter.key.toLowerCase();
  const values = filter.values?.map(v => v.toLowerCase());

  // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
  // make a lot of sense. However, it had abysmal performance on sqlite
  // when datasets grew large, so we're using IN instead.
  const matchQuery = db<DbSearchRow>('search')
    .select('search.entity_id')
    .where({ key })
    .andWhere(function keyFilter() {
      if (values?.length === 1) {
        this.where({ value: values.at(0) });
      } else if (values) {
        this.andWhere('value', 'in', values);
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
  if (isNegationEntityFilter(filter)) {
    return parseFilter(filter.not, query, db, !negate, entityIdField);
  }

  if (isEntitiesSearchFilter(filter)) {
    return query.andWhere(function filterFunction() {
      addCondition(this, db, filter, negate, entityIdField);
    });
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
  private readonly logger: LoggerService;
  private readonly stitcher: Stitcher;

  constructor(options: {
    database: Knex;
    logger: LoggerService;
    stitcher: Stitcher;
  }) {
    this.database = options.database;
    this.logger = options.logger;
    this.stitcher = options.stitcher;
  }

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;

    let entitiesQuery =
      db<DbFinalEntitiesRow>('final_entities').select('final_entities.*');

    request?.order?.forEach(({ field }, index) => {
      const alias = `order_${index}`;
      entitiesQuery = entitiesQuery.leftOuterJoin(
        { [alias]: 'search' },
        function search(inner) {
          inner
            .on(`${alias}.entity_id`, 'final_entities.entity_id')
            .andOn(`${alias}.key`, db.raw('?', [field]));
        },
      );
    });

    entitiesQuery = entitiesQuery.whereNotNull('final_entities.final_entity');

    if (request?.filter) {
      entitiesQuery = parseFilter(
        request.filter,
        entitiesQuery,
        db,
        false,
        'final_entities.entity_id',
      );
    }

    request?.order?.forEach(({ order }, index) => {
      if (db.client.config.client === 'pg') {
        // pg correctly orders by the column value and handling nulls in one go
        entitiesQuery = entitiesQuery.orderBy([
          { column: `order_${index}.value`, order, nulls: 'last' },
        ]);
      } else {
        // sqlite and mysql translate the above statement ONLY into "order by (value is null) asc"
        // no matter what the order is, for some reason, so we have to manually add back the statement
        // that translates to "order by value <order>" while avoiding to give an order
        entitiesQuery = entitiesQuery.orderBy([
          { column: `order_${index}.value`, order: undefined, nulls: 'last' },
          { column: `order_${index}.value`, order },
        ]);
      }
    });

    if (!request?.order) {
      entitiesQuery = entitiesQuery.orderBy('final_entities.entity_ref', 'asc'); // default sort
    } else {
      entitiesQuery.orderBy('final_entities.entity_id', 'asc'); // stable sort
    }

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

  async entitiesBatch(
    request: EntitiesBatchRequest,
  ): Promise<EntitiesBatchResponse> {
    const lookup = new Map<string, Entity>();

    for (const chunk of lodashChunk(request.entityRefs, 200)) {
      let query = this.database<DbFinalEntitiesRow>('final_entities')
        .select({
          entityRef: 'final_entities.entity_ref',
          entity: 'final_entities.final_entity',
        })
        .whereIn('final_entities.entity_ref', chunk);

      if (request?.filter) {
        query = parseFilter(
          request.filter,
          query,
          this.database,
          false,
          'final_entities.entity_id',
        );
      }

      for (const row of await query) {
        lookup.set(row.entityRef, row.entity ? JSON.parse(row.entity) : null);
      }
    }

    let items = request.entityRefs.map(ref => lookup.get(ref) ?? null);

    if (request.fields) {
      items = items.map(e => e && request.fields!(e));
    }

    return { items };
  }

  async queryEntities(
    request: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    const db = this.database;

    const limit = request.limit ?? DEFAULT_LIMIT;

    const cursor: Omit<Cursor, 'orderFieldValues'> & {
      orderFieldValues?: (string | null)[];
    } = {
      orderFields: [defaultSortField],
      isPrevious: false,
      ...parseCursorFromRequest(request),
    };

    const isFetchingBackwards = cursor.isPrevious;

    if (cursor.orderFields.length > 1) {
      this.logger.warn(`Only one sort field is supported, ignoring the rest`);
    }

    const sortField: EntityOrder = {
      ...defaultSortField,
      ...cursor.orderFields[0],
    };

    const [prevItemOrderFieldValue, prevItemUid] =
      cursor.orderFieldValues || [];

    const dbQuery = db('final_entities')
      .leftOuterJoin('search', qb =>
        qb
          .on('search.entity_id', 'final_entities.entity_id')
          .andOnVal('search.key', sortField.field),
      )
      .whereNotNull('final_entities.final_entity');

    if (cursor.filter) {
      parseFilter(
        cursor.filter,
        dbQuery,
        db,
        false,
        'final_entities.entity_id',
      );
    }

    const normalizedFullTextFilterTerm = cursor.fullTextFilter?.term?.trim();
    const textFilterFields = cursor.fullTextFilter?.fields ?? [sortField.field];
    if (normalizedFullTextFilterTerm) {
      if (
        textFilterFields.length === 1 &&
        textFilterFields[0] === sortField.field
      ) {
        // If there is one item, apply the like query to the top level query which is already
        //   filtered based on the singular sortField.
        dbQuery.andWhereRaw(
          'value like ?',
          `%${normalizedFullTextFilterTerm.toLocaleLowerCase('en-US')}%`,
        );
      } else {
        const matchQuery = db<DbSearchRow>('search')
          .select('search.entity_id')
          // textFilterFields must be lowercased to match searchable keys in database, i.e. spec.profile.displayName -> spec.profile.displayname
          .whereIn(
            'key',
            textFilterFields.map(field => field.toLocaleLowerCase('en-US')),
          )
          .andWhere(function keyFilter() {
            this.andWhereRaw(
              'value like ?',
              `%${normalizedFullTextFilterTerm.toLocaleLowerCase('en-US')}%`,
            );
          });
        dbQuery.andWhere('final_entities.entity_id', 'in', matchQuery);
      }
    }

    const countQuery = dbQuery.clone();

    const isOrderingDescending = sortField.order === 'desc';

    if (prevItemOrderFieldValue) {
      dbQuery.andWhere(function nested() {
        this.where(
          'value',
          isFetchingBackwards !== isOrderingDescending ? '<' : '>',
          prevItemOrderFieldValue,
        )
          .orWhere('value', '=', prevItemOrderFieldValue)
          .andWhere(
            'final_entities.entity_id',
            isFetchingBackwards !== isOrderingDescending ? '<' : '>',
            prevItemUid,
          );
      });
    }

    if (db.client.config.client === 'pg') {
      // pg correctly orders by the column value and handling nulls in one go
      dbQuery.orderBy([
        {
          column: 'search.value',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
          nulls: 'last',
        },
        {
          column: 'final_entities.entity_id',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
        },
      ]);
    } else {
      // sqlite and mysql translate the above statement ONLY into "order by (value is null) asc"
      // no matter what the order is, for some reason, so we have to manually add back the statement
      // that translates to "order by value <order>" while avoiding to give an order
      dbQuery.orderBy([
        {
          column: 'search.value',
          order: undefined,
          nulls: 'last',
        },
        {
          column: 'search.value',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
        },
        {
          column: 'final_entities.entity_id',
          order: isFetchingBackwards
            ? invertOrder(sortField.order)
            : sortField.order,
        },
      ]);
    }

    if (
      isQueryEntitiesInitialRequest(request) &&
      request.offset !== undefined
    ) {
      dbQuery.offset(request.offset);
    }
    // fetch an extra item to check if there are more items.
    dbQuery.limit(isFetchingBackwards ? limit : limit + 1);

    countQuery.count('final_entities.entity_id', { as: 'count' });

    const [rows, [{ count }]] = await Promise.all([
      limit > 0 ? dbQuery : [],
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

    const nextCursor: Cursor | undefined = hasMoreResults
      ? {
          ...cursor,
          orderFieldValues: sortFieldsFromRow(lastRow),
          firstSortFieldValues,
          isPrevious: false,
          totalItems,
        }
      : undefined;

    const prevCursor: Cursor | undefined =
      !isInitialRequest &&
      rows.length > 0 &&
      !isEqual(sortFieldsFromRow(firstRow), cursor.firstSortFieldValues)
        ? {
            ...cursor,
            orderFieldValues: sortFieldsFromRow(firstRow),
            firstSortFieldValues: cursor.firstSortFieldValues,
            isPrevious: true,
            totalItems,
          }
        : undefined;

    const items = rows
      .map(e => JSON.parse(e.final_entity!))
      .map(e => (request.fields ? request.fields(e) : e));

    return {
      items,
      pageInfo: {
        ...(!!prevCursor && { prevCursor }),
        ...(!!nextCursor && { nextCursor }),
      },
      totalItems,
    };
  }

  async removeEntityByUid(uid: string): Promise<void> {
    const dbConfig = this.database.client.config;

    // Clear the hashed state of the immediate parents of the deleted entity.
    // This makes sure that when they get reprocessed, their output is written
    // down again. The reason for wanting to do this, is that if the user
    // deletes entities that ARE still emitted by the parent, the parent
    // processing will still generate the same output hash as always, which
    // means it'll never try to write down the children again (it assumes that
    // they already exist). This means that without the code below, the database
    // never "heals" from accidental deletes.
    if (dbConfig.client.includes('mysql')) {
      // MySQL doesn't support the syntax we need to do this in a single query,
      // http://dev.mysql.com/doc/refman/5.6/en/update.html
      const results = await this.database<DbRefreshStateRow>('refresh_state')
        .select('entity_id')
        .whereIn('entity_ref', function parents(builder) {
          return builder
            .from<DbRefreshStateRow>('refresh_state')
            .innerJoin<DbRefreshStateReferencesRow>(
              'refresh_state_references',
              {
                'refresh_state_references.target_entity_ref':
                  'refresh_state.entity_ref',
              },
            )
            .where('refresh_state.entity_id', '=', uid)
            .select('refresh_state_references.source_entity_ref');
        });
      await this.database<DbRefreshStateRow>('refresh_state')
        .update({
          result_hash: 'child-was-deleted',
          next_update_at: this.database.fn.now(),
        })
        .whereIn(
          'entity_id',
          results.map(key => key.entity_id),
        );
    } else {
      await this.database<DbRefreshStateRow>('refresh_state')
        .update({
          result_hash: 'child-was-deleted',
          next_update_at: this.database.fn.now(),
        })
        .whereIn('entity_ref', function parents(builder) {
          return builder
            .from<DbRefreshStateRow>('refresh_state')
            .innerJoin<DbRefreshStateReferencesRow>(
              'refresh_state_references',
              {
                'refresh_state_references.target_entity_ref':
                  'refresh_state.entity_ref',
              },
            )
            .where('refresh_state.entity_id', '=', uid)
            .select('refresh_state_references.source_entity_ref');
        });
    }

    // Stitch the entities that the deleted one had relations to. If we do not
    // do this, the entities in the other end of the relations will still look
    // like they have a relation to the entity that was deleted, despite not
    // having any corresponding rows in the relations table.
    const relationPeers = await this.database
      .from<DbRelationsRow>('relations')
      .innerJoin<DbRefreshStateReferencesRow>('refresh_state', {
        'refresh_state.entity_ref': 'relations.target_entity_ref',
      })
      .where('relations.originating_entity_id', '=', uid)
      .andWhere('refresh_state.entity_id', '!=', uid)
      .select({ ref: 'relations.target_entity_ref' })
      .union(other =>
        other
          .from<DbRelationsRow>('relations')
          .innerJoin<DbRefreshStateReferencesRow>('refresh_state', {
            'refresh_state.entity_ref': 'relations.source_entity_ref',
          })
          .where('relations.originating_entity_id', '=', uid)
          .andWhere('refresh_state.entity_id', '!=', uid)
          .select({ ref: 'relations.source_entity_ref' }),
      );

    await this.database<DbRefreshStateRow>('refresh_state')
      .where('entity_id', uid)
      .delete();

    await this.stitcher.stitch({
      entityRefs: new Set(relationPeers.map(p => p.ref)),
    });
  }

  async entityAncestry(rootRef: string): Promise<EntityAncestryResponse> {
    const [rootRow] = await this.database<DbFinalEntitiesRow>('final_entities')
      .where('final_entities.entity_ref', '=', rootRef)
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
        .innerJoin<DbFinalEntitiesRow>('final_entities', {
          'refresh_state_references.source_entity_ref':
            'final_entities.entity_ref',
        })
        .where('refresh_state_references.target_entity_ref', '=', currentRef)
        .select({
          parentEntityRef: 'final_entities.entity_ref',
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
    const query = this.database<DbSearchRow>('search')
      .whereIn(
        'search.key',
        request.facets.map(f => f.toLocaleLowerCase('en-US')),
      )
      .whereNotNull('search.original_value')
      .select({
        facet: 'search.key',
        value: 'search.original_value',
        count: this.database.raw('count(*)'),
      })
      .groupBy(['search.key', 'search.original_value']);

    if (request.filter) {
      parseFilter(
        request.filter,
        query,
        this.database,
        false,
        'search.entity_id',
      );
    }

    const rows = await query;

    const facets: EntityFacetsResponse['facets'] = {};
    for (const facet of request.facets) {
      const facetLowercase = facet.toLocaleLowerCase('en-US');
      facets[facet] = rows
        .filter(row => row.facet === facetLowercase)
        .map(row => ({
          value: String(row.value),
          count: Number(row.count),
        }));
    }

    return { facets };
  }
}

const entityFilterParser: z.ZodSchema<EntityFilter> = z.lazy(() =>
  z
    .object({
      key: z.string(),
      values: z.array(z.string()).optional(),
    })
    .or(z.object({ not: entityFilterParser }))
    .or(z.object({ anyOf: z.array(entityFilterParser) }))
    .or(z.object({ allOf: z.array(entityFilterParser) })),
);

export const cursorParser: z.ZodSchema<Cursor> = z.object({
  orderFields: z.array(
    z.object({ field: z.string(), order: z.enum(['asc', 'desc']) }),
  ),
  orderFieldValues: z.array(z.string().or(z.null())),
  filter: entityFilterParser.optional(),
  isPrevious: z.boolean(),
  query: z.string().optional(),
  firstSortFieldValues: z.array(z.string().or(z.null())).optional(),
  totalItems: z.number().optional(),
});

function parseCursorFromRequest(
  request?: QueryEntitiesRequest,
): Partial<Cursor> {
  if (isQueryEntitiesInitialRequest(request)) {
    const {
      filter,
      orderFields: sortFields = [defaultSortField],
      fullTextFilter,
    } = request;
    return { filter, orderFields: sortFields, fullTextFilter };
  }
  if (isQueryEntitiesCursorRequest(request)) {
    return request.cursor;
  }
  return {};
}

function invertOrder(order: EntityOrder['order']) {
  return order === 'asc' ? 'desc' : 'asc';
}

function sortFieldsFromRow(row: DbSearchRow) {
  return [row.value, row.entity_id];
}
