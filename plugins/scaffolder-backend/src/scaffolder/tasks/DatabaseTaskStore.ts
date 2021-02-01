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

import { JsonObject } from '@backstage/config';
import {
  ConflictError,
  NotFoundError,
  resolvePackagePath,
} from '@backstage/backend-common';
import Knex, { Transaction } from 'knex';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';
import {
  DbTaskEventRow,
  DbTaskRow,
  Status,
  TaskEventType,
  TaskSpec,
  TaskStore,
  TaskStoreEmitOptions,
  TaskStoreGetEventsOptions,
} from './types';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-scaffolder-backend',
  'migrations',
);

export type RawDbTaskRow = {
  id: string;
  spec: string;
  status: Status;
  last_heartbeat_at?: string;
  retry_count: number;
  created_at: string;
  run_id?: string;
};

export type RawDbTaskEventRow = {
  id: number;
  run_id: string;
  task_id: string;
  body: string;
  event_type: TaskEventType;
  created_at: string;
};

export class DatabaseTaskStore implements TaskStore {
  static async create(knex: Knex): Promise<DatabaseTaskStore> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new DatabaseTaskStore(knex);
  }

  constructor(private readonly db: Knex) {}

  async get(taskId: string): Promise<DbTaskRow> {
    const [result] = await this.db<RawDbTaskRow>('tasks')
      .where({ id: taskId })
      .select();
    if (!result) {
      throw new NotFoundError(`No task with id '${taskId}' found`);
    }
    try {
      const spec = JSON.parse(result.spec);
      return {
        id: result.id,
        spec,
        status: result.status,
        lastHeartbeat: result.last_heartbeat_at,
        retryCount: result.retry_count,
        createdAt: result.created_at,
        runId: result.run_id,
      };
    } catch (error) {
      throw new Error(`Failed to parse spec of task '${taskId}', ${error}`);
    }
  }

  async createTask(spec: TaskSpec): Promise<{ taskId: string }> {
    const taskId = uuid();
    await this.db<RawDbTaskRow>('tasks').insert({
      id: taskId,
      spec: JSON.stringify(spec),
      status: 'open',
      retry_count: 0,
    });
    return { taskId };
  }

  async claimTask(): Promise<DbTaskRow | undefined> {
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

      const runId = uuid();
      const updateCount = await tx<RawDbTaskRow>('tasks')
        .where({ id: task.id, status: 'open' })
        .update({
          status: 'processing',
          run_id: runId,
        });

      if (updateCount < 1) {
        return undefined;
      }

      try {
        const spec = JSON.parse(task.spec);
        return {
          id: task.id,
          spec,
          status: 'processing',
          lastHeartbeat: task.last_heartbeat_at,
          retryCount: task.retry_count,
          createdAt: task.created_at,
          runId: runId,
        };
      } catch (error) {
        throw new Error(`Failed to parse spec of task '${task.id}', ${error}`);
      }
    });
  }

  async heartbeat(runId: string): Promise<void> {
    const updateCount = await this.db<RawDbTaskRow>('tasks')
      .where({ run_id: runId, status: 'processing' })
      .update({
        last_heartbeat_at: this.db.fn.now(),
      });
    if (updateCount === 0) {
      throw new Error(`No running task with runId ${runId} found`);
    }
  }

  async setStatus(runId: string, status: Status): Promise<void> {
    let oldStatus: string;
    if (status === 'failed' || status === 'completed') {
      oldStatus = 'processing';
    } else {
      throw new Error(
        `Invalid status update of run '${runId}' to status '${status}'`,
      );
    }
    await this.db.transaction(async tx => {
      const [task] = await tx<RawDbTaskRow>('tasks')
        .where({
          run_id: runId,
        })
        .limit(1)
        .select();

      if (!task) {
        throw new Error(`No task with runId ${runId} found`);
      }
      if (task.status !== oldStatus) {
        throw new ConflictError(
          `Refusing to update status of run '${runId}' to status '${status}' ` +
            `as it is currently '${task.status}', expected '${oldStatus}'`,
        );
      }
      const updateCount = await tx<RawDbTaskRow>('tasks')
        .where({
          run_id: runId,
          status: oldStatus,
        })
        .update({
          status,
        });
      if (updateCount !== 1) {
        throw new Error(
          `Failed to update status to '${status}' for runId ${runId}`,
        );
      }
    });
  }

  async emit({
    taskId,
    runId,
    body,
    type,
  }: TaskStoreEmitOptions): Promise<void> {
    const serliazedBody = JSON.stringify(body);
    await this.db<RawDbTaskEventRow>('task_events').insert({
      task_id: taskId,
      run_id: runId,
      event_type: type,
      body: serliazedBody,
    });
  }

  async getEvents({
    taskId,
    after,
  }: TaskStoreGetEventsOptions): Promise<{ events: DbTaskEventRow[] }> {
    let query = this.db<RawDbTaskEventRow>('task_events').where({
      task_id: taskId,
    });
    if (typeof after === 'number') {
      query = query
        .where('task_events.id', '>', after)
        .orWhere({ event_type: 'completion' });
    }

    const rawEvents = await query.select();
    const events = rawEvents.map(event => {
      try {
        const body = JSON.parse(event.body) as JsonObject;
        return {
          id: event.id,
          runId: event.run_id,
          taskId: event.task_id,
          body,
          type: event.event_type,
          createdAt: event.created_at,
        };
      } catch (error) {
        throw new Error(
          `Failed to parse event body from event taskId=${taskId} id=${event.id}, ${error}`,
        );
      }
    });
    return { events };
  }
}
