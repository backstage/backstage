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

import { InputError, NotAllowedError, stringifyError } from '@backstage/errors';

import { ScmIntegrations } from '@backstage/integration';
import {
  TaskRecovery,
  TaskSpec,
  TaskSpecV1beta3,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
import fs from 'fs-extra';
import { validate as validateJsonSchema } from 'jsonschema';
import { toPath } from 'lodash';
import path from 'node:path';
import {
  createTemplateRenderer,
  PreparedTemplateContext,
  TemplateCapabilities,
  TemplateContext as NunjitsuTemplateContext,
  TemplateRenderer,
  TemplateValue as NunjitsuTemplateValue,
} from 'nunjitsu';
import * as winston from 'winston';
import { z } from 'zod/v3';
import { TemplateActionRegistry } from '../actions/TemplateActionRegistry';
import {
  filterConditionalItems,
  generateExampleOutput,
  isTruthy,
} from './helper';
import { isTaskRecoveryEnabled } from './taskRecoveryHelper';
import {
  TaskTrackType,
  TaskState,
  WorkflowResponse,
  WorkflowRunner,
} from './types';

import type {
  AuditorService,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type { MetricsService } from '@backstage/backend-plugin-api/alpha';
import { UserEntity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  AuthorizeResult,
  type PermissionCondition,
  type PermissionCriteria,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  createConditionAuthorizer,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from '@backstage/plugin-permission-node';
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  TaskContext,
  TaskSecrets,
  TemplateAction,
} from '@backstage/plugin-scaffolder-node';
import {
  CheckpointContext,
  CheckpointState,
} from '@backstage/plugin-scaffolder-node/alpha';
import { resolveDefaultEnvironment } from '../../lib/defaultEnvironment';
import { createDefaultFilters } from '../../lib/templating/filters/createDefaultFilters';
import { scaffolderActionRules } from '../../service/rules';
import { createCounterMetric, createHistogramMetric } from '../../util/metrics';
import {
  collectTemplateCapabilities,
  convertFiltersToRecord,
} from '../../util/templating';
import { BackstageLoggerTransport, WinstonLogger } from './logger';

type NunjucksWorkflowRunnerOptions = {
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  logger: LoggerService;
  auditor?: AuditorService;
  templateCapabilities?: TemplateCapabilities;
  permissions?: PermissionsService;
  config?: Config;
  metrics: MetricsService;
};

type TemplateContext = {
  parameters: JsonObject;
  environment: JsonObject;
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

const isValidTaskSpec = (taskSpec: TaskSpec): taskSpec is TaskSpecV1beta3 => {
  return taskSpec.apiVersion === 'scaffolder.backstage.io/v1beta3';
};

function stringifyEachLogValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map(item =>
        item === null || item === undefined ? '' : stringifyEachLogValue(item),
      )
      .join(',');
  }
  if (value !== null && typeof value === 'object') {
    return '[object Object]';
  }
  return String(value);
}

const createStepLogger = ({
  task,
  step,
  rootLogger,
  redactions,
}: {
  task: TaskContext;
  step: TaskStep;
  rootLogger: LoggerService;
  redactions?: Iterable<string>;
}) => {
  const taskLogger = WinstonLogger.create({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    transports: [new BackstageLoggerTransport(rootLogger, task, step.id)],
  });

  taskLogger.addRedactions(redactions ?? []);

  return { taskLogger };
};

/**
 * Recursively compares two rendered objects and returns string keys and values
 * from `withSecrets` that differ from their counterpart in `withoutSecrets`.
 * These were influenced by secret interpolation and should be added as log
 * redactions.
 */
function collectSecretRedactions(
  withSecrets: unknown,
  withoutSecrets: unknown,
): string[] {
  if (typeof withSecrets === 'string') {
    return withSecrets !== withoutSecrets ? [withSecrets] : [];
  }
  if (Array.isArray(withSecrets)) {
    const other = Array.isArray(withoutSecrets) ? withoutSecrets : [];
    return withSecrets.flatMap((val, i) =>
      collectSecretRedactions(val, other[i]),
    );
  }
  if (withSecrets && typeof withSecrets === 'object') {
    const otherEntries =
      withoutSecrets && typeof withoutSecrets === 'object'
        ? Object.entries(withoutSecrets as Record<string, unknown>)
        : [];
    return Object.entries(withSecrets as Record<string, unknown>).flatMap(
      ([key, value], index) => {
        const otherEntry = otherEntries[index];
        if (!otherEntry) {
          return [key, ...extractStringValues(value)];
        }
        const [otherKey, otherValue] = otherEntry;
        return [
          ...(key !== otherKey ? [key] : []),
          ...collectSecretRedactions(value, otherValue),
        ];
      },
    );
  }
  return [];
}

/**
 * Extracts all string values from a nested object structure.
 * Used as a fallback when the comparison render fails.
 */
function extractStringValues(obj: unknown): string[] {
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap(extractStringValues);
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([key, val]) => [
      key,
      ...extractStringValues(val),
    ]);
  }
  return [];
}

