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

import { AuditorService, LoggerService } from '@backstage/backend-plugin-api';
import type { MetricsService } from '@backstage/backend-plugin-api/alpha';
import { InputError, stringifyError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import {
  TaskBroker,
  TaskContext,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import PQueue from 'p-queue';
import { TemplateActionRegistry } from '../actions/TemplateActionRegistry';
import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import { WorkflowRunner } from './types';
import { setTimeout } from 'node:timers/promises';
import { JsonObject } from '@backstage/types';
import { Config, ConfigReader } from '@backstage/config';
import { collectTemplateCapabilities } from '../../util/templating';
import { TaskRunContext } from './TaskRunContext';
import type { SystemSecretProvider } from './TaskRunContext';
import { SystemSecretSource } from './SystemSecretSource';

const DEFAULT_TASK_PARAMETER_MAX_LENGTH = 256;

/** How long to wait before trying to claim again after a failed claim. */
const CLAIM_RETRY_DELAY_MS = 1000;

class NoopLogger implements LoggerService {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
  child(): LoggerService {
    return this;
  }
}

/**
 * TaskWorkerOptions
 */
export type TaskWorkerOptions = {
  taskBroker: TaskBroker;
  runners: {
    workflowRunner: WorkflowRunner;
  };
  concurrentTasksLimit: number;
  permissions?: PermissionEvaluator;
  logger?: LoggerService;
  auditor?: AuditorService;
  config?: Config;
  gracefulShutdown?: boolean;
  systemSecrets: SystemSecretProvider;
  disposeSystemSecrets?: () => void;
};

/**
 * CreateWorkerOptions
 */
export type CreateWorkerOptions = {
  taskBroker: TaskBroker;
  actionRegistry: TemplateActionRegistry;
  integrations: ScmIntegrations;
  workingDirectory: string;
  logger: LoggerService;
  auditor?: AuditorService;
  config?: Config;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  /**
   * The number of tasks that can be executed at the same time by the worker
   * @defaultValue 10
   * @example
   * ```
   * {
   *   concurrentTasksLimit: 1,
   *   // OR
   *   concurrentTasksLimit: Infinity
   * }
   * ```
   */
  concurrentTasksLimit?: number;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  permissions?: PermissionEvaluator;
  gracefulShutdown?: boolean;
  metrics: MetricsService;
  systemSecrets?: SystemSecretProvider;
};

/**
 * TaskWorker
 */
export class TaskWorker {
  private taskQueue: PQueue;
  private logger: LoggerService | undefined;
  private auditor: AuditorService | undefined;
  private parameterAuditTransform: ParameterAuditTransform;
  private stopWorkers: boolean;

  private readonly options: TaskWorkerOptions & {
    parameterAuditTransform: ParameterAuditTransform;
  };

  private constructor(
    options: TaskWorkerOptions & {
      parameterAuditTransform: ParameterAuditTransform;
    },
  ) {
    this.options = options;
    this.stopWorkers = false;
    this.logger = options.logger;
    this.auditor = options.auditor;
    this.taskQueue = new PQueue({
      concurrency: options.concurrentTasksLimit,
    });
    this.parameterAuditTransform = options.parameterAuditTransform;
  }

  static async create(options: CreateWorkerOptions): Promise<TaskWorker> {
    const {
      taskBroker,
      logger,
      auditor,
      config,
      actionRegistry,
      integrations,
      workingDirectory,
      additionalTemplateFilters,
      concurrentTasksLimit = 10, // from 1 to Infinity
      additionalTemplateGlobals,
      permissions,
      gracefulShutdown,
      metrics,
      systemSecrets,
    } = options;
    let disposeSystemSecrets: (() => void) | undefined;
    let resolvedSystemSecrets = systemSecrets;
    if (!resolvedSystemSecrets) {
      const source = await SystemSecretSource.create({
        config: config ?? new ConfigReader({}),
        logger,
      });
      resolvedSystemSecrets = source;
      disposeSystemSecrets = () => source.close();
    }

    const workflowRunner = new NunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      logger,
      auditor,
      workingDirectory,
      templateCapabilities: collectTemplateCapabilities({
        filters: additionalTemplateFilters,
        globals: additionalTemplateGlobals,
      }),
      permissions,
      config,
      metrics,
    });
    return new TaskWorker({
      taskBroker: taskBroker,
      runners: { workflowRunner },
      concurrentTasksLimit,
      permissions,
      logger,
      auditor,
      config,
      gracefulShutdown,
      systemSecrets: resolvedSystemSecrets,
      disposeSystemSecrets,
      parameterAuditTransform: createParameterTruncator(config),
    });
  }

  async recoverTasks() {
    try {
      await this.options.taskBroker.recoverTasks?.();
    } catch (err) {
      this.logger?.error(stringifyError(err));
    }
  }

  start() {
    (async () => {
      while (!this.stopWorkers) {
        await setTimeout(10000);
        await this.recoverTasks();
      }
    })();
    (async () => {
      while (!this.stopWorkers) {
        try {
          await this.onReadyToClaimTask();
          if (!this.stopWorkers) {
            const task = await this.options.taskBroker.claim();
            void this.taskQueue.add(() => this.runOneTask(task));
          }
        } catch (err) {
          // Without this the loop exits on the first rejection and the worker
          // stops claiming tasks for the rest of the process lifetime, leaving
          // every new task queued with no indication that anything is wrong.
          this.logger?.error(
            `Failed to claim task, retrying in ${CLAIM_RETRY_DELAY_MS}ms; caused by ${stringifyError(
              err,
            )}`,
          );
          await setTimeout(CLAIM_RETRY_DELAY_MS);
        }
      }
    })();
  }

  async stop() {
    this.stopWorkers = true;
    const dispose = this.taskQueue.onIdle().then(() => {
      this.options.disposeSystemSecrets?.();
    });
    if (this.options.gracefulShutdown) {
      await dispose;
    }
  }

  waitUntilIdle(): Promise<void> {
    return this.taskQueue.onIdle();
  }

  protected onReadyToClaimTask(): Promise<void> {
    if (this.taskQueue.pending < this.options.concurrentTasksLimit) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      // "next" event emits when a task completes
      // https://github.com/sindresorhus/p-queue#next
      this.taskQueue.once('next', () => {
        resolve();
      });
    });
  }

  async runOneTask(task: TaskContext) {
    const runner = this.options.runners.workflowRunner;
    const runContext = await TaskRunContext.create({
      task,
      logger: this.logger ?? new NoopLogger(),
      systemSecrets: this.options.systemSecrets,
      loadEnvironment: async () =>
        (await runner.getEnvironmentConfig?.()) ?? {
          parameters: {},
          secrets: {},
        },
    });
    let auditorEvent:
      | Awaited<ReturnType<NonNullable<AuditorService>['createEvent']>>
      | undefined;

    try {
      await runContext.waitUntilReady();
      const auditParameters = runContext.redacter.redactJson(
        task.spec.parameters,
      ) as JsonObject;
      auditorEvent = await this.auditor?.createEvent({
        eventId: 'task',
        severityLevel: 'medium',
        meta: runContext.redacter.redactJson({
          actionType: 'execution',
          createdBy: task.createdBy,
          taskId: task.taskId,
          taskParameters: this.parameterAuditTransform(auditParameters),
          templateRef: task.spec.templateInfo?.entityRef,
        }) as JsonObject,
      });

      if (
        runContext.task.spec.apiVersion !== 'scaffolder.backstage.io/v1beta3'
      ) {
        throw new Error(
          `Unsupported Template apiVersion ${runContext.task.spec.apiVersion}`,
        );
      }

      const { output } = await runner.execute(runContext);

      await runContext.task.complete('completed', { output });
      await auditorEvent?.success();
    } catch (error) {
      const err = runContext.redacter.redactError(error);
      let projectedAuditError: Error | undefined;
      try {
        await auditorEvent?.fail({
          error: err,
        });
      } catch (auditError) {
        projectedAuditError = runContext.redacter.redactError(auditError);
      }
      try {
        if (runContext.initializationError) {
          await task.complete('failed', {
            error: {
              name: 'Error',
              message: 'Failed to initialize task secret redaction',
            },
          });
        } else {
          await runContext.task.complete('failed', {
            error: { name: err.name, message: err.message },
          });
        }
      } catch (completionError) {
        throw runContext.redacter.redactError(completionError);
      }
      if (projectedAuditError) {
        throw projectedAuditError;
      }
    } finally {
      await runContext.dispose();
    }
  }
}

