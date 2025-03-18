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
import { createGaugeMetric } from '../util/metrics';
import { DbRelationsRow, DbLocationsRow, DbSearchRow } from './tables';
import { metrics } from '@opentelemetry/api';

export function initDatabaseMetrics(knex: Knex) {
  const seenProm = new Set<string>();
  const seen = new Set<string>();
  const meter = metrics.getMeter('default');
  return {
    entities_count_prom: createGaugeMetric({
      name: 'catalog_entities_count',
      help: 'Total amount of entities in the catalog. DEPRECATED: Please use opentelemetry metrics instead.',
      labelNames: ['kind'],
      async collect() {
        const results = await knex<DbSearchRow>('search')
          .where('key', '=', 'kind')
          .whereNotNull('value')
          .select({ kind: 'value', count: knex.raw('count(*)') })
          .groupBy('value');

        results.forEach(({ kind, count }) => {
          seenProm.add(kind);
          this.set({ kind }, Number(count));
        });

        // Set all the entities that were not seenProm to 0 and delete them from the seenProm set.
        seenProm.forEach(kind => {
          if (!results.some(r => r.kind === kind)) {
            this.set({ kind }, 0);
            seenProm.delete(kind);
          }
        });
      },
    }),
    registered_locations_prom: createGaugeMetric({
      name: 'catalog_registered_locations_count',
      help: 'Total amount of registered locations in the catalog. DEPRECATED: Please use opentelemetry metrics instead.',
      async collect() {
        const total = await knex<DbLocationsRow>('locations').count({
          count: '*',
        });
        this.set(Number(total[0].count));
      },
    }),
    relations_prom: createGaugeMetric({
      name: 'catalog_relations_count',
      help: 'Total amount of relations between entities. DEPRECATED: Please use opentelemetry metrics instead.',
      async collect() {
        const total = await knex<DbRelationsRow>('relations').count({
          count: '*',
        });
        this.set(Number(total[0].count));
      },
    }),
    entities_count: meter
      .createObservableGauge('catalog_entities_count', {
        description: 'Total amount of entities in the catalog',
      })
      .addCallback(async gauge => {
        const results = await knex<DbSearchRow>('search')
          .where('key', '=', 'kind')
          .whereNotNull('value')
          .select({ kind: 'value', count: knex.raw('count(*)') })
          .groupBy('value');

        results.forEach(({ kind, count }) => {
          seen.add(kind);
          gauge.observe(Number(count), { kind });
        });

        // Set all the entities that were not seen to 0 and delete them from the seen set.
        seen.forEach(kind => {
          if (!results.some(r => r.kind === kind)) {
            gauge.observe(0, { kind });
            seen.delete(kind);
          }
        });
      }),
    registered_locations: meter
      .createObservableGauge('catalog_registered_locations_count', {
        description: 'Total amount of registered locations in the catalog',
      })
      .addCallback(async gauge => {
        if (knex.client.config.client === 'pg') {
          // https://stackoverflow.com/questions/7943233/fast-way-to-discover-the-row-count-of-a-table-in-postgresql
          const total = await knex.raw(`
            SELECT reltuples::bigint AS estimate
            FROM   pg_class
            WHERE  oid = 'locations'::regclass;
          `);
          gauge.observe(Number(total.rows[0].estimate));
        } else {
          const total = await knex<DbLocationsRow>('locations').count({
            count: '*',
          });
          gauge.observe(Number(total[0].count));
        }
      }),
    relations: meter
      .createObservableGauge('catalog_relations_count', {
        description: 'Total amount of relations between entities',
      })
      .addCallback(async gauge => {
        if (knex.client.config.client === 'pg') {
          // https://stackoverflow.com/questions/7943233/fast-way-to-discover-the-row-count-of-a-table-in-postgresql
          const total = await knex.raw(`
            SELECT reltuples::bigint AS estimate
            FROM   pg_class
            WHERE  oid = 'relations'::regclass;
          `);
          gauge.observe(Number(total.rows[0].estimate));
        } else {
          const total = await knex<DbRelationsRow>('relations').count({
            count: '*',
          });
          gauge.observe(Number(total[0].count));
        }
      }),
  };
}
