/*
 * Copyright 2026 The Backstage Authors
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

import {
  DLQHandler,
  Job,
  JobOptions,
  ProcessHandler,
  ProcessInput,
  ProcessOptions,
  Queue,
  QueueWorker,
} from '@backstage/backend-plugin-api/alpha';
import { LoggerService } from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';

/**
 * Options for {@link BaseQueue}.
 *
 * @internal
 */
export interface BaseQueueOptions {
  logger: LoggerService;
  queueName: string;
  /**
   * Maximum number of attempts before sending to DLQ handler.
   * @defaultValue 5
   */
  maxAttempts?: number;
  /**
   * Handler for jobs that have exceeded the maximum number of attempts.
   */
  dlqHandler?: DLQHandler;
  /**
   * Default concurrency for the queue.
   */
  defaultConcurrency?: number;
}

/**
 * Abstract base class for Queue implementations.
 *
 * @internal
 */
export abstract class BaseQueue implements Queue {
  protected readonly logger: LoggerService;
  protected readonly queueName: string;
  protected readonly maxAttempts: number;
  protected readonly dlqHandler?: DLQHandler;
  protected readonly defaultConcurrency: number;
  protected isDisconnecting: boolean = false;
  protected activeProcessingCount: number = 0;
  protected handler?: ProcessHandler<any>;

  constructor(options: BaseQueueOptions) {
    this.logger = options.logger;
    this.queueName = options.queueName;
    this.maxAttempts = options.maxAttempts ?? 5;
    this.dlqHandler = options.dlqHandler;
    this.defaultConcurrency = options.defaultConcurrency ?? 1;
  }

  abstract add(payload: JsonValue, options?: JobOptions): Promise<void>;

  process<T extends JsonValue = JsonValue>(
    handler: ProcessHandler<T>,
    options?: ProcessOptions,
  ): QueueWorker<T>;

  process<T extends JsonValue = JsonValue>(
    options?: ProcessOptions,
  ): QueueWorker<T>;

  process<T extends JsonValue = JsonValue>(
    handlerOrOptions?: ProcessInput<T>,
    maybeOptions?: ProcessOptions,
  ): QueueWorker<T> {
    return this.prepareProcessing(handlerOrOptions, maybeOptions).worker;
  }

  abstract getJobCount(): Promise<number>;

  async disconnect(): Promise<void> {
    this.isDisconnecting = true;
    this.logger.debug(`[${this.queueName}] Queue disconnecting`);
    await this.onDisconnect();
    this.handler = undefined;
  }

  /**
   * Handles a failed job by either retrying or sending to DLQ.
   * Returns true if the job should be retried, false if it was sent to DLQ.
   */
  protected async handleFailedJob(
    job: Job,
    error: Error,
  ): Promise<{ shouldRetry: boolean; nextAttempt: number }> {
    const nextAttempt = job.attempt + 1;

    if (nextAttempt > this.maxAttempts) {
      this.logger.error(
        `[${this.queueName}] Job ${job.id} exceeded max attempts (${this.maxAttempts}), sending to DLQ`,
        error,
      );

      if (this.dlqHandler) {
        try {
          await this.dlqHandler(job, error);
        } catch (dlqError) {
          this.logger.error(
            `[${this.queueName}] DLQ handler failed for job ${job.id}`,
            dlqError,
          );
        }
      }

      return { shouldRetry: false, nextAttempt };
    }

    this.logger.warn(
      `[${this.queueName}] Job ${job.id} failed (attempt ${job.attempt}/${this.maxAttempts}), will retry`,
      error,
    );

    return { shouldRetry: true, nextAttempt };
  }

  protected abstract onDisconnect(): Promise<void>;

  protected prepareProcessing<T extends JsonValue = JsonValue>(
    handlerOrOptions?: ProcessInput<T>,
    maybeOptions?: ProcessOptions,
  ): {
    worker: QueueWorker<T>;
    handler?: ProcessHandler<T>;
    options?: ProcessOptions;
  } {
    if (typeof handlerOrOptions !== 'function') {
      return {
        worker: this.createWorker<T>(handlerOrOptions),
        options: handlerOrOptions,
      };
    }

    if (this.handler) {
      throw new Error('Queue is already being processed');
    }

    this.handler = handlerOrOptions as ProcessHandler<any>;
    return {
      worker: this.createWorker<T>(maybeOptions),
      handler: handlerOrOptions,
      options: maybeOptions,
    };
  }

  protected createWorker<T extends JsonValue = JsonValue>(
    _options?: ProcessOptions,
  ): QueueWorker<T> {
    return {
      next: async () => {
        throw new Error(
          `[${this.queueName}] Direct worker API is not supported by this queue backend`,
        );
      },
      close: async () => {},
    };
  }

  protected async waitForActiveProcessingToComplete(options?: {
    maxWaitTimeMs?: number;
    pollIntervalMs?: number;
  }): Promise<void> {
    const maxWaitTimeMs = options?.maxWaitTimeMs ?? 5000;
    const pollIntervalMs = options?.pollIntervalMs ?? 100;
    const startTime = Date.now();

    while (
      this.activeProcessingCount > 0 &&
      Date.now() - startTime < maxWaitTimeMs
    ) {
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    if (this.activeProcessingCount > 0) {
      this.logger.warn(
        `[${this.queueName}] Disconnecting with ${this.activeProcessingCount} jobs still processing`,
      );
    }
  }

  protected async waitForPromisesToSettle(
    promises: Promise<unknown>[],
    options: {
      timeoutMessage: string;
      maxWaitTimeMs?: number;
    },
  ): Promise<void> {
    if (promises.length === 0) {
      return;
    }

    const maxWaitTimeMs = options.maxWaitTimeMs ?? 5000;
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      await Promise.race([
        Promise.allSettled(promises).then(() => {}),
        new Promise<void>(resolve => {
          timeoutId = setTimeout(() => {
            this.logger.warn(`[${this.queueName}] ${options.timeoutMessage}`);
            resolve();
          }, maxWaitTimeMs);
        }),
      ]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
