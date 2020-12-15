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

import { ConfigReader } from '@backstage/config';
import {
  buildSqliteDatabaseConfig,
  createSqliteDatabaseClient,
} from './sqlite3';

describe('sqlite3', () => {
  const createConfig = (connection: any) =>
    new ConfigReader({ client: 'sqlite3', connection });

  describe('buildSqliteDatabaseConfig', () => {
    it('buidls a string connection', () => {
      expect(buildSqliteDatabaseConfig(createConfig(':memory:'))).toEqual({
        client: 'sqlite3',
        connection: ':memory:',
        useNullAsDefault: true,
      });
    });

    it('builds a filename connection', () => {
      expect(
        buildSqliteDatabaseConfig(
          createConfig({
            filename: '/path/to/foo',
          }),
        ),
      ).toEqual({
        client: 'sqlite3',
        connection: {
          filename: '/path/to/foo',
        },
        useNullAsDefault: true,
      });
    });

    it('replaces the connection with an override', () => {
      expect(
        buildSqliteDatabaseConfig(createConfig(':memory:'), {
          connection: { filename: '/path/to/foo' },
        }),
      ).toEqual({
        client: 'sqlite3',
        connection: {
          filename: '/path/to/foo',
        },
        useNullAsDefault: true,
      });
    });
  });

  describe('createSqliteDatabaseClient', () => {
    it('creates an in memory knex instance', () => {
      expect(
        createSqliteDatabaseClient(
          createConfig({
            client: 'sqlite3',
            connection: ':memory:',
          }),
        ),
      ).toBeTruthy();
    });
  });
});
