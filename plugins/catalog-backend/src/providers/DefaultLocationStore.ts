/*
 * Copyright 2021 The Backstage Authors
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

import { Location } from '@backstage/catalog-client';
import { ConflictError, InputError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import {
  DbLocationsRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { getEntityLocationRef } from '../processing/util';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { locationSpecToLocationEntity } from '../util/conversion';
import { LocationInput, LocationStore } from '../service/types';
import {
  ANNOTATION_ORIGIN_LOCATION,
  CompoundEntityRef,
  parseLocationRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  CatalogScmEvent,
  CatalogScmEventsService,
} from '@backstage/plugin-catalog-node/alpha';
import { chunk, uniqBy } from 'lodash';
import parseGitUrl, { type GitUrl } from 'git-url-parse';
import { ScmEventHandlingConfig } from '../util/readScmEventHandlingConfig';
import {
  FilterPredicate,
  FilterPredicateValue,
} from '@backstage/filter-predicates';

export class DefaultLocationStore implements LocationStore, EntityProvider {
  private _connection: EntityProviderConnection | undefined;
  private readonly db: Knex;
  private readonly scmEvents: CatalogScmEventsService;
  private readonly scmEventHandlingConfig: ScmEventHandlingConfig;

  constructor(
    db: Knex,
    scmEvents: CatalogScmEventsService,
    scmEventHandlingConfig: ScmEventHandlingConfig,
  ) {
    this.db = db;
    this.scmEvents = scmEvents;
    this.scmEventHandlingConfig = scmEventHandlingConfig;
  }

  getProviderName(): string {
    return 'DefaultLocationStore';
  }

  async createLocation(input: LocationInput): Promise<Location> {
    const location = await this.db.transaction(async tx => {
      // Attempt to find a previous location matching the input
      const previousLocations = await this.locations(tx);
      // TODO: when location id's are a compilation of input target we can remove this full
      // lookup of locations first and just grab the by that instead.
      const previousLocation = previousLocations.some(
        l => input.type === l.type && input.target === l.target,
      );
      if (previousLocation) {
        throw new ConflictError(
          `Location ${input.type}:${input.target} already exists`,
        );
      }

      const inner: DbLocationsRow = {
        id: uuid(),
        type: input.type,
        target: input.target,
      };

      await tx<DbLocationsRow>('locations').insert(inner);

      return inner;
    });
    const entity = locationSpecToLocationEntity({ location });
    await this.connection.applyMutation({
      type: 'delta',
      added: [{ entity, locationKey: getEntityLocationRef(entity) }],
      removed: [],
    });

    return location;
  }

  async listLocations(): Promise<Location[]> {
    return await this.locations();
  }

  async queryLocations(options: {
    limit: number;
    afterId?: string;
    query?: FilterPredicate;
  }): Promise<{ items: Location[]; totalItems: number }> {
    let itemsQuery = this.db<DbLocationsRow>('locations').whereNot(
      'type',
      'bootstrap',
    );

    if (options.query) {
      itemsQuery = applyLocationFilterToQuery(
        this.db.client.config.client,
        itemsQuery,
        options.query,
      );
    }

    const countQuery = itemsQuery.clone().count('*', { as: 'count' });

    itemsQuery = itemsQuery.orderBy('id', 'asc');
    if (options.afterId !== undefined) {
      itemsQuery = itemsQuery.where('id', '>', options.afterId);
    }
    if (options.limit !== undefined) {
      itemsQuery = itemsQuery.limit(options.limit);
    }

    const [items, [{ count }]] = await Promise.all([itemsQuery, countQuery]);

    return {
      items: items.map(item => ({
        id: item.id,
        target: item.target,
        type: item.type,
      })),
      totalItems: Number(count),
    };
  }

  async getLocation(id: string): Promise<Location> {
    const items = await this.db<DbLocationsRow>('locations')
      .where({ id })
      .select();

    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async deleteLocation(id: string): Promise<void> {
    if (!this.connection) {
      throw new Error('location store is not initialized');
    }

    const deleted = await this.db.transaction(async tx => {
      const [location] = await tx<DbLocationsRow>('locations')
        .where({ id })
        .select();

      if (!location) {
        throw new NotFoundError(`Found no location with ID ${id}`);
      }

      await tx<DbLocationsRow>('locations').where({ id }).del();
      return location;
    });
    const entity = locationSpecToLocationEntity({ location: deleted });
    await this.connection.applyMutation({
      type: 'delta',
      added: [],
      removed: [{ entity, locationKey: getEntityLocationRef(entity) }],
    });
  }

  async getLocationByEntity(entityRef: CompoundEntityRef): Promise<Location> {
    const entityRefString = stringifyEntityRef(entityRef);

    const [entityRow] = await this.db<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRefString })
      .select('entity_id')
      .limit(1);
    if (!entityRow) {
      throw new NotFoundError(`found no entity for ref ${entityRefString}`);
    }

    const [searchRow] = await this.db<DbSearchRow>('search')
      .where({
        entity_id: entityRow.entity_id,
        key: `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
      })
      .select('original_value')
      .limit(1);
    if (!searchRow?.original_value) {
      throw new NotFoundError(
        `found no origin annotation for ref ${entityRefString}`,
      );
    }

    const { type, target } = parseLocationRef(searchRow.original_value);
    const [locationRow] = await this.db<DbLocationsRow>('locations')
      .where({ type, target })
      .select()
      .limit(1);

    if (!locationRow) {
      throw new NotFoundError(
        `Found no location with type ${type} and target ${target}`,
      );
    }

    return locationRow;
  }

  private get connection(): EntityProviderConnection {
    if (!this._connection) {
      throw new Error('location store is not initialized');
    }

    return this._connection;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this._connection = connection;

    const locations = await this.locations();

    const entities = locations.map(location => {
      const entity = locationSpecToLocationEntity({ location });
      return { entity, locationKey: getEntityLocationRef(entity) };
    });

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    if (
      this.scmEventHandlingConfig.unregister ||
      this.scmEventHandlingConfig.move
    ) {
      this.scmEvents.subscribe({ onEvents: this.#onScmEvents.bind(this) });
    }
  }

  private async locations(dbOrTx: Knex.Transaction | Knex = this.db) {
    const locations = await dbOrTx<DbLocationsRow>('locations').select();
    return (
      locations
        // TODO(blam): We should create a mutation to remove this location for everyone
        // eventually when it's all done and dusted
        .filter(({ type }) => type !== 'bootstrap')
        .map(item => ({
          id: item.id,
          target: item.target,
          type: item.type,
        }))
    );
  }

  // #region SCM event handling

  async #onScmEvents(events: CatalogScmEvent[]): Promise<void> {
    const exactLocationsToDelete = new Set<string>();
    const locationPrefixesToDelete = new Set<string>();
    const exactLocationsToCreate = new Set<string>();
    const locationPrefixesToMove = new Map<string, string>();

    for (const event of events) {
      if (
        event.type === 'location.deleted' &&
        this.scmEventHandlingConfig.unregister
      ) {
        exactLocationsToDelete.add(event.url);
      } else if (
        event.type === 'location.moved' &&
        this.scmEventHandlingConfig.move
      ) {
        // Since Location entities are named after their target URL, these
        // unfortunately have to be translated into deletion and creation
        exactLocationsToDelete.add(event.fromUrl);
        exactLocationsToCreate.add(event.toUrl);
      } else if (
        event.type === 'repository.deleted' &&
        this.scmEventHandlingConfig.unregister
      ) {
        locationPrefixesToDelete.add(event.url);
      } else if (
        event.type === 'repository.moved' &&
        this.scmEventHandlingConfig.move
      ) {
        // These also have to be handled with deletions and creations
        locationPrefixesToMove.set(event.fromUrl, event.toUrl);
      }
    }

    if (exactLocationsToDelete.size > 0) {
      await this.#deleteLocationsByExactUrl(exactLocationsToDelete);
    }
    if (locationPrefixesToDelete.size > 0) {
      await this.#deleteLocationsByUrlPrefix(locationPrefixesToDelete);
    }
    if (exactLocationsToCreate.size > 0) {
      await this.#createLocationsByExactUrl(exactLocationsToCreate);
    }
    if (locationPrefixesToMove.size > 0) {
      await this.#moveLocationsByUrlPrefix(locationPrefixesToMove);
    }
  }

  async #createLocationsByExactUrl(urls: Iterable<string>): Promise<number> {
    let count = 0;

    for (const batch of chunk(Array.from(urls), 100)) {
      const existingUrls = await this.db<DbLocationsRow>('locations')
        .where('type', '=', 'url')
        .whereIn('target', batch)
        .select()
        .then(rows => new Set(rows.map(row => row.target)));

      const newLocations = batch
        .filter(url => !existingUrls.has(url))
        .map(url => ({ id: uuid(), type: 'url', target: url }));

      if (newLocations.length) {
        await this.db<DbLocationsRow>('locations').insert(newLocations);

        await this.connection.applyMutation({
          type: 'delta',
          added: newLocations.map(location => {
            const entity = locationSpecToLocationEntity({ location });
            return { entity, locationKey: getEntityLocationRef(entity) };
          }),
          removed: [],
        });

        count += newLocations.length;
      }
    }

    return count;
  }

  async #deleteLocationsByExactUrl(urls: Iterable<string>): Promise<number> {
    let count = 0;

    for (const batch of chunk(Array.from(urls), 100)) {
      const rows = await this.db<DbLocationsRow>('locations')
        .where('type', '=', 'url')
        .whereIn('target', batch)
        .select();

      if (rows.length) {
        await this.db<DbLocationsRow>('locations')
          .whereIn(
            'id',
            rows.map(row => row.id),
          )
          .delete();

        await this.connection.applyMutation({
          type: 'delta',
          added: [],
          removed: rows.map(row => ({
            entity: locationSpecToLocationEntity({ location: row }),
          })),
        });

        count += rows.length;
      }
    }

    return count;
  }

  async #deleteLocationsByUrlPrefix(urls: Iterable<string>): Promise<number> {
    const matches = await this.#findLocationsByPrefixOrExactMatch(urls);
    if (matches.length) {
      await this.#deleteLocations(matches.map(l => l.row));
    }

    return matches.length;
  }

  async #moveLocationsByUrlPrefix(
    urlPrefixes: Map<string, string>,
  ): Promise<number> {
    let count = 0;

    for (const [fromPrefix, toPrefix] of urlPrefixes) {
      if (fromPrefix === toPrefix) {
        continue;
      }

      if (fromPrefix.match(/[?#]/) || toPrefix.match(/[?#]/)) {
        // TODO(freben): We can't yet support complex URL locations where e.g.
        // the path can be anywhere in the URL including in the query or hash
        // part. The code below currently assumes that we can use simple
        // substring operations.
        continue;
      }

      const matches = await this.#findLocationsByPrefixOrExactMatch([
        fromPrefix,
      ]);
      if (matches.length) {
        await this.#deleteLocations(matches.map(m => m.row));

        await this.#createLocationsByExactUrl(
          matches.map(m => {
            const remainder = m.row.target
              .slice(fromPrefix.length)
              .replace(/^\/+/, '');
            if (!remainder) {
              return toPrefix;
            }
            return `${toPrefix.replace(/\/+$/, '')}/${remainder}`;
          }),
        );

        count += matches.length;
      }
    }

    return count;
  }

  async #deleteLocations(rows: DbLocationsRow[]): Promise<void> {
    // Delete the location table entries (in chunks so as not to overload the
    // knex query builder)
    for (const ids of chunk(
      rows.map(l => l.id),
      100,
    )) {
      await this.db<DbLocationsRow>('locations').whereIn('id', ids).delete();
    }

    // Delete the corresponding Location kind entities (this is efficiently
    // chunked internally in the catalog)
    await this.connection.applyMutation({
      type: 'delta',
      added: [],
      removed: rows.map(l => ({
        entity: locationSpecToLocationEntity({ location: l }),
      })),
    });
  }

  /**
   * Given a "base" URL prefix, find all locations that are for paths at or
   * below it.
   *
   * For example, given a base URL prefix of
   * "https://github.com/backstage/backstage/blob/master/plugins", it will match
   * locations inside the plugins directory, and nowhere else.
   */
  async #findLocationsByPrefixOrExactMatch(
    urls: Iterable<string>,
  ): Promise<Array<{ row: DbLocationsRow; parsed: GitUrl }>> {
    const result = new Array<{ row: DbLocationsRow; parsed: GitUrl }>();

    for (const url of urls) {
      let base: GitUrl;
      try {
        base = parseGitUrl(url);
      } catch (error) {
        throw new Error(`Invalid URL prefix, could not parse: ${url}`);
      }

      if (!base.owner || !base.name) {
        throw new Error(
          `Invalid URL prefix, missing owner or repository: ${url}`,
        );
      }

      const pathPrefix =
        base.filepath === '' || base.filepath.endsWith('/')
          ? base.filepath
          : `${base.filepath}/`;

      const rows = await this.db<DbLocationsRow>('locations')
        .where('type', '=', 'url')
        // Initial rough pruning to not have to go through them all
        .where('target', 'like', `%${base.owner}%`)
        .where('target', 'like', `%${base.name}%`)
        .select();

      result.push(
        ...rows.flatMap(row => {
          try {
            // We do this pretty explicit set of checks because we want to support
            // providers that have a URL format where the path isn't necessarily at
            // the end of the URL string (e.g. in the query part). Some of these may
            // be empty strings etc, but that's fine as long as they parse to the
            // same thing as above.
            const candidate = parseGitUrl(row.target);

            if (
              candidate.protocol === base.protocol &&
              candidate.resource === base.resource &&
              candidate.port === base.port &&
              candidate.organization === base.organization &&
              candidate.owner === base.owner &&
              candidate.name === base.name &&
              // If the base has no ref (for example didn't have the "/blob/master"
              // part and therefore targeted an entire repository) then we match any
              // ref below that
              (!base.ref || candidate.ref === base.ref) &&
              // Match both on exact equality and any subpath with a slash between
              (candidate.filepath === base.filepath ||
                candidate.filepath.startsWith(pathPrefix))
            ) {
              return [{ row, parsed: candidate }];
            }
            return [];
          } catch {
            return [];
          }
        }),
      );
    }

    return uniqBy(result, entry => entry.row.id);
  }

  // #endregion
}

