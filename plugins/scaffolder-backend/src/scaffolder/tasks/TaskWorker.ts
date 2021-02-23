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
import { JsonValue, JsonObject } from '@backstage/config';
import { TaskBroker, Task } from './types';
import fs from 'fs-extra';
import path from 'path';
import { TemplateActionRegistry } from './TemplateActionRegistry';
import * as handlebars from 'handlebars';

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
      const { actionRegistry } = this.options;

      const workspacePath = path.join(
        this.options.workingDirectory,
        await task.getWorkspaceName(),
      );
      await fs.ensureDir(workspacePath);
      await task.emitLog(
        `Starting up task with ${task.spec.steps.length} steps`,
      );

      const templateCtx: {
        parameters: JsonObject;
        steps: {
          [stepName: string]: { output: { [outputName: string]: JsonValue } };
        };
      } = { parameters: task.spec.values, steps: {} };

      for (const step of task.spec.steps) {
        const metadata = { stepId: step.id };
        try {
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
          stream.on('data', async data => {
            const message = data.toString().trim();
            if (message?.length > 1) {
              await task.emitLog(message, metadata);
            }
          });

          taskLogger.add(new winston.transports.Stream({ stream }));
          await task.emitLog(`Beginning step ${step.name}`, {
            ...metadata,
            status: 'processing',
          });

          const action = actionRegistry.get(step.action);
          if (!action) {
            throw new Error(`Action '${step.action}' does not exist`);
          }

          const parameters = JSON.parse(
            JSON.stringify(step.parameters),
            (_key, value) => {
              if (typeof value === 'string') {
                return handlebars.compile(value, {
                  noEscape: true,
                  strict: true,
                  data: false,
                  preventIndent: true,
                })(templateCtx);
              }
              return value;
            },
          );

          const stepOutputs: { [name: string]: JsonValue } = {};

          await action.handler({
            logger: taskLogger,
            logStream: stream,
            parameters,
            workspacePath,
            output(name: string, value: JsonValue) {
              stepOutputs[name] = value;
            },
          });

          templateCtx.steps[step.id] = { output: stepOutputs };

          await task.emitLog(`Finished step ${step.name}`, {
            ...metadata,
            status: 'completed',
          });
        } catch (error) {
          await task.emitLog(String(error.stack), {
            ...metadata,
            status: 'failed',
          });
          throw error;
        }
      }

      const output = JSON.parse(
        JSON.stringify(task.spec.output),
        (_key, value) => {
          if (typeof value === 'string') {
            return handlebars.compile(value, {
              noEscape: true,
              strict: true,
              data: false,
              preventIndent: true,
            })(templateCtx);
          }
          return value;
        },
      );

      await task.complete('completed', { output });
    } catch (error) {
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    }
  }
}
