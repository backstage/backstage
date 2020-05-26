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
import { DatabaseLocationsCatalog } from './DatabaseLocationsCatalog';
import knex from 'knex';
import path from 'path';

import { Database } from '../database';
import { ReaderOutput } from '../ingestion/types';
import { getVoidLogger } from '@backstage/backend-common';

describe('DatabaseLocationsCatalog', () => {
  const database = knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  let db: Database;
  let catalog: DatabaseLocationsCatalog;

  const mockLocationReader = {
    read: async (type: string, target: string): Promise<ReaderOutput[]> => {
      if (type !== 'valid_type') {
        throw new Error(`Unknown location type ${type}`);
      }
      if (target === 'valid_target') {
        return Promise.resolve([{ type: 'data', data: {} }]);
      }
      throw new Error(
        `Can't read location at ${target} with error: Something is broken`,
      );
    },
  };

  beforeEach(async () => {
    await database.migrate.latest({
      directory: path.resolve(__dirname, '../database/migrations'),
      loadExtensions: ['.ts'],
    });
    db = new Database(database, getVoidLogger());
    catalog = new DatabaseLocationsCatalog(db, mockLocationReader);
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
