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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { TemplaterValues } from '../stages/templater/types';
import { MemoryDatabase } from './MemoryDatabase';
import { MemoryTaskBroker, TaskAgent } from './MemoryTaskBroker';

describe('MemoryTaskBroker', () => {
  const storage = new MemoryDatabase();
  const broker = new MemoryTaskBroker(storage);

  const taskSpec = {
    values: {} as TemplaterValues,
    template: {} as TemplateEntityV1alpha1,
  };

  it('should claim a dispatched work item', async () => {
    await broker.dispatch(taskSpec);
    await expect(broker.claim()).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should wait for a dispatched work item', async () => {
    const promise = broker.claim();

    await expect(Promise.race([promise, 'waiting'])).resolves.toBe('waiting');

    await broker.dispatch(taskSpec);
    await expect(promise).resolves.toEqual(expect.any(TaskAgent));
  });

  it('should dispatch multiple items and claim them in order', async () => {
    await broker.dispatch({
      values: { owner: 'a' } as TemplaterValues,
      template: {} as TemplateEntityV1alpha1,
    });
    await broker.dispatch({
      values: { owner: 'b' } as TemplaterValues,
      template: {} as TemplateEntityV1alpha1,
    });
    await broker.dispatch({
      values: { owner: 'c' } as TemplaterValues,
      template: {} as TemplateEntityV1alpha1,
    });

    const taskA = await broker.claim();
    const taskB = await broker.claim();
    const taskC = await broker.claim();
    await expect(taskA).toEqual(expect.any(TaskAgent));
    await expect(taskB).toEqual(expect.any(TaskAgent));
    await expect(taskC).toEqual(expect.any(TaskAgent));
    await expect(taskA.spec.values.owner).toBe('a');
    await expect(taskB.spec.values.owner).toBe('b');
    await expect(taskC.spec.values.owner).toBe('c');
  });

  it('should complete a task', async () => {
    const dispatchResult = await broker.dispatch(taskSpec);
    const task = await broker.claim();
    await task.complete('COMPLETED');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('COMPLETED');
  });

  it('should fail a task', async () => {
    const dispatchResult = await broker.dispatch(taskSpec);
    const task = await broker.claim();
    await task.complete('FAILED');
    const taskRow = await storage.get(dispatchResult.taskId);
    expect(taskRow.status).toBe('FAILED');
  });
});
