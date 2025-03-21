/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import path from 'path';
import {
  buildSqliteDatabaseConfig,
  createSqliteDatabaseClient,
} from './sqlite3';
import { mockServices } from '@backstage/backend-test-utils';

describe('better-sqlite3', () => {
  const createConfig = (connection: any) =>
    new ConfigReader({ client: 'better-sqlite3', connection });

  const deps = {
    logger: mockServices.logger.mock(),
    lifecycle: mockServices.lifecycle.mock(),
  };

  describe('buildSqliteDatabaseConfig', () => {
    it('builds an in-memory connection', () => {
      expect(buildSqliteDatabaseConfig(createConfig(':memory:'))).toEqual({
        client: 'better-sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      });
    });

    it('builds an in-memory connection by override with filename', () => {
      expect(
        buildSqliteDatabaseConfig(
          createConfig(path.join('path', 'to', 'foo')),
          { connection: ':memory:' },
        ),
      ).toEqual({
        client: 'better-sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      });
    });

    it('builds a persistent connection, normalize config with filename', () => {
      expect(
        buildSqliteDatabaseConfig(createConfig(path.join('path', 'to', 'foo'))),
      ).toEqual({
        client: 'better-sqlite3',
        connection: { filename: path.join('path', 'to', 'foo') },
        useNullAsDefault: true,
      });
    });

    it('builds a persistent connection', () => {
      expect(
        buildSqliteDatabaseConfig(
          createConfig({
            filename: path.join('path', 'to', 'foo'),
          }),
        ),
      ).toEqual({
        client: 'better-sqlite3',
        connection: {
          filename: path.join('path', 'to', 'foo'),
        },
        useNullAsDefault: true,
      });
    });

    it('replaces the connection with an override', () => {
      expect(
        buildSqliteDatabaseConfig(createConfig(':memory:'), {
          connection: { filename: path.join('path', 'to', 'foo') },
        }),
      ).toEqual({
        client: 'better-sqlite3',
        connection: {
          filename: path.join('path', 'to', 'foo'),
        },
        useNullAsDefault: true,
      });
    });
  });

  describe('createSqliteDatabaseClient', () => {
    it('creates an in memory knex instance', () => {
      expect(
        createSqliteDatabaseClient('p', createConfig(':memory:'), deps),
      ).toBeTruthy();
    });
  });
});
