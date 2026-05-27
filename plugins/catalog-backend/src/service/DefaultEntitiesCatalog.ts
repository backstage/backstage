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
  TotalItemsMode,
} from '../catalog/types';
import {
  DbFinalEntitiesRow,
  DbPageInfo,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
  DbSearchRow,
} from '../database/tables';
import { markForStitching } from '../database/operations/stitcher/markForStitching';

import {
  expandLegacyCompoundRelationsInEntity,
  isQueryEntitiesCursorRequest,
  isQueryEntitiesInitialRequest,
} from './util';
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
  private readonly enableRelationsCompatibility: boolean;

  constructor(options: {
    database: Knex;
    logger: LoggerService;
    enableRelationsCompatibility?: boolean;
  }) {
    this.database = options.database;
    this.logger = options.logger;
    this.enableRelationsCompatibility = Boolean(
      options.enableRelationsCompatibility,
    );
  }

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;
    const { limit, offset } = parsePagination(request?.pagination);
    const primaryOrder = request?.order?.[0];

    // When exactly one order field is specified we run a two-phase fetch
    // that drives from the search-by-key index for that field. The index
    // walks rows in already-sorted order, so the planner can short-circuit
    // on LIMIT instead of having to materialise and sort the full filtered
    // set. Phase 2 appends entities that lack the order field (NULLS LAST)
    // and is skipped when phase 1 already fills the request.
    //
    // Multi-field ordering falls back to the original LEFT JOIN shape
    // because tie-breaking on a second field requires materialisation of
    // the full set anyway.
    const useFastPath = primaryOrder && (request?.order?.length ?? 0) <= 1;
    let rows: DbFinalEntitiesRow[];
    if (useFastPath) {
      rows = await this.runOrderedEntitiesQuery(
        request!,
        primaryOrder,
        limit,
        offset,
      );
    } else {
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

      if (request?.order) {
        request.order.forEach(({ order }, index) => {
          if (db.client.config.client === 'pg') {
            entitiesQuery = entitiesQuery.orderBy([
              { column: `order_${index}.value`, order, nulls: 'last' },
            ]);
          } else {
            entitiesQuery = entitiesQuery.orderBy([
              {
                column: `order_${index}.value`,
                order: undefined,
                nulls: 'last',
              },
              { column: `order_${index}.value`, order },
            ]);
          }
        });
        entitiesQuery.orderBy('final_entities.entity_id', 'asc');
      } else {
        entitiesQuery = entitiesQuery.orderBy(
          'final_entities.entity_ref',
          'asc',
        );
      }

      if (limit !== undefined) {
        entitiesQuery = entitiesQuery.limit(limit + 1);
      }
      if (offset !== undefined) {
        entitiesQuery = entitiesQuery.offset(offset);
      }

      rows = await entitiesQuery;
    }

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
        this.enableRelationsCompatibility
          ? e => {
              expandLegacyCompoundRelationsInEntity(e);
              if (request?.fields) {
                return request.fields(e);
              }
              return e;
            }
          : request?.fields,
      ),
      pageInfo,
    };
  }

  /**
   * Two-phase fetch used when the caller has specified an order field.
   * See entities() for a longer description of the rationale.
   */
  private async runOrderedEntitiesQuery(
    request: EntitiesRequest,
    primaryOrder: EntityOrder,
    limit: number | undefined,
    offset: number | undefined,
  ): Promise<DbFinalEntitiesRow[]> {
    const db = this.database;
    const isPg = db.client.config.client === 'pg';
    const wantedRows =
      limit === undefined ? Number.MAX_SAFE_INTEGER : (offset ?? 0) + limit + 1;

    const applyFilter = <T extends object>(
      query: Knex.QueryBuilder<T>,
    ): Knex.QueryBuilder<T> => {
      if (!request.filter) {
        return query;
      }
      return applyEntityFilterToQuery({
        filter: request.filter,
        targetQuery: query,
        onEntityIdField: 'final_entities.entity_id',
        knex: db,
      });
    };

    // Phase 1 -- entities that have a non-NULL value for the order field.
    // Rows where the key exists but value IS NULL (e.g. the entity field is
    // explicitly null, or exceeded MAX_VALUE_LENGTH in buildEntitySearch) are
    // excluded here so they fall through to Phase 2 and sort in the same
    // NULLS-LAST bucket as entities that have no row for the key at all —
    // preserving the semantics of the previous LEFT JOIN approach.
    let withField = db('search as order_0')
      .innerJoin(
        'final_entities',
        'final_entities.entity_id',
        'order_0.entity_id',
      )
      .where('order_0.key', primaryOrder.field)
      .whereNotNull('order_0.value')
      .whereNotNull('final_entities.final_entity')
      .select<DbFinalEntitiesRow[]>('final_entities.*');
    withField = applyFilter(withField);
    withField = isPg
      ? withField.orderBy([
          { column: 'order_0.value', order: primaryOrder.order, nulls: 'last' },
          { column: 'final_entities.entity_id', order: 'asc' },
        ])
      : withField.orderBy([
          { column: 'order_0.value', order: undefined, nulls: 'last' },
          { column: 'order_0.value', order: primaryOrder.order },
          { column: 'final_entities.entity_id', order: 'asc' },
        ]);
    if (wantedRows < Number.MAX_SAFE_INTEGER) {
      withField = withField.limit(wantedRows);
    }
    const withFieldRows = await withField;

    // If phase 1 already covered everything we asked for, skip the second
    // phase entirely. This is the common UI case where every entity in the
    // filtered set has the order field.
    if (withFieldRows.length >= wantedRows) {
      const skip = offset ?? 0;
      return withFieldRows.slice(skip, skip + (limit ?? wantedRows) + 1);
    }

    // Phase 2 -- entities that lack the order field, appended after.
    let withoutField = db<DbFinalEntitiesRow>('final_entities')
      .select<DbFinalEntitiesRow[]>('final_entities.*')
      .whereNotNull('final_entities.final_entity')
      .whereNotExists(qb =>
        qb
          .from('search')
          .where('search.entity_id', db.ref('final_entities.entity_id'))
          .andWhere('search.key', primaryOrder.field)
          .whereNotNull('search.value'),
      );
    withoutField = applyFilter(withoutField);
    withoutField = withoutField.orderBy(
      'final_entities.entity_id',
      'asc', // NULL group always stable-sorted ASC regardless of primary direction
    );
    if (limit !== undefined) {
      // Phase 2 only contributes the rows that phase 1 didn't cover.
      const remaining =
        wantedRows - Math.min(withFieldRows.length, (offset ?? 0) + limit + 1);
      withoutField = withoutField.limit(Math.max(0, remaining));
    }
    const withoutFieldRows = await withoutField;

    const combined = [...withFieldRows, ...withoutFieldRows];
    if (limit === undefined) {
      return combined.slice(offset ?? 0);
    }
    const skip = offset ?? 0;
    return combined.slice(skip, skip + limit + 1);
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

      if (request?.filter || request?.query) {
        query = applyEntityFilterToQuery({
          filter: request.filter,
          query: request.query,
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

    const { totalItemsMode, ...cursor } = {
      orderFields: [] as EntityOrder[],
      isPrevious: false,
      ...parseCursorFromRequest(request),
    } satisfies Omit<Cursor, 'orderFieldValues'> & {
      orderFieldValues?: (string | null)[];
      totalItemsMode: TotalItemsMode;
    };

    const shouldComputeTotalItems =
      cursor.totalItems === undefined && totalItemsMode !== 'exclude';
    const isFetchingBackwards = cursor.isPrevious;

    if (cursor.orderFields.length > 1) {
      this.logger.warn(`Only one sort field is supported, ignoring the rest`);
    }

    const sortField = cursor.orderFields.at(0);
    const sortKey = sortField?.field.toLocaleLowerCase('en-US');

    const normalizedFullTextFilterTerm = cursor.fullTextFilter?.term?.trim();
    const textFilterFields = cursor.fullTextFilter?.fields ?? [
      sortKey || 'metadata.uid',
    ];

    // Shared predicate logic applied to both the list CTE and the
    // standalone count query so they stay in sync. The `searchInScope`
    // flag indicates whether a `search` table is already joined in the
    // target query (true for the list CTE when a sort field is set),
    // enabling a fast-path LIKE on the already-joined row.
    const applyPredicates = (
      q: Knex.QueryBuilder,
      options?: { searchInScope?: boolean },
    ) => {
      if (cursor.filter || cursor.query) {
        applyEntityFilterToQuery({
          filter: cursor.filter,
          query: cursor.query,
          targetQuery: q,
          onEntityIdField: 'final_entities.entity_id',
          knex: this.database,
        });
      }

      if (normalizedFullTextFilterTerm) {
        if (
          options?.searchInScope &&
          sortField &&
          textFilterFields.length === 1 &&
          textFilterFields[0] === sortKey
        ) {
          q.andWhereRaw(
            'search.value like ?',
            `%${normalizedFullTextFilterTerm.toLocaleLowerCase('en-US')}%`,
          );
        } else {
          const matchQuery = this.database<DbSearchRow>('search')
            .select('search.entity_id')
            .whereIn(
              'search.key',
              textFilterFields.map(field => field.toLocaleLowerCase('en-US')),
            )
            .andWhere(function keyFilter() {
              this.andWhereRaw(
                'search.value like ?',
                `%${normalizedFullTextFilterTerm.toLocaleLowerCase('en-US')}%`,
              );
            });
          q.andWhere('final_entities.entity_id', 'in', matchQuery);
        }
      }
    };

    // The list CTE. When a sort field is specified, the search table for
    // that key drives the query via INNER JOIN so that the covering index
    // walks rows in sort order, letting LIMIT short-circuit. Entities
    // that lack the sort field are excluded — this aligns totalItems with
    // the set reachable through cursor pagination.
    const dbQuery = this.database.with(
      'filtered',
      ['entity_id', 'final_entity', ...(sortField ? ['value'] : [])],
      inner => {
        if (sortField) {
          inner
            .from('search')
            .innerJoin(
              'final_entities',
              'final_entities.entity_id',
              'search.entity_id',
            )
            .where('search.key', sortKey!)
            .whereNotNull('search.value')
            .whereNotNull('final_entities.final_entity')
            .select({
              entity_id: 'final_entities.entity_id',
              final_entity: 'final_entities.final_entity',
              value: 'search.value',
            });
        } else {
          inner
            .from<DbFinalEntitiesRow>('final_entities')
            .whereNotNull('final_entity')
            .select({
              entity_id: 'final_entities.entity_id',
              final_entity: 'final_entities.final_entity',
            });
        }

        applyPredicates(inner, { searchInScope: !!sortField });
      },
    );

    // The list query references the CTE exactly once, allowing Postgres
    // 12+ to inline it and short-circuit on LIMIT.
    dbQuery.from('filtered').select('*');

    // Standalone count query — runs concurrently with the list so the
    // CTE stays single-referenced and inlineable.
    let countQuery: Knex.QueryBuilder | undefined;
    if (shouldComputeTotalItems) {
      countQuery = this.database('final_entities')
        .whereNotNull('final_entities.final_entity')
        .count('*', { as: 'count' });

      if (sortField) {
        countQuery.whereExists(
          this.database('search')
            .select(this.database.raw(1))
            .whereRaw('search.entity_id = final_entities.entity_id')
            .where('search.key', sortKey!)
            .whereNotNull('search.value'),
        );
      }

      applyPredicates(countQuery);
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

    let order = sortField?.order ?? 'asc';
    if (isFetchingBackwards) {
      order = invertOrder(order);
    }
    dbQuery.orderBy([
      ...(sortField ? [{ column: 'filtered.value', order }] : []),
      { column: 'filtered.entity_id', order },
    ]);

    // Apply a manually set initial offset
    if (
      isQueryEntitiesInitialRequest(request) &&
      request.offset !== undefined
    ) {
      dbQuery.offset(request.offset);
    }
    // fetch an extra item to check if there are more items.
    dbQuery.limit(isFetchingBackwards ? limit : limit + 1);

    // Run list and count queries concurrently
    const [rows, countResult] = await Promise.all([
      limit > 0 ? dbQuery : Promise.resolve([]),
      countQuery ?? Promise.resolve(undefined),
    ]);

    let totalItems: number;
    if (cursor.totalItems !== undefined) {
      totalItems = cursor.totalItems;
    } else if (totalItemsMode === 'exclude') {
      totalItems = 0;
    } else if (countResult?.[0]) {
      totalItems = Number(countResult[0].count);
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
    const relationPeerRefs = await this.database.transaction(async tx => {
      const dbConfig = tx.client.config;

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
        const results = await tx<DbRefreshStateRow>('refresh_state')
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
        await tx<DbRefreshStateRow>('refresh_state')
          .update({
            result_hash: 'child-was-deleted',
            next_update_at: tx.fn.now(),
          })
          .whereIn(
            'entity_id',
            results.map(key => key.entity_id),
          );
      } else {
        await tx<DbRefreshStateRow>('refresh_state')
          .update({
            result_hash: 'child-was-deleted',
            next_update_at: tx.fn.now(),
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

      const relationPeers = await tx
        .from<DbRelationsRow>('relations')
        .innerJoin<DbRefreshStateRow>('refresh_state', {
          'refresh_state.entity_ref': 'relations.target_entity_ref',
        })
        .where('relations.originating_entity_id', '=', uid)
        .andWhere('refresh_state.entity_id', '!=', uid)
        .select({ ref: 'relations.target_entity_ref' })
        .union(other =>
          other
            .from<DbRelationsRow>('relations')
            .innerJoin<DbRefreshStateRow>('refresh_state', {
              'refresh_state.entity_ref': 'relations.source_entity_ref',
            })
            .where('relations.originating_entity_id', '=', uid)
            .andWhere('refresh_state.entity_id', '!=', uid)
            .select({ ref: 'relations.source_entity_ref' }),
        );

      await tx<DbRefreshStateRow>('refresh_state')
        .where('entity_id', uid)
        .delete();

      return new Set(relationPeers.map(p => p.ref));
    });

    if (relationPeerRefs.size > 0) {
      await markForStitching({
        knex: this.database,
        entityRefs: relationPeerRefs,
      });
    }
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
      .groupBy(['search.key', 'search.original_value'])
      .orderBy(['search.key', 'search.original_value']);

    if (request.filter || request.query) {
      // Build a subquery that finds matching entity IDs via
      // final_entities, so that the EXISTS-based filters correlate
      // against one-row-per-entity rather than the much larger search
      // table. The whereNotNull guard on final_entity excludes
      // not-yet-stitched (or future tombstoned) entities.
      const entityIdSubquery = this.database('final_entities')
        .select('final_entities.entity_id')
        .whereNotNull('final_entities.final_entity');

      applyEntityFilterToQuery({
        filter: request.filter,
        query: request.query,
        targetQuery: entityIdSubquery,
        onEntityIdField: 'final_entities.entity_id',
        knex: this.database,
      });

      // Use INNER JOIN rather than `WHERE search.entity_id IN (...)`. The
      // results are the same but the JOIN form gives the planner more
      // freedom in join shape and ordering. On PostgreSQL with large
      // search tables, the IN form tends to materialize the full filtered
      // entity set up front and spill to temp; the JOIN form lets the
      // planner pick a much cheaper plan based on actual selectivities.
      query.innerJoin(
        entityIdSubquery.as('filtered_entities'),
        'search.entity_id',
        'filtered_entities.entity_id',
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

function parseCursorFromRequest(
  request?: QueryEntitiesRequest,
): Partial<Cursor> & { totalItemsMode: TotalItemsMode } {
  if (isQueryEntitiesInitialRequest(request)) {
    const {
      filter,
      query,
      orderFields: sortFields = [],
      fullTextFilter,
      totalItems: totalItemsMode = 'include',
    } = request;
    return {
      filter,
      query,
      orderFields: sortFields,
      fullTextFilter,
      totalItemsMode,
    };
  }
  if (isQueryEntitiesCursorRequest(request)) {
    return {
      ...request.cursor,
      // Doesn't matter — cursor already carries the computed totalItems
      // number from the first page, so the count query is skipped regardless.
      totalItemsMode: 'exclude',
    };
  }
  return {
    totalItemsMode: 'include',
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
