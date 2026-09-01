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

import os from 'node:os';
import { DatabaseManager } from '@backstage/backend-defaults/database';
import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker } from './StorageTaskBroker';
import {
  createParameterTruncator,
  TaskWorker,
  TaskWorkerOptions,
} from './TaskWorker';
import { ScmIntegrations } from '@backstage/integration';
import {
  DefaultTemplateActionRegistry,
  TemplateActionRegistry,
} from '../actions';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import {
  createTemplateAction,
  SerializedTaskEvent,
  TaskBroker,
  TaskContext,
} from '@backstage/plugin-scaffolder-node';
import { WorkflowRunner } from './types';
import ObservableImpl from 'zen-observable';
import waitForExpect from 'wait-for-expect';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import {
  actionsRegistryServiceMock,
  metricsServiceMock,
} from '@backstage/backend-test-utils/alpha';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { loggerToWinstonLogger } from '../../util/loggerToWinstonLogger';
import { TaskRunContext } from './TaskRunContext';

jest.mock('./NunjucksWorkflowRunner');
jest.mock('./SystemSecretSource', () => ({
  SystemSecretSource: {
    create: jest.fn(async () => ({
      subscribe: () => ({ secrets: new Set(), unsubscribe() {} }),
    })),
  },
}));
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
  ).forPlugin('scaffolder', {
    logger: mockServices.logger.mock(),
    lifecycle: mockServices.lifecycle.mock(),
  });
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
    jest.clearAllMocks();
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
      metrics: metricsServiceMock.mock(),
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
      metrics: metricsServiceMock.mock(),
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

  it('should complete successfully when workspace cleanup fails', async () => {
    const cleanWorkspace = jest
      .fn()
      .mockRejectedValue(new Error('Cleanup failed'));
    const config = new ConfigReader({
      scaffolder: {
        taskRecovery: {
          workspaceProvider: 'mock',
        },
      },
    });
    const broker = new StorageTaskBroker(storage, logger, config, undefined, {
      mock: {
        serializeWorkspace: jest.fn(),
        rehydrateWorkspace: jest.fn(),
        cleanWorkspace,
      },
    });
    const { NunjucksWorkflowRunner: ActualNunjucksWorkflowRunner } =
      jest.requireActual<typeof import('./NunjucksWorkflowRunner')>(
        './NunjucksWorkflowRunner',
      );
    const actualWorkflowRunner = new ActualNunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
      metrics: metricsServiceMock.mock(),
    });
    MockedNunjucksWorkflowRunner.mockImplementation(() => actualWorkflowRunner);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
      config,
      metrics: metricsServiceMock.mock(),
    });

    const { taskId } = await broker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [],
        output: {},
        parameters: {},
      },
    });
    const task = await broker.claim();

    await taskWorker.runOneTask(task);

    await expect(storage.getTask(taskId)).resolves.toMatchObject({
      status: 'completed',
    });
    expect(cleanWorkspace).toHaveBeenCalledTimes(1);
  });

  it('should redact secrets from persisted failure events', async () => {
    const ActualNunjucksWorkflowRunner = jest.requireActual<
      typeof import('./NunjucksWorkflowRunner')
    >('./NunjucksWorkflowRunner').NunjucksWorkflowRunner;
    MockedNunjucksWorkflowRunner.mockImplementationOnce(
      options => new ActualNunjucksWorkflowRunner(options),
    );

    const realActionRegistry = new DefaultTemplateActionRegistry(
      actionsRegistryServiceMock(),
      mockServices.logger.mock(),
    );
    realActionRegistry.register(
      createTemplateAction({
        id: 'fail-with-secret',
        handler: async ctx => {
          const error = new Error(`Failed to read ${ctx.input.url}`);
          error.name = `ReadError:${ctx.input.url}`;
          throw Object.freeze(error);
        },
      }),
    );

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry: realActionRegistry,
      metrics: metricsServiceMock.mock(),
    });

    const secret = 'task-secret-value';
    const { taskId } = await broker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'test',
            action: 'fail-with-secret',
            input: {
              url: 'https://${{ secrets.secret }}@example.com',
            },
          },
        ],
        output: {},
        parameters: {},
      },
      secrets: {
        secret,
        __initiatorCredentials: JSON.stringify(mockCredentials.user()),
      },
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const failedStepEvent = events.find(
      event => event.type === 'log' && event.body.status === 'failed',
    );
    const completionEvent = events.find(event => event.type === 'completion');

    expect(failedStepEvent?.body.message).toContain(
      'ReadError:***: Failed to read ***',
    );
    expect(completionEvent?.body.error).toEqual({
      name: 'ReadError:***',
      message: 'Failed to read ***',
    });
    expect(JSON.stringify(events)).not.toContain(secret);
  });

  it('should redact transformed secret values and keys from rejected action events', async () => {
    const ActualNunjucksWorkflowRunner = jest.requireActual<
      typeof import('./NunjucksWorkflowRunner')
    >('./NunjucksWorkflowRunner').NunjucksWorkflowRunner;
    MockedNunjucksWorkflowRunner.mockImplementationOnce(
      options => new ActualNunjucksWorkflowRunner(options),
    );

    const realActionRegistry = new DefaultTemplateActionRegistry(
      actionsRegistryServiceMock(),
      mockServices.logger.mock(),
    );
    realActionRegistry.register(
      createTemplateAction({
        id: 'rejected-action',
        handler: async () => {},
      }),
    );
    const permissions: jest.Mocked<PermissionEvaluator> = {
      authorizeConditional: jest.fn().mockResolvedValue([
        {
          result: AuthorizeResult.DENY,
        },
      ]),
    } as unknown as jest.Mocked<PermissionEvaluator>;

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry: realActionRegistry,
      permissions,
      additionalTemplateFilters: {
        keyedBy: value =>
          value ? { nested: { [String(value).toUpperCase()]: 'value' } } : {},
      },
      metrics: metricsServiceMock.mock(),
    });

    const secret = 'task-secret-value';
    const transformedSecret = secret.toUpperCase();
    const { taskId } = await broker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'test',
            action: 'rejected-action',
            input: {
              url: 'https://${{ secrets.secret | upper }}@example.com',
              attributes: '${{ secrets.secret | keyedBy }}',
            },
          },
        ],
        output: {},
        parameters: {},
      },
      secrets: {
        secret,
        __initiatorCredentials: JSON.stringify(mockCredentials.user()),
      },
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const failedStepEvent = events.find(
      event => event.type === 'log' && event.body.status === 'failed',
    );
    const completionEvent = events.find(event => event.type === 'completion');

    expect(failedStepEvent?.body.message).toContain(
      'Unauthorized action: rejected-action. The action is not allowed.',
    );
    expect(completionEvent?.body.error).toEqual({
      name: 'NotAllowedError',
      message:
        'Unauthorized action: rejected-action. The action is not allowed.',
    });
    expect(JSON.stringify(events)).not.toContain(transformedSecret);
  });

  it('should log an audit event with task parameters when running a task', async () => {
    (workflowRunner.execute as jest.Mock).mockResolvedValue({
      output: {},
    });

    const auditor = mockServices.auditor.mock();
    const auditEvent = {
      success: jest.fn(),
      fail: jest.fn(),
    };
    auditor.createEvent.mockResolvedValue(auditEvent);

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: broker,
      actionRegistry,
      auditor,
      config: mockServices.rootConfig({
        data: {
          scaffolder: {
            auditor: {
              taskParameterMaxLength: 5,
            },
          },
        },
      }),
      metrics: metricsServiceMock.mock(),
    });

    await taskWorker.runOneTask({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {
          test: 'thisisaverylongstring',
        },
        steps: [],
        output: {},
      },
      complete: jest.fn(),
      createdBy: 'test-creator',
      taskId: 'test-id',
    } as unknown as TaskContext);

    expect(auditor.createEvent).toHaveBeenCalledWith({
      eventId: 'task',
      severityLevel: 'medium',
      meta: {
        actionType: 'execution',
        createdBy: 'test-creator',
        taskId: 'test-id',
        taskParameters: {
          test: 'thisi...<truncated>',
        },
      },
    });
    expect(auditEvent.success).toHaveBeenCalled();
  });

  it('redacts audit failures and completion errors without retaining the thrown error', async () => {
    const original = Object.assign(
      new Error('failed with task-secret', {
        cause: new Error('cause task-secret'),
      }),
      { detail: 'detail task-secret' },
    );
    (workflowRunner.execute as jest.Mock).mockRejectedValue(original);
    const auditor = mockServices.auditor.mock();
    const auditEvent = { success: jest.fn(), fail: jest.fn() };
    auditor.createEvent.mockResolvedValue(auditEvent);
    const complete = jest.fn();
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: {} as TaskBroker,
      actionRegistry,
      auditor,
      metrics: metricsServiceMock.mock(),
    });

    await taskWorker.runOneTask({
      taskId: 'test-id',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: { value: 'task-secret' },
        steps: [],
        output: {},
      },
      secrets: { value: 'task-secret' },
      complete,
    } as unknown as TaskContext);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          taskParameters: { value: '***' },
        }),
      }),
    );
    const projectedError = auditEvent.fail.mock.calls[0][0].error;
    expect(projectedError).not.toBe(original);
    expect(projectedError).toMatchObject({
      name: 'Error',
      message: 'failed with ***',
    });
    expect('cause' in projectedError).toBe(false);
    expect('detail' in projectedError).toBe(false);
    expect(complete).toHaveBeenCalledWith('failed', {
      error: { name: 'Error', message: 'failed with ***' },
    });
  });

  it('redacts task parameters before truncating them for audit', async () => {
    const secret = 'a-very-long-task-secret';
    (workflowRunner.execute as jest.Mock).mockResolvedValue({ output: {} });
    const auditor = mockServices.auditor.mock();
    auditor.createEvent.mockResolvedValue({
      success: jest.fn(),
      fail: jest.fn(),
    });
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: {} as TaskBroker,
      actionRegistry,
      auditor,
      config: new ConfigReader({
        scaffolder: { auditor: { taskParameterMaxLength: 5 } },
      }),
      metrics: metricsServiceMock.mock(),
    });

    await taskWorker.runOneTask({
      taskId: 'test-id',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: { value: secret },
        steps: [],
        output: {},
      },
      secrets: { value: secret },
      complete: jest.fn(),
    } as unknown as TaskContext);

    expect(auditor.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({ taskParameters: { value: '***' } }),
      }),
    );
  });

  it('sanitizes errors thrown by the audit failure sink', async () => {
    const secret = 'task-secret';
    (workflowRunner.execute as jest.Mock).mockRejectedValue(
      new Error(`task failed with ${secret}`),
    );
    const auditor = mockServices.auditor.mock();
    const auditError = Object.assign(
      new Error(`audit storage failed with ${secret}`),
      { detail: secret },
    );
    const auditEvent = {
      success: jest.fn(),
      fail: jest.fn().mockRejectedValue(auditError),
    };
    auditor.createEvent.mockResolvedValue(auditEvent);
    const complete = jest.fn();
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: {} as TaskBroker,
      actionRegistry,
      auditor,
      metrics: metricsServiceMock.mock(),
    });

    const result = taskWorker.runOneTask({
      taskId: 'test-id',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        steps: [],
        output: {},
      },
      secrets: { value: secret },
      complete,
    } as unknown as TaskContext);

    const error = await result.catch(caught => caught);
    expect(error).toMatchObject({
      message: 'audit storage failed with ***',
    });
    expect(error).not.toBe(auditError);
    expect(error).not.toHaveProperty('detail');
    expect(complete).toHaveBeenCalledWith('failed', {
      error: { name: 'Error', message: 'task failed with ***' },
    });
  });

  it('fails safely when loading the execution environment fails', async () => {
    const originalGetEnvironmentConfig = workflowRunner.getEnvironmentConfig;
    const environmentError = Object.assign(
      new Error('environment failed with task-secret'),
      { detail: 'task-secret' },
    );
    workflowRunner.getEnvironmentConfig = jest
      .fn()
      .mockRejectedValue(environmentError);
    const auditor = mockServices.auditor.mock();
    const auditEvent = { success: jest.fn(), fail: jest.fn() };
    auditor.createEvent.mockResolvedValue(auditEvent);
    const complete = jest.fn();
    const taskWorker = await TaskWorker.create({
      logger,
      workingDirectory,
      integrations,
      taskBroker: {} as TaskBroker,
      actionRegistry,
      auditor,
      metrics: metricsServiceMock.mock(),
    });

    await taskWorker.runOneTask({
      taskId: 'test-id',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        steps: [],
        output: {},
      },
      secrets: { value: 'task-secret' },
      complete,
    } as unknown as TaskContext);

    expect(auditor.createEvent).not.toHaveBeenCalled();
    expect(auditEvent.fail).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledWith('failed', {
      error: {
        name: 'Error',
        message: 'Failed to initialize task secret redaction',
      },
    });

    workflowRunner.getEnvironmentConfig = originalGetEnvironmentConfig;
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
    jest.clearAllMocks();
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
      metrics: metricsServiceMock.mock(),
    });

    taskWorker.start();

    await dispatchANewTask();
    await dispatchANewTask();
    await dispatchANewTask();
    await dispatchANewTask();

    await waitForExpect(() => {
      expect(asyncTasksCount).toEqual(expectedConcurrentTasks);
    });
  });
});

