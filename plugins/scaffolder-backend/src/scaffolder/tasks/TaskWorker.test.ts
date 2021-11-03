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

import { getVoidLogger, DatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskWorker } from './TaskWorker';
import { HandlebarsWorkflowRunner } from './HandlebarsWorkflowRunner';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateActionRegistry } from '../actions';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';

jest.mock('./HandlebarsWorkflowRunner');
const MockedHandlebarsWorkflowRunner =
  HandlebarsWorkflowRunner as jest.Mock<HandlebarsWorkflowRunner>;
MockedHandlebarsWorkflowRunner.mockImplementation();

jest.mock('./NunjucksWorkflowRunner');
const MockedNunjucksWorkflowRunner =
  NunjucksWorkflowRunner as jest.Mock<NunjucksWorkflowRunner>;
MockedNunjucksWorkflowRunner.mockImplementation();

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
  return await DatabaseTaskStore.create({
    database: await manager.getClient(),
  });
}

describe('TaskWorker', () => {
  let storage: DatabaseTaskStore;

  const integrations: ScmIntegrations = {} as ScmIntegrations;

  const actionRegistry: TemplateActionRegistry = {} as TemplateActionRegistry;
  const workingDirectory = '/tmp/scaffolder';

  const handlebarsWorkflowRunner: HandlebarsWorkflowRunner = {
    execute: jest.fn(),
  } as unknown as HandlebarsWorkflowRunner;

  const workflowRunner: NunjucksWorkflowRunner = {
    execute: jest.fn(),
  } as unknown as NunjucksWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    MockedHandlebarsWorkflowRunner.mockImplementation(
      () => handlebarsWorkflowRunner,
    );
    MockedNunjucksWorkflowRunner.mockImplementation(() => workflowRunner);
  });

  const logger = getVoidLogger();

  it('should call the legacy workflow runner when the apiVersion is not beta3', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
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

    expect(MockedHandlebarsWorkflowRunner).toBeCalledWith({
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
    });
    expect(handlebarsWorkflowRunner.execute).toHaveBeenCalled();
  });

  it('should call the default workflow runner when the apiVersion is beta3', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
    });

    await broker.dispatch({
      apiVersion: 'scaffolder.backstage.io/v1beta3',
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
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
    });

    const { taskId } = await broker.dispatch({
      apiVersion: 'scaffolder.backstage.io/v1beta3',
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
