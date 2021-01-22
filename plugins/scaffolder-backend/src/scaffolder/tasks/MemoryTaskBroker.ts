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
  CompletedTaskState,
  Task,
  TaskSpec,
  TaskBroker,
  DispatchResult,
  DbTaskEventRow,
} from './types';
import { MemoryDatabase } from './MemoryDatabase';

export class TaskAgent implements Task {
  private heartbeartInterval?: ReturnType<typeof setInterval>;

  static create(state: TaskState, storage: MemoryDatabase) {
    const agent = new TaskAgent(state, storage);
    agent.start();
    return agent;
  }

  // Runs heartbeat internally
  private constructor(
    private readonly state: TaskState,
    private readonly storage: MemoryDatabase,
  ) {}

  get spec() {
    return this.state.spec;
  }

  async emitLog(message: string): Promise<void> {
    await this.storage.emit({
      taskId: this.state.taskId,
      runId: this.state.runId,
      event: message,
    });
  }

  async complete(result: CompletedTaskState): Promise<void> {
    await this.storage.setStatus(
      this.state.taskId,
      result === 'FAILED' ? 'FAILED' : 'COMPLETED',
    );

    if (this.heartbeartInterval) {
      clearInterval(this.heartbeartInterval);
    }
  }

  private start() {
    this.heartbeartInterval = setInterval(() => {
      if (!this.state.runId) {
        throw new Error('no run id provided');
      }
      this.storage.heartbeat(this.state.runId);
    }, 1000);
  }
}

interface TaskState {
  spec: TaskSpec;
  taskId: string;
  runId: string;
}

function defer() {
  let resolve = () => {};
  const promise = new Promise<void>(_resolve => {
    resolve = _resolve;
  });
  return { promise, resolve };
}

export class MemoryTaskBroker implements TaskBroker {
  constructor(private readonly storage: MemoryDatabase) {}
  private deferredDispatch = defer();

  async claim(): Promise<Task> {
    for (;;) {
      const pendingTask = await this.storage.claimTask();
      if (pendingTask) {
        return TaskAgent.create(
          {
            runId: pendingTask.runId!,
            taskId: pendingTask.taskId,
            spec: pendingTask.spec,
          },
          this.storage,
        );
      }

      await this.waitForDispatch();
    }
  }

  async dispatch(spec: TaskSpec): Promise<DispatchResult> {
    const taskRow = await this.storage.createTask(spec);
    this.signalDispatch();
    return {
      taskId: taskRow.taskId,
    };
  }

  observe(
    options: {
      taskId: string;
      after: number | undefined;
    },
    callback: (result: { events: DbTaskEventRow[] }) => void,
  ): () => void {
    const { taskId } = options;

    let cancelled = false;
    const unsubscribe = () => {
      cancelled = true;
    };

    (async () => {
      let after = options.after;
      while (!cancelled) {
        const result = await this.storage.getEvents({ taskId, after: after });
        const { events } = result;
        if (events.length) {
          after = events[events.length - 1].id;
          try {
            callback(result);
          } catch (error) {
            console.log('DEBUG: error =', error);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    })();

    return unsubscribe;
  }

  private waitForDispatch() {
    return this.deferredDispatch.promise;
  }

  private signalDispatch() {
    this.deferredDispatch.resolve();
    this.deferredDispatch = defer();
  }
}
