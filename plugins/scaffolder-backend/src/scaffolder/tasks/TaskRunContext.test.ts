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

import { mockServices } from '@backstage/backend-test-utils';
import { TaskContext } from '@backstage/plugin-scaffolder-node';
import { SystemSecretProvider, TaskRunContext } from './TaskRunContext';

function createSystemSecrets(initial: string[]) {
  let listener: ((values: ReadonlySet<string>) => void) | undefined;
  const unsubscribe = jest.fn();
  const source: SystemSecretProvider = {
    subscribe(next) {
      listener = next;
      return { secrets: new Set(initial), unsubscribe };
    },
  };
  return {
    source,
    unsubscribe,
    update(...values: string[]) {
      listener?.(new Set(values));
    },
  };
}

function createTask() {
  const emitLog = jest.fn(async () => {});
  const complete = jest.fn(async () => {});
  const updateCheckpoint = jest.fn(async () => {});
  const updateStepState = jest.fn(async () => {});
  const serializeWorkspace = jest.fn(async () => {});
  const task = {
    taskId: 'task-a',
    spec: { parameters: {}, steps: [] },
    secrets: {
      task: 'task-secret',
      backstageToken: 'backstage-token',
      __initiatorCredentials: JSON.stringify({
        principal: { type: 'service', subject: 'credential-subject' },
        token: 'credential-token',
      }),
    },
    createdBy: 'user:default/guest',
    cancelSignal: new AbortController().signal,
    done: false,
    emitLog,
    complete,
    updateCheckpoint,
    updateStepState,
    serializeWorkspace,
    cleanWorkspace: jest.fn(async () => {}),
    rehydrateWorkspace: jest.fn(async () => {}),
    getTaskState: jest.fn(async () => undefined),
    getWorkspaceName: jest.fn(async () => 'task-a'),
    getInitiatorCredentials: jest.fn(async () => ({
      principal: { type: 'service', subject: 'credential-subject' },
    })),
  } as unknown as TaskContext;
  return {
    task,
    emitLog,
    complete,
    updateCheckpoint,
    updateStepState,
    serializeWorkspace,
  };
}

