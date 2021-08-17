/*
 * Copyright 2021 The Backstage Authors
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
import { queryPostgresMajorVersion } from './util';

describe('util', () => {
  describe('unsupported', () => {
    const databases = TestDatabases.create({
      ids: ['SQLITE_3', 'MYSQL_8'],
    });

    it.each(databases.eachSupportedId())(
      'should fail on get postgres major version, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);

        await expect(
          async () => await queryPostgresMajorVersion(knex),
        ).rejects.toThrow();
      },
      60_000,
    );
  });

  describe('supported', () => {
    const databases = TestDatabases.create({
      ids: ['POSTGRES_13', 'POSTGRES_9'],
    });

    if (databases.eachSupportedId().length < 1) {
      // Only execute tests if at least on database engine is available, e.g. if
      // not in CI=1. it.each doesn't support an empty array.
      return;
    }

    it.each(databases.eachSupportedId())(
      'should get postgres major version, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        const expectedVersion = +databaseId.substr(9);

        await expect(queryPostgresMajorVersion(knex)).resolves.toBe(
          expectedVersion,
        );
      },
      60_000,
    );
  });
});
