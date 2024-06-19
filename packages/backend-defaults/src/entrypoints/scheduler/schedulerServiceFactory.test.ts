/*
 * Copyright 2023 The Backstage Authors
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

import { coreServices } from '@backstage/backend-plugin-api';
import { ServiceFactoryTester } from '@backstage/backend-test-utils';
import { schedulerServiceFactory } from './schedulerServiceFactory';

describe('schedulerFactory', () => {
  it('creates sidecar database features', async () => {
    const tester = ServiceFactoryTester.from(schedulerServiceFactory());

    const scheduler = await tester.get();
    await scheduler.scheduleTask({
      id: 'task1',
      timeout: { seconds: 1 },
      frequency: { seconds: 1 },
      fn: async () => {},
    });

    const database = await tester.getService(coreServices.database);

    const client = await database.getClient();
    await expect(
      client.from('backstage_backend_tasks__tasks').count(),
    ).resolves.toEqual([{ 'count(*)': 1 }]);
    await expect(
      client.from('backstage_backend_tasks__knex_migrations').count(),
    ).resolves.toEqual([{ 'count(*)': expect.any(Number) }]);
    await expect(
      client.from('backstage_backend_tasks__knex_migrations_lock').count(),
    ).resolves.toEqual([{ 'count(*)': expect.any(Number) }]);
  });
});
