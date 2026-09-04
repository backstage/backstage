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
import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import { EventsService } from '@backstage/plugin-events-node';
import { PermissionCriteria } from '@backstage/plugin-permission-common';
import { TaskFilters } from '@backstage/plugin-scaffolder-node';
import { TaskState } from './types';

const createStore = async (
  events?: EventsService,
  recoverTasksEnabled?: boolean,
) => {
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
    recoverTasksEnabled,
  });
  return { store, manager };
};

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

  it('does not select stored workspaces during ordinary task operations', async () => {
    const { store, manager } = await createStore();
    const client = await manager.getClient();
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    await client('tasks')
      .where({ id: taskId })
      .update({ workspace: Buffer.from('legacy workspace') });

    const selectedTaskRows: Record<string, unknown>[] = [];
    const onQueryResponse = (response: unknown, query: { sql?: string }) => {
      if (
        Array.isArray(response) &&
        query.sql &&
        /\bfrom\s+[`"]?tasks[`"]?/i.test(query.sql)
      ) {
        selectedTaskRows.push(
          ...response.filter(
            (row): row is Record<string, unknown> =>
              typeof row === 'object' && row !== null && 'id' in row,
          ),
        );
      }
    };
    client.on('query-response', onQueryResponse);

    try {
      await store.list({});
      await store.getTask(taskId);
      await store.claimTask();
      await client('tasks')
        .where({ id: taskId })
        .update({ last_heartbeat_at: new Date(0) });
      await store.listStaleTasks({ timeoutS: 1 });
      await store.completeTask({
        taskId,
        status: 'completed',
        eventBody: {},
      });
    } finally {
      client.removeListener('query-response', onQueryResponse);
    }

    expect(selectedTaskRows).toHaveLength(5);
    expect(
      selectedTaskRows.every(
        row => !Object.prototype.hasOwnProperty.call(row, 'workspace'),
      ),
    ).toBe(true);
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

  it.each(['open', 'processing'] as const)(
    'should reject retrying %s task',
    async status => {
      const { store } = await createStore();
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
      });

      if (status === 'processing') {
        await store.claimTask();
      }

      await expect(store.retryTask?.({ taskId })).rejects.toThrow(
        ConflictError,
      );
      await expect(store.getTask(taskId)).resolves.toMatchObject({ status });
    },
  );

  it('should allow only one of two concurrent retries', async () => {
    const { store, manager } = await createStore();
    const client = await manager.getClient();
    const { taskId } = await store.createTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });
    await store.completeTask({ taskId, status: 'cancelled', eventBody: {} });

    const results = await Promise.allSettled([
      store.retryTask({ taskId }),
      store.retryTask({ taskId }),
    ]);

    expect(
      results.filter(result => result.status === 'fulfilled'),
    ).toHaveLength(1);
    expect(results.filter(result => result.status === 'rejected')).toEqual([
      {
        status: 'rejected',
        reason: expect.any(ConflictError),
      },
    ]);
    await expect(store.getTask(taskId)).resolves.toMatchObject({
      status: 'open',
    });
    await expect(
      client<RawDbTaskEventRow>('task_events')
        .where({ task_id: taskId, event_type: 'recovered' })
        .select('id'),
    ).resolves.toHaveLength(1);
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

  describe('secrets persistence for recovery', () => {
    it('should clear secrets on claim when recovery is disabled', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task - secrets ARE still returned to the worker
      const claimedTask = await store.claimTask();
      expect(claimedTask).toBeDefined();
      expect(claimedTask?.secrets).toEqual(secrets);

      // But with recovery disabled they are cleared from the DB on claim,
      // preserving the default security lifecycle.
      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toBeUndefined();
    });

    it('should preserve secrets in DB on claim when recovery is enabled', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'super-secret' };

      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim task - secrets ARE returned to worker
      const claimedTask = await store.claimTask();
      expect(claimedTask).toBeDefined();
      expect(claimedTask?.secrets).toEqual(secrets);

      // Secrets stay in DB for potential recovery
      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toEqual(secrets);
    });

    it('should preserve secrets for tasks with EXPERIMENTAL_recovery opt-in even when recovery is disabled', async () => {
      const { store } = await createStore();
      const secrets = { token: 'super-secret' };

      const { taskId } = await store.createTask({
        spec: {
          EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
        } as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      const claimedTask = await store.claimTask();
      expect(claimedTask).toBeDefined();
      expect(claimedTask?.secrets).toEqual(secrets);

      const taskFromDb = await store.getTask(taskId);
      expect(taskFromDb.secrets).toEqual(secrets);
    });

    it('should have secrets available after recovery', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'super-secret' };

      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();

      // Recover task (timeout 0 = immediate recovery)
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Re-claim has secrets available for recovery
      const reclaimedTask = await store.claimTask();
      expect(reclaimedTask).toBeDefined();
      expect(reclaimedTask?.id).toBe(taskId);
      expect(reclaimedTask?.secrets).toEqual(secrets);
    });

    it('should not have secrets after UI retry of failed task', async () => {
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

    it('should preserve secrets for recovery without per-template opt-in when recovery is enabled', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'super-secret' };

      // Create task without per-template opt-in
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();

      // Recover task
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Task is recovered to 'open'
      const recoveredTask = await store.getTask(taskId);
      expect(recoveredTask.status).toBe('open');

      // Re-claim has secrets - recovery works without per-template opt-in
      const reclaimedTask = await store.claimTask();
      expect(reclaimedTask).toBeDefined();
      expect(reclaimedTask?.secrets).toEqual(secrets);
    });
  });

  describe('secrets lifecycle for task completion', () => {
    it('should preserve secrets in DB when claiming a task (for recovery)', async () => {
      const { store } = await createStore(undefined, true);
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
      const { store } = await createStore(undefined, true);
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
      const { store } = await createStore(undefined, true);
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

    it('should delete secrets when task is cancelled', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'secret' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      await store.claimTask();
      await store.cancelTask({
        taskId,
        body: { message: 'cancelled', status: 'cancelled' },
      });

      const task = await store.getTask(taskId);
      const { events } = await store.listEvents({ taskId });
      expect(task.secrets).toBeUndefined();
      expect(events).toEqual([
        expect.objectContaining({
          taskId,
          type: 'cancelled',
          body: { message: 'cancelled', status: 'cancelled' },
        }),
      ]);
    });

    it('should preserve secrets through multiple recovery cycles', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'secret' };
      await store.createTask({
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
      const { store } = await createStore(undefined, true);
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

  describe('end-to-end recovery flow', () => {
    it('should recover a stale task with secrets and step state intact', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { gheAccessToken: 'secret-token' };
      const { taskId } = await store.createTask({
        spec: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [{ id: 'step1' }, { id: 'step2' }],
        } as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // First worker claims and starts processing
      const firstClaim = await store.claimTask();
      expect(firstClaim?.secrets).toEqual(secrets);

      // Simulate step 1 completion
      await store.saveTaskState({
        taskId,
        state: {
          steps: {
            step1: { status: 'completed', output: { result: 'done' } },
          },
        },
      });

      // Simulate worker crash (heartbeat goes stale)
      // Recovery runs
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Verify task is back to open
      const taskAfterRecovery = await store.getTask(taskId);
      expect(taskAfterRecovery.status).toBe('open');

      // Second worker claims
      const secondClaim = await store.claimTask();
      expect(secondClaim).toBeDefined();
      expect(secondClaim!.id).toBe(taskId);

      // Secrets should still be available
      expect(secondClaim!.secrets).toEqual(secrets);

      // Step state should be preserved
      const state = await store.getTaskState({ taskId });
      const taskState = state?.state as TaskState | undefined;
      expect(taskState?.steps?.step1).toEqual({
        status: 'completed',
        output: { result: 'done' },
      });
    });

    it('should handle multiple recovery cycles', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'secret' };
      await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // First crash
      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Second crash
      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Third crash
      await store.claimTask();
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Fourth claim should still work
      const task = await store.claimTask();
      expect(task).toBeDefined();
      expect(task!.secrets).toEqual(secrets);
    });

    it('should accumulate step state across recovery cycles', async () => {
      const { store } = await createStore();
      const { taskId } = await store.createTask({
        spec: {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [{ id: 'step1' }, { id: 'step2' }, { id: 'step3' }],
        } as TaskSpec,
        createdBy: 'me',
      });

      // First run: complete step1
      await store.claimTask();
      await store.saveTaskState({
        taskId,
        state: { steps: { step1: { status: 'completed', output: { v: 1 } } } },
      });
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Second run: complete step2
      await store.claimTask();
      await store.saveTaskState({
        taskId,
        state: {
          steps: {
            step1: { status: 'completed', output: { v: 1 } },
            step2: { status: 'completed', output: { v: 2 } },
          },
        },
      });
      await store.recoverTasks({ timeout: { milliseconds: 0 } });

      // Third run should see both completed steps
      await store.claimTask();
      const state = await store.getTaskState({ taskId });
      expect(state?.state?.steps).toEqual({
        step1: { status: 'completed', output: { v: 1 } },
        step2: { status: 'completed', output: { v: 2 } },
      });
    });

    it('should clean up secrets only on final completion', async () => {
      const { store } = await createStore(undefined, true);
      const secrets = { token: 'secret' };
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
        secrets,
      });

      // Claim and complete successfully
      await store.claimTask();
      await store.completeTask({
        taskId,
        status: 'completed',
        eventBody: { message: 'All done' },
      });

      // Secrets should now be deleted
      const task = await store.getTask(taskId);
      expect(task.secrets).toBeUndefined();
      expect(task.status).toBe('completed');
    });
  });
});

