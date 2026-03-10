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
  Job,
  JobOptions,
  ProcessHandler,
  ProcessInput,
  ProcessOptions,
  QueueWorker,
} from '@backstage/backend-plugin-api/alpha';
import { JsonValue } from '@backstage/types';
import { v4 as uuid } from 'uuid';
import Redis from 'ioredis';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

export type RedisQueueOptions = BaseQueueOptions & {
  client: Redis;
  keyPrefix?: string;
};

type RedisJob = Job & {
  priority: number;
};

type RedisJobData = RedisJob & {
  _seq: string;
};

/**
 * Queue implementation for redis.
 *
 * @internal
 */
export class RedisQueue extends BaseQueue {
  private readonly client: Redis;
  private delayedClient?: Redis;

  private readonly queueKey: string;
  private readonly delayedKey: string;
  private readonly sequenceKey: string;

  private processLoopActive: boolean = false;
  private delayedLoopActive: boolean = false;
  private processLoopPromise?: Promise<void>;
  private delayedLoopPromise?: Promise<void>;
  private concurrency: number = 1;

  constructor(options: RedisQueueOptions) {
    super(options);
    this.client = options.client;

    const prefix = options.keyPrefix ?? 'backstage:queue:';
    this.queueKey = `${prefix}${this.queueName}`;
    this.delayedKey = `${prefix}${this.queueName}:delayed`;
    this.sequenceKey = `${prefix}${this.queueName}:seq`;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const job: RedisJob = {
      id: uuid(),
      payload,
      attempt: 0,
      priority: options?.priority ?? 20,
    };
    const serialized = await this.serializeJob(job);

    const delay = options?.delay ?? 0;

    if (delay > 0) {
      const runAt = Date.now() + delay;
      await this.client.zadd(this.delayedKey, runAt, serialized);
    } else {
      const priority = options?.priority ?? 20;
      await this.client.zadd(this.queueKey, priority, serialized);
    }
  }

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
    const processing = this.prepareProcessing(handlerOrOptions, maybeOptions);
    if (!processing.handler) {
      return processing.worker;
    }

    this.concurrency =
      processing.options?.concurrency ?? this.defaultConcurrency;

    if (!this.delayedClient) {
      // We need another client to process delayed jobs without blocking the main queue.
      this.delayedClient = this.client.duplicate();
      this.delayedClient.on('error', err => {
        this.logger.error(
          `[${this.queueName}] Redis delayed client error`,
          err,
        );
      });
    }

    this.startProcessLoop();
    this.startDelayedLoop();
    return processing.worker;
  }

  async getJobCount(): Promise<number> {
    const waiting = await this.client.zcard(this.queueKey);
    const delayed = await this.client.zcard(this.delayedKey);
    return waiting + delayed;
  }

  protected async onDisconnect(): Promise<void> {
    this.processLoopActive = false;
    this.delayedLoopActive = false;

    const loopPromises: Promise<void>[] = [];
    if (this.processLoopPromise) {
      loopPromises.push(this.processLoopPromise);
    }
    if (this.delayedLoopPromise) {
      loopPromises.push(this.delayedLoopPromise);
    }

    if (loopPromises.length > 0) {
      await this.waitForPromisesToSettle(loopPromises, {
        timeoutMessage: 'Timed out waiting for loops to complete',
      });
    }

    await this.waitForActiveProcessingToComplete();

    if (this.delayedClient) {
      await this.delayedClient.quit();
      this.delayedClient = undefined;
    }
  }

  private async processJobFromQueue(job: RedisJob): Promise<void> {
    job.attempt++;

    try {
      if (this.handler) {
        await this.handler(job);
      }
    } catch (error) {
      const retryResult = await this.handleFailedJob(job, error);

      if (retryResult.shouldRetry) {
        const backoffDelay = 1000 * Math.pow(2, job.attempt - 1);
        const runAt = Date.now() + backoffDelay;
        const serialized = await this.serializeJob(job);
        await this.client.zadd(this.delayedKey, runAt, serialized);
      }
    } finally {
      this.activeProcessingCount--;
    }
  }

  private async getJobs(availableCapacity: number): Promise<RedisJob[]> {
    const jobs: RedisJob[] = [];

    try {
      const results = await this.client.zpopmin(
        this.queueKey,
        availableCapacity,
      );

      if (results && results.length > 0) {
        for (let i = 0; i < results.length; i += 2) {
          if (!results[i]) {
            continue;
          }
          const jobData = this.deserializeJob(results[i]);
          const job: RedisJob = {
            id: jobData.id,
            payload: jobData.payload,
            attempt: jobData.attempt ?? 0,
            priority: jobData.priority ?? 20,
          };
          jobs.push(job);
        }
      }
    } catch (error) {
      this.logger.error(
        `[${this.queueName}] Failed to fetch jobs from Redis`,
        error,
      );
    }

    return jobs;
  }

  private startProcessLoop() {
    if (this.processLoopActive) return;
    this.processLoopActive = true;

    this.processLoopPromise = (async () => {
      try {
        while (!this.isDisconnecting) {
          try {
            const availableCapacity =
              this.concurrency - this.activeProcessingCount;

            if (availableCapacity <= 0) {
              await new Promise(r => setTimeout(r, 100));
              continue;
            }

            const jobs = await this.getJobs(availableCapacity);

            for (const job of jobs) {
              this.activeProcessingCount++;
              this.processJobFromQueue(job).catch(error => {
                this.logger.error(
                  `[${this.queueName}] Redis job processing error`,
                  error,
                );
              });
            }
          } catch (error) {
            this.logger.error(
              `[${this.queueName}] Redis queue loop error`,
              error,
            );
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      } finally {
        this.processLoopActive = false;
        this.processLoopPromise = undefined;
      }
    })();
  }

  private startDelayedLoop() {
    if (this.delayedLoopActive) return;
    this.delayedLoopActive = true;

    this.delayedLoopPromise = (async () => {
      try {
        while (!this.isDisconnecting) {
          if (!this.handler || !this.delayedClient) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }

          try {
            const now = Date.now();
            const result = await this.delayedClient.bzpopmin(
              this.delayedKey,
              1,
            );

            if (!result) {
              continue;
            }

            const [, serialized, score] = result;
            const jobScore = Number.parseFloat(score);

            // Not yet time to run the job, add it back to the delayed queue
            if (jobScore > now) {
              await this.delayedClient.zadd(
                this.delayedKey,
                jobScore,
                serialized,
              );
              continue;
            }

            // It's time to run the job, remove it from the delayed queue and add it to the main queue
            const jobData = this.deserializeJob(serialized);
            const priority = (jobData.priority ?? 20) as number;
            await this.client.zadd(this.queueKey, priority, serialized);
          } catch (error) {
            this.logger.error(
              `[${this.queueName}] Redis delayed loop error`,
              error,
            );
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      } finally {
        this.delayedLoopActive = false;
        this.delayedLoopPromise = undefined;
      }
    })();
  }

  private async serializeJob(job: RedisJob): Promise<string> {
    const sequence = await this.client.incr(this.sequenceKey);
    const jobData: RedisJobData = {
      _seq: sequence.toString().padStart(20, '0'),
      ...job,
    };

    return `${jobData._seq}:${JSON.stringify(jobData)}`;
  }

  private deserializeJob(serialized: string): RedisJobData {
    if (serialized.startsWith('{')) {
      return JSON.parse(serialized) as RedisJobData;
    }

    const separatorIndex = serialized.indexOf(':');
    const payload =
      separatorIndex === -1 ? serialized : serialized.slice(separatorIndex + 1);
    return JSON.parse(payload) as RedisJobData;
  }
}