describe('Cancellable TaskWorker', () => {
  let storage: DatabaseTaskStore;
  const integrations: ScmIntegrations = {} as ScmIntegrations;
  const actionRegistry: TemplateActionRegistry = {} as TemplateActionRegistry;
  const workingDirectory = os.tmpdir();

  let myTask: TaskContext | undefined = undefined;

  const workflowRunner: NunjucksWorkflowRunner = {
    execute: (context: TaskRunContext) => {
      myTask = context.task;
    },
  } as unknown as NunjucksWorkflowRunner;

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
      metrics: metricsServiceMock.mock(),
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
      task: TaskRunContext;
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
    const secretListeners = new Set<(secrets: ReadonlySet<string>) => void>();

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
      systemSecrets: {
        subscribe(listener) {
          secretListeners.add(listener);
          return {
            secrets: new Set(),
            unsubscribe: () => secretListeners.delete(listener),
          };
        },
      },
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

    let stopped = false;
    const stop = taskWorker.stop().then(() => {
      stopped = true;
    });
    for (const listener of secretListeners) {
      listener(new Set(['rotated-during-shutdown']));
    }
    await new Promise(resolve => setTimeout(resolve));

    expect(stopped).toBe(true);
    for (const { task } of inflightTasks) {
      await task.waitUntilReady();
      expect(task.redacter.redactString('rotated-during-shutdown')).toBe('***');
    }

    for (const inflight of inflightTasks) {
      inflight.resolve();
    }
    await stop;
  });

  it('should keep claiming tasks after a claim fails', async () => {
    const workflowRunner: WorkflowRunner = {
      // Never resolves, so the worker parks at its concurrency limit once it
      // has successfully claimed a task.
      execute() {
        return new Promise<never>(() => {});
      },
    };

    let claimedTaskCount = 0;
    const taskWorker = new TaskWorkerConstructor({
      runners: { workflowRunner },
      logger: mockServices.logger.mock(),
      taskBroker: {
        event$() {
          return new ObservableImpl<{ events: SerializedTaskEvent[] }>(
            () => {},
          );
        },
        async claim() {
          claimedTaskCount++;
          if (claimedTaskCount === 1) {
            throw new Error('Connection terminated unexpectedly');
          }
          return {
            spec: {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
            },
            createdBy: 'test',
            async complete(_result, _metadata) {},
          } as TaskContext;
        },
      } as unknown as TaskBroker,
      concurrentTasksLimit: 1,
      systemSecrets: {
        subscribe: () => ({ secrets: new Set(), unsubscribe() {} }),
      },
    });

    taskWorker.start();

    // The first claim rejects. The worker must retry rather than stop for good.
    await waitForExpect(() => {
      expect(claimedTaskCount).toBe(2);
    });
  });
});

