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

  const logger = winston.createLogger({
    transports: [new winston.transports.Stream({ stream: new PassThrough() })],
  });

  beforeEach(async () => {
    await database.migrate.latest({
      directory: path.resolve(__dirname, '..', 'migrations'),
      loadExtensions: ['.ts'],
    });
  });

  it('instantiates', () => {
    const catalog = new DatabaseCatalog(database, logger);
    expect(catalog).toBeDefined();
  });

  describe(`refreshLocations`, () => {
    it('works with no locations added', async () => {
      const catalog = new DatabaseCatalog(database, logger);
      await expect(catalog.refreshLocations()).resolves.toBeUndefined();
    });
  });
});