/**
 * Recursively builds up the SQL expression corresponding to the given filter
 * predicate.
 *
 * @remarks
 *
 * Design note: The code prefers to let the SQL engine achieve case
 * insensitivitiy. We could attempt to use `.toUpperCase` etc on the client
 * side, but that would only work for the values being passed in, not the column
 * side of the expression. If we let the database perform UPPER on both, we know
 * that they will always be locale consistent etc as well.
 *
 * This does come at a runtime cost. However, the data set is typically rather
 * small in the grand scheme of things, and we can add the proper indices in the
 * future if needed. At this point I considered it not worth the effort.
 */
function applyLocationFilterToQuery(
  clientType: string,
  inputQuery: Knex.QueryBuilder,
  query: FilterPredicate,
): Knex.QueryBuilder {
  let result = inputQuery;

  if (!query || typeof query !== 'object' || Array.isArray(query)) {
    throw new InputError('Invalid filter predicate, expected an object');
  }

  if ('$all' in query) {
    // Explicitly handle the empty case to avoid malformed SQL
    if (query.$all.length === 0) {
      return result.whereRaw('1 = 0');
    }

    return result.where(outer => {
      for (const subQuery of query.$all) {
        outer.andWhere(inner => {
          applyLocationFilterToQuery(clientType, inner, subQuery);
        });
      }
    });
  }

  if ('$any' in query) {
    // Explicitly handle the empty case to avoid malformed SQL
    if (query.$any.length === 0) {
      return result.whereRaw('1 = 0');
    }

    return result.where(outer => {
      for (const subQuery of query.$any) {
        outer.orWhere(inner => {
          applyLocationFilterToQuery(clientType, inner, subQuery);
        });
      }
    });
  }

  if ('$not' in query) {
    return result.whereNot(inner => {
      applyLocationFilterToQuery(clientType, inner, query.$not);
    });
  }

  const entries = Object.entries(query);
  const keys = entries.map(e => e[0]);
  if (keys.some(k => k.startsWith('$'))) {
    throw new InputError(
      `Invalid filter predicate, unknown logic operator '${keys.join(', ')}'`,
    );
  }

  for (const [keyAnyCase, value] of entries) {
    const key = keyAnyCase.toLocaleLowerCase('en-US');
    if (!['id', 'type', 'target'].includes(key)) {
      throw new InputError(
        `Invalid filter predicate, expected key to be 'id', 'type', or 'target', got '${keyAnyCase}'`,
      );
    }

    result = applyFilterValueToQuery(clientType, result, key, value);
  }

  return result;
}

