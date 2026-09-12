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
import { InputError, toError } from '@backstage/errors';
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
import { JsonObject } from '@backstage/types';
import { Config } from '@backstage/config';
import { collectTemplateCapabilities } from '../../util/templating';

const DEFAULT_TASK_PARAMETER_MAX_LENGTH = 256;
const TASK_RECOVERY_INTERVAL_MS = 10_000;
const CLAIM_RETRY_INITIAL_DELAY_MS = 1_000;
const CLAIM_RETRY_MAX_DELAY_MS = 60_000;
const CLAIM_RETRY_JITTER_FACTOR = 0.2;

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
  private workerLoops: Promise<void> | undefined;
  private readonly workerAbortController = new AbortController();

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
    } = options;

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
      logger,
      permissions,
      auditor,
      config,
      gracefulShutdown,
      parameterAuditTransform: createParameterTruncator(config),
    });
  }

  async recoverTasks() {
    try {
      await this.options.taskBroker.recoverTasks?.();
    } catch (error) {
      this.logger?.error('Failed to recover tasks', toError(error));
    }
  }

  start() {
    if (this.workerLoops) {
      return;
    }

    this.workerLoops = Promise.all([
      this.runTaskRecoveryLoop(),
      this.runTaskClaimLoop(),
    ])
      .then(() => undefined)
      .catch(error => {
        this.logger?.error(
          'Unexpected task worker loop failure',
          toError(error),
        );
      });
  }

  async stop() {
    this.stopWorkers = true;
    this.workerAbortController.abort();
    if (this.options?.gracefulShutdown) {
      await this.workerLoops;
      await this.taskQueue.onIdle();
    }
  }

  private async runTaskRecoveryLoop() {
    while (!this.stopWorkers) {
      await this.wait(TASK_RECOVERY_INTERVAL_MS);
      if (!this.stopWorkers) {
        await this.recoverTasks();
      }
    }
  }

  private async runTaskClaimLoop() {
    let retryDelayMs = CLAIM_RETRY_INITIAL_DELAY_MS;

    while (!this.stopWorkers) {
      await this.onReadyToClaimTask();
      if (this.stopWorkers) {
        break;
      }

      try {
        const task = await this.options.taskBroker.claim({
          signal: this.workerAbortController.signal,
        });
        retryDelayMs = CLAIM_RETRY_INITIAL_DELAY_MS;
        void this.taskQueue
          .add(() => this.runOneTask(task))
          .catch(error => {
            this.logger?.error(
              `Unexpected error while executing task ${task.taskId}`,
              toError(error),
            );
          });
      } catch (error) {
        if (this.stopWorkers) {
          break;
        }
        const jitter = retryDelayMs * CLAIM_RETRY_JITTER_FACTOR;
        const actualDelayMs = Math.min(
          CLAIM_RETRY_MAX_DELAY_MS,
          Math.round(retryDelayMs - jitter + Math.random() * jitter * 2),
        );
        this.logger?.error(
          `Failed to claim task, retrying in ${actualDelayMs}ms`,
          toError(error),
        );
        await this.wait(actualDelayMs);
        retryDelayMs = Math.min(retryDelayMs * 2, CLAIM_RETRY_MAX_DELAY_MS);
      }
    }
  }

  private wait(delayMs: number) {
    return new Promise<void>(resolve => {
      const signal = this.workerAbortController.signal;
      const timeout = setTimeout(onDone, delayMs);

      function onDone() {
        clearTimeout(timeout);
        signal.removeEventListener('abort', onDone);
        resolve();
      }

      timeout.unref();
      signal.addEventListener('abort', onDone, { once: true });
      if (signal.aborted) {
        onDone();
      }
    });
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
    const auditorEvent = await this.auditor?.createEvent({
      eventId: 'task',
      severityLevel: 'medium',
      meta: {
        actionType: 'execution',
        createdBy: task.createdBy,
        taskId: task.taskId,
        taskParameters: this.parameterAuditTransform(task.spec.parameters),
        templateRef: task.spec.templateInfo?.entityRef,
      },
    });

    try {
      if (task.spec.apiVersion !== 'scaffolder.backstage.io/v1beta3') {
        throw new Error(
          `Unsupported Template apiVersion ${task.spec.apiVersion}`,
        );
      }

      const { output } = await this.options.runners.workflowRunner.execute(
        task,
      );

      await task.complete('completed', { output });
      await auditorEvent?.success();
    } catch (error) {
      const err = toError(error);
      await auditorEvent?.fail({
        error: err,
      });
      await task.complete('failed', {
        error: { name: err.name, message: err.message },
      });
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
