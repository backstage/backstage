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

import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import {
  SerializedTaskEvent,
  TaskSecrets,
} from '@backstage/plugin-scaffolder-node';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker, TaskManager } from './StorageTaskBroker';
import {
  TestDatabases,
  TestDatabaseId,
  mockServices,
} from '@backstage/backend-test-utils';
import { loggerToWinstonLogger } from '../../util/loggerToWinstonLogger';

jest.setTimeout(60_000);

describe('StorageTaskBroker', () => {
  // TODO(freben): Rewrite to support more databases - the implementation is correct but the test needs to be adapted
  const databases = TestDatabases.create({ ids: ['SQLITE_3'] });

  async function createStore(
    databaseId: TestDatabaseId,
  ): Promise<DatabaseTaskStore> {
    const knex = await databases.init(databaseId);
    return await DatabaseTaskStore.create({
      database: knex,
    });
  }

  const fakeSecrets = { backstageToken: 'secret' } as TaskSecrets;

  const emptyTaskSpec = { spec: { steps: [] } as unknown as TaskSpec };
  const emptyTaskWithFakeSecretsSpec = {
    spec: { steps: [] } as unknown as TaskSpec,
    secrets: fakeSecrets,
  };

  const logger = loggerToWinstonLogger(mockServices.logger.mock());

  it.each(databases.eachSupportedId())(
    'should claim a dispatched work item',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      await broker.dispatch(emptyTaskSpec);
      await expect(broker.claim()).resolves.toEqual(
        expect.any(TaskManager as any),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'should wait for a dispatched work item',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const promise = broker.claim();

      await expect(Promise.race([promise, 'waiting'])).resolves.toBe('waiting');

      await broker.dispatch(emptyTaskSpec);
      await expect(promise).resolves.toEqual(expect.any(TaskManager as any));
    },
  );

  it.each(databases.eachSupportedId())(
    'should dispatch multiple items and claim them in order',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      await broker.dispatch({ spec: { steps: [{ id: 'a' }] } as TaskSpec });
      await broker.dispatch({ spec: { steps: [{ id: 'b' }] } as TaskSpec });
      await broker.dispatch({ spec: { steps: [{ id: 'c' }] } as TaskSpec });

      const taskA = await broker.claim();
      const taskB = await broker.claim();
      const taskC = await broker.claim();
      expect(taskA).toEqual(expect.any(TaskManager as any));
      expect(taskB).toEqual(expect.any(TaskManager as any));
      expect(taskC).toEqual(expect.any(TaskManager as any));
      expect(taskA.spec.steps[0].id).toBe('a');
      expect(taskB.spec.steps[0].id).toBe('b');
      expect(taskC.spec.steps[0].id).toBe('c');
    },
  );

  it.each(databases.eachSupportedId())(
    'should store secrets',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      await broker.dispatch(emptyTaskWithFakeSecretsSpec);
      const task = await broker.claim();
      expect(task.secrets).toEqual(fakeSecrets);
    },
  );

  it.each(databases.eachSupportedId())(
    'should complete a task',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const dispatchResult = await broker.dispatch(emptyTaskSpec);
      const task = await broker.claim();
      await task.complete('completed');
      const taskRow = await storage.getTask(dispatchResult.taskId);
      expect(taskRow.status).toBe('completed');
    },
  );

  it.each(databases.eachSupportedId())(
    'should remove secrets after picking up a task',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const dispatchResult = await broker.dispatch(
        emptyTaskWithFakeSecretsSpec,
      );
      await broker.claim();

      const taskRow = await storage.getTask(dispatchResult.taskId);
      expect(taskRow.secrets).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should fail a task',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const dispatchResult = await broker.dispatch(emptyTaskSpec);
      const task = await broker.claim();
      await task.complete('failed');
      const taskRow = await storage.getTask(dispatchResult.taskId);
      expect(taskRow.status).toBe('failed');
    },
  );

  it.each(databases.eachSupportedId())(
    'multiple brokers should be able to observe a single task',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker1 = new StorageTaskBroker(storage, logger);
      const broker2 = new StorageTaskBroker(storage, logger);

      const { taskId } = await broker1.dispatch(emptyTaskSpec);

      const logPromise = new Promise<SerializedTaskEvent[]>(resolve => {
        const observedEvents = new Array<SerializedTaskEvent>();

        const subscription = broker2
          .event$({ taskId, after: undefined })
          .subscribe(({ events }) => {
            observedEvents.push(...events);
            if (events.some(e => e.type === 'completion')) {
              resolve(observedEvents);
              subscription.unsubscribe();
            }
          });
      });
      const task = await broker1.claim();
      await task.emitLog('log 1');
      await task.emitLog('log 2');
      await task.emitLog('log 3');
      await task.complete('completed');

      const logs = await logPromise;
      expect(logs.map(l => l.body.message, logger)).toEqual([
        'log 1',
        'log 2',
        'log 3',
        'Run completed with status: completed',
      ]);

      const afterLogs = await new Promise<string[]>(resolve => {
        const subscription = broker2
          .event$({ taskId, after: logs[1].id })
          .subscribe(({ events }) => {
            resolve(events.map(e => e.body.message as string));
            subscription.unsubscribe();
          });
      });
      expect(afterLogs).toEqual([
        'log 3',
        'Run completed with status: completed',
      ]);
    },
  );

  it.each(databases.eachSupportedId())('should heartbeat', async databaseId => {
    const storage = await createStore(databaseId);
    const broker = new StorageTaskBroker(storage, logger);
    const { taskId } = await broker.dispatch(emptyTaskSpec);
    const task = await broker.claim();

    const initialTask = await storage.getTask(taskId);

    for (;;) {
      const maybeTask = await storage.getTask(taskId);
      if (maybeTask.lastHeartbeatAt !== initialTask.lastHeartbeatAt) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    await task.complete('completed');
    expect.assertions(0);
  });

  it.each(databases.eachSupportedId())(
    'should be update the status to failed if heartbeat fails',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const { taskId } = await broker.dispatch(emptyTaskSpec);
      const task = await broker.claim();

      jest
        .spyOn((task as any).storage, 'heartbeatTask')
        .mockRejectedValue(new Error('nah m8'));

      const intervalId = setInterval(() => {
        broker.vacuumTasks({ timeoutS: 2 });
      }, 500);

      for (;;) {
        const maybeTask = await storage.getTask(taskId);
        if (maybeTask.status === 'failed') {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      clearInterval(intervalId);

      expect(task.done).toBe(true);
    },
  );

  it.each(databases.eachSupportedId())(
    'should list all tasks',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const { taskId } = await broker.dispatch(emptyTaskSpec);

      const promise = broker.list();
      await expect(promise).resolves.toEqual({
        tasks: [
          expect.objectContaining({
            id: taskId,
          }),
        ],
        totalTasks: 1,
      });
    },
  );

  it.each(databases.eachSupportedId())(
    'should list only tasks createdBy a specific user',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const { taskId } = await broker.dispatch({
        spec: { steps: [] } as unknown as TaskSpec,
        createdBy: 'user:default/foo',
      });

      const task = await storage.getTask(taskId);

      const promise = broker.list({
        filters: { createdBy: ['user:default/foo'] },
      });
      await expect(promise).resolves.toEqual({ tasks: [task], totalTasks: 1 });
    },
  );

  it.each(databases.eachSupportedId())(
    'should list only tasks with specific status',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);
      const { taskId } = await broker.dispatch({
        spec: { steps: [] } as unknown as TaskSpec,
        createdBy: 'user:default/foo',
      });

      const promise = broker.list({
        filters: { status: ['open'] },
      });
      await expect(promise).resolves.toEqual({
        tasks: [
          expect.objectContaining({
            id: taskId,
          }),
        ],
        totalTasks: 1,
      });
    },
  );

  it.each(databases.eachSupportedId())(
    'should handle checkpoints in task state',
    async databaseId => {
      const storage = await createStore(databaseId);
      const broker = new StorageTaskBroker(storage, logger);

      await broker.dispatch({
        spec: { steps: [] } as unknown as TaskSpec,
        createdBy: 'user:default/foo',
      });

      const taskA = await broker.claim();
      await taskA.updateCheckpoint?.({
        key: 'repo.create',
        status: 'success',
        value: 'https://github.com/backstage/backstage.git',
      });

      expect(await taskA.getTaskState?.()).toEqual({
        state: {
          checkpoints: {
            'repo.create': {
              status: 'success',
              value: 'https://github.com/backstage/backstage.git',
            },
          },
        },
      });
    },
  );
});
