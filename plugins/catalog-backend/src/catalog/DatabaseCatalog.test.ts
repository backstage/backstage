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
import { PassThrough } from 'stream';
import winston from 'winston';
import { DatabaseCatalog } from './DatabaseCatalog';

describe('DatabaseCatalog', () => {
  const database = knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  const logger = winston.createLogger({
    transports: [new winston.transports.Stream({ stream: new PassThrough() })],
  });

  beforeEach(async () => {
    await database.migrate.latest({
      directory: path.resolve(__dirname, '..', 'migrations'),
      loadExtensions: ['.ts'],
    });
  });

  it('manages locations', async () => {
    const catalog = new DatabaseCatalog(database, logger);
    const input = { type: 'a', target: 'b' };
    const output = { id: expect.anything(), type: 'a', target: 'b' };

    await catalog.addLocation(input);

    const locations = await catalog.locations();
    expect(locations).toEqual([output]);
    const location = await catalog.location(locations[0].id);
    expect(location).toEqual(output);

    await catalog.removeLocation(locations[0].id);

    await expect(catalog.locations()).resolves.toEqual([]);
    await expect(catalog.location(locations[0].id)).rejects.toThrow(
      /Found no location/,
    );
  });

  it('instead of adding second location with the same target, returns existing one', async () => {
    // Prepare
    const catalog = new DatabaseCatalog(database, logger);
    const input = { type: 'a', target: 'b' };
    const output1 = await catalog.addLocation(input);

    // Try to insert the same location
    const output2 = await catalog.addLocation(input);
    const locations = await catalog.locations();

    // Output is the same
    expect(output2).toEqual(output1);
    // Locations contain only one record
    expect(locations).toEqual([output1]);
  });
});