describe('createParameterTruncator', () => {
  it('successfully does nothing', async () => {
    const testParams = {};

    const result = createParameterTruncator()(testParams);

    expect(result).toEqual({});
  });

  it('truncates long strings in nested objects and arrays', async () => {
    const params = {
      test: 'short',
      test2: 'thisisaverylongstring',
      nested: {
        test3: 'anotherlongstringhere',
        test4: ['ok', 'toolongstring', { prop: 'thisisaverylongstring' }],
      },
    };

    const result = createParameterTruncator(
      mockServices.rootConfig({
        data: {
          scaffolder: {
            auditor: {
              taskParameterMaxLength: 5,
            },
          },
        },
      }),
    )(params);

    expect(result).toEqual({
      test: 'short',
      test2: 'thisi...<truncated>',
      nested: {
        test3: 'anoth...<truncated>',
        test4: ['ok', 'toolo...<truncated>', { prop: 'thisi...<truncated>' }],
      },
    });
  });

  it('should not truncate if max length is -1', async () => {
    const params = {
      test: 'short',
      test2: 'thisisaverylongstring',
      nested: {
        test3: 'anotherlongstringhere',
        test4: ['ok', 'toolongstring', { prop: 'thisisaverylongstring' }],
      },
    };

    const result = createParameterTruncator(
      mockServices.rootConfig({
        data: {
          scaffolder: {
            auditor: {
              taskParameterMaxLength: -1,
            },
          },
        },
      }),
    )(params);

    expect(result).toEqual({
      test: 'short',
      test2: 'thisisaverylongstring',
      nested: {
        test3: 'anotherlongstringhere',
        test4: ['ok', 'toolongstring', { prop: 'thisisaverylongstring' }],
      },
    });
  });

  it('should throw on invalid max length', async () => {
    expect(() =>
      createParameterTruncator(
        mockServices.rootConfig({
          data: {
            scaffolder: {
              auditor: {
                taskParameterMaxLength: -2,
              },
            },
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid configuration for 'scaffolder.auditor.taskParameterMaxLength', got -2. Must be a positive integer or -1 to disable truncation."`,
    );

    expect(() =>
      createParameterTruncator(
        mockServices.rootConfig({
          data: {
            scaffolder: {
              auditor: {
                taskParameterMaxLength: 1.5,
              },
            },
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid configuration for 'scaffolder.auditor.taskParameterMaxLength', got 1.5. Must be a positive integer or -1 to disable truncation."`,
    );
  });
});
