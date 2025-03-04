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
import { DatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskWorker, TaskWorkerOptions } from './TaskWorker';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateActionRegistry } from '../actions';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import {
  SerializedTaskEvent,
  TaskBroker,
  TaskContext,
} from '@backstage/plugin-scaffolder-node';
import { WorkflowRunner } from './types';
import ObservableImpl from 'zen-observable';
import waitForExpect from 'wait-for-expect';
import { mockServices } from '@backstage/backend-test-utils';
import { loggerToWinstonLogger } from '../../util/loggerToWinstonLogger';

jest.mock('./NunjucksWorkflowRunner');
const MockedNunjucksWorkflowRunner =
  NunjucksWorkflowRunner as jest.Mock<NunjucksWorkflowRunner>;
MockedNunjucksWorkflowRunner.mockImplementation();

async function createStore(): Promise<DatabaseTaskStore> {
  const manager = DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('scaffolder');
  return await DatabaseTaskStore.create({
    database: manager,
  });
}

describe('TaskWorker', () => {
  let storage: DatabaseTaskStore;

  const integrations: ScmIntegrations = {} as ScmIntegrations;

  const actionRegistry: TemplateActionRegistry = {} as TemplateActionRegistry;
  const workingDirectory = '/tmp/scaffolder';

  const workflowRunner: NunjucksWorkflowRunner = {
    execute: jest.fn(),
  } as unknown as NunjucksWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    MockedNunjucksWorkflowRunner.mockImplementation(() => workflowRunner);
  });

  const logger = loggerToWinstonLogger(mockServices.logger.mock());

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
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
        output: {
          result: '{{ steps.test.output.testOutput }}',
        },
        parameters: {},
      },
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
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
        output: {
          result: '{{ steps.test.output.testOutput }}',
        },
        parameters: {},
      },
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');
    expect(event?.body.output).toEqual({ testOutput: 'testmockoutput' });
  });
});

describe('Concurrent TaskWorker', () => {
  let storage: DatabaseTaskStore;

  const integrations: ScmIntegrations = {} as ScmIntegrations;

  const actionRegistry: TemplateActionRegistry = {} as TemplateActionRegistry;
  const workingDirectory = os.tmpdir();
  let asyncTasksCount = 0;

  const workflowRunner: NunjucksWorkflowRunner = {
    execute: () => {
      asyncTasksCount++;
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ output: { testOutput: 'testmockoutput' } });
        }, 1000);
      });
    },
  } as unknown as NunjucksWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    asyncTasksCount = 0;
    jest.resetAllMocks();
    MockedNunjucksWorkflowRunner.mockImplementation(() => workflowRunner);
  });

  const logger = loggerToWinstonLogger(mockServices.logger.mock());

  it('should be able to run multiple tasks at once', async () => {
    const broker = new StorageTaskBroker(storage, logger);

    const dispatchANewTask = () =>
      broker.dispatch({
        spec: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
          output: {
            result: '{{ steps.test.output.testOutput }}',
          },
          parameters: {},
        },
      });

    const expectedConcurrentTasks = 3;
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
      concurrentTasksLimit: expectedConcurrentTasks,
    });

    taskWorker.start();

    await dispatchANewTask();
    await dispatchANewTask();
    await dispatchANewTask();
    await dispatchANewTask();

    expect(asyncTasksCount).toEqual(expectedConcurrentTasks);
  });
});

describe('Cancellable TaskWorker', () => {
  let storage: DatabaseTaskStore;
  const integrations: ScmIntegrations = {} as ScmIntegrations;
  const actionRegistry: TemplateActionRegistry = {} as TemplateActionRegistry;
  const workingDirectory = os.tmpdir();

  let myTask: TaskContext | undefined = undefined;

  const workflowRunner: NunjucksWorkflowRunner = {
    execute: (task: TaskContext) => {
      myTask = task;
    },
  } as unknown as NunjucksWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    MockedNunjucksWorkflowRunner.mockImplementation(() => workflowRunner);
  });

  const logger = loggerToWinstonLogger(mockServices.logger.mock());

  it('should be able to cancel the running task', async () => {
    const taskBroker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker,
      actionRegistry,
    });

    const steps = [...Array(10)].map(n => ({
      id: `test${n}`,
      name: `test${n}`,
      action: 'not-found-action',
    }));

    const { taskId } = await taskBroker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps,
        output: {
          result: '{{ steps.test.output.testOutput }}',
        },
        parameters: {},
      },
    });

    taskWorker.start();
    await taskBroker.cancel(taskId);

    await waitForExpect(() => {
      expect(myTask?.cancelSignal.aborted).toBeTruthy();
    });
  });
});

describe('TaskWorker internals', () => {
  const TaskWorkerConstructor = TaskWorker as unknown as {
    new (options: TaskWorkerOptions): TaskWorker;
  };

  it('should not pick up tasks before it is ready to execute more work', async () => {
    const inflightTasks = new Array<{
      task: TaskContext;
      resolve: () => void;
    }>();
    const workflowRunner: WorkflowRunner = {
      async execute(task) {
        await new Promise<void>(resolve => {
          inflightTasks.push({ task, resolve });
        });
        return {
          output: {},
        };
      },
    };

    const subscribers = new Set<
      ZenObservable.SubscriptionObserver<{ events: SerializedTaskEvent[] }>
    >();

    let claimedTaskCount = 0;
    const taskWorker = new TaskWorkerConstructor({
      runners: { workflowRunner },
      taskBroker: {
        event$() {
          return new ObservableImpl<{ events: SerializedTaskEvent[] }>(
            subscriber => {
              subscribers.add(subscriber);
              return () => {
                subscribers.delete(subscriber);
              };
            },
          );
        },
        async claim() {
          claimedTaskCount++;
          return {
            spec: {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
            },
            createdBy: `test-${claimedTaskCount}`,
            async complete(_result, _metadata) {},
          } as TaskContext;
        },
      } as unknown as TaskBroker,
      concurrentTasksLimit: 2,
    });

    expect(claimedTaskCount).toBe(0);
    taskWorker.start();

    // This will wait for all higher priority promise ticks to complete
    await new Promise(resolve => setTimeout(resolve));

    // Once we start the worker it should pick up 2 tasks, since that's our limit
    expect(claimedTaskCount).toBe(2);
    expect(inflightTasks.length).toBe(2);

    // This completes the first task, making space for one more
    inflightTasks.shift()?.resolve();
    await new Promise(resolve => setTimeout(resolve));

    // We now expect one more task to have been claimed, and two tasks in the queue again
    expect(claimedTaskCount).toBe(3);
    expect(inflightTasks.length).toBe(2);
  });
});
