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

import { InMemoryDatabase } from './Database';
import { MemoryTaskBroker, TaskAgent } from './TaskBroker';

describe('MemoryTaskBroker', () => {
  const storage = new InMemoryDatabase();
  const broker = new MemoryTaskBroker(storage);

  it('should claim a dispatched work item', async () => {
    await broker.dispatch({
      metadata: '',
    });
    await expect(broker.claim()).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should wait for a dispatched work item', async () => {
    const promise = broker.claim();

    await expect(Promise.race([promise, 'waiting'])).resolves.toBe('waiting');

    await broker.dispatch({ metadata: 'foo' });
    await expect(promise).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should dispatch multiple items and claim them in order', async () => {
    await broker.dispatch({ metadata: 'a' });
    await broker.dispatch({ metadata: 'b' });
    await broker.dispatch({ metadata: 'c' });

    const taskA = await broker.claim();
    const taskB = await broker.claim();
    const taskC = await broker.claim();
    await expect(taskA).toEqual(expect.any(TaskAgent));
    await expect(taskB).toEqual(expect.any(TaskAgent));
    await expect(taskC).toEqual(expect.any(TaskAgent));
    await expect(taskA.spec.metadata).toBe('a');
    await expect(taskB.spec.metadata).toBe('b');
    await expect(taskC.spec.metadata).toBe('c');
  });

  it('should complete a task', async () => {
    const dispatchResult = await broker.dispatch({ metadata: 'foo' });
    const task = await broker.claim();
    await task.complete('COMPLETED');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('COMPLETED');
  });

  it('should fail a task', async () => {
    const dispatchResult = await broker.dispatch({ metadata: 'foo' });
    const task = await broker.claim();
    await task.complete('FAILED');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('FAILED');
  });
});
