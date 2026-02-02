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

import { Job, JobOptions, ProcessOptions } from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';
import PgBoss from 'pg-boss';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

export type PostgresQueueOptions = BaseQueueOptions & {
  boss: PgBoss;
  stopBossOnDisconnect?: boolean;
};

/**
 * Queue implementation using PostgreSQL via pg-boss.
 *
 * @internal
 */
export class PostgresQueue extends BaseQueue {
  private readonly boss: PgBoss;
  private workerIds: string[] = [];
  private workerPromises: Promise<string>[] = [];
  private workerConcurrency?: number;
  private queueInitialized: boolean = false;
  private readonly stopBossOnDisconnect: boolean;

  constructor(options: PostgresQueueOptions) {
    super(options);
    this.boss = options.boss;
    this.stopBossOnDisconnect = options.stopBossOnDisconnect ?? true;
  }

  private async ensureQueueExists(): Promise<void> {
    if (this.queueInitialized) {
      return;
    }

    await this.boss.createQueue(this.queueName);
    this.queueInitialized = true;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    await this.ensureQueueExists();

    const ourPriority = options?.priority ?? 20;
    const pgBossPriority = 100 - ourPriority;

    const sendOptions: PgBoss.SendOptions = {
      retryLimit: this.maxAttempts - 1,
      retryDelay: 1,
      retryBackoff: true,
      priority: pgBossPriority,
    };

    if (options?.delay) {
      sendOptions.startAfter = Math.floor(options.delay / 1000);
    }

    const jobPayload =
      payload !== null && typeof payload === 'object'
        ? payload
        : { __value: payload }; // Primitive values need to be wrapped to object

    await this.boss.send(this.queueName, jobPayload, sendOptions);

    for (const workerId of this.workerIds) {
      this.boss.notifyWorker(workerId);
    }
  }

  private createWorkHandler() {
    return async (pgBossJobs: PgBoss.JobWithMetadata[]) => {
      if (this.isDisconnecting || !this.handler || !pgBossJobs.length) {
        return;
      }

      const pgBossJob = pgBossJobs[0];
      let payload: object | JsonValue = pgBossJob.data;

      // We need to unwrap primitive values
      if (
        typeof payload === 'object' &&
        Object.keys(payload).length === 1 &&
        '__value' in payload &&
        payload.__value !== undefined
      ) {
        payload = payload.__value;
      }

      const job: Job = {
        id: pgBossJob.id,
        payload: payload,
        attempt: (pgBossJob.retryCount ?? 0) + 1,
      };

      try {
        if (this.handler) {
          await this.handler(job);
        }
        this.notifyWorkers();
      } catch (error) {
        const result = await this.handleFailedJob(job, error);
        if (result.shouldRetry) {
          throw error;
        }
      }
    };
  }

  process(
    handler: (job: Job) => Promise<void>,
    options?: ProcessOptions,
  ): void {
    super.process(handler, options);
    this.workerConcurrency = options?.concurrency ?? this.defaultConcurrency;
    this.startWorkers();
  }

  async getJobCount(): Promise<number> {
    return await this.boss.getQueueSize(this.queueName);
  }

  async pause(): Promise<void> {
    await super.pause();
    await this.stopWorkers();
  }

  async resume(): Promise<void> {
    await super.resume();
    this.startWorkers();
  }

  protected async onDisconnect(): Promise<void> {
    await this.stopWorkers();
    if (this.stopBossOnDisconnect) {
      await this.boss.stop();
    }
  }

  private startWorkers(): void {
    if (this.workerIds.length > 0 || this.workerPromises.length > 0) {
      return;
    }

    const concurrency = this.workerConcurrency ?? this.defaultConcurrency;
    const workHandler = this.createWorkHandler();

    const workerPromises: Promise<string>[] = [];
    for (let i = 0; i < concurrency; i++) {
      const workerPromise = this.boss
        .work(
          this.queueName,
          {
            batchSize: 1,
            includeMetadata: true,
            pollingIntervalSeconds: 1,
          },
          workHandler,
        )
        .catch(error => {
          this.logger.error(
            `Failed to start worker ${i} for queue ${this.queueName}`,
            error,
          );
          throw error;
        });
      workerPromises.push(workerPromise);
    }
    this.workerPromises = workerPromises;

    Promise.all(workerPromises)
      .then(ids => {
        this.workerIds = ids;
        this.workerPromises = [];
      })
      .catch(error => {
        this.logger.error(
          `Failed to initialize workers for queue ${this.queueName}`,
          error,
        );
        this.workerPromises = [];
      });
  }

  private async stopWorkers(): Promise<void> {
    const workerPromises = this.workerPromises;
    const workerIds = this.workerIds;
    this.workerPromises = [];
    this.workerIds = [];

    const resolvedIds: string[] = [...workerIds];
    if (workerPromises.length > 0) {
      try {
        resolvedIds.push(...(await Promise.all(workerPromises)));
      } catch (error) {
        this.logger.warn(
          `Failed to resolve worker ids for queue ${this.queueName}`,
          error,
        );
      }
    }

    await Promise.all(
      resolvedIds.map(workerId => this.boss.offWork({ id: workerId })),
    );
  }

  private notifyWorkers(): void {
    for (const workerId of this.workerIds) {
      this.boss.notifyWorker(workerId);
    }
  }
}
