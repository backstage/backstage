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
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { ConflictError } from '@backstage/errors';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { TaskSuspension } from '@backstage/plugin-scaffolder-node';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { TaskSuspensionStore } from './TaskSuspensionStore';

const databases = TestDatabases.create({ ids: ['SQLITE_3', 'POSTGRES_18'] });
const migrations = {
  directory: resolvePackagePath(
    '@backstage/plugin-scaffolder-backend',
    'migrations',
  ),
};

describe.each(databases.eachSupportedId())(
  'task suspension storage, %p',
  databaseId => {
    const wait: TaskSuspension = {
      key: 'review',
      stepId: 'gate',
      resumeOn: [
        { id: 'manual', type: 'manual', principals: ['user:default/reviewer'] },
        {
          id: 'event',
          type: 'event',
          topic: 'test.merge',
          match: { merged: true },
        },
      ],
    };

    async function setup() {
      const db = await databases.init(databaseId);
      const store = await DatabaseTaskStore.create({
        database: db,
        recoverTasksEnabled: true,
      });
      const { taskId } = await store.createTask({
        spec: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          steps: [],
          output: {},
        } as TaskSpec,
      });
      await store.claimTask();
      await store.suspensions.park(taskId, wait);
      return { db, store, taskId };
    }

    it('commits exactly one outcome across separate consumers', async () => {
      const { db, store, taskId } = await setup();
      expect(await store.suspensions.listEventTopics()).toEqual(['test.merge']);
      const otherConsumer = new TaskSuspensionStore(db);
      const results = await Promise.allSettled([
        store.suspensions.resume({
          taskId,
          key: wait.key,
          triggerId: 'manual',
          payload: { decision: 'approved' },
          principalRefs: ['user:default/reviewer'],
          resumedBy: { type: 'user', userEntityRef: 'user:default/reviewer' },
        }),
        otherConsumer.onEvent({
          topic: 'test.merge',
          eventPayload: { merged: true, extra: 'accepted' },
        }),
      ]);
      expect(results.some(result => result.status === 'fulfilled')).toBe(true);
      const saved = await store.suspensions.get(taskId, wait.key);
      expect(saved?.result?.timedOut).toBe(false);
      expect(['manual', 'event']).toContain(saved?.result?.triggerId);
      expect((await store.getTask(taskId)).status).toBe('open');
      expect(
        await db('task_suspensions')
          .where({ task_id: taskId })
          .whereNotNull('consumed_at'),
      ).toHaveLength(1);
      expect(
        (await store.listEvents({ taskId })).events.filter(event =>
          event.body.message?.startsWith('Resumed by trigger'),
        ),
      ).toHaveLength(1);
      expect(await store.suspensions.listEventTopics()).toEqual([]);
      await db.destroy();
    });

    it('ignores conflict errors and preserves other transaction failures', async () => {
      const { db, store, taskId } = await setup();
      await db('task_suspensions')
        .where({ task_id: taskId })
        .update({ expires_at: Date.now() - 1 });
      const transaction = jest.spyOn(db.client, 'transaction');
      const consumers = [
        () =>
          store.suspensions.onEvent({
            topic: 'test.merge',
            eventPayload: { merged: true },
          }),
        () => store.suspensions.expire(),
      ];
      try {
        for (const consume of consumers) {
          for (const failure of [
            new ConflictError('Already consumed'),
            { name: 'ConflictError', message: 'Already consumed' },
          ]) {
            transaction.mockRejectedValueOnce(failure);
            await expect(consume()).resolves.toBeUndefined();
          }
          for (const failure of [
            new Error('Database failed'),
            undefined,
            null,
            'Database failed',
            { name: 'ConflictError' },
          ]) {
            transaction.mockRejectedValueOnce(failure);
            await expect(consume()).rejects.toBe(failure);
          }
        }
      } finally {
        transaction.mockRestore();
        await db.destroy();
      }
    });

    it('expires waits and refuses to migrate down while a task is waiting', async () => {
      const { db, store, taskId } = await setup();
      await expect(db.migrate.down(migrations)).rejects.toThrow(
        'Resume or cancel waiting tasks',
      );
      await db('task_suspensions')
        .where({ task_id: taskId })
        .update({ expires_at: Date.now() - 1 });
      await expect(
        store.suspensions.resume({
          taskId,
          key: wait.key,
          triggerId: 'manual',
          payload: {},
          principalRefs: ['user:default/reviewer'],
          resumedBy: { type: 'user', userEntityRef: 'user:default/reviewer' },
        }),
      ).rejects.toThrow('expired');
      await store.suspensions.expire();
      expect((await store.getTask(taskId)).status).toBe('open');
      expect((await store.suspensions.get(taskId, wait.key))?.result).toEqual({
        timedOut: true,
        payload: {},
      });
      await db.migrate.down(migrations);
      expect(await db.schema.hasTable('task_suspensions')).toBe(false);
      await db.destroy();
    });
  },
);
