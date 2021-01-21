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

import { MemoryTaskBroker, TaskAgent } from './TaskBroker';

describe('MemoryTaskBroker', () => {
  it('should claim a dispatched work item', async () => {
    const broker = new MemoryTaskBroker();

    await broker.dispatch({});
    await expect(broker.claim()).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should wait for a dispatched work item', async () => {
    const broker = new MemoryTaskBroker();

    const promise = broker.claim();

    await expect(Promise.race([promise, 'waiting'])).resolves.toBe('waiting');

    await broker.dispatch({});
    await expect(promise).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should dispatch multiple items and claim them in order', async () => {
    const broker = new MemoryTaskBroker();

    await broker.dispatch({ name: 'a' });
    await broker.dispatch({ name: 'b' });
    await broker.dispatch({ name: 'c' });

    const taskA = await broker.claim();
    const taskB = await broker.claim();
    const taskC = await broker.claim();
    await expect(taskA).toEqual(expect.any(TaskAgent));
    await expect(taskB).toEqual(expect.any(TaskAgent));
    await expect(taskC).toEqual(expect.any(TaskAgent));
    await expect(taskA.spec.name).toBe('a');
    await expect(taskB.spec.name).toBe('b');
    await expect(taskC.spec.name).toBe('c');
  });

  it('should complete a task', async () => {
    const broker = new MemoryTaskBroker();

    await broker.dispatch({});
    const task = await broker.claim();
    await task.complete('COMPLETED');
  });
});
