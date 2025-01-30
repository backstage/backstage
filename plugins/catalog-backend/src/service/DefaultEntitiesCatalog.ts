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
  expandLegacyCompoundRelationsInEntity,
  isQueryEntitiesCursorRequest,
  isQueryEntitiesInitialRequest,
} from './util';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { applyEntityFilterToQuery } from './request/applyEntityFilterToQuery';
import { processRawEntitiesResult } from './response';

const DEFAULT_LIMIT = 200;

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

export class DefaultEntitiesCatalog implements EntitiesCatalog {
  private readonly database: Knex;
  private readonly logger: LoggerService;
  private readonly stitcher: Stitcher;
  private readonly disableRelationsCompatibility: boolean;

  constructor(options: {
    database: Knex;
    logger: LoggerService;
    stitcher: Stitcher;
    disableRelationsCompatibility?: boolean;
  }) {
    this.database = options.database;
    this.logger = options.logger;
    this.stitcher = options.stitcher;
    this.disableRelationsCompatibility = Boolean(
      options.disableRelationsCompatibility,
    );
  }

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;
    const { limit, offset } = parsePagination(request?.pagination);

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
      entitiesQuery = applyEntityFilterToQuery({
        filter: request.filter,
        targetQuery: entitiesQuery,
        onEntityIdField: 'final_entities.entity_id',
        knex: db,
      });
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

