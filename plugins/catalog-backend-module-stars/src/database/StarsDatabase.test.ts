/*
 * Copyright 2026 The Backstage Authors
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
import { StarsDatabase } from './StarsDatabase';

const databases = TestDatabases.create({
  ids: ['POSTGRES_16', 'POSTGRES_13', 'MYSQL_8', 'SQLITE_3'],
});

describe('StarsDatabase', () => {
  it.each(databases.eachSupportedId())(
    'should correctly manage stars for %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const db = await StarsDatabase.create(knex);

      const user1 = 'user:default/user1';
      const user2 = 'user:default/user2';
      const entity1 = 'component:default/component1';
      const entity2 = 'component:default/component2';

      await db.star(user1, entity1);
      await db.star(user1, entity2);
      await db.star(user2, entity1);

      // Duplicate star should be ignored
      await db.star(user1, entity1);

      expect(await db.getStars(user1)).toEqual(
        expect.arrayContaining([entity1, entity2]),
      );
      expect(await db.getStars(user2)).toEqual([entity1]);

      expect(await db.getStarCount(entity1)).toBe(2);
      expect(await db.getStarCount(entity2)).toBe(1);

      await db.unstar(user1, entity1);

      expect(await db.getStars(user1)).toEqual([entity2]);
      expect(await db.getStarCount(entity1)).toBe(1);
    },
  );
});
