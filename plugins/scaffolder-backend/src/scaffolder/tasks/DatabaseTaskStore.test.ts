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

import { DatabaseManager } from '@backstage/backend-defaults/database';
import { ConfigReader } from '@backstage/config';
import { DatabaseTaskStore, RawDbTaskEventRow } from './DatabaseTaskStore';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { ConflictError } from '@backstage/errors';
import {
  mockServices,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { EventsService } from '@backstage/plugin-events-node';
import { PermissionCriteria } from '@backstage/plugin-permission-common';
import { TaskFilters } from '@backstage/plugin-scaffolder-node';

const createStore = async (events?: EventsService) => {
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
  const store = await DatabaseTaskStore.create({
    database: manager,
    events,
  });
  return { store, manager };
};

const workspaceDir = createMockDirectory({
  content: {
    'app-config.yaml': `
            app:
              title: Example App
              sessionKey:
                $file: secrets/session-key.txt
              escaped: \$\${Escaped}
          `,
  },
});

describe('DatabaseTaskStore', () => {
  const eventsService = {
    publish: jest.fn(),
  } as unknown as EventsService;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create the database store and run migration', async () => {
    const { store, manager } = await createStore();
    expect(store).toBeDefined();

    const client = await manager.getClient();
    expect(client.schema.hasTable('tasks')).toBeTruthy();
    expect(client.schema.hasTable('task_events')).toBeTruthy();
  });

  it('should list all created tasks', async () => {
    const { store } = await createStore();
    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const { tasks } = await store.list({});
    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('me');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();
  });

  it('should allow paginating tasks', async () => {
    const { store } = await createStore();
    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks } = await store.list({ pagination: { limit: 1, offset: 0 } });
    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('me');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.list({
      pagination: { limit: 1, offset: 1 },
    });
    expect(tasks2.length).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('open');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should allow ordering tasks', async () => {
    const { store } = await createStore();
    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'a',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'b',
    });

    const { tasks } = await store.list({
      order: [{ field: 'created_by', order: 'asc' }],
    });
    expect(tasks.length).toBe(2);
    expect(tasks[0].createdBy).toBe('a');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.list({
      order: [{ field: 'created_by', order: 'desc' }],
    });
    expect(tasks2.length).toBe(2);
    expect(tasks2[0].createdBy).toBe('b');
    expect(tasks2[0].status).toBe('open');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should list filtered created tasks by createdBy', async () => {
    const { store } = await createStore();

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks } = await store.list({ createdBy: 'him' });
    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.list({
      filters: { createdBy: 'him' },
    });
    expect(tasks2.length).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('open');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should list filtered created tasks by status', async () => {
    const { store } = await createStore();

    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const message = `This task was marked as stale as it exceeded its timeout`;
    await store.completeTask({
      taskId,
      status: 'cancelled',
      eventBody: { message },
    });

    const { tasks, totalTasks } = await store.list({
      status: 'open',
    });
    expect(tasks.length).toBe(1);
    expect(totalTasks).toBe(1);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2, totalTasks: totalTasks2 } = await store.list({
      filters: { status: ['open'] },
    });
    expect(tasks2.length).toBe(1);
    expect(totalTasks2).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('open');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should limit and offset based on parameters', async () => {
    const { store } = await createStore();

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks, totalTasks } = await store.list({
      pagination: { limit: 1, offset: 1 },
    });
    expect(tasks.length).toBe(1);
    expect(totalTasks).toBe(2);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('open');
    expect(tasks[0].id).toBeDefined();
  });

  it('should filter tasks based on permissionFilters', async () => {
    const { store } = await createStore();

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'user:default/one',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'user:default/two',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'user:default/three',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'user:default/one',
    });

    await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'user:default/four',
    });

    const permissionFilters: PermissionCriteria<TaskFilters> = {
      not: {
        key: 'created_by',
        values: ['user:default/three', 'user:default/four'],
      },
    };

    const { tasks, totalTasks } = await store.list({
      permissionFilters: permissionFilters,
    });

    expect(totalTasks).toBe(3);

    const createdByList = tasks.map(task => task.createdBy);
    expect(createdByList).toEqual(
      expect.arrayContaining(['user:default/one', 'user:default/two']),
    );
    expect(createdByList).not.toEqual(
      expect.arrayContaining(['user:default/three', 'user:default/four']),
    );
  });

  it('should sent an event to start cancelling the task', async () => {
    const { store } = await createStore(eventsService);

    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');

    await store.cancelTask({
      taskId,
      body: {
        message: `Step 2 has been cancelled.`,
        stepId: 2,
        status: 'cancelled',
      },
    });

    const { events } = await store.listEvents({ taskId });
    const event = events[0];
    expect(event.taskId).toBe(taskId);
    expect(event.body.status).toBe('cancelled');

    expect(eventsService.publish).toHaveBeenCalledWith({
      topic: 'scaffolder.task',
      eventPayload: {
        id: 1,
        taskId,
        status: 'cancelled',
        body: {
          message: `Step 2 has been cancelled.`,
          stepId: 2,
          status: 'cancelled',
        },
      },
    });
  });

  it('should emit a log event', async () => {
    const { store } = await createStore(eventsService);
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    await store.emitLogEvent({
      taskId,
      body: {
        message: 'Step #2 failed',
        stepId: 2,
        status: 'failed',
      },
    });
    const { events } = await store.listEvents({ taskId });
    const event = events[0];
    expect(event.taskId).toBe(taskId);
    expect(event.body.status).toBe('failed');
    expect(event.type).toBe('log');
  });

  it('should be able to retied cancelled recoverable task', async () => {
    const { store, manager } = await createStore();
    const client = await manager.getClient();

    const { taskId } = await store.createTask({
      spec: {
        EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
      } as TaskSpec,
      createdBy: 'me#too',
    });
    await store.completeTask({ taskId, status: 'cancelled', eventBody: {} });

    await store.retryTask?.({ taskId });

    const taskAfterRetry = await store.getTask(taskId);
    expect(taskAfterRetry.status).toBe('open');

    expect(
      await client<RawDbTaskEventRow>('task_events')
        .where({
          task_id: taskId,
          event_type: 'recovered',
        })
        .select(['body', 'event_type', 'task_id']),
    ).toEqual([
      {
        body: JSON.stringify({ recoverStrategy: 'startOver' }),
        event_type: 'recovered',
        task_id: taskId,
      },
    ]);

    expect(
      await client<RawDbTaskEventRow>('task_events')
        .where({
          task_id: taskId,
        })
        .andWhere(q => q.whereIn('event_type', ['cancelled', 'completion']))
        .select(['body', 'event_type', 'task_id']),
    ).toEqual([]);
  });

  it('should complete the task', async () => {
    const { store } = await createStore(eventsService);
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');

    const message = `This task was marked as stale as it exceeded its timeout`;
    await store.completeTask({
      taskId,
      status: 'cancelled',
      eventBody: { message },
    });

    const taskAfterCompletion = await store.getTask(taskId);
    expect(taskAfterCompletion.status).toBe('cancelled');

    expect(eventsService.publish).toHaveBeenCalledWith({
      topic: 'scaffolder.task',
      eventPayload: {
        id: taskId,
        status: 'cancelled',
        createdAt: expect.any(String),
        lastHeartbeatAt: null,
        createdBy: 'me',
      },
    });
  });

  it('should claim a new task', async () => {
    const { store } = await createStore(eventsService);
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');
    await store.claimTask();

    const claimedTask = await store.getTask(taskId);
    expect(claimedTask.status).toBe('processing');

    expect(eventsService.publish).toHaveBeenCalledWith({
      topic: 'scaffolder.task',
      eventPayload: {
        id: taskId,
        status: 'processing',
        createdAt: expect.any(String),
        lastHeartbeatAt: null,
        createdBy: 'me',
        spec: {},
      },
    });
  });

  it('should restore the state of the task after the task recovery', async () => {
    const { store } = await createStore(eventsService);
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');
    await store.claimTask();

    const state = {
      state: {
        checkpoints: {
          'v1.task.checkpoint.deploy.to.stg': {
            status: 'success',
            value: true,
          },
          'v1.task.checkpoint.deploy.to.pro': {
            status: 'success',
            value: true,
          },
        },
      },
    };

    await store.saveTaskState({
      taskId,
      state,
    });

    await store.recoverTasks({ timeout: { milliseconds: 0 } });
    await store.claimTask();

    const claimedTask = await store.getTask(taskId);
    expect(claimedTask.state).toEqual({ state: state.state });

    expect(eventsService.publish).toHaveBeenCalledWith({
      topic: 'scaffolder.task',
      eventPayload: {
        id: 1,
        taskId,
        body: {
          recoverStrategy: 'none',
        },
        status: 'recovered',
      },
    });
  });

  it('should shutdown the running task', async () => {
    const { store } = await createStore(eventsService);
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');
    await store.claimTask();
    await store.shutdownTask({ taskId });

    const claimedTask = await store.getTask(taskId);
    expect(claimedTask.status).toBe('failed');

    expect(eventsService.publish).toHaveBeenCalledWith({
      topic: 'scaffolder.task',
      eventPayload: {
        id: taskId,
        status: 'failed',
        createdAt: expect.any(String),
        lastHeartbeatAt: expect.any(String),
        createdBy: 'me',
      },
    });
  });

  it('should be not possible to shutdown not running task', async () => {
    const { store } = await createStore();
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    const task = await store.getTask(taskId);
    expect(task.status).toBe('open');
    await expect(async () => {
      await store.shutdownTask({ taskId });
    }).rejects.toThrow(ConflictError);
  });

  it('should store checkpoints and retrieve task state', async () => {
    const { store } = await createStore();
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.saveTaskState({
      taskId,
      state: {
        checkpoints: {
          'repo.create': {
            status: 'success',
            value: { repoUrl: 'https://github.com/backstage/backstage.git' },
          },
        },
      },
    });

    const state = await store.getTaskState({ taskId });

    expect(state).toStrictEqual({
      state: {
        checkpoints: {
          'repo.create': {
            status: 'success',
            value: { repoUrl: 'https://github.com/backstage/backstage.git' },
          },
        },
      },
    });
  });

  it('serialize and restore the workspace', async () => {
    const { store } = await createStore();
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.serializeWorkspace({ path: workspaceDir.path, taskId });
    expect(fs.existsSync(`${workspaceDir.path}/app-config.yaml`)).toBeTruthy();

    fs.removeSync(workspaceDir.path);
    expect(fs.existsSync(`${workspaceDir.path}/app-config.yaml`)).toBeFalsy();

    fs.mkdirSync(workspaceDir.path);
    await store.rehydrateWorkspace({ targetPath: workspaceDir.path, taskId });
    expect(fs.existsSync(`${workspaceDir.path}/app-config.yaml`)).toBeTruthy();
  });

  describe('BUG REPRODUCTION: current recovery issues', () => {
    it('BUG: secrets are deleted on claim when template lacks EXPERIMENTAL_recovery', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      // Create task WITHOUT EXPERIMENTAL_recovery
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task - secrets ARE returned to worker
      const claimedTask = await store.claimTask();
      expect(claimedTask).toBeDefined();
      expect(claimedTask?.secrets).toEqual(secrets);

      // FIXED: Secrets now stay in DB for recovery
      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toEqual(secrets);
    });

    it('BUG: secrets survive claim ONLY when template has EXPERIMENTAL_recovery startOver', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      // Create task WITH EXPERIMENTAL_recovery
      const { taskId } = await store.createTask({
        spec: {
          EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
        } as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task
      const claimedTask = await store.claimTask();
      expect(claimedTask).toBeDefined();
      expect(claimedTask?.secrets).toEqual(secrets);

      // Check DB - secrets should still be there
      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toEqual(secrets);
    });

    it('BUG: recovered task has no secrets if template lacked opt-in', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      // Create task without opt-in
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task
      await store.claimTask();

      // Recover task (timeout 0 = immediate recovery)
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // FIXED: Re-claim now has secrets available for recovery
      const reclaimedTask = await store.claimTask();
      expect(reclaimedTask).toBeDefined();
      expect(reclaimedTask?.id).toBe(taskId);
      expect(reclaimedTask?.secrets).toEqual(secrets);
    });

    it('BUG: retry from UI fails because secrets were deleted on completeTask', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      // Create task with opt-in
      const { taskId } = await store.createTask({
        spec: {
          EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
        } as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task
      await store.claimTask();

      // Complete with status 'failed'
      await store.completeTask({
        taskId,
        status: 'failed',
        eventBody: { message: 'Task failed' },
      });

      // Call retryTask without secrets (simulating UI retry)
      await store.retryTask({ taskId });

      // Re-claim - secrets should be undefined (even though we had opt-in)
      const reclaimedTask = await store.claimTask();
      expect(reclaimedTask).toBeDefined();
      expect(reclaimedTask?.id).toBe(taskId);
      expect(reclaimedTask?.secrets).toBeUndefined();
    });

    it('BUG: recovery config is checked but templates still need opt-in for secrets', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      // Create task without opt-in
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task
      await store.claimTask();

      // Recover task
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Check status is 'open' (recovery "worked")
      const recoveredTask = await store.getTask(taskId);
      expect(recoveredTask.status).toBe('open');

      // FIXED: Re-claim now has secrets - recovery actually works!
      const reclaimedTask = await store.claimTask();
      expect(reclaimedTask).toBeDefined();
      expect(reclaimedTask?.secrets).toEqual(secrets);
    });
  });

  describe('FIXED: secrets preservation for recovery', () => {
    it('should preserve secrets in DB when claiming a task (for recovery)', async () => {
      const { store } = await createStore();
      const secrets = { gheAccessToken: 'secret-token' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim returns secrets to worker
      const claimedTask = await store.claimTask();
      expect(claimedTask?.secrets).toEqual(secrets);

      // Secrets should STILL be in DB for recovery
      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toEqual(secrets);
    });

    it('should delete secrets only when task reaches terminal state (completed)', async () => {
      const { store } = await createStore();
      const secrets = { token: 'secret' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();
      await store.completeTask({
        taskId,
        status: 'completed',
        eventBody: { message: 'done' },
      });

      const task = await store.getTask(taskId);
      expect(task.secrets).toBeUndefined();
    });

    it('should delete secrets when task fails', async () => {
      const { store } = await createStore();
      const secrets = { token: 'secret' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();
      await store.completeTask({
        taskId,
        status: 'failed',
        eventBody: { message: 'error' },
      });

      const task = await store.getTask(taskId);
      expect(task.secrets).toBeUndefined();
    });

    it('should preserve secrets through multiple recovery cycles', async () => {
      const { store } = await createStore();
      const secrets = { token: 'secret' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // First crash and recovery
      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Second crash and recovery
      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Third claim should still have secrets
      const task = await store.claimTask();
      expect(task?.secrets).toEqual(secrets);
    });
  });

  describe('recovery without template opt-in', () => {
    it('should recover tasks regardless of EXPERIMENTAL_recovery setting', async () => {
      const { store } = await createStore();
      const secrets = { token: 'secret' };

      // Task WITHOUT any EXPERIMENTAL_recovery setting
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Should be recovered
      const task = await store.getTask(taskId);
      expect(task.status).toBe('open');

      // Secrets should be intact
      const recoveredTask = await store.claimTask();
      expect(recoveredTask?.secrets).toEqual(secrets);
    });
  });
});
