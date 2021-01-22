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

import { DbTaskRow, DbTaskEventRow, Status, TaskSpec } from './types';
import { v4 as uuid } from 'uuid';

export interface Database {
  get(taskId: string): Promise<DbTaskRow>;
  createTask(task: TaskSpec): Promise<DbTaskRow>;
  claimTask(): Promise<DbTaskRow | undefined>;
  heartbeat(runId: string): Promise<void>;
  setStatus(taskId: string, status: Status): Promise<void>;
}

type EmitOptions = {
  taskId: string;
  runId: string;
  event: string;
};

type ReadOptions = {
  taskId: string;
  after?: number | undefined;
};

export class MemoryDatabase implements Database {
  private readonly store = new Map<string, DbTaskRow>();
  private readonly events = new Array<DbTaskEventRow>();

  async emit({ taskId, runId, event }: EmitOptions) {
    this.events.push({
      id: this.events.length,
      taskId,
      runId,
      event,
      createdAt: new Date().toISOString(),
    });
  }

  async getEvents({
    taskId,
    after,
  }: ReadOptions): Promise<{ events: DbTaskEventRow[] }> {
    const events = this.events.filter(event => {
      if (event.taskId !== taskId) {
        return false;
      }
      if (after !== undefined) {
        if (event.id <= after) {
          return false;
        }
      }
      return true;
    });
    return { events };
  }

  async heartbeat(runId: string): Promise<void> {
    let task: DbTaskRow | undefined;

    for (const t of this.store.values()) {
      if (t.runId === runId) {
        task = t;
      }
    }

    if (!task) {
      throw new Error('No task with matching runId found');
    }

    this.store.set(task.taskId, {
      ...task,
      lastHeartbeat: new Date().toISOString(),
    });
  }

  async claimTask(): Promise<DbTaskRow | undefined> {
    for (const t of this.store.values()) {
      if (t.status === 'OPEN') {
        const task: DbTaskRow = {
          ...t,
          status: 'PROCESSING',
          runId: uuid(),
        };
        this.store.set(t.taskId, task);
        return task;
      }
    }
    return undefined;
  }

  async createTask(spec: TaskSpec): Promise<DbTaskRow> {
    const taskRow = {
      taskId: uuid(),
      spec,
      status: 'OPEN' as Status,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.store.set(taskRow.taskId, taskRow);
    return taskRow;
  }

  async get(taskId: string): Promise<DbTaskRow> {
    const task = this.store.get(taskId);
    if (task) {
      return task;
    }
    throw new Error(`could not found task ${taskId}`);
  }

  async setStatus(taskId: string, status: Status): Promise<void> {
    const task = this.store.get(taskId);
    if (!task) {
      throw new Error(`no task found`);
    }
    this.store.set(task.taskId, { ...task, status });
  }
}
