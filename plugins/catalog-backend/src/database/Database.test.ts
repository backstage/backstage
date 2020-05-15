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

import knex from 'knex';
import path from 'path';
import { Database } from './Database';
import { AddDatabaseLocation, DatabaseLocation } from './types';

describe('Database', () => {
  const database = knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  beforeEach(async () => {
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.ts'],
    });
  });

  it('manages locations', async () => {
    const db = new Database(database);
    const input: AddDatabaseLocation = { type: 'a', target: 'b' };
    const output: DatabaseLocation = {
      id: expect.anything(),
      type: 'a',
      target: 'b',
    };

    await db.addLocation(input);

    const locations = await db.locations();
    expect(locations).toEqual([output]);
    const location = await db.location(locations[0].id);
    expect(location).toEqual(output);

    await db.removeLocation(locations[0].id);

    await expect(db.locations()).resolves.toEqual([]);
    await expect(db.location(locations[0].id)).rejects.toThrow(
      /Found no location/,
    );
  });
});
