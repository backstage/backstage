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
import { UserInfoDatabaseHandler } from './UserInfoDatabaseHandler';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-auth-backend',
  'migrations',
);

jest.setTimeout(60_000);

describe('UserInfoDatabaseHandler', () => {
  const databases = TestDatabases.create();

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: migrationsDir,
    });

    return {
      knex,
      dbHandler: new UserInfoDatabaseHandler(knex),
    };
  }

  describe.each(databases.eachSupportedId())(
    'should support database %p',
    databaseId => {
      let knex: Knex;
      let dbHandler: UserInfoDatabaseHandler;

      beforeEach(async () => {
        ({ knex, dbHandler } = await createDatabaseHandler(databaseId));
      });

      it('addUserInfo', async () => {
        const userInfo = {
          claims: {
            sub: 'user:default/foo',
            ent: ['group:default/foo-group', 'group:default/bar'],
            exp: 1234567890,
          },
        };

        await dbHandler.addUserInfo(userInfo);

        const savedUserInfo = await knex('user_info')
          .where('user_entity_ref', 'user:default/foo')
          .first();
        expect(savedUserInfo).toEqual({
          user_entity_ref: 'user:default/foo',
          user_info: JSON.stringify(userInfo),
          exp: expect.anything(),
        });

        userInfo.claims.ent = ['group:default/group1', 'group:default/group2'];
        await dbHandler.addUserInfo(userInfo);

        const updatedUserInfo = await knex('user_info')
          .where('user_entity_ref', 'user:default/foo')
          .first();
        expect(updatedUserInfo).toEqual({
          user_entity_ref: 'user:default/foo',
          user_info: JSON.stringify(userInfo),
          exp: expect.anything(),
        });
      });

      it('getUserInfo', async () => {
        const userInfo = {
          claims: {
            sub: 'user:default/backstage-user',
            ent: ['group:default/group1', 'group:default/group2'],
            exp: 1234567890,
          },
        };

        await knex('user_info').insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info: JSON.stringify(userInfo),
          exp: knex.fn.now(),
        });

        const savedUserInfo = await dbHandler.getUserInfo(
          'user:default/backstage-user',
        );
        expect(savedUserInfo).toEqual(userInfo);
      });
    },
  );
});
