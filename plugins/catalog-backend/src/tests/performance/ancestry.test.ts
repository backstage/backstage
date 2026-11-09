/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';
import { Knex } from 'knex';
import { DefaultCatalogDatabase } from '../../database/DefaultCatalogDatabase';
import { DefaultProcessingDatabase } from '../../database/DefaultProcessingDatabase';
import { createRandomProcessingInterval } from '../../processing/refresh';
import { DefaultEntitiesCatalog } from '../../service/DefaultEntitiesCatalog';
import { describePerformanceTest } from './lib/env';
import {
  cloneDataset,
  getPerformanceDatabaseIds,
  getPerformanceDataset,
} from './lib/dataset';
import { measure } from './lib/measure';

jest.setTimeout(600_000);

const PROVIDER_KEY = 'perf-provider';
// listAncestors gives up after 32 levels
const CHAIN_DEPTH = 30;
const FAN_IN = 500;
const PARENT_LOOKUPS = 1_000;

const chainRef = (i: number) => `component:default/chain-${i}`;
const FAN_IN_REF = 'component:default/fanin';

async function insertEntities(knex: Knex, refs: string[]) {
  const rows = refs.map(ref => ({
    entity_id: `perf-ancestry-${ref}`,
    entity_ref: ref,
  }));
  const entity = (ref: string) => {
    const name = ref.split('/')[1];
    return JSON.stringify({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name, namespace: 'default', uid: `perf-ancestry-${ref}` },
    });
  };
  await knex('refresh_state').insert(
    rows.map(r => ({
      ...r,
      unprocessed_entity: entity(r.entity_ref),
      errors: '[]',
      next_update_at: '2031-01-01 23:00:00',
      last_discovery_at: '2021-04-01 13:37:00',
    })),
  );
  await knex('final_entities').insert(
    rows.map(r => ({
      ...r,
      final_entity: entity(r.entity_ref),
      hash: 'perf',
      last_updated_at: knex.fn.now(),
    })),
  );
}

describePerformanceTest('ancestry and parents', () => {
  describe.each(getPerformanceDatabaseIds())('%s', databaseId => {
    let knex: Knex;
    let catalogDb: DefaultCatalogDatabase;
    let processingDb: DefaultProcessingDatabase;
    let catalog: DefaultEntitiesCatalog;
    let components: string[];

    beforeAll(async () => {
      const dataset = await getPerformanceDataset(databaseId);
      knex = await cloneDataset(dataset.knex);
      const logger = mockServices.logger.mock();
      catalogDb = new DefaultCatalogDatabase({ database: knex, logger });
      processingDb = new DefaultProcessingDatabase({
        database: knex,
        logger,
        refreshInterval: createRandomProcessingInterval({
          minSeconds: 100,
          maxSeconds: 150,
        }),
        events: mockServices.events.mock(),
        metrics: metricsServiceMock.mock(),
      });
      catalog = new DefaultEntitiesCatalog({ database: knex, logger });

      components = (
        await knex('refresh_state')
          .where('entity_ref', 'like', 'component:default/svc-%')
          .orderBy('entity_ref')
          .limit(Math.max(FAN_IN, PARENT_LOOKUPS))
          .select('entity_ref')
      ).map(r => r.entity_ref);
      if (components.length < Math.max(FAN_IN, PARENT_LOOKUPS)) {
        throw new Error(
          `Dataset has too few components, got ${components.length}`,
        );
      }

      // Deep tree: a chain from the provider down to chain-(DEPTH - 1)
      const chain = Array.from({ length: CHAIN_DEPTH }, (_, i) => chainRef(i));
      await insertEntities(knex, [...chain, FAN_IN_REF]);
      await knex('refresh_state_references').insert([
        { source_key: PROVIDER_KEY, target_entity_ref: chain[0] },
        ...chain.slice(1).map((ref, i) => ({
          source_entity_ref: chain[i],
          target_entity_ref: ref,
        })),
        // Wide tree: one entity with many parents
        ...components.slice(0, FAN_IN).map(parent => ({
          source_entity_ref: parent,
          target_entity_ref: FAN_IN_REF,
        })),
      ]);
    });

    afterAll(async () => {
      await knex?.destroy();
    });

    it('lists ancestors of a deep chain', async () => {
      const result = await measure(expect.getState().currentTestName!, () =>
        catalogDb.transaction(tx =>
          catalogDb.listAncestors(tx, { entityRef: chainRef(CHAIN_DEPTH - 1) }),
        ),
      );
      expect(result.entityRefs).toEqual(
        Array.from({ length: CHAIN_DEPTH - 1 }, (_, i) =>
          chainRef(CHAIN_DEPTH - 2 - i),
        ),
      );
    });

    it('lists parents of many entities', async () => {
      const refs = components.slice(0, PARENT_LOOKUPS);
      const result = await measure(expect.getState().currentTestName!, () =>
        processingDb.transaction(tx =>
          processingDb.listParents(tx, { entityRefs: refs }),
        ),
      );
      // Every component has exactly one parent, a location
      expect(result.entityRefs).toHaveLength(PARENT_LOOKUPS);
      expect(result.entityRefs.every(r => r.startsWith('location:'))).toBe(
        true,
      );
    });

    it('lists the parents of an entity with a wide fan-in', async () => {
      const result = await measure(expect.getState().currentTestName!, () =>
        processingDb.transaction(tx =>
          processingDb.listParents(tx, { entityRefs: [FAN_IN_REF] }),
        ),
      );
      expect(new Set(result.entityRefs)).toEqual(
        new Set(components.slice(0, FAN_IN)),
      );
    });

    it('resolves the entity ancestry of a deep chain', async () => {
      const result = await measure(expect.getState().currentTestName!, () =>
        catalog.entityAncestry(chainRef(CHAIN_DEPTH - 1)),
      );
      expect(result.rootEntityRef).toBe(chainRef(CHAIN_DEPTH - 1));
      expect(result.items).toHaveLength(CHAIN_DEPTH);
    });

    it('resolves the entity ancestry of a wide fan-in', async () => {
      const result = await measure(expect.getState().currentTestName!, () =>
        catalog.entityAncestry(FAN_IN_REF),
      );
      expect(result.rootEntityRef).toBe(FAN_IN_REF);
      const root = result.items.find(i => i.entity.metadata.name === 'fanin');
      expect(root?.parentEntityRefs).toHaveLength(FAN_IN);
      // The root, its parents and their (shared) locations
      expect(result.items.length).toBeGreaterThan(FAN_IN);
    });
  });
});