type ParameterAuditTransform = (parameters: JsonObject) => JsonObject;

/**
 * Truncates task parameters for audit logging using the configured max length.
 * @internal
 */
export function createParameterTruncator(
  config?: Config,
): ParameterAuditTransform {
  const maxLength =
    config?.getOptionalNumber('scaffolder.auditor.taskParameterMaxLength') ??
    DEFAULT_TASK_PARAMETER_MAX_LENGTH;

  if (!Number.isSafeInteger(maxLength) || maxLength < -1) {
    throw new InputError(
      `Invalid configuration for 'scaffolder.auditor.taskParameterMaxLength', got ${maxLength}. Must be a positive integer or -1 to disable truncation.`,
    );
  }

  if (maxLength === -1) {
    return (parameters: JsonObject) => parameters;
  }

  return (parameters: JsonObject) => {
    function truncate(value: unknown): unknown {
      if (typeof value === 'string') {
        if (value.length > maxLength) {
          return value.slice(0, maxLength).concat('...<truncated>');
        }
        return value;
      }
      if (Array.isArray(value)) {
        return value.map(truncate);
      }
      if (value && typeof value === 'object') {
        const result: Record<string, unknown> = {};
        for (const k in value as object) {
          if (Object.hasOwn(value, k)) {
            result[k] = truncate((value as any)[k]);
          }
        }
        return result;
      }
      return value;
    }

    return truncate(parameters) as JsonObject;
  };
}
