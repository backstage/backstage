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

const members: Array<any> = [
  {
    entity_ref: 'project1',
    user_id: 'member1',
  },
];

describe('DatabaseHandler', () => {
  let database: DatabaseHandler;
  beforeAll(async () => {
    database = await DatabaseHandler.createTestDatabase();
    await database.addMember(members[0].user_id, members[0].entity_ref);
  });

  it("can get members that's in the database", async () => {
    const cov: any[] = await database.getMembers('project1');
    expect(cov[0].entity_ref).toEqual(members[0].entity_ref);
    expect(cov[0].user_id).toEqual(members[0].user_id);
  });
});
