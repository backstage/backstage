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
import { DbRefreshStateRow, DbRelationsRow, DbLocationsRow } from './tables';
import { metrics } from '@opentelemetry/api';
import { parseEntityRef } from '@backstage/catalog-model';

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
        const result =
          await knex<DbRefreshStateRow>('refresh_state').select('entity_ref');
        const results = result
          .map(row => row.entity_ref.split(':')[0])
          .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        results.forEach((value, key) => {
          seenProm.add(key);
          this.set({ kind: key }, value);
        });

        // Set all the entities that were not seenProm to 0 and delete them from the seenProm set.
        seenProm.forEach(key => {
          if (!results.has(key)) {
            this.set({ kind: key }, 0);
            seenProm.delete(key);
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
        const result =
          await knex<DbRefreshStateRow>('refresh_state').select('entity_ref');
        const results = result
          .map(row => parseEntityRef(row.entity_ref).kind)
          .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        results.forEach((value, key) => {
          seen.add(key);
          gauge.observe(value, { kind: key });
        });

        // Set all the entities that were not seen to 0 and delete them from the seen set.
        seen.forEach(key => {
          if (!results.has(key)) {
            gauge.observe(0, { kind: key });
            seen.delete(key);
          }
        });
      }),
    registered_locations: meter
      .createObservableGauge('catalog_registered_locations_count', {
        description: 'Total amount of registered locations in the catalog',
      })
      .addCallback(async gauge => {
        const total = await knex<DbLocationsRow>('locations').count({
          count: '*',
        });
        gauge.observe(Number(total[0].count));
      }),
    relations: meter
      .createObservableGauge('catalog_relations_count', {
        description: 'Total amount of relations between entities',
      })
      .addCallback(async gauge => {
        const total = await knex<DbRelationsRow>('relations').count({
          count: '*',
        });
        gauge.observe(Number(total[0].count));
      }),
  };
}
