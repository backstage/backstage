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
import { JsonObject, Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { Logger } from 'winston';
import {
  TaskCompletionState,
  TaskContext,
  TaskSecrets,
  TaskStore,
  TaskBroker,
  SerializedTaskEvent,
  SerializedTask,
} from './types';
import { TaskBrokerDispatchOptions } from '.';

/**
 * TaskManager
 *
 * @public
 */
export class TaskManager implements TaskContext {
  private isDone = false;

  private heartbeatTimeoutId?: ReturnType<typeof setInterval>;

  static create(task: CurrentClaimedTask, storage: TaskStore, logger: Logger) {
    const agent = new TaskManager(task, storage, logger);
    agent.startTimeout();
    return agent;
  }

  // Runs heartbeat internally
  private constructor(
    private readonly task: CurrentClaimedTask,
    private readonly storage: TaskStore,
    private readonly logger: Logger,
  ) {}

  get spec() {
    return this.task.spec;
  }

  get secrets() {
    return this.task.secrets;
  }

  get createdBy() {
    return this.task.createdBy;
  }

  async getWorkspaceName() {
    return this.task.taskId;
  }

  get done() {
    return this.isDone;
  }

  async emitLog(message: string, logMetadata?: JsonObject): Promise<void> {
    await this.storage.emitLogEvent({
      taskId: this.task.taskId,
      body: { message, ...logMetadata },
    });
  }

  async complete(
    result: TaskCompletionState,
    metadata?: JsonObject,
  ): Promise<void> {
    await this.storage.completeTask({
      taskId: this.task.taskId,
      status: result === 'failed' ? 'failed' : 'completed',
      eventBody: {
        message: `Run completed with status: ${result}`,
        ...metadata,
      },
    });
    this.isDone = true;
    if (this.heartbeatTimeoutId) {
      clearTimeout(this.heartbeatTimeoutId);
    }
  }

  private startTimeout() {
    this.heartbeatTimeoutId = setTimeout(async () => {
      try {
        await this.storage.heartbeatTask(this.task.taskId);
        this.startTimeout();
      } catch (error) {
        this.isDone = true;

        this.logger.error(
          `Heartbeat for task ${this.task.taskId} failed`,
          error,
        );
      }
    }, 1000);
  }
}

/**
 * Stores the state of the current claimed task passed to the TaskContext
 *
 * @public
 */
export interface CurrentClaimedTask {
  /**
   * The TaskSpec of the current claimed task.
   */
  spec: TaskSpec;
  /**
   * The uuid of the current claimed task.
   */
  taskId: string;
  /**
   * The secrets that are stored with the task.
   */
  secrets?: TaskSecrets;
  /**
   * The creator of the task.
   */
  createdBy?: string;
}

function defer() {
  let resolve = () => {};
  const promise = new Promise<void>(_resolve => {
    resolve = _resolve;
  });
  return { promise, resolve };
}

export class StorageTaskBroker implements TaskBroker {
  constructor(
    private readonly storage: TaskStore,
    private readonly logger: Logger,
  ) {}

  async list(options?: {
    createdBy?: string;
  }): Promise<{ tasks: SerializedTask[] }> {
    if (!this.storage.list) {
      throw new Error(
        'TaskStore does not implement the list method. Please implement the list method to be able to list tasks',
      );
    }
    return await this.storage.list({ createdBy: options?.createdBy });
  }

  private deferredDispatch = defer();

  /**
   * {@inheritdoc TaskBroker.claim}
   */
  async claim(): Promise<TaskContext> {
    for (;;) {
      const pendingTask = await this.storage.claimTask();
      if (pendingTask) {
        return TaskManager.create(
          {
            taskId: pendingTask.id,
            spec: pendingTask.spec,
            secrets: pendingTask.secrets,
            createdBy: pendingTask.createdBy,
          },
          this.storage,
          this.logger,
        );
      }

      await this.waitForDispatch();
    }
  }

  /**
   * {@inheritdoc TaskBroker.dispatch}
   */
  async dispatch(
    options: TaskBrokerDispatchOptions,
  ): Promise<{ taskId: string }> {
    const taskRow = await this.storage.createTask(options);
    this.signalDispatch();
    return {
      taskId: taskRow.taskId,
    };
  }

  /**
   * {@inheritdoc TaskBroker.get}
   */
  async get(taskId: string): Promise<SerializedTask> {
    return this.storage.getTask(taskId);
  }

  /**
   * {@inheritdoc TaskBroker.event$}
   */
  event$(options: {
    taskId: string;
    after?: number;
  }): Observable<{ events: SerializedTaskEvent[] }> {
    return new ObservableImpl(observer => {
      const { taskId } = options;

      let after = options.after;
      let cancelled = false;

      (async () => {
        while (!cancelled) {
          const result = await this.storage.listEvents({ taskId, after });
          const { events } = result;
          if (events.length) {
            after = events[events.length - 1].id;
            observer.next(result);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      })();

      return () => {
        cancelled = true;
      };
    });
  }

  /**
   * {@inheritdoc TaskBroker.vacuumTasks}
   */
  async vacuumTasks(options: { timeoutS: number }): Promise<void> {
    const { tasks } = await this.storage.listStaleTasks(options);
    await Promise.all(
      tasks.map(async task => {
        try {
          await this.storage.completeTask({
            taskId: task.taskId,
            status: 'failed',
            eventBody: {
              message:
                'The task was cancelled because the task worker lost connection to the task broker',
            },
          });
        } catch (error) {
          this.logger.warn(`Failed to cancel task '${task.taskId}', ${error}`);
        }
      }),
    );
  }

  private waitForDispatch() {
    return this.deferredDispatch.promise;
  }

  private signalDispatch() {
    this.deferredDispatch.resolve();
    this.deferredDispatch = defer();
  }
}
