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

import { DatabaseHandler } from './DatabaseHandler';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';

const bazaarProject: any = {
  name: 'n1',
  entityRef: 'ref1',
  community: '',
  status: 'proposed',
  announcement: 'a',
  membersCount: 0,
  startDate: '2021-11-07T13:27:00.000Z',
  endDate: null,
  size: 'small',
  responsible: 'r',
};
describe('DatabaseHandler', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return {
      knex,
      dbHandler: await DatabaseHandler.create({ database: knex }),
    };
  }

  it.each(databases.eachSupportedId())(
    'should insert and get entity, %p',
    async databaseId => {
      const { knex, dbHandler } = await createDatabaseHandler(databaseId);

      await knex('metadata').insert({
        entity_ref: bazaarProject.entityRef,
        name: bazaarProject.name,
        announcement: bazaarProject.announcement,
        community: bazaarProject.community,
        status: bazaarProject.status,
        updated_at: new Date().toISOString(),
        start_date: bazaarProject.startDate,
        end_date: bazaarProject.endDate,
        size: bazaarProject.size,
        responsible: bazaarProject.responsible,
      });

      const res = await dbHandler.getMetadata('ref1');

      expect(res).toHaveLength(1);
      expect(res[0].announcement).toEqual('a');
      expect(res[0].community).toEqual('');
      expect(res[0].status).toEqual('proposed');
      expect(res[0].start_date).toEqual('2021-11-07T13:27:00.000Z');
      expect(res[0].end_date).toEqual(null);
      expect(res[0].size).toEqual('small');
      expect(res[0].responsible).toEqual('r');
    },
    60_000,
  );
});