    return {
      entities: processRawEntitiesResult(
        rows.map(r => r.final_entity!),
        this.disableRelationsCompatibility
          ? request?.fields
          : e => {
              expandLegacyCompoundRelationsInEntity(e);
              if (request?.fields) {
                return request.fields(e);
              }
              return e;
            },
      ),
      pageInfo,
    };
  }

  async entitiesBatch(
    request: EntitiesBatchRequest,
  ): Promise<EntitiesBatchResponse> {
    const lookup = new Map<string, string>();

    for (const chunk of lodashChunk(request.entityRefs, 200)) {
      let query = this.database<DbFinalEntitiesRow>('final_entities')
        .select({
          entityRef: 'final_entities.entity_ref',
          entity: 'final_entities.final_entity',
        })
        .whereIn('final_entities.entity_ref', chunk);

      if (request?.filter) {
        query = applyEntityFilterToQuery({
          filter: request.filter,
          targetQuery: query,
          onEntityIdField: 'final_entities.entity_id',
          knex: this.database,
        });
      }

      for (const row of await query) {
        lookup.set(row.entityRef, row.entity ? row.entity : null);
      }
    }

    const items = request.entityRefs.map(ref => lookup.get(ref) ?? null);

    return { items: processRawEntitiesResult(items, request.fields) };
  }

  async queryEntities(
    request: QueryEntitiesRequest,
  ): Promise<QueryEntitiesResponse> {
    const limit = request.limit ?? DEFAULT_LIMIT;

    const cursor: Omit<Cursor, 'orderFieldValues'> & {
      orderFieldValues?: (string | null)[];
      skipTotalItems: boolean;
    } = {
      orderFields: [],
      isPrevious: false,
      ...parseCursorFromRequest(request),
    };

    // For performance reasons we invoke the count query only on the first
    // request. The result is then embedded into the cursor for subsequent
    // requests. Threfore this can be undefined here, but will then get
    // populated further down.
    const shouldComputeTotalItems =
      cursor.totalItems === undefined && !cursor.skipTotalItems;
    const isFetchingBackwards = cursor.isPrevious;

    if (cursor.orderFields.length > 1) {
      this.logger.warn(`Only one sort field is supported, ignoring the rest`);
    }

    const sortField = cursor.orderFields.at(0);

    // The first part of the query builder is a subquery that applies all of the
    // filtering.
    const dbQuery = this.database.with(
      'filtered',
      ['entity_id', 'final_entity', ...(sortField ? ['value'] : [])],
      inner => {
        inner
          .from<DbFinalEntitiesRow>('final_entities')
          .whereNotNull('final_entity');

        if (sortField) {
          inner
            .leftOuterJoin('search', qb =>
              qb
                .on('search.entity_id', 'final_entities.entity_id')
                .andOnVal('search.key', sortField.field),
            )
            .select({
              entity_id: 'final_entities.entity_id',
              final_entity: 'final_entities.final_entity',
              value: 'search.value',
            });
        } else {
          inner.select({
            entity_id: 'final_entities.entity_id',
            final_entity: 'final_entities.final_entity',
          });
        }

        // Add regular filters, if given
        if (cursor.filter) {
          applyEntityFilterToQuery({
            filter: cursor.filter,
            targetQuery: inner,
            onEntityIdField: 'final_entities.entity_id',
            knex: this.database,
          });
        }

        // Add full text search filters, if given
        const normalizedFullTextFilterTerm =
          cursor.fullTextFilter?.term?.trim();
        const textFilterFields = cursor.fullTextFilter?.fields ?? [
          sortField?.field || 'metadata.uid',
        ];
        if (normalizedFullTextFilterTerm) {
          if (
            textFilterFields.length === 1 &&
            textFilterFields[0] === sortField?.field
          ) {
            // If there is one item, apply the like query to the top level query which is already
            //   filtered based on the singular sortField.
            inner.andWhereRaw(
              'search.value like ?',
              `%${normalizedFullTextFilterTerm.toLocaleLowerCase('en-US')}%`,
            );
          } else {
            const matchQuery = this.database<DbSearchRow>('search')
              .select('search.entity_id')
              // textFilterFields must be lowercased to match searchable keys in database, i.e. spec.profile.displayName -> spec.profile.displayname
              .whereIn(
                'search.key',
                textFilterFields.map(field => field.toLocaleLowerCase('en-US')),
              )
              .andWhere(function keyFilter() {
                this.andWhereRaw(
                  'search.value like ?',
                  `%${normalizedFullTextFilterTerm.toLocaleLowerCase(
                    'en-US',
                  )}%`,
                );
              });
            inner.andWhere('final_entities.entity_id', 'in', matchQuery);
          }
        }
      },
    );

    // Only pay the cost of counting the number of items if needed
    if (shouldComputeTotalItems) {
      // Note the intentional cross join here. The filtered_count dataset is
      // always exactly one row, so it won't grow the result unnecessarily. But
      // it's also important that there IS at least one row, because even if the
      // filtered dataset is empty, we still want to know the total number of
      // items.
      dbQuery
        .with('filtered_count', ['count'], inner =>
          inner.from('filtered').count('*', { as: 'count' }),
        )
        .fromRaw('filtered_count, filtered')
        .select('count', 'filtered.*');
    } else {
      dbQuery.from('filtered').select('*');
    }

    const isOrderingDescending = sortField?.order === 'desc';

    // Move forward (or backward) in the set to the correct cursor position
    if (cursor.orderFieldValues) {
      if (cursor.orderFieldValues.length === 2) {
        // The first will be the sortField value, the second the entity_id
        const [first, second] = cursor.orderFieldValues;
        dbQuery.andWhere(function nested() {
          this.where(
            'filtered.value',
            isFetchingBackwards !== isOrderingDescending ? '<' : '>',
            first,
          )
            .orWhere('filtered.value', '=', first)
            .andWhere(
              'filtered.entity_id',
              isFetchingBackwards !== isOrderingDescending ? '<' : '>',
              second,
            );
        });
      } else if (cursor.orderFieldValues.length === 1) {
        // This will be the entity_id
        const [first] = cursor.orderFieldValues;
        dbQuery.andWhere('entity_id', isFetchingBackwards ? '<' : '>', first);
      }
    }

    // Add the ordering
    let order = sortField?.order ?? 'asc';
    if (isFetchingBackwards) {
      order = invertOrder(order);
    }
    if (this.database.client.config.client === 'pg') {
      // pg correctly orders by the column value and handling nulls in one go
      dbQuery.orderBy([
        ...(sortField
          ? [
              {
                column: 'filtered.value',
                order,
                nulls: 'last',
              },
            ]
          : []),
        {
          column: 'filtered.entity_id',
          order,
        },
      ]);
    } else {
      // sqlite and mysql translate the above statement ONLY into "order by (value is null) asc"
      // no matter what the order is, for some reason, so we have to manually add back the statement
      // that translates to "order by value <order>" while avoiding to give an order
      dbQuery.orderBy([
        ...(sortField
          ? [
              {
                column: 'filtered.value',
                order: undefined,
                nulls: 'last',
              },
              {
                column: 'filtered.value',
                order,
              },
            ]
          : []),
        {
          column: 'filtered.entity_id',
          order,
        },
      ]);
    }

    // Apply a manually set initial offset
    if (
      isQueryEntitiesInitialRequest(request) &&
      request.offset !== undefined
    ) {
      dbQuery.offset(request.offset);
    }
    // fetch an extra item to check if there are more items.
    dbQuery.limit(isFetchingBackwards ? limit : limit + 1);

    const rows = shouldComputeTotalItems || limit > 0 ? await dbQuery : [];

    let totalItems: number;
    if (cursor.totalItems !== undefined) {
      totalItems = cursor.totalItems;
    } else if (cursor.skipTotalItems) {
      totalItems = 0;
    } else if (rows.length) {
      totalItems = Number(rows[0].count);
    } else {
      totalItems = 0;
    }

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

    const firstSortFieldValues =
      cursor.firstSortFieldValues || sortFieldsFromRow(firstRow, sortField);

    const nextCursor: Cursor | undefined = hasMoreResults
      ? {
          ...cursor,
          orderFieldValues: sortFieldsFromRow(lastRow, sortField),
          firstSortFieldValues,
          isPrevious: false,
          totalItems,
        }
      : undefined;

    const prevCursor: Cursor | undefined =
      !isInitialRequest &&
      rows.length > 0 &&
      !isEqual(
        sortFieldsFromRow(firstRow, sortField),
        cursor.firstSortFieldValues,
      )
        ? {
            ...cursor,
            orderFieldValues: sortFieldsFromRow(firstRow, sortField),
            firstSortFieldValues: cursor.firstSortFieldValues,
            isPrevious: true,
            totalItems,
          }
        : undefined;

    return {
      items: processRawEntitiesResult(
        rows.map(r => r.final_entity!),
        request.fields,
      ),
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
      applyEntityFilterToQuery({
        filter: request.filter,
        targetQuery: query,
        onEntityIdField: 'search.entity_id',
        knex: this.database,
      });
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
): Partial<Cursor> & { skipTotalItems: boolean } {
  if (isQueryEntitiesInitialRequest(request)) {
    const {
      filter,
      orderFields: sortFields = [],
      fullTextFilter,
      skipTotalItems = false,
    } = request;
    return { filter, orderFields: sortFields, fullTextFilter, skipTotalItems };
  }
  if (isQueryEntitiesCursorRequest(request)) {
    return {
      ...request.cursor,
      // Doesn't matter here
      skipTotalItems: false,
    };
  }
  return {
    skipTotalItems: false,
  };
}

function invertOrder(order: EntityOrder['order']) {
  return order === 'asc' ? 'desc' : 'asc';
}

function sortFieldsFromRow(
  row: DbSearchRow & DbFinalEntitiesRow,
  sortField?: EntityOrder | undefined,
) {
  return sortField ? [row?.value, row?.entity_id] : [row?.entity_id];
}
