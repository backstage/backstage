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

import {
  createMockDirectory,
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import {
  actionsRegistryServiceMock,
  metricsServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import {
  createTemplateAction,
  TaskSuspendOptions,
} from '@backstage/plugin-scaffolder-node';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import express from 'express';
import fs from 'fs-extra';
import knex, { Knex } from 'knex';
import request from 'supertest';
import waitForExpect from 'wait-for-expect';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskWorker } from './TaskWorker';
import { DefaultTemplateActionRegistry } from '../actions';
import { createSuspendAction } from '../actions/builtin/suspend';
import { createRouter } from '../../service/router';

describe('persistent task suspension', () => {
  const dir = createMockDirectory();
  const logger = mockServices.logger.mock();
  const auth = mockServices.auth();
  const credentials = mockCredentials.user();
  const config = new ConfigReader({
    scaffolder: {
      taskRecovery: { enabled: true, workspaceProvider: 'test' },
      gatedWorkflows: { eventTopics: ['github.pull_request'] },
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  let db: Knex;
  let store: DatabaseTaskStore;
  let broker: StorageTaskBroker;
  let events: ReturnType<typeof mockServices.events>;
  let registry: DefaultTemplateActionRegistry;
  let worker: TaskWorker;
  let beforeGate: jest.Mock;
  let beforeSuspend: jest.Mock;
  let afterGate: jest.Mock;
  let afterGateBarrier: Promise<void> | undefined;
  let afterGateStarted: (() => void) | undefined;

  const provider: WorkspaceProvider = {
    async serializeWorkspace({ path, taskId }) {
      const snapshot = dir.resolve('snapshots', taskId);
      await fs.remove(snapshot);
      await fs.copy(path, snapshot);
    },
    async rehydrateWorkspace({ targetPath, taskId }) {
      const snapshot = dir.resolve('snapshots', taskId);
      if (await fs.pathExists(snapshot)) await fs.copy(snapshot, targetPath);
    },
    async cleanWorkspace({ taskId }) {
      await fs.remove(dir.resolve('snapshots', taskId));
    },
  };

  async function restart() {
    await worker?.stop();
    broker = new StorageTaskBroker(store, logger, config, auth, {
      test: provider,
    });
    events = mockServices.events();
    await broker.startEventListener(events);
    worker = await TaskWorker.create({
      taskBroker: broker,
      actionRegistry: registry,
      integrations,
      config,
      logger,
      workingDirectory: dir.resolve('working'),
      concurrentTasksLimit: 1,
      gracefulShutdown: true,
      metrics: metricsServiceMock.mock(),
    });
  }

  const gate: TaskSuspendOptions = {
    key: 'approval-or-merge',
    resumeOn: [
      {
        id: 'approved',
        type: 'manual',
        principals: [credentials.principal.userEntityRef],
      },
      {
        id: 'merged',
        type: 'event',
        topic: 'github.pull_request',
        match: {
          action: 'closed',
          pull_request: {
            merged: true,
            html_url: 'https://github.com/acme/service/pull/42',
          },
        },
      },
    ],
  };

  async function dispatch(options = gate, action = 'workflow:suspend') {
    return broker.dispatch({
      createdBy: credentials.principal.userEntityRef,
      secrets: { __initiatorCredentials: JSON.stringify(credentials) },
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        steps: [
          { id: 'before', name: 'Before', action: 'test:before' },
          { id: 'gate', name: 'Gate', action, input: options },
          {
            id: 'after',
            name: 'After',
            action: 'test:after',
            input: { trigger: '${{ steps.gate.output.triggerId }}' },
          },
        ],
        output: {},
      } as TaskSpec,
    });
  }

  async function run() {
    await worker.runOneTask(await broker.claim());
  }

  async function app(
    permissions = mockServices.permissions(),
    httpAuth = mockServices.httpAuth(),
  ) {
    const router = await createRouter({
      logger,
      config,
      auth,
      httpAuth,
      userInfo: mockServices.userInfo(),
      database: mockServices.database({ knex: db }),
      catalog: catalogServiceMock(),
      taskBroker: broker,
      concurrentTasksLimit: 0,
      permissions,
      permissionsRegistry: mockServices.permissionsRegistry.mock(),
      actionsRegistry: actionsRegistryServiceMock(),
      metrics: metricsServiceMock.mock(),
    });
    return express().use(router).use(mockErrorHandler());
  }

  beforeEach(async () => {
    dir.clear();
    db = knex({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    store = await DatabaseTaskStore.create({
      database: db,
      recoverTasksEnabled: true,
    });
    registry = new DefaultTemplateActionRegistry(
      actionsRegistryServiceMock(),
      logger,
    );
    beforeGate = jest.fn();
    beforeSuspend = jest.fn();
    afterGate = jest.fn();
    afterGateBarrier = undefined;
    afterGateStarted = undefined;
    registry.register(
      createTemplateAction({
        id: 'test:before',
        async handler(ctx) {
          beforeGate();
          await fs.writeFile(
            `${ctx.workspacePath}/before.txt`,
            'saved before the wait',
          );
        },
      }),
    );
    registry.register(createSuspendAction());
    registry.register(
      createTemplateAction({
        id: 'test:custom-suspend',
        async handler(ctx) {
          await ctx.checkpoint({
            key: 'before-suspend',
            fn: async () => {
              beforeSuspend();
              return 'created';
            },
          });
          const result = await ctx.suspend(gate);
          ctx.output('triggerId', result.triggerId!);
        },
      }),
    );
    registry.register(
      createTemplateAction({
        id: 'test:ignores-timeout',
        async handler(ctx) {
          await ctx.suspend({ ...gate, timeout: { hours: 1 } });
          ctx.output('triggerId', 'ignored-timeout');
        },
      }),
    );
    registry.register(
      createTemplateAction({
        id: 'test:after',
        async handler(ctx) {
          afterGateStarted?.();
          await afterGateBarrier;
          afterGate(
            ctx.input,
            await fs.readFile(`${ctx.workspacePath}/before.txt`, 'utf8'),
          );
        },
      }),
    );
    await restart();
  });

  afterEach(async () => {
    await worker.stop();
    await db.destroy();
  });

  it('releases the only queue slot while a task is waiting', async () => {
    worker.start();
    const parked = await dispatch();
    const next = await broker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        steps: [],
        output: {},
      },
    });
    await waitForExpect(
      async () => {
        expect((await broker.get(parked.taskId)).status).toBe('waiting');
        expect((await broker.get(next.taskId)).status).toBe('completed');
      },
      4000,
      20,
    );
    await broker.cancel(parked.taskId);
  });

  it('parks, runs another task, restarts, and resumes through the manual HTTP route', async () => {
    const { taskId } = await dispatch(gate, 'test:custom-suspend');
    await run();
    expect((await broker.get(taskId)).status).toBe('waiting');
    expect(afterGate).not.toHaveBeenCalled();
    expect(await fs.pathExists(dir.resolve('working', taskId))).toBe(false);
    const other = await broker.dispatch({
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        steps: [],
        output: {},
      },
    });
    await run();
    expect((await broker.get(other.taskId)).status).toBe('completed');
    await restart();
    const server = await app();
    const path = `/v2/tasks/${taskId}/resume`;
    const denied = await app(
      mockServices.permissions.mock({
        authorizeConditional: async requests =>
          requests.map(() => ({ result: AuthorizeResult.DENY })),
      }),
    );
    await request(denied)
      .post(path)
      .set('Authorization', mockCredentials.user.header())
      .send({ key: gate.key, triggerId: 'approved' })
      .expect(403);
    const outsider = await app(
      mockServices.permissions(),
      mockServices.httpAuth({
        defaultCredentials: mockCredentials.user('user:default/outsider'),
      }),
    );
    await request(outsider)
      .post(path)
      .set(
        'Authorization',
        mockCredentials.user.header('user:default/outsider'),
      )
      .send({ key: gate.key, triggerId: 'approved' })
      .expect(403);
    await request(server)
      .post(path)
      .set('Authorization', mockCredentials.user.header())
      .send({ key: gate.key, triggerId: 'merged' })
      .expect(403);
    await request(server)
      .post(path)
      .set('Authorization', mockCredentials.user.header())
      .send({
        key: gate.key,
        triggerId: 'approved',
        payload: { decision: 'approved', by: 'untrusted' },
      })
      .expect(200);
    await request(server)
      .post(path)
      .set('Authorization', mockCredentials.user.header())
      .send({ key: gate.key, triggerId: 'approved' })
      .expect(409);
    const saved = await store.suspensions.get(taskId, gate.key);
    expect(saved?.result?.resumedBy).toEqual({
      type: 'user',
      userEntityRef: credentials.principal.userEntityRef,
    });
    await run();
    expect((await broker.get(taskId)).status).toBe('completed');
    expect(beforeGate).toHaveBeenCalledTimes(1);
    expect(beforeSuspend).toHaveBeenCalledTimes(1);
    expect(afterGate).toHaveBeenCalledWith(
      { trigger: 'approved' },
      'saved before the wait',
    );
    const logs = await store.listEvents({ taskId });
    expect(logs.events.some(e => e.body.status === 'waiting')).toBe(true);
    expect(logs.events.some(e => e.body.status === 'failed')).toBe(false);
    expect(
      (await store.suspensions.get(taskId, gate.key))?.result?.payload,
    ).toEqual({});
  });

  it('matches an event after restart and consumes the wait only once', async () => {
    const { taskId } = await dispatch();
    await run();
    await restart();
    await events.publish({
      topic: 'github.pull_request',
      eventPayload: {
        action: 'closed',
        pull_request: {
          merged: false,
          html_url: 'https://github.com/acme/service/pull/42',
        },
      },
    });
    expect((await broker.get(taskId)).status).toBe('waiting');
    const event = {
      topic: 'github.pull_request',
      eventPayload: {
        action: 'closed',
        pull_request: {
          merged: true,
          html_url: 'https://github.com/acme/service/pull/42',
          extra: 'allowed',
        },
      },
    };
    await events.publish(event);
    await events.publish(event);
    expect((await broker.get(taskId)).status).toBe('open');
    expect(
      (await store.suspensions.get(taskId, gate.key))?.result?.triggerId,
    ).toBe('merged');
    await run();
    expect((await broker.get(taskId)).status).toBe('completed');
    expect(afterGate).toHaveBeenCalledTimes(1);
  });

  it('keeps the resumed workspace when an event arrives before the old worker exits', async () => {
    let release!: () => void;
    let started!: () => void;
    afterGateBarrier = new Promise<void>(resolve => {
      release = resolve;
    });
    const reachedAfterGate = new Promise<void>(resolve => {
      started = resolve;
    });
    afterGateStarted = started;
    const { taskId } = await dispatch();
    const task = await broker.claim();
    const park = task.suspend!.bind(task);
    let resumedRun!: Promise<void>;
    task.suspend = async options => {
      await park(options);
      await events.publish({
        topic: 'github.pull_request',
        eventPayload: {
          action: 'closed',
          pull_request: {
            merged: true,
            html_url: 'https://github.com/acme/service/pull/42',
          },
        },
      });
      resumedRun = worker.runOneTask(await broker.claim());
      await reachedAfterGate;
    };
    await worker.runOneTask(task);
    release();
    await resumedRun;
    expect((await broker.get(taskId)).status).toBe('completed');
    expect(afterGate).toHaveBeenCalledWith(
      { trigger: 'merged' },
      'saved before the wait',
    );
  });

  it('fails timed-out gates and keeps cancelled waits out of the timeout sweep', async () => {
    const first = await dispatch(
      { ...gate, timeout: { hours: 1 } },
      'test:ignores-timeout',
    );
    await run();
    await db('task_suspensions')
      .where({ task_id: first.taskId })
      .update({ expires_at: Date.now() - 1 });
    await broker.recoverTasks();
    expect((await broker.get(first.taskId)).status).toBe('open');
    await run();
    expect((await broker.get(first.taskId)).status).toBe('failed');
    expect(afterGate).not.toHaveBeenCalled();
    const second = await dispatch({ ...gate, timeout: { hours: 1 } });
    await run();
    await broker.cancel(second.taskId);
    await db('task_suspensions')
      .where({ task_id: second.taskId })
      .update({ expires_at: Date.now() - 1 });
    await broker.recoverTasks();
    expect((await broker.get(second.taskId)).status).toBe('cancelled');
    expect(
      await db('task_suspensions')
        .where({ task_id: second.taskId })
        .whereNull('consumed_at'),
    ).toHaveLength(0);
  });

  it('lets only one manual or event trigger win a concurrent race', async () => {
    const { taskId } = await dispatch();
    await run();
    const results = await Promise.allSettled([
      broker.resume({
        taskId,
        key: gate.key,
        triggerId: 'approved',
        payload: {},
        principalRefs: [credentials.principal.userEntityRef],
        resumedBy: {
          type: 'user',
          userEntityRef: credentials.principal.userEntityRef,
        },
      }),
      events.publish({
        topic: 'github.pull_request',
        eventPayload: {
          action: 'closed',
          pull_request: {
            merged: true,
            html_url: 'https://github.com/acme/service/pull/42',
          },
        },
      }),
    ]);
    expect(results.some(result => result.status === 'fulfilled')).toBe(true);
    const rows = await db('task_suspensions')
      .where({ task_id: taskId })
      .whereNotNull('consumed_at');
    expect(rows).toHaveLength(1);
    const { events: log } = await store.listEvents({ taskId });
    expect(
      log.filter(event => event.body.message?.startsWith('Resumed by trigger')),
    ).toHaveLength(1);
    await run();
    expect((await broker.get(taskId)).status).toBe('completed');
    expect(afterGate).toHaveBeenCalledTimes(1);
  });

  it('allows a new successful wait after a timeout', async () => {
    registry.register(
      createTemplateAction({
        id: 'test:reask',
        async handler(ctx) {
          const first = await ctx.suspend({
            ...gate,
            key: 'first',
            timeout: { hours: 1 },
          });
          const result = first.timedOut
            ? await ctx.suspend({ ...gate, key: 'second' })
            : first;
          ctx.output('triggerId', result.triggerId!);
        },
      }),
    );
    const { taskId } = await dispatch(gate, 'test:reask');
    await run();
    await db('task_suspensions')
      .where({ task_id: taskId, key: 'first' })
      .update({ expires_at: Date.now() - 1 });
    await broker.recoverTasks();
    await run();
    expect((await broker.get(taskId)).status).toBe('waiting');
    await broker.resume({
      taskId,
      key: 'second',
      triggerId: 'approved',
      payload: {},
      principalRefs: [credentials.principal.userEntityRef],
      resumedBy: {
        type: 'user',
        userEntityRef: credentials.principal.userEntityRef,
      },
    });
    await run();
    expect((await broker.get(taskId)).status).toBe('completed');
    expect(afterGate).toHaveBeenCalledWith(
      { trigger: 'approved' },
      'saved before the wait',
    );
  });

  it('rejects swallowed signals, repeated keys, and unavailable recovery', async () => {
    registry.register(
      createTemplateAction({
        id: 'test:swallowed',
        async handler(ctx) {
          try {
            await ctx.suspend(gate);
          } catch {
            throw new Error('handler error');
          }
        },
      }),
    );
    const swallowed = await dispatch(gate, 'test:swallowed');
    await run();
    expect((await broker.get(swallowed.taskId)).status).toBe('failed');
    expect(
      await store.suspensions.get(swallowed.taskId, gate.key),
    ).toBeUndefined();

    registry.register(
      createTemplateAction({
        id: 'test:repeated',
        async handler(ctx) {
          await ctx.suspend(gate);
          await ctx.suspend(gate);
        },
      }),
    );
    const repeated = await dispatch(gate, 'test:repeated');
    await run();
    await broker.resume({
      taskId: repeated.taskId,
      key: gate.key,
      triggerId: 'approved',
      payload: {},
      principalRefs: [credentials.principal.userEntityRef],
      resumedBy: {
        type: 'user',
        userEntityRef: credentials.principal.userEntityRef,
      },
    });
    await run();
    expect((await broker.get(repeated.taskId)).status).toBe('failed');

    const disabled = await dispatch();
    const disabledWorker = await TaskWorker.create({
      taskBroker: broker,
      actionRegistry: registry,
      integrations,
      config: new ConfigReader({}),
      logger,
      workingDirectory: dir.resolve('working'),
      metrics: metricsServiceMock.mock(),
    });
    await disabledWorker.runOneTask(await broker.claim());
    expect((await broker.get(disabled.taskId)).status).toBe('failed');
    expect(
      await store.suspensions.get(disabled.taskId, gate.key),
    ).toBeUndefined();
  });
});