describe('TaskRunContext', () => {
  it('starts with the union of system, environment, task, and credential values', async () => {
    const system = createSystemSecrets(['system-secret']);
    const fixture = createTask();

    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: {
        parameters: {},
        secrets: { environment: 'environment-secret' },
      },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    expect(
      context.redacter.redactString(
        'system-secret environment-secret task-secret backstage-token credential-subject credential-token',
      ),
    ).toBe('*** *** *** *** credential-subject ***');
  });

  it('reacts to config changes while keeping the execution environment immutable', async () => {
    const system = createSystemSecrets(['old-system']);
    const { task } = createTask();
    const loadEnvironment = jest.fn(async () => ({
      parameters: { version: 'new' },
      secrets: { current: 'rotated-environment' },
    }));
    const initialEnvironment = {
      parameters: { version: 'initial' },
      secrets: { initial: 'initial-environment' },
    };
    const context = await TaskRunContext.create({
      task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: initialEnvironment,
      loadEnvironment,
    });

    system.update('rotated-system');
    await context.waitUntilReady();

    expect(context.environment).toBe(initialEnvironment);
    expect(loadEnvironment).toHaveBeenCalledTimes(1);
    expect(
      context.redacter.redactString(
        'old-system rotated-system initial-environment rotated-environment',
      ),
    ).toBe('*** *** *** ***');
  });

  it('redacts task events after an in-flight environment refresh completes', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    let finishRefresh: (() => void) | undefined;
    const refreshReady = new Promise<void>(resolve => {
      finishRefresh = resolve;
    });
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => {
        await refreshReady;
        return {
          parameters: {},
          secrets: { rotated: 'rotated-environment-secret' },
        };
      },
    });

    system.update('rotated-system-secret');
    const emission = context.task.emitLog('rotated-environment-secret');
    expect(fixture.emitLog).not.toHaveBeenCalled();

    finishRefresh?.();
    await emission;

    expect(fixture.emitLog).toHaveBeenCalledWith('***');
  });

  it('fails subsequent egress safely when an environment refresh fails', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => {
        throw Object.assign(new Error('refresh exposed unknown-secret'), {
          detail: 'unknown-secret',
        });
      },
    });

    system.update('rotated-system-secret');

    await expect(context.task.emitLog('safe')).rejects.toThrow(
      'Failed to initialize task secret redaction',
    );
    expect(fixture.emitLog).not.toHaveBeenCalled();
    expect(() => context.logger.info('safe')).toThrow(
      'Failed to initialize task secret redaction',
    );
    await context.dispose();
  });

  it('keeps task values isolated and creates a fresh redacter per attempt', async () => {
    const system = createSystemSecrets([]);
    const first = createTask();
    const second = createTask();
    second.task.taskId = 'task-b';
    second.task.secrets = { task: 'other-secret' };

    const [firstContext, secondContext] = await Promise.all([
      TaskRunContext.create({
        task: first.task,
        logger: mockServices.logger.mock(),
        systemSecrets: system.source,
        environment: { parameters: {} },
        loadEnvironment: async () => ({ parameters: {} }),
      }),
      TaskRunContext.create({
        task: second.task,
        logger: mockServices.logger.mock(),
        systemSecrets: system.source,
        environment: { parameters: {} },
        loadEnvironment: async () => ({ parameters: {} }),
      }),
    ]);

    expect(firstContext.redacter).not.toBe(secondContext.redacter);
    expect(firstContext.redacter.redactString('other-secret')).toBe(
      'other-secret',
    );
    expect(secondContext.redacter.redactString('task-secret')).toBe(
      'task-secret',
    );
  });

  it('fails closed with a sanitized initialization error', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    fixture.task.secrets = { __initiatorCredentials: '{task-secret' };

    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    const error = (() => {
      try {
        context.assertInitialized();
        return undefined;
      } catch (caught) {
        return caught;
      }
    })();
    expect(error).toMatchObject({
      message: 'Failed to initialize task secret redaction',
    });
    expect(error).not.toHaveProperty('detail');
  });

  it('redacts logger, task event, and completion projections', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    const logger = mockServices.logger.mock();
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger,
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    context.logger.info('message task-secret', {
      'task-secret': 'value task-secret',
    });
    await context.task.emitLog('event task-secret', {
      detail: 'task-secret',
    });
    await context.task.complete('failed', {
      error: { message: 'task-secret' },
    });

    expect(logger.info).toHaveBeenCalledWith('message ***', {
      '***': 'value ***',
    });
    expect(fixture.emitLog).toHaveBeenCalledWith('event ***', {
      detail: '***',
    });
    expect(fixture.complete).toHaveBeenCalledWith('failed', {
      error: { message: '***' },
    });
  });

  it('learns sensitive values from recovered task state before returning it', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    (fixture.task.getTaskState as jest.Mock).mockResolvedValue({
      state: {
        checkpoints: {
          'v1.task.checkpoint.step1.checkpoint': {
            status: 'success',
            value: {
              'checkpoint-secret-key': 'checkpoint-secret-value',
            },
          },
        },
        steps: {
          step1: {
            status: 'completed',
            output: {
              'recovered-secret-key': 'recovered-secret-value',
            },
          },
        },
      },
    });
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    await context.task.getTaskState?.();
    await context.task.emitLog(
      'completed step1 success recovered-secret-key recovered-secret-value checkpoint-secret-key checkpoint-secret-value',
    );

    expect(fixture.emitLog).toHaveBeenCalledWith(
      'completed step1 success *** *** *** ***',
    );
  });

  it('redacts child logger metadata learned after child creation', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    const childLogger = mockServices.logger.mock();
    const logger = mockServices.logger.mock({ child: () => childLogger });
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger,
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    const child = context.logger.child({ detail: 'late-sensitive-value' });
    context.registerSensitiveValue('late-sensitive-value');
    child.info('safe');

    expect(logger.child).toHaveBeenCalledWith({ detail: '***' });
    expect(childLogger.info).toHaveBeenCalledWith('safe');
  });

  it('sanitizes errors thrown by observable sinks', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    fixture.emitLog.mockRejectedValue(
      Object.assign(new Error('storage failed with task-secret'), {
        detail: 'task-secret',
      }),
    );
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    const error = await context.task.emitLog('safe').catch(e => e);

    expect(error).toMatchObject({ message: 'storage failed with ***' });
    expect(error).not.toHaveProperty('detail');
  });

  it('learns credentials returned dynamically by the task context', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    const credentials = {
      version: 'v1',
      principal: {
        type: 'user',
        userEntityRef: 'user:default/mock',
      },
    };
    Object.defineProperty(credentials, 'token', {
      enumerable: false,
      value: 'dynamic-token-secret',
    });
    (fixture.task.getInitiatorCredentials as jest.Mock).mockResolvedValue(
      credentials,
    );
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    await context.task.getInitiatorCredentials();
    await context.task.emitLog(
      'v1 user user:default/mock dynamic-token-secret',
    );

    expect(fixture.emitLog).toHaveBeenCalledWith(
      'v1 user user:default/mock ***',
    );
  });

  it('keeps registered values in the attempt redacter', async () => {
    const system = createSystemSecrets([]);
    const fixture = createTask();
    const context = await TaskRunContext.create({
      task: fixture.task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    context.registerSensitiveValue({ 'generated-key': 'generated-secret' });
    await context.task.updateCheckpoint?.({
      key: 'checkpoint',
      status: 'success',
      value: { secret: 'generated-secret' },
    });
    await context.task.emitLog('generated-key generated-secret');

    expect(fixture.updateCheckpoint).toHaveBeenCalledWith({
      key: 'checkpoint',
      status: 'success',
      value: { secret: 'generated-secret' },
    });
    expect(fixture.emitLog).toHaveBeenCalledWith('*** ***');
  });

  it('unsubscribes when disposed', async () => {
    const system = createSystemSecrets([]);
    const { task } = createTask();
    const context = await TaskRunContext.create({
      task,
      logger: mockServices.logger.mock(),
      systemSecrets: system.source,
      environment: { parameters: {} },
      loadEnvironment: async () => ({ parameters: {} }),
    });

    await context.dispose();

    expect(system.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
