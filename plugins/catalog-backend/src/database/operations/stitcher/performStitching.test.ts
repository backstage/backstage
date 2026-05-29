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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { applyDatabaseMigrations } from '../../migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
  DbSearchRow,
} from '../../tables';
import { markForStitching } from './markForStitching';
import { performStitching } from './performStitching';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

it.each(databases.eachSupportedId())(
  'runs the happy path for %p',
  async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    const logger = mockServices.logger.mock();

    let entities: DbFinalEntitiesRow[];
    let entity: Entity;

    await knex<DbRefreshStateRow>('refresh_state').insert([
      {
        entity_id: 'my-id',
        entity_ref: 'k:ns/n',
        unprocessed_entity: JSON.stringify({}),
        processed_entity: JSON.stringify({
          apiVersion: 'a',
          kind: 'k',
          metadata: {
            name: 'n',
            namespace: 'ns',
          },
          spec: {
            k: 'v',
          },
        }),
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      },
    ]);
    await knex<DbRefreshStateReferencesRow>('refresh_state_references').insert([
      { source_key: 'a', target_entity_ref: 'k:ns/n' },
    ]);
    await knex<DbRelationsRow>('relations').insert([
      {
        originating_entity_id: 'my-id',
        source_entity_ref: 'k:ns/n',
        type: 'looksAt',
        target_entity_ref: 'k:ns/other',
      },
      // handles and ignores duplicates
      {
        originating_entity_id: 'my-id',
        source_entity_ref: 'k:ns/n',
        type: 'looksAt',
        target_entity_ref: 'k:ns/other',
      },
    ]);

    await markForStitching({
      knex,
      entityRefs: ['k:ns/n'],
    });

    await performStitching({
      knex,
      logger,
      entityRef: 'k:ns/n',
      stitchTicket: await getStitchTicket(knex, 'k:ns/n'),
    });

    entities = await knex<DbFinalEntitiesRow>('final_entities');

    expect(entities.length).toBe(1);
    entity = JSON.parse(entities[0].final_entity!);
    expect(entity).toEqual({
      relations: [
        {
          type: 'looksAt',
          targetRef: 'k:ns/other',
        },
      ],
      apiVersion: 'a',
      kind: 'k',
      metadata: {
        name: 'n',
        namespace: 'ns',
        etag: expect.any(String),
        uid: 'my-id',
      },
      spec: {
        k: 'v',
      },
    });

    expect(entity.metadata.etag).toEqual(entities[0].hash);
    const last_updated_at = entities[0].last_updated_at;
    expect(last_updated_at).not.toBeNull();
    const firstHash = entities[0].hash;

    const search = await knex<DbSearchRow>('search');
    expect(search).toEqual(
      expect.arrayContaining([
        {
          entity_id: 'my-id',
          key: 'relations.looksat',
          original_value: 'k:ns/other',
          value: 'k:ns/other',
        },
        {
          entity_id: 'my-id',
          key: 'apiversion',
          original_value: 'a',
          value: 'a',
        },
        {
          entity_id: 'my-id',
          key: 'kind',
          original_value: 'k',
          value: 'k',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.name',
          original_value: 'n',
          value: 'n',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.namespace',
          original_value: 'ns',
          value: 'ns',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.uid',
          original_value: 'my-id',
          value: 'my-id',
        },
        {
          entity_id: 'my-id',
          key: 'spec.k',
          original_value: 'v',
          value: 'v',
        },
      ]),
    );

    // Re-stitch without any changes
    await markForStitching({
      knex,
      entityRefs: ['k:ns/n'],
    });

    await performStitching({
      knex,
      logger,
      entityRef: 'k:ns/n',
      stitchTicket: await getStitchTicket(knex, 'k:ns/n'),
    });

    entities = await knex<DbFinalEntitiesRow>('final_entities');
    expect(entities.length).toBe(1);
    entity = JSON.parse(entities[0].final_entity!);
    expect(entities[0].hash).toEqual(firstHash);
    expect(entity.metadata.etag).toEqual(firstHash);

    // Now add one more relation and re-stitch
    await knex<DbRelationsRow>('relations').insert([
      {
        originating_entity_id: 'my-id',
        source_entity_ref: 'k:ns/n',
        type: 'looksAt',
        target_entity_ref: 'k:ns/third',
      },
    ]);

    await markForStitching({
      knex,
      entityRefs: ['k:ns/n'],
    });

    await performStitching({
      knex,
      logger,
      entityRef: 'k:ns/n',
      stitchTicket: await getStitchTicket(knex, 'k:ns/n'),
    });

    entities = await knex<DbFinalEntitiesRow>('final_entities');

    expect(entities.length).toBe(1);
    entity = JSON.parse(entities[0].final_entity!);
    expect(entity).toEqual({
      relations: expect.arrayContaining([
        {
          type: 'looksAt',
          targetRef: 'k:ns/other',
        },
        {
          type: 'looksAt',
          targetRef: 'k:ns/third',
        },
      ]),
      apiVersion: 'a',
      kind: 'k',
      metadata: {
        name: 'n',
        namespace: 'ns',
        etag: expect.any(String),
        uid: 'my-id',
      },
      spec: {
        k: 'v',
      },
    });

    expect(entities[0].hash).not.toEqual(firstHash);
    expect(entities[0].hash).toEqual(entity.metadata.etag);

    expect(await knex<DbSearchRow>('search')).toEqual(
      expect.arrayContaining([
        {
          entity_id: 'my-id',
          key: 'relations.looksat',
          original_value: 'k:ns/other',
          value: 'k:ns/other',
        },
        {
          entity_id: 'my-id',
          key: 'relations.looksat',
          original_value: 'k:ns/third',
          value: 'k:ns/third',
        },
        {
          entity_id: 'my-id',
          key: 'apiversion',
          original_value: 'a',
          value: 'a',
        },
        {
          entity_id: 'my-id',
          key: 'kind',
          original_value: 'k',
          value: 'k',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.name',
          original_value: 'n',
          value: 'n',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.namespace',
          original_value: 'ns',
          value: 'ns',
        },
        {
          entity_id: 'my-id',
          key: 'metadata.uid',
          original_value: 'my-id',
          value: 'my-id',
        },
        {
          entity_id: 'my-id',
          key: 'spec.k',
          original_value: 'v',
          value: 'v',
        },
      ]),
    );
  },
);

