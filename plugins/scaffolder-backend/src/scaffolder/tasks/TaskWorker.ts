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

import { Task, TaskBroker, WorkflowRunner } from './types';
import { HandlebarsWorkflowRunner } from './HandlebarsWorkflowRunner';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import { Logger } from 'winston';
import { TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { assertError } from '@backstage/errors';

/**
 * TaskWorkerOptions
 *
 * @public
 */
export type TaskWorkerOptions = {
  taskBroker: TaskBroker;
  runners: {
    legacyWorkflowRunner: HandlebarsWorkflowRunner;
    workflowRunner: WorkflowRunner;
  };
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
};

/**
 * TaskWorker
 *
 * @public
 */
export class TaskWorker {
  private constructor(private readonly options: TaskWorkerOptions) {}

  static createWorker(options: CreateWorkerOptions) {
    const {
      taskBroker,
      logger,
      actionRegistry,
      integrations,
      workingDirectory,
    } = options;

    const legacyWorkflowRunner = new HandlebarsWorkflowRunner({
      logger,
      actionRegistry,
      integrations,
      workingDirectory,
    });

    const workflowRunner = new NunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      logger,
      workingDirectory,
    });

    return new TaskWorker({
      taskBroker: taskBroker,
      runners: { legacyWorkflowRunner, workflowRunner },
    });
  }

  start() {
    (async () => {
      for (;;) {
        const task = await this.options.taskBroker.claim();
        await this.runOneTask(task);
      }
    })();
  }

  async runOneTask(task: Task) {
    try {
      const { output } =
        task.spec.apiVersion === 'scaffolder.backstage.io/v1beta3'
          ? await this.options.runners.workflowRunner.execute(task)
          : await this.options.runners.legacyWorkflowRunner.execute(task);

      await task.complete('completed', { output });
    } catch (error) {
      assertError(error);
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    }
  }
}
