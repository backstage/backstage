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
import { ScmIntegrations } from '@backstage/integration';
import { TemplateActionRegistry } from '..';
import {
  Task,
  TaskSpec,
  TaskSpecV1beta3,
  TaskStep,
  WorkflowResponse,
  WorkflowRunner,
} from './types';
import * as winston from 'winston';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import path from 'path';
import { JsonObject, JsonValue } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { PassThrough } from 'stream';

type Options = {
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  logger: winston.Logger;
};

type TemplateContext = {
  parameters: JsonObject;
  steps: {
    [stepName: string]: { output: { [outputName: string]: JsonValue } };
  };
};

const isValidTaskSpec = (taskSpec: TaskSpec): taskSpec is TaskSpecV1beta3 => {
  return taskSpec.apiVersion === 'backstage.io/v1beta3';
};

const createStepLogger = ({ task, step }: { task: Task; step: TaskStep }) => {
  const metadata = { stepId: step.id };
  const taskLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.simple(),
    ),
    defaultMeta: {},
  });

  const streamLogger = new PassThrough();
  streamLogger.on('data', async data => {
    const message = data.toString().trim();
    if (message?.length > 1) {
      await task.emitLog(message, metadata);
    }
  });

  taskLogger.add(new winston.transports.Stream({ stream: streamLogger }));

  return { taskLogger, streamLogger };
};

export class DefaultWorkflowRunner implements WorkflowRunner {
  private readonly nunjucks: nunjucks.Environment;

  constructor(private readonly options: Options) {
    this.nunjucks = nunjucks.configure({
      autoescape: false,
      tags: {
        variableStart: '${{',
        variableEnd: '}}',
      },
    });
  }

  async execute(task: Task): Promise<WorkflowResponse> {
    if (!isValidTaskSpec(task.spec)) {
      throw new InputError(
        'Wrong template version executed with the workflow engine',
      );
    }
    const workspacePath = path.join(
      this.options.workingDirectory,
      await task.getWorkspaceName(),
    );
    try {
      await fs.ensureDir(workspacePath);
      await task.emitLog(
        `Starting up task with ${task.spec.steps.length} steps`,
      );

      /**
       * This is a little bit of a hack / magic so that when we use nunjucks and we try to
       * pass through an object from the `parameters` section of the task spec, it will
       * actually work as the toString method is called from the nunjucks template.
       */
      const parsedParams = JSON.parse(
        JSON.stringify(task.spec.parameters),
        (key: string, value: JsonObject) => {
          if (typeof value === 'object' && key) {
            value.toString = () => JSON.stringify(value);
          }

          return value;
        },
      );

      const context: TemplateContext = {
        parameters: parsedParams,
        steps: {},
      };

      for (const step of task.spec.steps) {
        const action = this.options.actionRegistry.get(step.action);
        const { taskLogger, streamLogger } = createStepLogger({ task, step });

        const input =
          step.input &&
          JSON.parse(JSON.stringify(step.input), (_key, value) => {
            try {
              if (typeof value === 'string') {
                const templated = this.nunjucks.renderString(value, context);
                try {
                  return JSON.parse(templated);
                } catch {
                  return templated;
                }
              }
            } catch {
              return value;
            }
            return value;
          });

        const tmpDirs = new Array<string>();
        const stepOutputs: { [outputName: string]: JsonValue } = {};

        await action.handler({
          baseUrl: task.spec.baseUrl,
          input,
          logger: taskLogger,
          logStream: streamLogger,
          workspacePath,
          createTemporaryDirectory: async () => {
            const tmpDir = await fs.mkdtemp(
              `${workspacePath}_step-${step.id}-`,
            );
            tmpDirs.push(tmpDir);
            return tmpDir;
          },
          output(name: string, value: JsonValue) {
            stepOutputs[name] = value;
          },
        });
      }
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}
