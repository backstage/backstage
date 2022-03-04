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
import lodash from 'lodash';
import {
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
  EntitiesSearchFilter,
  EntityAncestryResponse,
  EntityFacetsRequest,
  EntityFacetsResponse,
  EntityFilter,
  EntityPagination,
} from '../catalog/types';
import {
  DbFinalEntitiesRow,
  DbPageInfo,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';

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

export class DefaultEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Knex) {}

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;

    let entitiesQuery = db<DbFinalEntitiesRow>('final_entities');
    if (request?.filter) {
      entitiesQuery = parseFilter(request.filter, entitiesQuery, db);
    }

    // TODO: move final_entities to use entity_ref
    entitiesQuery = entitiesQuery
      .select('final_entities.*')
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
          return lodash.get(entity, facet);
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

      const counts = lodash.countBy(values, lodash.identity);

      facets[facet] = Object.entries(counts).map(([value, count]) => ({
        value,
        count,
      }));
    }

    return { facets };
  }
}
