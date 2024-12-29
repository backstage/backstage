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

import { JsonObject } from '@backstage/types';
import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import {
  TaskStore,
  TaskStoreCreateTaskOptions,
  TaskStoreCreateTaskResult,
  TaskStoreEmitOptions,
  TaskStoreListEventsOptions,
  TaskStoreRecoverTaskOptions,
  TaskStoreShutDownTaskOptions,
} from './types';
import {
  SerializedTask,
  SerializedTaskEvent,
  TaskEventType,
  TaskSecrets,
  TaskStatus,
} from '@backstage/plugin-scaffolder-node';
import { DateTime, Duration } from 'luxon';
import { TaskRecovery, TaskSpec } from '@backstage/plugin-scaffolder-common';
import { trimEventsTillLastRecovery } from './taskRecoveryHelper';
import { intervalFromNowTill } from './dbUtil';
import {
  restoreWorkspace,
  serializeWorkspace,
} from '@backstage/plugin-scaffolder-node/alpha';
import { flattenParams } from '../../service/helpers';
import { EventsService } from '@backstage/plugin-events-node';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-scaffolder-backend',
  'migrations',
);

export type RawDbTaskRow = {
  id: string;
  spec: string;
  status: TaskStatus;
  state?: string;
  last_heartbeat_at?: string;
  created_at: string;
  created_by: string | null;
  secrets?: string | null;
  workspace?: Buffer;
};

export type RawDbTaskEventRow = {
  id: number;
  task_id: string;
  body: string;
  event_type: TaskEventType;
  created_at: string;
};

/**
 * DatabaseTaskStore
 *
 * @public
 */
export type DatabaseTaskStoreOptions = {
  database: DatabaseService | Knex;
  events?: EventsService;
};

/**
 * Type guard to help DatabaseTaskStore understand when database is DatabaseService vs. when database is a Knex instance.
 *
 * * @public
 */
function isDatabaseService(
  opt: DatabaseService | Knex,
): opt is DatabaseService {
  return (opt as DatabaseService).getClient !== undefined;
}

const parseSqlDateToIsoString = <T>(input: T): T | string => {
  if (typeof input === 'string') {
    const parsed = DateTime.fromSQL(input, { zone: 'UTC' });
    if (!parsed.isValid) {
      throw new Error(
        `Failed to parse database timestamp '${input}', ${parsed.invalidReason}: ${parsed.invalidExplanation}`,
      );
    }
    return parsed.toISO()!;
  }

  return input;
};

/**
 * DatabaseTaskStore
 *
 * @public
 */
export class DatabaseTaskStore implements TaskStore {
  private readonly db: Knex;
  private readonly events?: EventsService;

  static async create(
    options: DatabaseTaskStoreOptions,
  ): Promise<DatabaseTaskStore> {
    const { database } = options;
    const client = await this.getClient(database);

    await this.runMigrations(database, client);

    return new DatabaseTaskStore(client, options.events);
  }

  private isRecoverableTask(spec: TaskSpec): boolean {
    return ['startOver'].includes(
      spec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ?? 'none',
    );
  }

  private parseSpec({ spec, id }: { spec: string; id: string }): TaskSpec {
    try {
      return JSON.parse(spec);
    } catch (error) {
      throw new Error(`Failed to parse spec of task '${id}', ${error}`);
    }
  }

  private parseTaskSecrets(taskRow: RawDbTaskRow): TaskSecrets | undefined {
    try {
      return taskRow.secrets ? JSON.parse(taskRow.secrets) : undefined;
    } catch (error) {
      throw new Error(
        `Failed to parse secrets of task '${taskRow.id}', ${error}`,
      );
    }
  }

  private static async getClient(
    database: DatabaseService | Knex,
  ): Promise<Knex> {
    if (isDatabaseService(database)) {
      return database.getClient();
    }

    return database;
  }

