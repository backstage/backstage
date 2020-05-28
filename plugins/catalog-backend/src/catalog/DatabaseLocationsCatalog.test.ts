/*
 * Copyright 2020 Spotify AB
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
import { getVoidLogger } from '@backstage/backend-common';
import type { Entity } from '@backstage/catalog-model';
import Knex from 'knex';
import path from 'path';
import { CommonDatabase } from '../database';
import type { Database } from '../database';
import type { IngestionModel } from '../ingestion/types';
import { DatabaseLocationsCatalog } from './DatabaseLocationsCatalog';

class MockIngestionModel implements IngestionModel {
  readLocation = jest.fn(async (type: string, target: string) => {
    if (type !== 'valid_type') {
      throw new Error(`Unknown location type ${type}`);
    }
    if (target === 'valid_target') {
      return [{ type: 'data', data: {} as Entity } as const];
    }
    throw new Error(
      `Can't read location at ${target} with error: Something is broken`,
    );
  });
}

describe('DatabaseLocationsCatalog', () => {
  const knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  let db: Database;
  let catalog: DatabaseLocationsCatalog;
  let ingestionModel: IngestionModel;

  beforeEach(async () => {
    await knex.migrate.latest({
      directory: path.resolve(__dirname, '../database/migrations'),
      loadExtensions: ['.ts'],
    });
    db = new CommonDatabase(knex, getVoidLogger());
    ingestionModel = new MockIngestionModel();
    catalog = new DatabaseLocationsCatalog(db, ingestionModel);
  });

  it('resolves to location with id', async () => {
    return expect(
      catalog.addLocation({ type: 'valid_type', target: 'valid_target' }),
    ).resolves.toEqual({
      id: expect.anything(),
      type: 'valid_type',
      target: 'valid_target',
    });
  });
  it('rejects for invalid type', async () => {
    const type = 'invalid_type';
    return expect(
      catalog.addLocation({ type, target: 'valid_target' }),
    ).rejects.toThrow(/Unknown location type/);
  });
  it('rejects for unreadable target ', async () => {
    const target = 'invalid_target';
    return expect(
      catalog.addLocation({ type: 'valid_type', target }),
    ).rejects.toThrow(
      `Can't read location at ${target} with error: Something is broken`,
    );
  });
});
