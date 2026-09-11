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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../migrations';
import { updateUnprocessedEntity } from './updateUnprocessedEntity';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'updateUnprocessedEntity, %p',
  databaseId => {
    let knex: Knex;

    beforeEach(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await knex('refresh_state').insert({
        entity_id: 'id-component:default/test',
        entity_ref: 'component:default/test',
        unprocessed_entity: '{}',
        errors: '[]',
        next_update_at: new Date(),
        last_discovery_at: new Date(),
      });
    });

    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
    };

    it('reports when a weak entity is claimed with a location key', async () => {
      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity,
          hash: 'hash',
          locationKey: 'provider:key',
        }),
      ).resolves.toEqual({ updated: true, claimed: true });
    });

    it('does not report a claim when the location key already matches', async () => {
      await knex('refresh_state')
        .where({ entity_ref: 'component:default/test' })
        .update({ location_key: 'provider:key' });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity,
          hash: 'hash',
          locationKey: 'provider:key',
        }),
      ).resolves.toEqual({ updated: true, claimed: false });
    });

    it('does not update an entity owned by a different location key', async () => {
      await knex('refresh_state')
        .where({ entity_ref: 'component:default/test' })
        .update({ location_key: 'other:key' });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity,
          hash: 'hash',
          locationKey: 'provider:key',
        }),
      ).resolves.toEqual({ updated: false, claimed: false });
    });
  },
);
