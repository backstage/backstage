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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import catalogBackend from '@backstage/plugin-catalog-backend';
import fs from 'fs';
import { Knex } from 'knex';
import waitFor from 'wait-for-expect';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { DB_MIGRATIONS_TABLE } from './migrations';
import { EventsTableRow } from './tables';

const migrationsDir = `${__dirname}/../../migrations_`;
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
    '20250519000000_events.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const mockProvider = createMockEntityProvider();

      function rows(): Promise<EventsTableRow[]> {
        return knex('module_history__events')
          .orderBy('event_id')
          .then(r =>
            r.map(row => ({
              ...row,
              event_id: String(row.event_id),
            })),
          );
      }

      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'foo',
          annotations: {
            'backstage.io/managed-by-location': 'url:https://backstage.io',
          },
        },
        spec: {
          type: 'service',
          owner: 'me',
          lifecycle: 'experimental',
        },
      };
      const entityRef = stringifyEntityRef(entity);

      await startTestBackend({
        features: [
          mockServices.database.factory({ knex }),
          mockServices.rootConfig.factory({
            data: { catalog: { processingInterval: '100ms' } },
          }),
          catalogBackend,
          mockProvider,
        ],
      });

      // Upgrading works
      await mockProvider.ready;
      await migrateUntilBefore(knex, '20250519000000_events.js');
      await migrateUpOnce(knex);

      // Expect that an insertion leads to an event
      mockProvider.addEntity(entity);

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          {
            event_id: '1',
            event_at: expect.anything(),
            event_type: 'entity_created',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"me"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
        ]);
      });

      // Expect that an update of the entity leads to an event
      entity.spec!.owner = 'you';
      mockProvider.addEntity(entity);

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          {
            event_id: '1',
            event_at: expect.anything(),
            event_type: 'entity_created',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"me"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
          {
            event_id: '2',
            event_at: expect.anything(),
            event_type: 'entity_updated',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"you"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
        ]);
      });

      // Expect that changes of unrelated columns do NOT lead to events
      await knex('final_entities')
        .update({ stitch_ticket: 'NEW VALUE' })
        .where({ entity_id: 'my-id' });

      await expect(rows()).resolves.toEqual([
        {
          event_id: '1',
          event_at: expect.anything(),
          event_type: 'entity_created',
          entity_ref: entityRef,
          entity_id: expect.any(String),
          entity_json: expect.stringContaining('"owner":"me"'),
          location_id: null,
          location_ref: 'url:https://backstage.io',
        },
        {
          event_id: '2',
          event_at: expect.anything(),
          event_type: 'entity_updated',
          entity_ref: entityRef,
          entity_id: expect.any(String),
          entity_json: expect.stringContaining('"owner":"you"'),
          location_id: null,
          location_ref: 'url:https://backstage.io',
        },
      ]);

      // Expect that a deletion of the final entity leads to an event
      mockProvider.removeEntity(entityRef);

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          {
            event_id: '1',
            event_at: expect.anything(),
            event_type: 'entity_created',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"me"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
          {
            event_id: '2',
            event_at: expect.anything(),
            event_type: 'entity_updated',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"you"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
          {
            event_id: '3',
            event_at: expect.anything(),
            event_type: 'entity_deleted',
            entity_ref: entityRef,
            entity_id: expect.any(String),
            entity_json: expect.stringContaining('"owner":"you"'),
            location_id: null,
            location_ref: 'url:https://backstage.io',
          },
        ]);
      });

      // Make a clean slate for location testing
      await knex('module_history__events').delete();

      await knex('locations').insert({
        id: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
        type: 'url',
        target: 'https://backstage.io',
      });

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          {
            event_id: '4',
            event_at: expect.anything(),
            event_type: 'location_created',
            entity_ref: null,
            entity_id: null,
            entity_json: null,
            location_id: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
            location_ref: 'url:https://backstage.io',
          },
        ]);
      });

      await knex('locations')
        .update({
          type: 'url',
          target: 'https://backstage.io(elsewhere',
        })
        .where('id', '=', 'b07a8526-0025-47e9-bf3b-f47ac94692c2');

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          expect.objectContaining({ event_id: '4' }),
          {
            event_id: '5',
            event_at: expect.anything(),
            event_type: 'location_updated',
            entity_ref: null,
            entity_id: null,
            entity_json: null,
            location_id: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
            location_ref: 'url:https://backstage.io(elsewhere',
          },
        ]);
      });

      await knex('locations')
        .delete()
        .where('id', '=', 'b07a8526-0025-47e9-bf3b-f47ac94692c2');

      await waitFor(async () => {
        await expect(rows()).resolves.toEqual([
          expect.objectContaining({ event_id: '4' }),
          expect.objectContaining({ event_id: '5' }),
          {
            event_id: '6',
            event_at: expect.anything(),
            event_type: 'location_deleted',
            entity_ref: null,
            entity_id: null,
            entity_json: null,
            location_id: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
            location_ref: 'url:https://backstage.io(elsewhere',
          },
        ]);
      });

      // Downgrading works
      await migrateDownOnce(knex);
      await knex.destroy();
    },
  );
});
