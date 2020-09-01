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
import { createDatabaseClient } from './connection';

describe('database connection', () => {
  const createConfig = (data: any) =>
    ConfigReader.fromConfigs([
      {
        context: '',
        data,
      },
    ]);

  describe(createDatabaseClient, () => {
    it('returns a postgres connection', () => {
      expect(
        createDatabaseClient(
          createConfig({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('returns an sqlite connection', () => {
      expect(
        createDatabaseClient(
          createConfig({
            client: 'sqlite3',
            connection: ':memory:',
          }),
        ),
      ).toBeTruthy();
    });

    it('tries to create a mysql connection as a passthrough', () => {
      expect(() =>
        createDatabaseClient(
          createConfig({
            client: 'mysql',
            connection: {
              host: '127.0.0.1',
              user: 'foo',
              password: 'bar',
              database: 'dbname',
            },
          }),
        ),
      ).toThrowError(/Cannot find module 'mysql'/);
    });

    it('accepts overrides', () => {
      expect(
        createDatabaseClient(
          createConfig({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
          {
            connection: {
              database: 'foo',
            },
          },
        ),
      ).toBeTruthy();
    });

    it('throws an error without a client', () => {
      expect(() =>
        createDatabaseClient(
          createConfig({
            connection: '',
          }),
        ),
      ).toThrowError();
    });

    it('throws an error without a connection', () => {
      expect(() =>
        createDatabaseClient(
          createConfig({
            client: 'pg',
          }),
        ),
      ).toThrowError();
    });
  });
});
