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

import { TaskContext, TaskBroker, WorkflowRunner } from './types';
import PQueue from 'p-queue';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import { Logger } from 'winston';
import { TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { assertError } from '@backstage/errors';
import {
  TemplateFilter,
  TemplateGlobal,
} from '../../lib/templating/SecureTemplater';

/**
 * TaskWorkerOptions
 *
 * @public
 */
export type TaskWorkerOptions = {
  taskBroker: TaskBroker;
  runners: {
    workflowRunner: WorkflowRunner;
  };
  concurrentTasksLimit: number;
};

/**
 * CreateWorkerOptions
 *
 * @public
 */
export type CreateWorkerOptions = {
  taskBroker: TaskBroker;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  workingDirectory: string;
  logger: Logger;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  /**
   * The number of tasks that can be executed at the same time by the worker
   * @defaultValue 10
   * @example
   * ```
   * {
   *   concurrentTasksLimit: 1,
   *   // OR
   *   concurrentTasksLimit: Infinity
   * }
   * ```
   */
  concurrentTasksLimit?: number;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
};

/**
 * TaskWorker
 *
 * @public
 */
export class TaskWorker {
  private constructor(private readonly options: TaskWorkerOptions) {}

  private taskQueue: PQueue = new PQueue({
    concurrency: this.options.concurrentTasksLimit,
  });

  static async create(options: CreateWorkerOptions): Promise<TaskWorker> {
    const {
      taskBroker,
      logger,
      actionRegistry,
      integrations,
      workingDirectory,
      additionalTemplateFilters,
      concurrentTasksLimit = 10, // from 1 to Infinity
      additionalTemplateGlobals,
    } = options;

    const workflowRunner = new NunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
      additionalTemplateFilters,
      additionalTemplateGlobals,
    });

    return new TaskWorker({
      taskBroker: taskBroker,
      runners: { workflowRunner },
      concurrentTasksLimit,
    });
  }

  start() {
    (async () => {
      for (;;) {
        await this.onReadyToClaimTask();
        const task = await this.options.taskBroker.claim();
        this.taskQueue.add(() => this.runOneTask(task));
      }
    })();
  }

  protected onReadyToClaimTask(): Promise<void> {
    if (this.taskQueue.pending < this.options.concurrentTasksLimit) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      // "next" event emits when a task completes
      // https://github.com/sindresorhus/p-queue#next
      this.taskQueue.once('next', () => {
        resolve();
      });
    });
  }

  async runOneTask(task: TaskContext) {
    try {
      if (task.spec.apiVersion !== 'scaffolder.backstage.io/v1beta3') {
        throw new Error(
          `Unsupported Template apiVersion ${task.spec.apiVersion}`,
        );
      }

      const { output } = await this.options.runners.workflowRunner.execute(
        task,
      );

      await task.complete('completed', { output });
    } catch (error) {
      assertError(error);
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    }
  }
}