const isActionAuthorized = createConditionAuthorizer(
  Object.values(scaffolderActionRules),
);

const stringPathConditionSchema = z.object({
  rule: z.literal('HAS_STRING_PROPERTY'),
  params: z.object({
    key: z.string().refine(key => toPath(key).join('.') === 'path'),
    value: z.string(),
  }),
});

const numericGroupPathSchema = z.number().or(z.string().regex(/^\d+$/u));

function getStringPathConditions(
  criteria: PermissionCriteria<PermissionCondition>,
): Array<string> {
  switch (true) {
    case isAndCriteria(criteria):
      return criteria.allOf.flatMap(getStringPathConditions);
    case isOrCriteria(criteria):
      return criteria.anyOf.flatMap(getStringPathConditions);
    case isNotCriteria(criteria):
      return getStringPathConditions(criteria.not);
    default: {
      const condition = stringPathConditionSchema.safeParse(criteria);
      return condition.success ? [condition.data.params.value] : [];
    }
  }
}

function isActionInputAuthorized(
  decision: PolicyDecision,
  action: string,
  input: JsonObject,
): boolean {
  if (!isActionAuthorized(decision, { action, input })) {
    return false;
  }

  if (
    decision.result !== AuthorizeResult.CONDITIONAL ||
    !action.split(':').includes('group') ||
    !numericGroupPathSchema.safeParse(input.path).success
  ) {
    return true;
  }

  return getStringPathConditions(decision.conditions).every(candidatePath =>
    isActionAuthorized(decision, {
      action,
      input: { ...input, path: candidatePath },
    }),
  );
}

export class NunjucksWorkflowRunner implements WorkflowRunner {
  private readonly defaultTemplateCapabilities: TemplateCapabilities;
  private readonly options: NunjucksWorkflowRunnerOptions;
  private environment: {
    parameters: JsonObject;
    secrets?: Record<string, string>;
  } = { parameters: {}, secrets: {} };

  private readonly tracker: ReturnType<typeof scaffoldingTracker>;
  private readonly recoveryEnabled: boolean;

  constructor(options: NunjucksWorkflowRunnerOptions) {
    this.options = options;
    this.defaultTemplateCapabilities = collectTemplateCapabilities({
      filters: convertFiltersToRecord(
        createDefaultFilters({
          integrations: this.options.integrations,
        }),
      ),
    });
    this.tracker = scaffoldingTracker(options.metrics);
    this.recoveryEnabled = isTaskRecoveryEnabled(options.config);
  }

  async getEnvironmentConfig(): Promise<{
    parameters: JsonObject;
    secrets?: TaskSecrets;
  }> {
    if (this.options.config) {
      const defaultEnvironment = resolveDefaultEnvironment(this.options.config);
      return {
        parameters: defaultEnvironment.parameters,
        secrets: defaultEnvironment.secrets,
      };
    }

    return {
      parameters: {},
      secrets: {},
    };
  }

