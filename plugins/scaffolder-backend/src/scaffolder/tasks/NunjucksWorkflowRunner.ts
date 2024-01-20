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
  TaskTrackType,
  WorkflowResponse,
  WorkflowRunner,
} from './types';
import * as winston from 'winston';
import fs from 'fs-extra';
import path from 'path';
import nunjucks from 'nunjucks';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
import { InputError, NotAllowedError } from '@backstage/errors';
import { PassThrough } from 'stream';
import { generateExampleOutput, isTruthy } from './helper';
import { validate as validateJsonSchema } from 'jsonschema';
import { TemplateActionRegistry } from '../actions';
import {
  TemplateFilter,
  SecureTemplater,
  SecureTemplateRenderer,
  TemplateGlobal,
} from '../../lib/templating/SecureTemplater';
import {
  TaskSpec,
  TaskSpecV1beta3,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createConditionAuthorizer } from '@backstage/plugin-permission-node';
import { UserEntity } from '@backstage/catalog-model';
import { createCounterMetric, createHistogramMetric } from '../../util/metrics';
import { createDefaultFilters } from '../../lib/templating/filters';
import {
  AuthorizeResult,
  PermissionEvaluator,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { scaffolderActionRules } from '../../service/rules';
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { TaskRecovery } from '@backstage/plugin-scaffolder-common';

type NunjucksWorkflowRunnerOptions = {
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  logger: winston.Logger;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  permissions?: PermissionEvaluator;
};

type TemplateContext = {
  parameters: JsonObject;
  EXPERIMENTAL_recovery?: TaskRecovery;
  steps: {
    [stepName: string]: { output: { [outputName: string]: JsonValue } };
  };
  secrets?: Record<string, string>;
  user?: {
    entity?: UserEntity;
    ref?: string;
  };
  each?: JsonValue;
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

const isActionAuthorized = createConditionAuthorizer(
  Object.values(scaffolderActionRules),
);

export class NunjucksWorkflowRunner implements WorkflowRunner {
  private readonly defaultTemplateFilters: Record<string, TemplateFilter>;

  constructor(private readonly options: NunjucksWorkflowRunnerOptions) {
    this.defaultTemplateFilters = createDefaultFilters({
      integrations: this.options.integrations,
    });
  }

  private readonly tracker = scaffoldingTracker();

  private isSingleTemplateString(input: string) {
    const { parser, nodes } = nunjucks as unknown as {
      parser: {
        parse(
          template: string,
          ctx: object,
          options: nunjucks.ConfigureOptions,
        ): { children: { children?: unknown[] }[] };
      };
      nodes: { TemplateData: Function };
    };

    const parsed = parser.parse(
      input,
      {},
      {
        autoescape: false,
        tags: {
          variableStart: '${{',
          variableEnd: '}}',
        },
      },
    );

    return (
      parsed.children.length === 1 &&
      !(parsed.children[0]?.children?.[0] instanceof nodes.TemplateData)
    );
  }

  private render<T>(
    input: T,
    context: TemplateContext,
    renderTemplate: SecureTemplateRenderer,
  ): T {
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
              const templated = renderTemplate(wrappedDumped, context);

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
          const templated = renderTemplate(value, context);

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

  async executeStep(
    task: TaskContext,
    step: TaskStep,
    context: TemplateContext,
    renderTemplate: (template: string, values: unknown) => string,
    taskTrack: TaskTrackType,
    workspacePath: string,
    decision: PolicyDecision,
  ) {
    const stepTrack = await this.tracker.stepStart(task, step);

    if (task.cancelSignal.aborted) {
      throw new Error(`Step ${step.name} has been cancelled.`);
    }

    try {
      if (step.if) {
        const ifResult = await this.render(step.if, context, renderTemplate);
        if (!isTruthy(ifResult)) {
          await stepTrack.skipFalsy();
          return;
        }
      }

      const action: TemplateAction<JsonObject> =
        this.options.actionRegistry.get(step.action);
      const { taskLogger, streamLogger } = createStepLogger({ task, step });

      if (task.isDryRun) {
        const redactedSecrets = Object.fromEntries(
          Object.entries(task.secrets ?? {}).map(secret => [
            secret[0],
            '[REDACTED]',
          ]),
        );
        const debugInput =
          (step.input &&
            this.render(
              step.input,
              {
                ...context,
                secrets: redactedSecrets,
              },
              renderTemplate,
            )) ??
          {};
        taskLogger.info(
          `Running ${
            action.id
          } in dry-run mode with inputs (secrets redacted): ${JSON.stringify(
            debugInput,
            undefined,
            2,
          )}`,
        );
        if (!action.supportsDryRun) {
          await taskTrack.skipDryRun(step, action);
          const outputSchema = action.schema?.output;
          if (outputSchema) {
            context.steps[step.id] = {
              output: generateExampleOutput(outputSchema) as {
                [name in string]: JsonValue;
              },
            };
          } else {
            context.steps[step.id] = { output: {} };
          }
          return;
        }
      }
      const iterations = (
        step.each
          ? Object.entries(this.render(step.each, context, renderTemplate)).map(
              ([key, value]) => ({
                each: { key, value },
              }),
            )
          : [{}]
      ).map(i => ({
        ...i,
        // Secrets are only passed when templating the input to actions for security reasons
        input: step.input
          ? this.render(
              step.input,
              { ...context, secrets: task.secrets ?? {}, ...i },
              renderTemplate,
            )
          : {},
      }));
      for (const iteration of iterations) {
        const actionId = `${action.id}${
          iteration.each ? `[${iteration.each.key}]` : ''
        }`;

        if (action.schema?.input) {
          const validateResult = validateJsonSchema(
            iteration.input,
            action.schema.input,
          );
          if (!validateResult.valid) {
            const errors = validateResult.errors.join(', ');
            throw new InputError(
              `Invalid input passed to action ${actionId}, ${errors}`,
            );
          }
        }
        if (
          !isActionAuthorized(decision, {
            action: action.id,
            input: iteration.input,
          })
        ) {
          throw new NotAllowedError(
            `Unauthorized action: ${actionId}. The action is not allowed. Input: ${JSON.stringify(
              iteration.input,
              null,
              2,
            )}`,
          );
        }
      }
      const tmpDirs = new Array<string>();
      const stepOutput: { [outputName: string]: JsonValue } = {};

      for (const iteration of iterations) {
        if (iteration.each) {
          taskLogger.info(
            `Running step each: ${JSON.stringify(
              iteration.each,
              (k, v) => (k ? v.toString() : v),
              0,
            )}`,
          );
        }
        await action.handler({
          input: iteration.input,
          secrets: task.secrets ?? {},
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
            if (step.each) {
              stepOutput[name] = stepOutput[name] || [];
              (stepOutput[name] as JsonArray).push(value);
            } else {
              stepOutput[name] = value;
            }
          },
          templateInfo: task.spec.templateInfo,
          user: task.spec.user,
          isDryRun: task.isDryRun,
          signal: task.cancelSignal,
        });
      }

      // Remove all temporary directories that were created when executing the action
      for (const tmpDir of tmpDirs) {
        await fs.remove(tmpDir);
      }

      context.steps[step.id] = { output: stepOutput };

      if (task.cancelSignal.aborted) {
        throw new Error(`Step ${step.name} has been cancelled.`);
      }

      await stepTrack.markSuccessful();
    } catch (err) {
      await taskTrack.markFailed(step, err);
      await stepTrack.markFailed();
      throw err;
    }
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

    const { additionalTemplateFilters, additionalTemplateGlobals } =
      this.options;

    const renderTemplate = await SecureTemplater.loadRenderer({
      templateFilters: {
        ...this.defaultTemplateFilters,
        ...additionalTemplateFilters,
      },
      templateGlobals: additionalTemplateGlobals,
    });

    try {
      const taskTrack = await this.tracker.taskStart(task);
      await fs.ensureDir(workspacePath);

      const context: TemplateContext = {
        parameters: task.spec.parameters,
        steps: {},
        user: task.spec.user,
      };

      const [decision]: PolicyDecision[] =
        this.options.permissions && task.spec.steps.length
          ? await this.options.permissions.authorizeConditional(
              [{ permission: actionExecutePermission }],
              { token: task.secrets?.backstageToken },
            )
          : [{ result: AuthorizeResult.ALLOW }];

      for (const step of task.spec.steps) {
        await this.executeStep(
          task,
          step,
          context,
          renderTemplate,
          taskTrack,
          workspacePath,
          decision,
        );
      }

      const output = this.render(task.spec.output, context, renderTemplate);
      await taskTrack.markSuccessful();

      return { output };
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}

function scaffoldingTracker() {
  const taskCount = createCounterMetric({
    name: 'scaffolder_task_count',
    help: 'Count of task runs',
    labelNames: ['template', 'user', 'result'],
  });
  const taskDuration = createHistogramMetric({
    name: 'scaffolder_task_duration',
    help: 'Duration of a task run',
    labelNames: ['template', 'result'],
  });
  const stepCount = createCounterMetric({
    name: 'scaffolder_step_count',
    help: 'Count of step runs',
    labelNames: ['template', 'step', 'result'],
  });
  const stepDuration = createHistogramMetric({
    name: 'scaffolder_step_duration',
    help: 'Duration of a step runs',
    labelNames: ['template', 'step', 'result'],
  });

  async function taskStart(task: TaskContext) {
    await task.emitLog(`Starting up task with ${task.spec.steps.length} steps`);
    const template = task.spec.templateInfo?.entityRef || '';
    const user = task.spec.user?.ref || '';

    const taskTimer = taskDuration.startTimer({
      template,
    });

    async function skipDryRun(
      step: TaskStep,
      action: TemplateAction<JsonObject>,
    ) {
      task.emitLog(`Skipping because ${action.id} does not support dry-run`, {
        stepId: step.id,
        status: 'skipped',
      });
    }

    async function markSuccessful() {
      taskCount.inc({
        template,
        user,
        result: 'ok',
      });
      taskTimer({ result: 'ok' });
    }

    async function markFailed(step: TaskStep, err: Error) {
      await task.emitLog(String(err.stack), {
        stepId: step.id,
        status: 'failed',
      });
      taskCount.inc({
        template,
        user,
        result: 'failed',
      });
      taskTimer({ result: 'failed' });
    }

    async function markCancelled(step: TaskStep) {
      await task.emitLog(`Step ${step.id} has been cancelled.`, {
        stepId: step.id,
        status: 'cancelled',
      });
      taskCount.inc({
        template,
        user,
        result: 'cancelled',
      });
      taskTimer({ result: 'cancelled' });
    }

    return {
      skipDryRun,
      markCancelled,
      markSuccessful,
      markFailed,
    };
  }

  async function stepStart(task: TaskContext, step: TaskStep) {
    await task.emitLog(`Beginning step ${step.name}`, {
      stepId: step.id,
      status: 'processing',
    });
    const template = task.spec.templateInfo?.entityRef || '';

    const stepTimer = stepDuration.startTimer({
      template,
      step: step.name,
    });

    async function markSuccessful() {
      await task.emitLog(`Finished step ${step.name}`, {
        stepId: step.id,
        status: 'completed',
      });
      stepCount.inc({
        template,
        step: step.name,
        result: 'ok',
      });
      stepTimer({ result: 'ok' });
    }

    async function markCancelled() {
      stepCount.inc({
        template,
        step: step.name,
        result: 'cancelled',
      });
      stepTimer({ result: 'cancelled' });
    }

    async function markFailed() {
      stepCount.inc({
        template,
        step: step.name,
        result: 'failed',
      });
      stepTimer({ result: 'failed' });
    }

    async function skipFalsy() {
      await task.emitLog(
        `Skipping step ${step.id} because its if condition was false`,
        { stepId: step.id, status: 'skipped' },
      );
      stepTimer({ result: 'skipped' });
    }

    return {
      markCancelled,
      markFailed,
      markSuccessful,
      skipFalsy,
    };
  }

  return {
    taskStart,
    stepStart,
  };
}
