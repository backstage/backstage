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

import os from 'os';
import { getVoidLogger, DatabaseManager } from '@backstage/backend-common';
import { ConfigReader, JsonObject } from '@backstage/config';
import { createTemplateAction, TemplateActionRegistry } from '../actions';
import { RepoSpec } from '../actions/builtin/publish/util';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskWorker } from './TaskWorker';
import { ScmIntegrations } from '@backstage/integration';
import { WorkflowRunner } from './types';
import { LegacyWorkflowRunner } from './LegacyWorkflowRunner';

async function createStore(): Promise<DatabaseTaskStore> {
  const manager = DatabaseManager.fromConfig(
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

describe('TaskWorker', () => {
  let storage: DatabaseTaskStore;
  const workflowRunner: WorkflowRunner = {
    execute: jest.fn(),
  } as unknown as WorkflowRunner;

  const legacyWorkflowRunner: LegacyWorkflowRunner = {
    execute: jest.fn(),
  } as unknown as LegacyWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const logger = getVoidLogger();

  it('should call the legacy workflow runner when the apiVersion is not beta3', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      taskBroker: broker,
      runners: {
        legacyWorkflowRunner,
        workflowRunner,
      },
    });

    await broker.dispatch({
      apiVersion: 'backstage.io/v1beta2',
      steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      values: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    expect(legacyWorkflowRunner.execute).toHaveBeenCalled();
  });

  it('should call the default workflow runner when the apiVersion is beta3', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      taskBroker: broker,
      runners: {
        legacyWorkflowRunner,
        workflowRunner,
      },
    });

    await broker.dispatch({
      apiVersion: 'backstage.io/v1beta3',
      steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      parameters: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    expect(workflowRunner.execute).toHaveBeenCalled();
  });

  it('should save the output to the task', async () => {
    (workflowRunner.execute as jest.Mock).mockResolvedValue({
      output: { testOutput: 'testmockoutput' },
    });

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      taskBroker: broker,
      runners: {
        legacyWorkflowRunner,
        workflowRunner,
      },
    });

    const { taskId } = await broker.dispatch({
      apiVersion: 'backstage.io/v1beta3',
      steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      parameters: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');
    expect(event?.body.output).toEqual({ testOutput: 'testmockoutput' });
  });
});
