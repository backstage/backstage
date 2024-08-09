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

import { Config } from '@backstage/config';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { JsonObject, JsonValue, Observable } from '@backstage/types';
import { Logger } from 'winston';
import ObservableImpl from 'zen-observable';
import {
  SerializedTask,
  SerializedTaskEvent,
  TaskBroker,
  TaskBrokerDispatchOptions,
  TaskCompletionState,
  TaskContext,
  TaskSecrets,
  TaskStatus,
} from '@backstage/plugin-scaffolder-node';
import { InternalTaskSecrets, TaskStore } from './types';
import { readDuration } from './helper';
import {
  AuthService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import { DefaultWorkspaceService, WorkspaceService } from './WorkspaceService';
import { WorkspaceProvider } from '@backstage/plugin-scaffolder-node/alpha';

type TaskState = {
  checkpoints: {
    [key: string]:
      | {
          status: 'failed';
          reason: string;
        }
      | {
          status: 'success';
          value: JsonValue;
        };
  };
};
/**
 * TaskManager
 *
 * @public
 */
export class TaskManager implements TaskContext {
  private isDone = false;

  private heartbeatTimeoutId?: ReturnType<typeof setInterval>;

  static create(
    task: CurrentClaimedTask,
    storage: TaskStore,
    abortSignal: AbortSignal,
    logger: Logger,
    auth?: AuthService,
    config?: Config,
    additionalWorkspaceProviders?: Record<string, WorkspaceProvider>,
  ) {
    const workspaceService = DefaultWorkspaceService.create(
      task,
      storage,
      additionalWorkspaceProviders,
      config,
    );

    const agent = new TaskManager(
      task,
      storage,
      abortSignal,
      logger,
      workspaceService,
      auth,
    );
    agent.startTimeout();
    return agent;
  }

  // Runs heartbeat internally
  private constructor(
    private readonly task: CurrentClaimedTask,
    private readonly storage: TaskStore,
    private readonly signal: AbortSignal,
    private readonly logger: Logger,
    private readonly workspaceService: WorkspaceService,
    private readonly auth?: AuthService,
  ) {}

  get spec() {
    return this.task.spec;
  }

  get cancelSignal() {
    return this.signal;
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

  async rehydrateWorkspace?(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    await this.workspaceService.rehydrateWorkspace(options);
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

  async getTaskState?(): Promise<
    | {
        state?: JsonObject;
      }
    | undefined
  > {
    return this.storage.getTaskState?.({ taskId: this.task.taskId });
  }

  async updateCheckpoint?(
    options:
      | {
          key: string;
          status: 'success';
          value: JsonValue;
        }
      | {
          key: string;
          status: 'failed';
          reason: string;
        },
  ): Promise<void> {
    const { key, ...value } = options;
    if (this.task.state) {
      (this.task.state as TaskState).checkpoints[key] = value;
    } else {
      this.task.state = { checkpoints: { [key]: value } };
    }
    await this.storage.saveTaskState?.({
      taskId: this.task.taskId,
      state: this.task.state,
    });
  }

  async serializeWorkspace?(options: { path: string }): Promise<void> {
    await this.workspaceService.serializeWorkspace(options);
  }

  async cleanWorkspace?(): Promise<void> {
    await this.workspaceService.cleanWorkspace();
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

  async getInitiatorCredentials(): Promise<BackstageCredentials> {
    const secrets = this.task.secrets as InternalTaskSecrets;

    if (secrets && secrets.__initiatorCredentials) {
      return JSON.parse(secrets.__initiatorCredentials);
    }
    if (!this.auth) {
      throw new Error(
        'Failed to create none credentials in scaffolder task. The TaskManager has not been initialized with an auth service implementation',
      );
    }
    return this.auth.getNoneCredentials();
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
   * The state of checkpoints of the task.
   */
  state?: JsonObject;
  /**
   * The creator of the task.
   */
  createdBy?: string;

  workspace?: Promise<Buffer>;
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
    private readonly config?: Config,
    private readonly auth?: AuthService,
    private readonly additionalWorkspaceProviders?: Record<
      string,
      WorkspaceProvider
    >,
  ) {}

  async list(options?: {
    createdBy?: string;
    status?: TaskStatus;
  }): Promise<{ tasks: SerializedTask[] }> {
    if (!this.storage.list) {
      throw new Error(
        'TaskStore does not implement the list method. Please implement the list method to be able to list tasks',
      );
    }
    return await this.storage.list({
      createdBy: options?.createdBy,
      status: options?.status,
    });
  }

  private deferredDispatch = defer();

  private async registerCancellable(
    taskId: string,
    abortController: AbortController,
  ) {
    let shouldUnsubscribe = false;
    const subscription = this.event$({ taskId, after: undefined }).subscribe({
      error: _ => {
        subscription.unsubscribe();
      },
      next: ({ events }) => {
        for (const event of events) {
          if (event.type === 'cancelled') {
            abortController.abort();
            shouldUnsubscribe = true;
          }

          if (event.type === 'completion') {
            shouldUnsubscribe = true;
          }
        }
        if (shouldUnsubscribe) {
          subscription.unsubscribe();
        }
      },
    });
  }

  public async recoverTasks(): Promise<void> {
    const enabled =
      (this.config &&
        this.config.getOptionalBoolean(
          'scaffolder.EXPERIMENTAL_recoverTasks',
        )) ??
      false;

    if (enabled) {
      const defaultTimeout = { seconds: 30 };
      const timeout = readDuration(
        this.config,
        'scaffolder.EXPERIMENTAL_recoverTasksTimeout',
        defaultTimeout,
      );
      const { ids: recoveredTaskIds } = (await this.storage.recoverTasks?.({
        timeout,
      })) ?? { ids: [] };
      if (recoveredTaskIds.length > 0) {
        this.signalDispatch();
      }
    }
  }

  /**
   * {@inheritdoc TaskBroker.claim}
   */
  async claim(): Promise<TaskContext> {
    for (;;) {
      const pendingTask = await this.storage.claimTask();
      if (pendingTask) {
        const abortController = new AbortController();
        await this.registerCancellable(pendingTask.id, abortController);
        return TaskManager.create(
          {
            taskId: pendingTask.id,
            spec: pendingTask.spec,
            secrets: pendingTask.secrets,
            createdBy: pendingTask.createdBy,
            state: pendingTask.state,
          },
          this.storage,
          abortController.signal,
          this.logger,
          this.auth,
          this.config,
          this.additionalWorkspaceProviders,
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

  async cancel(taskId: string) {
    const { events } = await this.storage.listEvents({ taskId });
    const currentStepId =
      events.length > 0
        ? events
            .filter(({ body }) => body?.stepId)
            .reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).body
            .stepId
        : 0;

    await this.storage.cancelTask?.({
      taskId,
      body: {
        message: `Step ${currentStepId} has been cancelled.`,
        stepId: currentStepId,
        status: 'cancelled',
      },
    });
  }
}
