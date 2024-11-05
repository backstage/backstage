/*
 * Copyright 2022 The Backstage Authors
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
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import fs from 'fs';
import waitFor from 'wait-for-expect';
import { Knex } from 'knex';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { DB_MIGRATIONS_TABLE } from './migrations';

const migrationsDir = `${__dirname}/../../migrations`;
const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUpOnce(knex: Knex): Promise<void> {
  await knex.migrate.up({
    directory: migrationsDir,
    tableName: DB_MIGRATIONS_TABLE,
  });
}

async function migrateDownOnce(knex: Knex): Promise<void> {
  await knex.migrate.down({
    directory: migrationsDir,
    tableName: DB_MIGRATIONS_TABLE,
  });
}

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await migrateUpOnce(knex);
  }
}

jest.setTimeout(60_000);

describe('migrations', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20241030163401_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const mockProvider = createMockEntityProvider();

      const entityRef = 'component:default/foo';
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'foo',
        },
        spec: {
          type: 'service',
          owner: 'me',
          lifecycle: 'experimental',
        },
      };

      await startTestBackend({
        features: [
          mockServices.database.mock({ getClient: async () => knex }).factory,
          catalogBackend,
          mockProvider,
        ],
      });

      // Upgrading works
      await mockProvider.ready;
      await migrateUntilBefore(knex, '20241030163401_init.js');
      await migrateUpOnce(knex);

      // Expect that an insertion leads to an event
      mockProvider.addEntity(entity);

      await waitFor(async () => {
        await expect(
          knex('module_history__events').orderBy('id'),
        ).resolves.toEqual([
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_inserted',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"me"'),
          },
        ]);
      }, 20_000);

      // Expect that an update of the entity leads to an event
      entity.spec!.owner = 'you';
      mockProvider.addEntity(entity);

      await waitFor(async () => {
        await expect(
          knex('module_history__events').orderBy('id'),
        ).resolves.toEqual([
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_inserted',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"me"'),
          },
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_updated',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"you"'),
          },
        ]);
      }, 20_000);

      // Expect that changes of unrelated columns do NOT lead to events
      await knex('final_entities')
        .update({ stitch_ticket: 'NEW VALUE' })
        .where({ entity_id: 'my-id' });

      await expect(
        knex('module_history__events').orderBy('id'),
      ).resolves.toEqual([
        {
          id: expect.anything(),
          event_at: expect.anything(),
          event_type: 'entity_inserted',
          entity_ref: entityRef,
          entity_json: expect.stringContaining('"owner":"me"'),
        },
        {
          id: expect.anything(),
          event_at: expect.anything(),
          event_type: 'entity_updated',
          entity_ref: entityRef,
          entity_json: expect.stringContaining('"owner":"you"'),
        },
      ]);

      // Expect that a deletion of the final entity leads to an event
      await mockProvider.removeEntity(entityRef);

      await waitFor(async () => {
        await expect(
          knex('module_history__events').orderBy('id'),
        ).resolves.toEqual([
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_inserted',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"me"'),
          },
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_updated',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"you"'),
          },
          {
            id: expect.anything(),
            event_at: expect.anything(),
            event_type: 'entity_deleted',
            entity_ref: entityRef,
            entity_json: expect.stringContaining('"owner":"you"'),
          },
        ]);
      });

      // Downgrading works
      await migrateDownOnce(knex);
      await knex.destroy();
    },
  );
});
