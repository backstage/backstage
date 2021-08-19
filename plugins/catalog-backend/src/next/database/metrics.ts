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

import { Knex } from 'knex';
import { DbLocationsRow } from '../../database/types';
import { createGaugeMetric } from '../metrics';
import { DbRefreshStateRow, DbRelationsRow } from './tables';

export function initDatabaseMetrics(knex: Knex) {
  const seen = new Set<string>();
  return {
    entities_count: createGaugeMetric({
      name: 'catalog_entities_count',
      help: 'Total amount of entities in the catalog',
      labelNames: ['kind'],
      async collect() {
        const result = await knex<DbRefreshStateRow>('refresh_state').select(
          'entity_ref',
        );
        const results = result
          .map(row => row.entity_ref.split(':')[0])
          .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        results.forEach((value, key) => {
          seen.add(key);
          this.set({ kind: key }, value);
        });

        // Set all the entities that were not seen to 0 and delete them from the seen set.
        seen.forEach(key => {
          if (!results.has(key)) {
            this.set({ kind: key }, 0);
            seen.delete(key);
          }
        });
      },
    }),
    registered_locations: createGaugeMetric({
      name: 'catalog_registered_locations_count',
      help: 'Total amount of registered locations in the catalog',
      async collect() {
        const total = await knex<DbLocationsRow>('locations').count({
          count: '*',
        });
        this.set(Number(total[0].count));
      },
    }),
    relations: createGaugeMetric({
      name: 'catalog_relations_count',
      help: 'Total amount of relations between entities',
      async collect() {
        const total = await knex<DbRelationsRow>('relations').count({
          count: '*',
        });
        this.set(Number(total[0].count));
      },
    }),
  };
}
