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
import { LegacyWorkflowRunner } from './LegacyWorkflowRunner';

type Options = {
  taskBroker: TaskBroker;
  runners: {
    legacyWorkflowRunner: LegacyWorkflowRunner;
    workflowRunner: WorkflowRunner;
  };
};

export class TaskWorker {
  constructor(private readonly options: Options) {}
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
        task.spec.apiVersion === 'backstage.io/v1beta3'
          ? await this.options.runners.workflowRunner.execute(task)
          : await this.options.runners.legacyWorkflowRunner.execute(task);

      await task.complete('completed', { output });
    } catch (error) {
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    }
  }
}