  private static async runMigrations(
    database: DatabaseService | Knex,
    client: Knex,
  ): Promise<void> {
    if (!isDatabaseService(database)) {
      await client.migrate.latest({
        directory: migrationsDir,
      });

      return;
    }

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }
  }

  private constructor(client: Knex, events?: EventsService) {
    this.db = client;
    this.events = events;
  }

  private getState(task: RawDbTaskRow) {
    try {
      return task.state ? JSON.parse(task.state).state : undefined;
    } catch (error) {
      throw new Error(
        `Failed to parse state of the task '${task.id}', ${error}`,
      );
    }
  }

  async list(options: {
    createdBy?: string;
    status?: TaskStatus;
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    order?: { order: 'asc' | 'desc'; field: string }[];
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }> {
    const { createdBy, status, pagination, order, filters } = options ?? {};
    const queryBuilder = this.db<RawDbTaskRow & { count: number }>('tasks');

    if (createdBy || filters?.createdBy) {
      const arr: string[] = flattenParams<string>(
        createdBy,
        filters?.createdBy,
      );
      queryBuilder.whereIn('created_by', [...new Set(arr)]);
    }

    if (status || filters?.status) {
      const arr: TaskStatus[] = flattenParams<TaskStatus>(
        status,
        filters?.status,
      );
      queryBuilder.whereIn('status', [...new Set(arr)]);
    }

    const countQuery = queryBuilder.clone();
    countQuery.count('tasks.id', { as: 'count' });

    if (order) {
      order.forEach(f => {
        queryBuilder.orderBy(f.field, f.order);
      });
    } else {
      queryBuilder.orderBy('created_at', 'desc');
    }

    if (pagination?.limit !== undefined) {
      queryBuilder.limit(pagination.limit);
    }

    if (pagination?.offset !== undefined) {
      queryBuilder.offset(pagination.offset);
    }

    const [results, [{ count }]] = await Promise.all([
      queryBuilder.select(),
      countQuery,
    ]);

    const tasks = results.map(result => ({
      id: result.id,
      spec: JSON.parse(result.spec),
      status: result.status,
      createdBy: result.created_by ?? undefined,
      lastHeartbeatAt: parseSqlDateToIsoString(result.last_heartbeat_at),
      createdAt: parseSqlDateToIsoString(result.created_at),
    }));

    return { tasks, totalTasks: count };
  }

  async getTask(taskId: string): Promise<SerializedTask> {
    const [result] = await this.db<RawDbTaskRow>('tasks')
      .where({ id: taskId })
      .select();
    if (!result) {
      throw new NotFoundError(`No task with id '${taskId}' found`);
    }
    try {
      const spec = JSON.parse(result.spec);
      const secrets = result.secrets ? JSON.parse(result.secrets) : undefined;
      const state = this.getState(result);
      return {
        id: result.id,
        spec,
        status: result.status,
        lastHeartbeatAt: parseSqlDateToIsoString(result.last_heartbeat_at),
        createdAt: parseSqlDateToIsoString(result.created_at),
        createdBy: result.created_by ?? undefined,
        secrets,
        state,
      };
    } catch (error) {
      throw new Error(`Failed to parse spec of task '${taskId}', ${error}`);
    }
  }

  async createTask(
    options: TaskStoreCreateTaskOptions,
  ): Promise<TaskStoreCreateTaskResult> {
    const taskId = uuid();
    await this.db<RawDbTaskRow>('tasks').insert({
      id: taskId,
      spec: JSON.stringify(options.spec),
      secrets: options.secrets ? JSON.stringify(options.secrets) : undefined,
      created_by: options.createdBy ?? null,
      status: 'open',
    });

    this.events?.publish({
      topic: 'scaffolder.task',
      eventPayload: {
        id: taskId,
        spec: options.spec,
        createdBy: options.createdBy,
        status: 'open',
      },
    });

    return { taskId };
  }

  async claimTask(): Promise<SerializedTask | undefined> {
    return this.db.transaction(async tx => {
      const [task] = await tx<RawDbTaskRow>('tasks')
        .where({
          status: 'open',
        })
        .limit(1)
        .select();

      if (!task) {
        return undefined;
      }

      const spec = this.parseSpec(task);

      const updateCount = await tx<RawDbTaskRow>('tasks')
        .where({ id: task.id, status: 'open' })
        .update({
          status: 'processing',
          last_heartbeat_at: this.db.fn.now(),
          // remove the secrets for non-recoverable tasks when moving to processing state.
          secrets: this.isRecoverableTask(spec) ? task.secrets : null,
        });

      if (updateCount < 1) {
        return undefined;
      }

      const ret: SerializedTask = {
        id: task.id,
        spec,
        status: 'processing',
        lastHeartbeatAt: task.last_heartbeat_at,
        createdAt: task.created_at,
        createdBy: task.created_by ?? undefined,
        state: this.getState(task),
      };

      this.events?.publish({
        topic: 'scaffolder.task',
        eventPayload: ret,
      });

      const secrets = this.parseTaskSecrets(task);
      return { ...ret, secrets };
    });
  }

  async heartbeatTask(taskId: string): Promise<void> {
    const updateCount = await this.db<RawDbTaskRow>('tasks')
      .where({ id: taskId, status: 'processing' })
      .update({
        last_heartbeat_at: this.db.fn.now(),
      });
    if (updateCount === 0) {
      throw new ConflictError(`No running task with taskId ${taskId} found`);
    }
  }

  async listStaleTasks(options: { timeoutS: number }): Promise<{
    tasks: { taskId: string; recovery?: TaskRecovery }[];
  }> {
    const { timeoutS } = options;
    const heartbeatInterval = intervalFromNowTill(timeoutS, this.db);
    const rawRows = await this.db<RawDbTaskRow>('tasks')
      .where('status', 'processing')
      .andWhere('last_heartbeat_at', '<=', heartbeatInterval);
    const tasks = rawRows.map(row => ({
      recovery: (JSON.parse(row.spec) as TaskSpec).EXPERIMENTAL_recovery,
      taskId: row.id,
    }));
    return { tasks };
  }

  async completeTask(options: {
    taskId: string;
    status: TaskStatus;
    eventBody: JsonObject;
  }): Promise<void> {
    const { taskId, status, eventBody } = options;

    let oldStatus: TaskStatus;
    if (['failed', 'completed', 'cancelled'].includes(status)) {
      oldStatus = 'processing';
    } else {
      throw new Error(
        `Invalid status update of run '${taskId}' to status '${status}'`,
      );
    }

    await this.db.transaction(async tx => {
      const [task] = await tx<RawDbTaskRow>('tasks')
        .where({
          id: taskId,
        })
        .limit(1)
        .select();

      const updateTask = async (criteria: {
        id: string;
        status?: TaskStatus;
      }) => {
        const updateCount = await tx<RawDbTaskRow>('tasks')
          .where(criteria)
          .update({
            status,
            secrets: null,
          });

        if (updateCount !== 1) {
          throw new ConflictError(
            `Failed to update status to '${status}' for taskId ${taskId}`,
          );
        }

        this.events?.publish({
          topic: 'scaffolder.task',
          eventPayload: {
            id: taskId,
            status: status,
            lastHeartbeatAt: task.last_heartbeat_at,
            createdAt: task.created_at,
            createdBy: task.created_by,
            state: this.getState(task),
          },
        });

        await tx<RawDbTaskEventRow>('task_events')
          .insert({
            task_id: taskId,
            event_type: 'completion',
            body: JSON.stringify(eventBody),
          })
          .returning('id');
      };

      if (status === 'cancelled') {
        await updateTask({
          id: taskId,
        });
        return;
      }

      if (task.status === 'cancelled') {
        return;
      }

      if (!task) {
        throw new Error(`No task with taskId ${taskId} found`);
      }
      if (task.status !== oldStatus) {
        throw new ConflictError(
          `Refusing to update status of run '${taskId}' to status '${status}' ` +
            `as it is currently '${task.status}', expected '${oldStatus}'`,
        );
      }

      await updateTask({
        id: taskId,
        status: oldStatus,
      });
    });
  }

  async emitLogEvent(
    options: TaskStoreEmitOptions<{ message: string } & JsonObject>,
  ): Promise<void> {
    const { taskId, body } = options;
    const serializedBody = JSON.stringify(body);
    await this.db<RawDbTaskEventRow>('task_events')
      .insert({
        task_id: taskId,
        event_type: 'log',
        body: serializedBody,
      })
      .returning('id');
  }

  async getTaskState({ taskId }: { taskId: string }): Promise<
    | {
        state: JsonObject;
      }
    | undefined
  > {
    const [result] = await this.db<RawDbTaskRow>('tasks')
      .where({ id: taskId })
      .select('state');
    return result.state ? JSON.parse(result.state) : undefined;
  }

  async saveTaskState(options: {
    taskId: string;
    state?: JsonObject;
  }): Promise<void> {
    if (options.state) {
      const serializedState = JSON.stringify({ state: options.state });
      await this.db<RawDbTaskRow>('tasks')
        .where({ id: options.taskId })
        .update({
          state: serializedState,
        });
    }
  }

  async listEvents(
    options: TaskStoreListEventsOptions,
  ): Promise<{ events: SerializedTaskEvent[] }> {
    const { isTaskRecoverable, taskId, after } = options;
    const rawEvents = await this.db<RawDbTaskEventRow>('task_events')
      .where({
        task_id: taskId,
      })
      .andWhere(builder => {
        if (typeof after === 'number') {
          builder.where('id', '>', after).orWhere('event_type', 'completion');
        }
      })
      .orderBy('id')
      .select();

    const events = rawEvents.map(event => {
      try {
        const body = JSON.parse(event.body) as JsonObject;
        return {
          id: Number(event.id),
          isTaskRecoverable,
          taskId,
          body,
          type: event.event_type,
          createdAt: parseSqlDateToIsoString(event.created_at),
        };
      } catch (error) {
        throw new Error(
          `Failed to parse event body from event taskId=${taskId} id=${event.id}, ${error}`,
        );
      }
    });

    return trimEventsTillLastRecovery(events);
  }

  async shutdownTask(options: TaskStoreShutDownTaskOptions): Promise<void> {
    const { taskId } = options;
    const message = `This task was marked as stale as it exceeded its timeout`;

    const statusStepEvents = (await this.listEvents({ taskId })).events.filter(
      ({ body }) => body?.stepId,
    );

    const completedSteps = statusStepEvents
      .filter(
        ({ body: { status } }) => status === 'failed' || status === 'completed',
      )
      .map(step => step.body.stepId);

    const hungProcessingSteps = statusStepEvents
      .filter(({ body: { status } }) => status === 'processing')
      .map(event => event.body.stepId)
      .filter(step => !completedSteps.includes(step));

    for (const step of hungProcessingSteps) {
      await this.emitLogEvent({
        taskId,
        body: {
          message,
          stepId: step,
          status: 'failed',
        },
      });
    }

    await this.completeTask({
      taskId,
      status: 'failed',
      eventBody: {
        message,
      },
    });
  }

  async rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    const [result] = await this.db<RawDbTaskRow>('tasks')
      .where({ id: options.taskId })
      .select('workspace');

    await restoreWorkspace({
      path: options.targetPath,
      buffer: result.workspace,
    });
  }

  async cleanWorkspace({ taskId }: { taskId: string }): Promise<void> {
    await this.db('tasks').where({ id: taskId }).update({
      workspace: null,
    });
  }

  async serializeWorkspace(options: {
    path: string;
    taskId: string;
  }): Promise<void> {
    if (options.path) {
      const workspace = (await serializeWorkspace(options)).contents;
      await this.db<RawDbTaskRow>('tasks')
        .where({ id: options.taskId })
        .update({
          workspace,
        });
    }
  }

  async cancelTask(
    options: TaskStoreEmitOptions<{ message: string } & JsonObject>,
  ): Promise<void> {
    const { taskId, body } = options;
    const serializedBody = JSON.stringify(body);
    const [ret] = await this.db<RawDbTaskEventRow>('task_events')
      .insert({
        task_id: taskId,
        event_type: 'cancelled',
        body: serializedBody,
      })
      .returning('id');

    this.events?.publish({
      topic: 'scaffolder.task',
      eventPayload: {
        id: ret.id,
        taskId,
        status: 'cancelled',
        body,
      },
    });
  }

  async retryTask?(options: { taskId: string }): Promise<void> {
    await this.db.transaction(async tx => {
      const result = await tx<RawDbTaskRow>('tasks')
        .where('id', options.taskId)
        .update(
          {
            status: 'open',
            last_heartbeat_at: this.db.fn.now(),
          },
          ['id', 'spec'],
        );

      for (const { id, spec } of result) {
        const taskSpec = JSON.parse(spec as string) as TaskSpec;

        /**
         * Once task is picked up, all event types are replayed.
         * We have to remove cancelled or completion event_type as these are as actions for frontend to perform.
         * In contrary, we send 'recovered' event_type to reset the state on the frontend side.
         *
         */
        await tx<RawDbTaskEventRow>('task_events')
          .where('task_id', id)
          .andWhere(q => q.whereIn('event_type', ['cancelled', 'completion']))
          .del();

        await tx<RawDbTaskEventRow>('task_events').insert({
          task_id: id,
          event_type: 'recovered',
          body: JSON.stringify({
            recoverStrategy:
              taskSpec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ?? 'none',
          }),
        });
      }
    });
  }

  async recoverTasks(
    options: TaskStoreRecoverTaskOptions,
  ): Promise<{ ids: string[] }> {
    const taskIdsToRecover: string[] = [];
    const timeoutS = Duration.fromObject(options.timeout).as('seconds');

    await this.db.transaction(async tx => {
      const heartbeatInterval = intervalFromNowTill(timeoutS, this.db);

      const result = await tx<RawDbTaskRow>('tasks')
        .where('status', 'processing')
        .andWhere('last_heartbeat_at', '<=', heartbeatInterval)
        .update(
          {
            status: 'open',
            last_heartbeat_at: this.db.fn.now(),
          },
          ['id', 'spec'],
        );

      taskIdsToRecover.push(...result.map(i => i.id));

      for (const { id, spec } of result) {
        const taskSpec = JSON.parse(spec as string) as TaskSpec;
        const event = {
          recoverStrategy:
            taskSpec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ?? 'none',
        };
        const [ret] = await tx<RawDbTaskEventRow>('task_events')
          .insert({
            task_id: id,
            event_type: 'recovered',
            body: JSON.stringify(event),
          })
          .returning('id');

        this.events?.publish({
          topic: 'scaffolder.task',
          eventPayload: {
            id: ret.id,
            taskId: id,
            status: 'recovered',
            body: event,
          },
        });
      }
    });

    return { ids: taskIdsToRecover };
  }
}