  private render<T>(
    input: T,
    context: PreparedTemplateContext,
    templateRenderer: TemplateRenderer,
  ): T {
    return JSON.parse(JSON.stringify(input), (_key, value) => {
      try {
        if (typeof value === 'string') {
          return templateRenderer.renderValue(value, context);
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
    preparedContext: PreparedTemplateContext,
    templateRenderer: TemplateRenderer,
    taskTrack: TaskTrackType,
    workspacePath: string,
    decision: PolicyDecision,
  ) {
    const stepTrack = await this.tracker.stepStart(task, step);
    let workspaceSerializationAttempted = false;
    const { taskLogger } = createStepLogger({
      task,
      step,
      rootLogger: this.options.logger,
      redactions: [
        ...Object.values(task.secrets ?? {}),
        ...Object.values(this.environment?.secrets ?? {}),
      ],
    });

    if (task.cancelSignal.aborted) {
      throw new Error(
        `Step ${step.id} (${step.name}) of task ${task.taskId} has been cancelled.`,
      );
    }

    try {
      if (
        step.if === false ||
        (typeof step.if === 'string' &&
          step.each === undefined &&
          !isTruthy(this.render(step.if, preparedContext, templateRenderer)))
      ) {
        await stepTrack.skipFalsy();
        return preparedContext;
      }
      const action: TemplateAction<JsonObject> =
        await this.options.actionRegistry.get(step.action, {
          credentials: await task.getInitiatorCredentials(),
        });

      if (task.isDryRun) {
        const redactedSecrets = Object.fromEntries(
          Object.entries(task.secrets ?? {}).map(secret => [secret[0], '***']),
        );

        const redactedEnvironmentSecrets = Object.fromEntries(
          Object.entries(this.environment?.secrets ?? {}).map(secret => [
            secret[0],
            '***',
          ]),
        );
        const dryRunContext = preparedContext
          .withValue(['environment'], {
            parameters: this.environment?.parameters || {},
            secrets: redactedEnvironmentSecrets,
          } as NunjitsuTemplateValue)
          .withValue(['secrets'], redactedSecrets);
        const debugInput =
          (step.input &&
            this.render(step.input, dryRunContext, templateRenderer)) ??
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
          return preparedContext.withValue(
            ['steps', step.id],
            context.steps[step.id] as unknown as NunjitsuTemplateValue,
          );
        }
      }

      const preIterationContext = {
        ...context,
        environment: {
          parameters: this.environment?.parameters ?? {},
          secrets: task.isDryRun ? {} : this.environment?.secrets ?? {},
        },
        secrets: task.secrets ?? {},
      };
      const preparedPreIterationContext = preparedContext
        .withValue(
          ['environment'],
          preIterationContext.environment as NunjitsuTemplateValue,
        )
        .withValue(
          ['secrets'],
          preIterationContext.secrets as NunjitsuTemplateValue,
        );
      const hasSecrets =
        Object.keys(task.secrets ?? {}).length > 0 ||
        Object.keys(this.environment?.secrets ?? {}).length > 0;
      const preparedPreIterationContextNoSecrets = preparedPreIterationContext
        .withValue(['secrets'], {})
        .withValue(['environment', 'secrets'], {});

      const hasEach = step.each !== undefined;
      const resolvedEach = hasEach
        ? this.render(step.each, preparedPreIterationContext, templateRenderer)
        : undefined;

      if (hasEach && resolvedEach === undefined) {
        throw new InputError(
          `Invalid value on action ${action.id}.each parameter, "${step.each}" cannot be resolved to a value`,
        );
      }

      if (
        hasEach &&
        (resolvedEach === null || typeof resolvedEach !== 'object')
      ) {
        throw new InputError(
          `Invalid value on action ${action.id}.each parameter, must resolve to an array or object`,
        );
      }

      // Discover secret-derived iteration values before logging or executing
      // any iteration. The iteration value is already resolved by the time it
      // is added to each iteration's context, so input-only comparison cannot
      // identify it as secret-derived.
      let eachWithoutSecretsEntries: [string, unknown][] | undefined;
      if (step.each && resolvedEach && hasSecrets) {
        try {
          const eachWithoutSecrets = this.render(
            step.each,
            preparedPreIterationContextNoSecrets,
            templateRenderer,
          );
          eachWithoutSecretsEntries =
            Array.isArray(resolvedEach) && Array.isArray(eachWithoutSecrets)
              ? Object.keys(resolvedEach).map(
                  key =>
                    [key, eachWithoutSecrets[Number(key)]] as [string, unknown],
                )
              : Object.entries(eachWithoutSecrets);
          taskLogger.addRedactions(
            collectSecretRedactions(
              Object.entries(resolvedEach),
              eachWithoutSecretsEntries,
            ),
          );
        } catch {
          taskLogger.addRedactions(extractStringValues(resolvedEach));
        }
      }

      const iterations = (
        resolvedEach
          ? Object.entries(resolvedEach).map(([key, value], index) => {
              const eachWithoutSecrets = eachWithoutSecretsEntries?.[index];
              return {
                each: { key, value },
                eachWithoutSecrets: eachWithoutSecrets
                  ? {
                      key: eachWithoutSecrets[0],
                      value: eachWithoutSecrets[1],
                    }
                  : {},
              };
            })
          : [{}]
      ).map(i => {
        const preparedFullContext =
          'each' in i
            ? preparedPreIterationContext.withValue(
                ['each'],
                i.each as NunjitsuTemplateValue,
              )
            : preparedPreIterationContext;
        const preparedContextNoSecrets =
          'each' in i
            ? preparedPreIterationContextNoSecrets.withValue(
                ['each'],
                i.eachWithoutSecrets as NunjitsuTemplateValue,
              )
            : preparedPreIterationContextNoSecrets;
        // Evaluate if condition once per iteration, only when using 'each'
        const shouldRun =
          !('each' in i) ||
          !step.if ||
          isTruthy(this.render(step.if, preparedFullContext, templateRenderer));

        return {
          ...i,
          preparedContext: preparedFullContext,
          preparedContextNoSecrets,
          shouldRun,
          // Secrets are only passed when templating the input to actions for security reasons
          input: step.input
            ? this.render(step.input, preparedFullContext, templateRenderer)
            : {},
        };
      });
      for (const iteration of iterations) {
        if (hasSecrets && iteration.each) {
          taskLogger.addRedactions(
            collectSecretRedactions(
              iteration.each,
              iteration.eachWithoutSecrets,
            ),
          );
        }
        if (!iteration.shouldRun) {
          // No need to check schema or authorization for iterations that will not run
          continue;
        }

        // Redact any rendered values that were influenced by secrets.
        // Re-render the input without secrets and diff against the real render
        // to find values that changed due to secret interpolation.
        if (step.input) {
          if (hasSecrets) {
            try {
              const inputWithoutSecrets = this.render(
                step.input,
                iteration.preparedContextNoSecrets,
                templateRenderer,
              );
              taskLogger.addRedactions(
                collectSecretRedactions(iteration.input, inputWithoutSecrets),
              );
            } catch {
              taskLogger.addRedactions(extractStringValues(iteration.input));
            }
          }
        }

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
        if (!isActionInputAuthorized(decision, action.id, iteration.input)) {
          throw new NotAllowedError(
            `Unauthorized action: ${action.id}. The action is not allowed.`,
          );
        }
      }
      const tmpDirs = new Array<string>();
      const stepOutput: { [outputName: string]: JsonValue } = {};
      const prevTaskState = await task.getTaskState?.();

      for (const iteration of iterations) {
        if (iteration.each) {
          if (!iteration.shouldRun) {
            taskLogger.info(
              `Skipping step each: ${JSON.stringify(
                iteration.each,
                (key, value) => (key ? stringifyEachLogValue(value) : value),
                0,
              )}`,
            );
            continue;
          }
          taskLogger.info(
            `Running step each: ${JSON.stringify(
              iteration.each,
              (key, value) => (key ? stringifyEachLogValue(value) : value),
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
          logger: taskLogger,
          workspacePath,
          async checkpoint<T extends JsonValue | void>(
            opts: CheckpointContext<T>,
          ) {
            const { key: checkpointKey, fn } = opts;
            const key = `v1.task.checkpoint.${step.id}.${checkpointKey}`;

            try {
              let prevValue: T | undefined;
              let value: T;

              try {
                if (prevTaskState) {
                  const prevState = (
                    prevTaskState.state?.checkpoints as CheckpointState
                  )?.[key];

                  if (prevState && prevState.status === 'success') {
                    prevValue = prevState.value as T;
                  }
                }

                value = prevValue !== undefined ? prevValue : await fn();
              } catch (err) {
                try {
                  await task.updateCheckpoint?.({
                    key,
                    status: 'failed',
                    reason: stringifyError(taskLogger.redactError(err)),
                  });
                } catch (persistenceError) {
                  throw new AggregateError(
                    [err, persistenceError],
                    `Checkpoint '${checkpointKey}' failed and its failure state could not be persisted`,
                  );
                }
                throw err;
              }

              if (prevValue === undefined) {
                await task.updateCheckpoint?.({
                  key,
                  status: 'success',
                  value: value ?? {},
                });
              }
              return value;
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
          step: {
            id: step.id,
            name: step.name,
          },
        });
      }

      // Remove all temporary directories that were created when executing the action
      for (const tmpDir of tmpDirs) {
        await fs.remove(tmpDir);
      }

      context.steps[step.id] = { output: stepOutput };
      const updatedPreparedContext = preparedContext.withValue(
        ['steps', step.id],
        context.steps[step.id] as unknown as NunjitsuTemplateValue,
      );

      if (task.cancelSignal.aborted) {
        throw new Error(
          `Step ${step.id} (${step.name}) of task ${task.taskId} has been cancelled.`,
        );
      }

      workspaceSerializationAttempted = true;
      await task.serializeWorkspace?.({ path: workspacePath });

      // Persist step state so a recovered task can resume from here. Only done
      // when recovery is enabled to keep the default retry lifecycle unchanged.
      if (this.recoveryEnabled) {
        await task.updateStepState?.({
          stepId: step.id,
          status: 'completed',
          output: stepOutput,
        });
      }

      await stepTrack.markSuccessful();
      return updatedPreparedContext;
    } catch (cause) {
      const err = taskLogger.redactError(cause);
      await taskTrack.markFailed(step, err);
      await stepTrack.markFailed();
      throw err;
    } finally {
      if (!workspaceSerializationAttempted) {
        await task.serializeWorkspace?.({ path: workspacePath });
      }
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

    const { templateCapabilities } = this.options;

    this.environment = await this.getEnvironmentConfig();

    // Track whether any step has failed, used by status check functions
    const taskState = { failed: false };

    // Track whether a status check global (always/failure) was invoked during rendering
    const statusCheckInvoked = { value: false };

    const templateRenderer = createTemplateRenderer({
      allowRegexExecution: true,
      filters: {
        ...this.defaultTemplateCapabilities.filters,
        ...templateCapabilities?.filters,
      },
      globals: {
        ...templateCapabilities?.globals,
        always: () => {
          statusCheckInvoked.value = true;
          return true;
        },
        failure: () => {
          statusCheckInvoked.value = true;
          return taskState.failed;
        },
      },
    });
    try {
      await task.rehydrateWorkspace?.({ taskId, targetPath: workspacePath });

      const taskTrack = await this.tracker.taskStart(task);
      await fs.ensureDir(workspacePath);

      const context: TemplateContext = {
        parameters: task.spec.parameters,
        environment: {
          parameters: this.environment?.parameters || {},
          secrets: {},
        },
        steps: {},
        user: task.spec.user,
        context: {
          task: {
            id: taskId,
          },
        },
      };
      let preparedContext = templateRenderer.prepareContext(
        context as unknown as NunjitsuTemplateContext,
      );

      const [decision]: PolicyDecision[] =
        this.options.permissions && task.spec.steps.length
          ? await this.options.permissions.authorizeConditional(
              [{ permission: actionExecutePermission }],
              { credentials: await task.getInitiatorCredentials() },
            )
          : [{ result: AuthorizeResult.ALLOW }];

      // Only resume from persisted step state when recovery is enabled.
      // Otherwise ignore any saved state so retries always re-run every step,
      // matching the behavior when recovery is disabled.
      const prevTaskState = this.recoveryEnabled
        ? await task.getTaskState?.()
        : undefined;
      const recoveredTaskState = prevTaskState?.state as TaskState | undefined;
      const savedSteps = recoveredTaskState?.steps ?? {};
      const completedStepIds = Object.keys(savedSteps).filter(
        id => savedSteps[id]?.status === 'completed',
      );
      if (completedStepIds.length > 0) {
        await task.emitLog(
          `Task recovered - resuming from last known good state. ${completedStepIds.length} step(s) already completed.`,
        );
      }

      let firstError: Error | undefined;
      const allErrors: Array<{ step: TaskStep; error: Error }> = [];

      for (const step of task.spec.steps) {
        const savedStepState = savedSteps[step.id];
        if (savedStepState?.status === 'completed') {
          context.steps[step.id] = { output: savedStepState.output };
          preparedContext = preparedContext.withValue(
            ['steps', step.id],
            context.steps[step.id] as unknown as NunjitsuTemplateValue,
          );
          // Re-emit the completion status event for the skipped step so the
          // frontend, which reconstructs step status from log events, does not
          // show a recovered step as stuck in `processing`. This also covers
          // the crash window between persisting the step state and emitting the
          // original completion event.
          await task.emitLog(
            `Skipping step ${step.id} because it was already completed in a previous run`,
            { stepId: step.id, status: 'completed' },
          );
          continue;
        }

        // If a previous step failed, only run steps whose `if` condition
        // invokes a status check global (${{ always() }} or ${{ failure() }})
        if (taskState.failed) {
          if (typeof step.if !== 'string') {
            await task.emitLog(
              `Skipping step ${step.id} because a previous step failed`,
              { stepId: step.id, status: 'skipped' },
            );
            continue;
          }

          // Render the if condition to detect status check function usage
          statusCheckInvoked.value = false;
          this.render(step.if, preparedContext, templateRenderer);

          if (!statusCheckInvoked.value) {
            await task.emitLog(
              `Skipping step ${step.id} because a previous step failed`,
              { stepId: step.id, status: 'skipped' },
            );
            continue;
          }
        }

        try {
          preparedContext = await this.executeStep(
            task,
            step,
            context,
            preparedContext,
            templateRenderer,
            taskTrack,
            workspacePath,
            decision,
          );
        } catch (err) {
          const error = err as Error;
          allErrors.push({ step, error });

          if (!firstError) {
            firstError = error;
          } else {
            // Log subsequent errors to preserve debugging information
            this.options.logger.error(
              `Additional error in step ${step.id} (${step.name}): ${error.message}`,
              error,
            );
            await task.emitLog(
              `Additional error occurred: ${error.message}\n${error.stack}`,
              { stepId: step.id, status: 'failed' },
            );
          }
          taskState.failed = true;
        }
      }

      if (firstError) {
        // If there were multiple errors, add context to the first error
        if (allErrors.length > 1) {
          const additionalErrorSummary = allErrors
            .slice(1)
            .map(({ step }) => `${step.id} (${step.name})`)
            .join(', ');
          this.options.logger.warn(
            `Task failed with ${allErrors.length} errors. First error from step ${allErrors[0].step.id}. Additional failures in: ${additionalErrorSummary}`,
          );
        }
        throw firstError;
      }

      const output = this.render(
        task.spec.output,
        preparedContext,
        templateRenderer,
      );

      // Filter output links and text items based on their `if` condition
      if (Array.isArray(output?.links)) {
        output.links = filterConditionalItems(output.links);
      }
      if (Array.isArray(output?.text)) {
        output.text = filterConditionalItems(output.text);
      }

      await taskTrack.markSuccessful();

      return { output };
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}

function scaffoldingTracker(metrics: MetricsService) {
  // prom-client metrics are deprecated in favour of OpenTelemetry metrics.
  const promTaskCount = createCounterMetric({
    name: 'scaffolder_task_count',
    help: 'Count of task runs',
    labelNames: ['template', 'result'],
  });
  const promTaskDuration = createHistogramMetric({
    name: 'scaffolder_task_duration',
    help: 'Duration of a task run',
    labelNames: ['template', 'result'],
  });
  const promStepCount = createCounterMetric({
    name: 'scaffolder_step_count',
    help: 'Count of step runs',
    labelNames: ['template', 'step', 'result'],
  });
  const promStepDuration = createHistogramMetric({
    name: 'scaffolder_step_duration',
    help: 'Duration of a step runs',
    labelNames: ['template', 'step', 'result'],
  });

  const taskCount = metrics.createCounter('scaffolder.task.count', {
    description: 'Total number of scaffolder tasks executed',
  });

  const taskDuration = metrics.createHistogram('scaffolder.task.duration', {
    description: 'Time taken to complete a scaffolder task end-to-end',
    unit: 's',
  });

  const stepCount = metrics.createCounter('scaffolder.step.count', {
    description: 'Total number of individual scaffolder action steps executed',
  });

  const stepDuration = metrics.createHistogram('scaffolder.step.duration', {
    description: 'Time taken to complete a single scaffolder action step',
    unit: 's',
  });

  async function taskStart(task: TaskContext) {
    await task.emitLog(`Starting up task with ${task.spec.steps.length} steps`);
    const template = task.spec.templateInfo?.entityRef || '';

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
        result: 'ok',
      });
      taskTimer({ result: 'ok' });

      taskCount.add(1, { template, result: 'ok' });
      taskDuration.record(endTime(), {
        template,
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
        result: 'failed',
      });
      taskTimer({ result: 'failed' });

      taskCount.add(1, { template, result: 'failed' });
      taskDuration.record(endTime(), {
        template,
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
        result: 'cancelled',
      });
      taskTimer({ result: 'cancelled' });

      taskCount.add(1, { template, result: 'cancelled' });
      taskDuration.record(endTime(), {
        template,
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
      promStepCount.inc({
        template,
        step: step.name,
        result: 'ok',
      });
      stepTimer({ result: 'ok' });

      stepCount.add(1, { template, step: step.name, result: 'ok' });
      stepDuration.record(endTime(), {
        template,
        step: step.name,
        result: 'ok',
      });
    }

    async function markCancelled() {
      promStepCount.inc({
        template,
        step: step.name,
        result: 'cancelled',
      });
      stepTimer({ result: 'cancelled' });

      stepCount.add(1, { template, step: step.name, result: 'cancelled' });
      stepDuration.record(endTime(), {
        template,
        step: step.name,
        result: 'cancelled',
      });
    }

    async function markFailed() {
      promStepCount.inc({
        template,
        step: step.name,
        result: 'failed',
      });
      stepTimer({ result: 'failed' });

      stepCount.add(1, { template, step: step.name, result: 'failed' });
      stepDuration.record(endTime(), {
        template,
        step: step.name,
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
        template,
        step: step.name,
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