function applyFilterValueToQuery(
  clientType: string,
  result: Knex.QueryBuilder,
  key: string,
  value: FilterPredicateValue,
): Knex.QueryBuilder {
  // Is it a primitive value?
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    // The id is matched with plain equality; it's of UUID type and case
    // insensitivity does not apply.
    if (key === 'id') {
      return result.where({ id: value });
    }

    if (clientType === 'pg') {
      return result.whereRaw(`UPPER(??::text) = UPPER(?::text)`, [key, value]);
    }

    if (clientType.includes('mysql')) {
      return result.whereRaw(
        `UPPER(CAST(?? AS CHAR)) = UPPER(CAST(? AS CHAR))`,
        [key, value],
      );
    }

    return result.whereRaw(`UPPER(??) = UPPER(?)`, [key, value]);
  }

  // Is it a matcher object?
  if (typeof value === 'object') {
    if (!value || Array.isArray(value)) {
      throw new InputError(
        `Invalid filter predicate, got unknown matcher object '${JSON.stringify(
          value,
        )}'`,
      );
    }

    // Technically existence checks do not make much sense in the context of
    // this table at the time of writing (values are always present), but
    // there's nothing gained by prohibiting it.
    if ('$exists' in value) {
      return value.$exists ? result.whereNotNull(key) : result.whereNull(key);
    }

    if ('$in' in value) {
      // Explicitly handle the empty case to avoid malformed SQL
      if (value.$in.length === 0) {
        return result.whereRaw('1 = 0');
      }

      // The id is matched with plain equality; it's of UUID type and case
      // insensitivity does not apply.
      if (key === 'id') {
        return result.whereIn(key, value.$in);
      }

      if (clientType === 'pg') {
        const rhs = value.$in.map(() => 'UPPER(?::text)').join(', ');
        return result.whereRaw(`UPPER(??::text) IN (${rhs})`, [
          key,
          ...value.$in,
        ]);
      }

      if (clientType.includes('mysql')) {
        const rhs = value.$in.map(() => 'UPPER(CAST(? AS CHAR))').join(', ');
        return result.whereRaw(`UPPER(CAST(?? AS CHAR)) IN (${rhs})`, [
          key,
          ...value.$in,
        ]);
      }

      const rhs = value.$in.map(() => 'UPPER(?)').join(', ');
      return result.whereRaw(`UPPER(??) IN (${rhs})`, [key, ...value.$in]);
    }

    if ('$hasPrefix' in value) {
      const escaped = value.$hasPrefix.replace(/([\\%_])/g, '\\$1');

      if (clientType === 'pg') {
        return result.whereRaw("?? ilike ? escape '\\'", [key, `${escaped}%`]);
      }

      if (clientType.includes('mysql')) {
        return result.whereRaw("UPPER(??) like UPPER(?) escape '\\\\'", [
          key,
          `${escaped}%`,
        ]);
      }

      return result.whereRaw("UPPER(??) like UPPER(?) escape '\\'", [
        key,
        `${escaped}%`,
      ]);
    }

    // There are no array shaped values for location queries, so we just always
    // fail here
    if ('$contains' in value) {
      return result.whereRaw('1 = 0');
    }

    throw new InputError(
      `Invalid filter predicate, got unknown matcher object '${JSON.stringify(
        value,
      )}'`,
    );
  }

  throw new InputError(
    `Invalid filter predicate, expected value to be a primitive value or a matcher object, got '${typeof value}'`,
  );
}
