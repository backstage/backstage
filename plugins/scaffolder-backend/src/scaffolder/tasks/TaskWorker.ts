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

import { PassThrough } from 'stream';
import { Logger } from 'winston';
import * as winston from 'winston';
import { JsonValue } from '@backstage/config';
import { TaskBroker, Task } from './types';
import fs from 'fs-extra';
import path from 'path';
import { TemplateActionRegistry } from './TemplateConverter';

type Options = {
  logger: Logger;
  taskBroker: TaskBroker;
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
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
      const { actionRegistry, logger } = this.options;

      const workspacePath = path.join(
        this.options.workingDirectory,
        await task.getWorkspaceName(),
      );
      await fs.ensureDir(workspacePath);

      const taskLogger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.simple(),
        ),
        defaultMeta: {},
      });

      const stream = new PassThrough();
      stream.on('data', data => {
        const message = data.toString().trim();
        if (message?.length > 1) task.emitLog(message);
      });

      taskLogger.add(new winston.transports.Stream({ stream }));

      // Give us some time to curl observe
      task.emitLog('Task claimed, waiting ...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      task.emitLog(`Starting up work with ${task.spec.steps.length} steps`);

      const outputs: { [name: string]: JsonValue } = {};

      for (const step of task.spec.steps) {
        task.emitLog(`Beginning step ${step.name}`);

        const action = actionRegistry.get(step.action);
        if (!action) {
          throw new Error(`Action '${step.action}' does not exist`);
        }

        // TODO: substitute any placeholders with output from previous steps
        const parameters = step.parameters!;

        await action.handler({
          logger,
          logStream: stream,
          parameters,
          workspacePath,
          output(name: string, value: JsonValue) {
            outputs[name] = value;
          },
        });

        task.emitLog(`Finished step ${step.name}`);
      }

      await task.complete('completed');
    } catch (error) {
      task.emitLog(String(error.stack));
      await task.complete('failed');
    }
  }
}
