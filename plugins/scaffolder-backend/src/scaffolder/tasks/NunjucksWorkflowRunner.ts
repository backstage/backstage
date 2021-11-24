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
import {
  TaskContext,
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
import { JsonObject, JsonValue } from '@backstage/types';
import { InputError } from '@backstage/errors';
import { PassThrough } from 'stream';
import { isTruthy } from './helper';
import { validate as validateJsonSchema } from 'jsonschema';
import { parseRepoUrl } from '../actions/builtin/publish/util';
import { TemplateActionRegistry } from '../actions';

type NunjucksWorkflowRunnerOptions = {
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
  return taskSpec.apiVersion === 'scaffolder.backstage.io/v1beta3';
};

const createStepLogger = ({
  task,
  step,
}: {
  task: TaskContext;
  step: TaskStep;
}) => {
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

export class NunjucksWorkflowRunner implements WorkflowRunner {
  private readonly nunjucks: nunjucks.Environment;

  private readonly nunjucksOptions: nunjucks.ConfigureOptions = {
    autoescape: false,
    tags: {
      variableStart: '${{',
      variableEnd: '}}',
    },
  };

  constructor(private readonly options: NunjucksWorkflowRunnerOptions) {
    this.nunjucks = nunjucks.configure(this.nunjucksOptions);

    // TODO(blam): let's work out how we can deprecate these.
    // We shouldn't really need to be exposing these now we can deal with
    // objects in the params block.
    // Maybe we can expose a new RepoUrlPicker with secrets for V3 that provides an object already.
    this.nunjucks.addFilter('parseRepoUrl', repoUrl => {
      return parseRepoUrl(repoUrl, this.options.integrations);
    });

    this.nunjucks.addFilter('projectSlug', repoUrl => {
      const { owner, repo } = parseRepoUrl(repoUrl, this.options.integrations);
      return `${owner}/${repo}`;
    });
  }

  private isSingleTemplateString(input: string) {
    const { parser, nodes } = require('nunjucks');
    const parsed = parser.parse(input, {}, this.nunjucksOptions);
    return (
      parsed.children.length === 1 &&
      !(parsed.children[0] instanceof nodes.TemplateData)
    );
  }

  private render<T>(input: T, context: TemplateContext): T {
    return JSON.parse(JSON.stringify(input), (_key, value) => {
      try {
        if (typeof value === 'string') {
          try {
            if (this.isSingleTemplateString(value)) {
              // Lets convert ${{ parameters.bob }} to ${{ (parameters.bob) | dump }} so we can keep the input type
              const wrappedDumped = value.replace(
                /\${{(.+)}}/g,
                '${{ ( $1 ) | dump }}',
              );

              // Run the templating
              const templated = this.nunjucks.renderString(
                wrappedDumped,
                context,
              );

              // If there's an empty string returned, then it's undefined
              if (templated === '') {
                return undefined;
              }

              // Reparse the dumped string
              return JSON.parse(templated);
            }
          } catch (ex) {
            this.options.logger.error(
              `Failed to parse template string: ${value} with error ${ex.message}`,
            );
          }

          // Fallback to default behaviour
          const templated = this.nunjucks.renderString(value, context);

          if (templated === '') {
            return undefined;
          }

          return templated;
        }
      } catch {
        return value;
      }
      return value;
    });
  }

  async execute(task: TaskContext): Promise<WorkflowResponse> {
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

      const context: TemplateContext = {
        parameters: task.spec.parameters,
        steps: {},
      };

      for (const step of task.spec.steps) {
        try {
          if (step.if) {
            const ifResult = await this.render(step.if, context);
            if (!isTruthy(ifResult)) {
              await task.emitLog(
                `Skipping step ${step.id} because it's if condition was false`,
                { stepId: step.id, status: 'skipped' },
              );
              continue;
            }
          }

          await task.emitLog(`Beginning step ${step.name}`, {
            stepId: step.id,
            status: 'processing',
          });

          const action = this.options.actionRegistry.get(step.action);
          const { taskLogger, streamLogger } = createStepLogger({ task, step });

          const input = (step.input && this.render(step.input, context)) ?? {};

          if (action.schema?.input) {
            const validateResult = validateJsonSchema(
              input,
              action.schema.input,
            );
            if (!validateResult.valid) {
              const errors = validateResult.errors.join(', ');
              throw new InputError(
                `Invalid input passed to action ${action.id}, ${errors}`,
              );
            }
          }

          const tmpDirs = new Array<string>();
          const stepOutput: { [outputName: string]: JsonValue } = {};

          if (!task.spec.metadata) {
            console.warn(
              'DEPRECATION NOTICE: metadata is undefined. metadata will be required in the future.',
            );
          }

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
              stepOutput[name] = value;
            },
            metadata: task.spec.metadata,
          });

          // Remove all temporary directories that were created when executing the action
          for (const tmpDir of tmpDirs) {
            await fs.remove(tmpDir);
          }

          context.steps[step.id] = { output: stepOutput };

          await task.emitLog(`Finished step ${step.name}`, {
            stepId: step.id,
            status: 'completed',
          });
        } catch (err) {
          await task.emitLog(String(err.stack), {
            stepId: step.id,
            status: 'failed',
          });
          throw err;
        }
      }

      const output = this.render(task.spec.output, context);

      return { output };
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}
