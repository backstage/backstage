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
import { TaskTrackType, WorkflowResponse, WorkflowRunner } from './types';
import * as winston from 'winston';
import fs from 'fs-extra';
import path from 'path';
import nunjucks from 'nunjucks';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
import { InputError, NotAllowedError, stringifyError } from '@backstage/errors';
import { PassThrough } from 'stream';
import { generateExampleOutput, isTruthy } from './helper';
import { validate as validateJsonSchema } from 'jsonschema';
import { TemplateActionRegistry } from '../actions';
import { metrics } from '@opentelemetry/api';
import {
  SecureTemplater,
  SecureTemplateRenderer,
} from '../../lib/templating/SecureTemplater';
import {
  TaskRecovery,
  TaskSpec,
  TaskSpecV1beta3,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';

import {
  TemplateAction,
  TemplateFilter,
  TemplateGlobal,
  TaskContext,
} from '@backstage/plugin-scaffolder-node';
import { createConditionAuthorizer } from '@backstage/plugin-permission-node';
import { UserEntity } from '@backstage/catalog-model';
import { createCounterMetric, createHistogramMetric } from '../../util/metrics';
import { createDefaultFilters } from '../../lib/templating/filters';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { scaffolderActionRules } from '../../service/rules';
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { PermissionsService } from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { BackstageLoggerTransport, WinstonLogger } from './logger';

type NunjucksWorkflowRunnerOptions = {
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  logger: winston.Logger;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  permissions?: PermissionsService;
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
  context: {
    task: {
      id: string;
    };
  };
};

type CheckpointState =
  | {
      status: 'failed';
      reason: string;
    }
  | {
      status: 'success';
      value: JsonValue;
    };

const isValidTaskSpec = (taskSpec: TaskSpec): taskSpec is TaskSpecV1beta3 => {
  return taskSpec.apiVersion === 'scaffolder.backstage.io/v1beta3';
};

const createStepLogger = ({
  task,
  step,
  rootLogger,
}: {
  task: TaskContext;
  step: TaskStep;
  rootLogger: winston.Logger;
}) => {
  const taskLogger = WinstonLogger.create({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    transports: [new BackstageLoggerTransport(rootLogger, task, step.id)],
  });

  taskLogger.addRedactions(Object.values(task.secrets ?? {}));

  // This stream logger should be deprecated. We're going to replace it with
  // just using the logger directly, as all those logs get written to step logs
  // using the stepLogStream above.
  // Initially this stream used to be the only way to write to the client logs, but that
  // has changed over time, there's not really a need for this anymore.
  // You can just create a simple wrapper like the below in your action to write to the main logger.
  // This way we also get recactions for free.
  const streamLogger = new PassThrough();
  streamLogger.on('data', async data => {
    const message = data.toString().trim();
    if (message?.length > 1) {
      taskLogger.info(message);
    }
  });

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
      if (
        step.if === false ||
        (typeof step.if === 'string' &&
          !isTruthy(this.render(step.if, context, renderTemplate)))
      ) {
        await stepTrack.skipFalsy();
        return;
      }
      const action: TemplateAction<JsonObject> =
        this.options.actionRegistry.get(step.action);
      const { taskLogger, streamLogger } = createStepLogger({
        task,
        step,
        rootLogger: this.options.logger,
      });

      if (task.isDryRun) {
        const redactedSecrets = Object.fromEntries(
          Object.entries(task.secrets ?? {}).map(secret => [secret[0], '***']),
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
      const prevTaskState = await task.getTaskState?.();

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
          task: {
            id: await task.getWorkspaceName(),
          },
          secrets: task.secrets ?? {},
          // TODO(blam): move to LoggerService and away from Winston
          logger: loggerToWinstonLogger(taskLogger),
          logStream: streamLogger,
          workspacePath,
          async checkpoint<T extends JsonValue | void>(opts: {
            key?: string;
            fn: () => Promise<T> | T;
          }) {
            const { key: checkpointKey, fn } = opts;
            const key = `v1.task.checkpoint.${step.id}.${checkpointKey}`;

            try {
              let prevValue: T | undefined;

              if (prevTaskState) {
                const prevState = (
                  prevTaskState.state?.checkpoints as {
                    [key: string]: CheckpointState;
                  }
                )?.[key];

                if (prevState && prevState.status === 'success') {
                  prevValue = prevState.value as T;
                }
              }

              const value = prevValue ? prevValue : await fn();

              if (!prevValue) {
                task.updateCheckpoint?.({
                  key,
                  status: 'success',
                  value: value ?? {},
                });
              }
              return value;
            } catch (err) {
              task.updateCheckpoint?.({
                key,
                status: 'failed',
                reason: stringifyError(err),
              });
              throw err;
            } finally {
              await task.serializeWorkspace?.({ path: workspacePath });
            }
          },
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
          getInitiatorCredentials: () => task.getInitiatorCredentials(),
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
    } finally {
      await task.serializeWorkspace?.({ path: workspacePath });
    }
  }

  async execute(task: TaskContext): Promise<WorkflowResponse> {
    if (!isValidTaskSpec(task.spec)) {
      throw new InputError(
        'Wrong template version executed with the workflow engine',
      );
    }
    const taskId = await task.getWorkspaceName();

    const workspacePath = path.join(this.options.workingDirectory, taskId);

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
      await task.rehydrateWorkspace?.({ taskId, targetPath: workspacePath });

      const taskTrack = await this.tracker.taskStart(task);
      await fs.ensureDir(workspacePath);

      const context: TemplateContext = {
        parameters: task.spec.parameters,
        steps: {},
        user: task.spec.user,
        context: {
          task: {
            id: taskId,
          },
        },
      };

      const [decision]: PolicyDecision[] =
        this.options.permissions && task.spec.steps.length
          ? await this.options.permissions.authorizeConditional(
              [{ permission: actionExecutePermission }],
              { credentials: await task.getInitiatorCredentials() },
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
      await task.cleanWorkspace?.();

      return { output };
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}

function scaffoldingTracker() {
  // prom-client metrics are deprecated in favour of OpenTelemetry metrics.
  const promTaskCount = createCounterMetric({
    name: 'scaffolder_task_count',
    help: 'Count of task runs',
    labelNames: ['template', 'user', 'result'],
  });
  const promTaskDuration = createHistogramMetric({
    name: 'scaffolder_task_duration',
    help: 'Duration of a task run',
    labelNames: ['template', 'result'],
  });
  const promtStepCount = createCounterMetric({
    name: 'scaffolder_step_count',
    help: 'Count of step runs',
    labelNames: ['template', 'step', 'result'],
  });
  const promStepDuration = createHistogramMetric({
    name: 'scaffolder_step_duration',
    help: 'Duration of a step runs',
    labelNames: ['template', 'step', 'result'],
  });

  const meter = metrics.getMeter('default');
  const taskCount = meter.createCounter('scaffolder.task.count', {
    description: 'Count of task runs',
  });

  const taskDuration = meter.createHistogram('scaffolder.task.duration', {
    description: 'Duration of a task run',
    unit: 'seconds',
  });

  const stepCount = meter.createCounter('scaffolder.step.count', {
    description: 'Count of step runs',
  });

  const stepDuration = meter.createHistogram('scaffolder.step.duration', {
    description: 'Duration of a step runs',
    unit: 'seconds',
  });

  async function taskStart(task: TaskContext) {
    await task.emitLog(`Starting up task with ${task.spec.steps.length} steps`);
    const template = task.spec.templateInfo?.entityRef || '';
    const user = task.spec.user?.ref || '';

    const startTime = process.hrtime();
    const taskTimer = promTaskDuration.startTimer({
      template,
    });

    function endTime() {
      const delta = process.hrtime(startTime);
      return delta[0] + delta[1] / 1e9;
    }

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
      promTaskCount.inc({
        template,
        user,
        result: 'ok',
      });
      taskTimer({ result: 'ok' });

      taskCount.add(1, { template, user, result: 'ok' });
      taskDuration.record(endTime(), {
        result: 'ok',
      });
    }

    async function markFailed(step: TaskStep, err: Error) {
      await task.emitLog(String(err.stack), {
        stepId: step.id,
        status: 'failed',
      });
      promTaskCount.inc({
        template,
        user,
        result: 'failed',
      });
      taskTimer({ result: 'failed' });

      taskCount.add(1, { template, user, result: 'failed' });
      taskDuration.record(endTime(), {
        result: 'failed',
      });
    }

    async function markCancelled(step: TaskStep) {
      await task.emitLog(`Step ${step.id} has been cancelled.`, {
        stepId: step.id,
        status: 'cancelled',
      });
      promTaskCount.inc({
        template,
        user,
        result: 'cancelled',
      });
      taskTimer({ result: 'cancelled' });

      taskCount.add(1, { template, user, result: 'cancelled' });
      taskDuration.record(endTime(), {
        result: 'cancelled',
      });
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

    const startTime = process.hrtime();
    const stepTimer = promStepDuration.startTimer({
      template,
      step: step.name,
    });

    function endTime() {
      const delta = process.hrtime(startTime);
      return delta[0] + delta[1] / 1e9;
    }

    async function markSuccessful() {
      await task.emitLog(`Finished step ${step.name}`, {
        stepId: step.id,
        status: 'completed',
      });
      promtStepCount.inc({
        template,
        step: step.name,
        result: 'ok',
      });
      stepTimer({ result: 'ok' });

      stepCount.add(1, { template, step: step.name, result: 'ok' });
      stepDuration.record(endTime(), {
        result: 'ok',
      });
    }

    async function markCancelled() {
      promtStepCount.inc({
        template,
        step: step.name,
        result: 'cancelled',
      });
      stepTimer({ result: 'cancelled' });

      stepCount.add(1, { template, step: step.name, result: 'cancelled' });
      stepDuration.record(endTime(), {
        result: 'cancelled',
      });
    }

    async function markFailed() {
      promtStepCount.inc({
        template,
        step: step.name,
        result: 'failed',
      });
      stepTimer({ result: 'failed' });

      stepCount.add(1, { template, step: step.name, result: 'failed' });
      stepDuration.record(endTime(), {
        result: 'failed',
      });
    }

    async function skipFalsy() {
      await task.emitLog(
        `Skipping step ${step.id} because its if condition was false`,
        { stepId: step.id, status: 'skipped' },
      );
      stepTimer({ result: 'skipped' });

      stepCount.add(1, { template, step: step.name, result: 'skipped' });
      stepDuration.record(endTime(), {
        result: 'skipped',
      });
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
