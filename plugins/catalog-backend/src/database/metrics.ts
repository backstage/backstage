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
import { DbRelationsRow, DbLocationsRow } from './tables';
import { MetricsService } from '@backstage/backend-plugin-api/alpha';

const ENTITIES_COUNT_TTL_MS = 30_000;

/**
 * Returns a function that produces a Map of entity kind -> count, with
 * a single-flight cache that coalesces overlapping calls.
 *
 * The OpenTelemetry observable gauge and the legacy Prometheus gauge are
 * both registered to emit the same `catalog_entities_count` series, and
 * both fire on every metrics scrape. Without coalescing, that means two
 * identical heavy queries per scrape per pod, which can pile up against
 * the database faster than they complete.
 *
 * Concurrent callers share the same in-flight promise, so a query is
 * never overlapped by another instance of itself. The TTL is the
 * minimum age at which the next caller is allowed to start a fresh
 * query; if a query is still running when the TTL would have elapsed,
 * waiting callers continue to share that one rather than starting a
 * duplicate.
 *
 * @internal exported for testing
 */
export function createEntitiesCountByKind(
  knex: Knex,
  options?: { ttlMs?: number },
): () => Promise<Map<string, number>> {
  const ttlMs = options?.ttlMs ?? ENTITIES_COUNT_TTL_MS;
  let inflight: Promise<Map<string, number>> | undefined;
  let cached: { at: number; data: Map<string, number> } | undefined;
  return () => {
    if (inflight) {
      return inflight;
    }
    if (cached && Date.now() - cached.at < ttlMs) {
      return Promise.resolve(cached.data);
    }
    inflight = (async () => {
      try {
        const data = await queryEntitiesCountByKind(knex);
        cached = { at: Date.now(), data };
        return data;
      } finally {
        inflight = undefined;
      }
    })();
    return inflight;
  };
}

/**
 * Reads kind counts straight from `final_entities` (one row per entity)
 * rather than from `search` (one row per entity per indexed key, often
 * 20-30x larger). The kind is parsed out of `entity_ref`, which is the
 * canonical lowercased `kind:namespace/name` form -- producing the same
 * lowercased labels the previous search-based query did.
 *
 * Rows where `final_entity` is null are excluded. They represent entities
 * that haven't been stitched yet, or tombstones for in-progress deletions.
 * Counting them would over-report by including entities the rest of the
 * catalog API treats as not present.
 *
 * @internal exported for testing
 */
export async function queryEntitiesCountByKind(
  knex: Knex,
): Promise<Map<string, number>> {
  const kindExpr = entityRefKindExpression(knex);

  const rows: { kind: string; count: string | number }[] = await knex(
    'final_entities',
  )
    .whereNotNull('final_entity')
    .select({ kind: kindExpr, count: knex.raw('count(*)') })
    .groupBy(kindExpr);

  return new Map(rows.map(row => [String(row.kind), Number(row.count)]));
}

function entityRefKindExpression(knex: Knex): Knex.Raw {
  const client = knex.client.config.client as string;
  if (client.includes('pg')) {
    return knex.raw(`split_part(entity_ref, ':', 1)`);
  }
  if (client.includes('mysql')) {
    return knex.raw(`substring_index(entity_ref, ':', 1)`);
  }
  // sqlite (better-sqlite3, sqlite3)
  return knex.raw(`substr(entity_ref, 1, instr(entity_ref, ':') - 1)`);
}

export function initDatabaseMetrics(knex: Knex, metrics: MetricsService) {
  const seenProm = new Set<string>();
  const seen = new Set<string>();
  const getEntitiesCountByKind = createEntitiesCountByKind(knex);

  return {
    entities_count_prom: createGaugeMetric({
      name: 'catalog_entities_count',
      help: 'Total amount of entities in the catalog. DEPRECATED: Please use opentelemetry metrics instead.',
      labelNames: ['kind'],
      async collect() {
        const results = await getEntitiesCountByKind();

        for (const [kind, count] of results) {
          seenProm.add(kind);
          this.set({ kind }, count);
        }

        // Set all the entities that were not seenProm to 0 and delete them from the seenProm set.
        for (const kind of seenProm) {
          if (!results.has(kind)) {
            this.set({ kind }, 0);
            seenProm.delete(kind);
          }
        }
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
    entities_count: metrics
      .createObservableGauge('catalog_entities_count', {
        description: 'Total amount of entities in the catalog',
      })
      .addCallback(async gauge => {
        const results = await getEntitiesCountByKind();

        for (const [kind, count] of results) {
          seen.add(kind);
          gauge.observe(count, { kind });
        }

        // Set all the entities that were not seen to 0 and delete them from the seen set.
        for (const kind of seen) {
          if (!results.has(kind)) {
            gauge.observe(0, { kind });
            seen.delete(kind);
          }
        }
      }),
    registered_locations: metrics
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
    relations: metrics
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
