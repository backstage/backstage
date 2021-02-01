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

import {
  DbTaskRow,
  DbTaskEventRow,
  Status,
  TaskSpec,
  TaskStore,
  TaskStoreGetEventsOptions,
  TaskStoreEmitOptions,
} from './types';
import { v4 as uuid } from 'uuid';

export class MemoryTaskStore implements TaskStore {
  private readonly store = new Map<string, DbTaskRow>();
  private readonly events = new Array<DbTaskEventRow>();

  async emit({ taskId, runId, body, type }: TaskStoreEmitOptions) {
    this.events.push({
      id: this.events.length,
      taskId,
      runId,
      body,
      type,
      createdAt: new Date().toISOString(),
    });
  }

  async getEvents({
    taskId,
    after,
  }: TaskStoreGetEventsOptions): Promise<{ events: DbTaskEventRow[] }> {
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

    this.store.set(task.id, {
      ...task,
      lastHeartbeat: new Date().toISOString(),
    });
  }

  async claimTask(): Promise<DbTaskRow | undefined> {
    for (const t of this.store.values()) {
      if (t.status === 'open') {
        const task: DbTaskRow = {
          ...t,
          status: 'processing',
          runId: uuid(),
        };
        this.store.set(t.id, task);
        return task;
      }
    }
    return undefined;
  }

  async createTask(spec: TaskSpec): Promise<{ taskId: string }> {
    const taskRow = {
      id: uuid(),
      spec,
      status: 'open' as Status,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.store.set(taskRow.id, taskRow);
    return { taskId: taskRow.id };
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
    this.store.set(task.id, { ...task, status });
  }
}
