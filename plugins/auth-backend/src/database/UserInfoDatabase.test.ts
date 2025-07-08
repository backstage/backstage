/*
 * Copyright 2024 The Backstage Authors
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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { UserInfoDatabase } from './UserInfoDatabase';
import { AuthDatabase } from './AuthDatabase';
import { DateTime } from 'luxon';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-auth-backend',
  'migrations',
);

jest.setTimeout(60_000);

describe('UserInfoDatabase', () => {
  const databases = TestDatabases.create();

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: migrationsDir,
    });

    return {
      knex,
      dbHandler: await UserInfoDatabase.create({
        database: AuthDatabase.create({
          getClient: async () => knex,
        }),
      }),
    };
  }

  describe.each(databases.eachSupportedId())(
    'should support database %p',
    databaseId => {
      let knex: Knex;
      let dbHandler: UserInfoDatabase;

      beforeEach(async () => {
        ({ knex, dbHandler } = await createDatabaseHandler(databaseId));
      });

      it('addUserInfo', async () => {
        const userInfo = {
          claims: {
            sub: 'user:default/foo',
            ent: ['group:default/foo-group', 'group:default/bar'],
          },
        };

        await dbHandler.addUserInfo(userInfo);

        const savedUserInfo = await knex('user_info')
          .where('user_entity_ref', 'user:default/foo')
          .first();

        expect(savedUserInfo).toEqual({
          user_entity_ref: 'user:default/foo',
          user_info: JSON.stringify(userInfo),
          updated_at: expect.anything(),
          created_at: expect.anything(),
        });

        userInfo.claims.ent = ['group:default/group1', 'group:default/group2'];
        await dbHandler.addUserInfo(userInfo);

        const updatedUserInfo = await knex('user_info')
          .where('user_entity_ref', 'user:default/foo')
          .first();

        expect(updatedUserInfo).toEqual({
          user_entity_ref: 'user:default/foo',
          user_info: JSON.stringify(userInfo),
          updated_at: expect.anything(),
          created_at: expect.anything(),
        });
      });

      it('getUserInfo', async () => {
        const userInfo = {
          claims: {
            sub: 'user:default/backstage-user',
            ent: ['group:default/group1', 'group:default/group2'],
          },
        };

        await knex('user_info').insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info: JSON.stringify(userInfo),
          updated_at: DateTime.now().toSQL({ includeOffset: false }),
        });

        const savedUserInfo = await dbHandler.getUserInfo(
          'user:default/backstage-user',
        );
        expect(savedUserInfo).toEqual(userInfo);
      });
    },
  );
});