describe.each(databases.eachSupportedId())(
  'performStitching edge cases, %p',
  databaseId => {
    it('stitches when final_entities row already exists', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      await knex<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          unprocessed_entity: JSON.stringify({}),
          processed_entity: JSON.stringify({
            apiVersion: 'a',
            kind: 'k',
            metadata: {
              name: 'n',
              namespace: 'ns',
            },
            spec: {
              k: 'v',
            },
          }),
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);
      await knex<DbFinalEntitiesRow>('final_entities').insert([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          hash: '',
          final_entity: JSON.stringify({}),
        },
      ]);

      await markForStitching({ knex, entityRefs: ['k:ns/n'] });

      const stitchLogger = mockServices.logger.mock();
      await expect(
        performStitching({
          knex,
          logger: stitchLogger,
          entityRef: 'k:ns/n',
          stitchTicket: await getStitchTicket(knex, 'k:ns/n'),
        }),
      ).resolves.toBe('changed');

      const entities = await knex<DbFinalEntitiesRow>('final_entities');
      expect(entities.length).toBe(1);
      expect(entities[0].hash).not.toBe('');
      expect(entities[0].final_entity).toBeDefined();
    });

    it('rejects a stale stitch ticket without overwriting', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      await knex<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          unprocessed_entity: JSON.stringify({}),
          processed_entity: JSON.stringify({
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'n', namespace: 'ns' },
            spec: { original: true },
          }),
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);

      // First stitch: create the final_entities row with a valid ticket
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const validTicket = await getStitchTicket(knex, 'k:ns/n');

      const result1 = await performStitching({
        knex,
        logger: mockServices.logger.mock(),
        entityRef: 'k:ns/n',
        stitchTicket: validTicket,
      });
      expect(result1).toBe('changed');

      const afterFirst = await knex<DbFinalEntitiesRow>('final_entities');
      expect(afterFirst).toHaveLength(1);
      const firstHash = afterFirst[0].hash;

      // Now change the processed entity and mark for stitching again
      await knex<DbRefreshStateRow>('refresh_state')
        .where('entity_id', 'my-id')
        .update({
          processed_entity: JSON.stringify({
            apiVersion: 'a',
            kind: 'k',
            metadata: { name: 'n', namespace: 'ns' },
            spec: { original: false, stale: true },
          }),
        });

      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const freshTicket = await getStitchTicket(knex, 'k:ns/n');

      // Attempt to stitch with a WRONG ticket (simulating a stale worker)
      const result2 = await performStitching({
        knex,
        logger: mockServices.logger.mock(),
        entityRef: 'k:ns/n',
        stitchTicket: 'stale-ticket-that-does-not-match',
      });
      expect(result2).toBe('abandoned');

      // The final_entities row should still have the FIRST hash,
      // not be overwritten by the stale worker
      const afterStale = await knex<DbFinalEntitiesRow>('final_entities');
      expect(afterStale).toHaveLength(1);
      expect(afterStale[0].hash).toBe(firstHash);

      // Now stitch with the correct fresh ticket — should succeed
      const result3 = await performStitching({
        knex,
        logger: mockServices.logger.mock(),
        entityRef: 'k:ns/n',
        stitchTicket: freshTicket,
      });
      expect(result3).toBe('changed');

      const afterFresh = await knex<DbFinalEntitiesRow>('final_entities');
      expect(afterFresh).toHaveLength(1);
      expect(afterFresh[0].hash).not.toBe(firstHash);
      const freshEntity = JSON.parse(afterFresh[0].final_entity!);
      expect(freshEntity.spec).toEqual({ original: false, stale: true });
    });
  },
);

async function getStitchTicket(
  knex: import('knex').Knex,
  entityRef: string,
): Promise<string> {
  const row = await knex('stitch_queue')
    .where('entity_ref', entityRef)
    .select('stitch_ticket')
    .first();
  if (!row) {
    throw new Error(`No stitch_queue entry for ${entityRef}`);
  }
  return row.stitch_ticket;
}