// Regression coverage for the `totalTasks` count type. The rest of the suite
// runs on better-sqlite3, where a `COUNT(*)` aggregate is returned as a number,
// so the PostgreSQL behaviour (where knex returns it as a string) was never
// exercised. These cases run against every supported database.
//
// `TestDatabases.create()` registers its own `afterAll` hook that shuts the
// engines down, so no explicit teardown is needed here.
const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'DatabaseTaskStore totalTasks, %p',
  databaseId => {
    // The timeout is scoped to this single test (passed as the third argument
    // to `it`) so the rest of the suite keeps the default timeout; spinning up
    // a real database engine can take longer than the default.
    it('returns list() totalTasks as a number', async () => {
      const knex = await databases.init(databaseId);
      const store = await DatabaseTaskStore.create({ database: knex });

      await store.createTask({ spec: {} as TaskSpec, createdBy: 'me' });
      await store.createTask({ spec: {} as TaskSpec, createdBy: 'me' });

      const { totalTasks } = await store.list({});

      expect(typeof totalTasks).toBe('number');
      expect(totalTasks).toBe(2);
    }, 60_000);
  },
);

describe.each(databases.eachSupportedId())(
  'DatabaseTaskStore retryTask, %p',
  databaseId => {
    it('retries a terminal task', async () => {
      const knex = await databases.init(databaseId);
      const store = await DatabaseTaskStore.create({ database: knex });
      const { taskId } = await store.createTask({
        spec: {} as TaskSpec,
        createdBy: 'me',
      });
      await store.completeTask({ taskId, status: 'cancelled', eventBody: {} });

      await store.retryTask({ taskId });

      await expect(store.getTask(taskId)).resolves.toMatchObject({
        status: 'open',
      });
    }, 60_000);
  },
);
