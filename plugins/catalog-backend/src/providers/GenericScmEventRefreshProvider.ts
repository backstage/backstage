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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import {
  CatalogScmEvent,
  CatalogScmEventsService,
} from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';
import { chunk } from 'lodash';
import {
  DbRefreshKeysRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { ScmEventHandlingConfig } from '../util/readScmEventHandlingConfig';

/**
 * Deals in a generic fashion with SCM events, refreshing entities as needed.
 *
 * It's implemented in the form of an entity provider even though its actually
 * does not behave like one, mostly in order to consistently start treating
 * events on connect time when the engine is known to be ready.
 */
export class GenericScmEventRefreshProvider implements EntityProvider {
  readonly #knex: Knex;
  readonly #scmEvents: CatalogScmEventsService;
  readonly #scmEventHandlingConfig: ScmEventHandlingConfig;

  constructor(
    knex: Knex,
    scmEvents: CatalogScmEventsService,
    scmEventHandlingConfig: ScmEventHandlingConfig,
  ) {
    this.#knex = knex;
    this.#scmEvents = scmEvents;
    this.#scmEventHandlingConfig = scmEventHandlingConfig;
  }

  getProviderName(): string {
    return 'GenericScmEventRefreshProvider';
  }

  async connect(_connection: EntityProviderConnection): Promise<void> {
    if (this.#scmEventHandlingConfig.refresh) {
      this.#scmEvents.subscribe({ onEvents: this.#onScmEvents.bind(this) });
    }
  }

  async #onScmEvents(events: CatalogScmEvent[]): Promise<void> {
    const exactLocationsToRefresh = new Set<string>();
    const locationPrefixesToRefresh = new Set<string>();

    for (const event of events) {
      if (event.type === 'location.updated') {
        exactLocationsToRefresh.add(event.url);
      } else if (event.type === 'repository.updated') {
        if (!event.url.match(/[?#]/)) {
          // TODO(freben): We can't yet support complex URL locations where e.g.
          // the path can be anywhere in the URL including in the query or hash
          // part. The code below currently assumes that we can use simple
          // substring operations.
          locationPrefixesToRefresh.add(event.url.replace(/\/*$/g, '/'));
        }
      }
    }

    let count = 0;

    // Perform exact location updates
    for (const urls of chunk(
      expandUrlVariations(exactLocationsToRefresh),
      50,
    )) {
      count += await this.#refreshMatchingCandidates((query, column) => {
        query.whereIn(column, urls);
      });
    }

    // Perform prefix updates
    for (const prefixes of chunk(
      expandUrlVariations(locationPrefixesToRefresh),
      10,
    )) {
      count += await this.#refreshMatchingCandidates((query, column) => {
        query.where(inner => {
          for (const prefix of prefixes) {
            inner.orWhere(column, 'like', `${prefix}%`);
          }
        });
      });
    }

    this.#scmEvents.markEventActionTaken({ count, action: 'refresh' });
  }

  async #refreshMatchingCandidates(
    match: (query: Knex.QueryBuilder, column: string) => void,
  ): Promise<number> {
    const byRefreshKey = this.#knex<DbRefreshKeysRow>('refresh_keys')
      .select('entity_id')
      .modify(match, 'key');
    // Search rows use the stable slot ID, not necessarily the candidate ID.
    const bySearch = this.#knex<DbSearchRow>('search')
      .join('final_entities', 'final_entities.entity_id', 'search.entity_id')
      .join(
        'refresh_state as candidate',
        'candidate.entity_ref',
        'final_entities.entity_ref',
      )
      .select('candidate.entity_id')
      .whereIn('search.key', [
        `metadata.annotations.${ANNOTATION_LOCATION}`,
        `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
      ])
      .modify(match, 'search.value');

    // A single IN over the UNION allows indexed candidate lookups. The derived
    // table also lets MySQL read refresh_state while updating it.
    const matches = byRefreshKey.union(bySearch).as('matches');
    const result = await this.#knex<DbRefreshStateRow>('refresh_state')
      .update({ next_update_at: this.#knex.fn.now() })
      .whereIn('entity_id', this.#knex.select('entity_id').from(matches));
    return Number(result);
  }
}

/**
 * Given a URL, returns all variations of that URL that may come into play for
 * refreshes.
 *
 * This covers the oddity that the catalog sometimes uses `/tree/` instead of
 * `/blob/` GitHub URLs, and in some circumstances there's a `url:` prefix and
 * sometimes not.
 */
function expandUrlVariations(urls: Iterable<string>): string[] {
  const variations = new Set<string>();
  for (const url of urls) {
    variations.add(`url:${url}`);
    variations.add(`url:${url.replace('/blob/', '/tree/')}`);
  }
  return Array.from(variations);
}
