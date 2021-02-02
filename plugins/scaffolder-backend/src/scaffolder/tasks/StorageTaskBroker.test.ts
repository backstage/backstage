/*
 * Copyright 2021 Spotify AB
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

import { SingleConnectionDatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker, TaskAgent } from './StorageTaskBroker';
import { TaskStore, TaskSpec, DbTaskEventRow } from './types';

async function createStore(): Promise<TaskStore> {
  const manager = SingleConnectionDatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('scaffolder');
  return await DatabaseTaskStore.create(await manager.getClient());
}

describe('StorageTaskBroker', () => {
  let storage: TaskStore;

  beforeAll(async () => {
    storage = await createStore();
  });

  it('should claim a dispatched work item', async () => {
    const broker = new StorageTaskBroker(storage);
    await broker.dispatch({ steps: [] });
    await expect(broker.claim()).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should wait for a dispatched work item', async () => {
    const broker = new StorageTaskBroker(storage);
    const promise = broker.claim();

    await expect(Promise.race([promise, 'waiting'])).resolves.toBe('waiting');

    await broker.dispatch({ steps: [] });
    await expect(promise).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should dispatch multiple items and claim them in order', async () => {
    const broker = new StorageTaskBroker(storage);
    await broker.dispatch({ steps: [{ id: 'a' }] } as TaskSpec);
    await broker.dispatch({ steps: [{ id: 'b' }] } as TaskSpec);
    await broker.dispatch({ steps: [{ id: 'c' }] } as TaskSpec);

    const taskA = await broker.claim();
    const taskB = await broker.claim();
    const taskC = await broker.claim();
    await expect(taskA).toEqual(expect.any(TaskAgent));
    await expect(taskB).toEqual(expect.any(TaskAgent));
    await expect(taskC).toEqual(expect.any(TaskAgent));
    await expect(taskA.spec.steps[0].id).toBe('a');
    await expect(taskB.spec.steps[0].id).toBe('b');
    await expect(taskC.spec.steps[0].id).toBe('c');
  });

  it('should complete a task', async () => {
    const broker = new StorageTaskBroker(storage);
    const dispatchResult = await broker.dispatch({ steps: [] });
    const task = await broker.claim();
    await task.complete('completed');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('completed');
  });

  it('should fail a task', async () => {
    const broker = new StorageTaskBroker(storage);
    const dispatchResult = await broker.dispatch({ steps: [] });
    const task = await broker.claim();
    await task.complete('failed');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('failed');
  });

  it('multiple brokers should be able to observe a single task', async () => {
    const broker1 = new StorageTaskBroker(storage);
    const broker2 = new StorageTaskBroker(storage);

    const { taskId } = await broker1.dispatch({ steps: [] });

    const logPromise = new Promise<DbTaskEventRow[]>(resolve => {
      const observedEvents = new Array<DbTaskEventRow>();

      broker2.observe({ taskId, after: undefined }, (_err, { events }) => {
        observedEvents.push(...events);
        if (events.some(e => e.type === 'completion')) {
          resolve(observedEvents);
        }
      });
    });
    const task = await broker1.claim();
    await task.emitLog('log 1');
    await task.emitLog('log 2');
    await task.emitLog('log 3');
    await task.complete('completed');

    const logs = await logPromise;
    expect(logs.map(l => l.body.message)).toEqual([
      'log 1',
      'log 2',
      'log 3',
      'Run completed with status: completed',
    ]);

    const afterLogs = await new Promise<string[]>(resolve => {
      broker2.observe({ taskId, after: logs[1].id }, (_err, { events }) =>
        resolve(events.map(e => e.body.message as string)),
      );
    });
    expect(afterLogs).toEqual([
      'log 3',
      'Run completed with status: completed',
    ]);
  });

  it('should heartbeat', async () => {
    const broker = new StorageTaskBroker(storage);
    const { taskId } = await broker.dispatch({ steps: [] });
    const task = await broker.claim();

    const initialTask = await storage.get(taskId);

    for (;;) {
      const maybeTask = await storage.get(taskId);
      if (maybeTask.lastHeartbeat !== initialTask.lastHeartbeat) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    await task.complete('completed');
    expect.assertions(0);
  });

  it('should be cancelled if heartbeat stops', async () => {
    const broker = new StorageTaskBroker(storage);
    const { taskId } = await broker.dispatch({ steps: [] });
    console.log('DEBUG: taskId =', taskId);
    const task = await broker.claim();
    clearInterval((task as any).heartbeatInterval);

    setTimeout(() => {
      storage.listStaleTasks();
    }, 4000);

    for (;;) {
      const maybeTask = await storage.get(taskId);
      if (maybeTask.status === 'cancelled') {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    expect.assertions(0);
  });
});
