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

import { JsonObject, JsonValue } from '@backstage/config';
import { InputError } from '@backstage/errors';
import fs from 'fs-extra';

import path from 'path';

import { Logger } from 'winston';
import { parseRepoUrl } from '../actions/builtin/publish/util';
import { TemplateActionRegistry } from '../actions/TemplateActionRegistry';
import { isTruthy } from './helper';
import { Task, TaskBroker, WorkflowRunner } from './types';
import { ScmIntegrations } from '@backstage/integration';
import { LegacyWorkflowRunner } from './LegacyWorkflowRunner';
import { DefaultWorkflowRunner } from './DefaultWorkflowRunner';

type Options = {
  logger: Logger;
  taskBroker: TaskBroker;
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
};

export class TaskWorker {
  private readonly legacyWorkflowRunner: LegacyWorkflowRunner;
  private readonly workflowRunner: WorkflowRunner;

  constructor(private readonly options: Options) {
    this.legacyWorkflowRunner = new LegacyWorkflowRunner(options);
    this.workflowRunner = new DefaultWorkflowRunner(options);
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
        task.spec.apiVersion === 'backstage.io/v1beta3'
          ? await this.workflowRunner.execute(task)
          : await this.legacyWorkflowRunner.execute(task);

      await task.complete('completed', { output });
    } catch (error) {
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    }
  }
}
