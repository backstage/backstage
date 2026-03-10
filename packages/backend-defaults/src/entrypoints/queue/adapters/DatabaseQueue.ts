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
  QueueWorkerJob,
} from '@backstage/backend-plugin-api/alpha';
import { JsonValue } from '@backstage/types';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { BaseQueue, BaseQueueOptions } from './BaseQueue';
import { DB_QUEUE_ITEMS_TABLE } from '../database/tables';

const DEFAULT_POLL_INTERVAL_MS = 250;
const DEFAULT_LEASE_DURATION_MS = 10 * 60 * 1000;
const MAX_RETRY_DELAY_MS = 5 * 60 * 1000;

type DatabaseQueueItemRow = {
  id: string;
  queue_name: string;
  payload: JsonValue | string;
  attempt: number;
  priority: number;
  available_at: string | Date;
  lease_expires_at: string | Date | null;
  lease_token: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type Lease = {
  job: Job;
  rowId: string;
  leaseToken: string;
};

export type DatabaseQueueOptions = BaseQueueOptions & {
  db: Knex;
  leaseDurationMs?: number;
  pollIntervalMs?: number;
};

/**
 * Queue implementation backed by the plugin database.
 *
 * @internal
 */
export class DatabaseQueue extends BaseQueue {
  private readonly db: Knex;
  private readonly leaseDurationMs: number;
  private readonly pollIntervalMs: number;
  private readonly workers = new Set<QueueWorker>();
  private workerPromises: Promise<void>[] = [];

  constructor(options: DatabaseQueueOptions) {
    super(options);
    this.db = options.db;
    this.leaseDurationMs = options.leaseDurationMs ?? DEFAULT_LEASE_DURATION_MS;
    this.pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const now = new Date();
    await this.db<DatabaseQueueItemRow>(DB_QUEUE_ITEMS_TABLE).insert({
      id: uuid(),
      queue_name: this.queueName,
      payload,
      attempt: 0,
      priority: options?.priority ?? 20,
      available_at: new Date(now.getTime() + (options?.delay ?? 0)),
      lease_expires_at: null,
      lease_token: null,
      created_at: now,
      updated_at: now,
    });
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

    if (this.workerPromises.length > 0) {
      return processing.worker;
    }

    const concurrency =
      processing.options?.concurrency ?? this.defaultConcurrency;
    this.workerPromises = Array.from({ length: concurrency }, (_, index) =>
      this.runWorker(processing.worker, index),
    );

    return processing.worker;
  }

  async getJobCount(): Promise<number> {
    const result = await this.db<DatabaseQueueItemRow>(DB_QUEUE_ITEMS_TABLE)
      .where({ queue_name: this.queueName })
      .count<{ count: number | string }>({ count: 'id' })
      .first();

    return Number(result?.count ?? 0);
  }

  protected async onDisconnect(): Promise<void> {
    await Promise.allSettled(
      Array.from(this.workers).map(worker => worker.close()),
    );

    await this.waitForPromisesToSettle(this.workerPromises, {
      timeoutMessage: 'Timed out waiting for workers to complete',
    });

    this.workerPromises = [];
  }

  protected createWorker<T extends JsonValue = JsonValue>(
    options?: ProcessOptions,
  ): QueueWorker<T> {
    const batchSize = options?.batchSize ?? 1;
    let closed = false;

    const worker: QueueWorker<T> = {
      next: async () => {
        if (closed) {
          return undefined;
        }

        return this.leaseNextBatch<T>(batchSize);
      },
      close: async () => {
        if (closed) {
          return;
        }

        closed = true;
        this.workers.delete(worker);
      },
    };

    this.workers.add(worker);
    return worker;
  }

  protected async leaseNextBatch<T extends JsonValue = JsonValue>(
    batchSize: number,
  ): Promise<QueueWorkerJob<T>[]> {
    if (this.isDisconnecting) {
      return [];
    }

    const jobs: QueueWorkerJob<T>[] = [];
    for (let i = 0; i < batchSize; i++) {
      const lease = await this.tryLeaseNextJob();
      if (!lease) {
        break;
      }

      jobs.push(this.createWorkerJob<T>(lease));
    }

    return jobs;
  }

  private async runWorker(
    worker: QueueWorker,
    workerIndex: number,
  ): Promise<void> {
    while (!this.isDisconnecting) {
      try {
        const jobs = await worker.next();
        if (jobs === undefined) {
          break;
        }

        if (jobs.length === 0) {
          await sleep(this.pollIntervalMs);
          continue;
        }

        for (const job of jobs) {
          try {
            if (!this.handler) {
              await job.complete();
              continue;
            }

            await this.handler(job);
            await job.complete();
          } catch (error) {
            await job.retry(error as Error);
          }
        }
      } catch (error) {
        this.logger.warn(
          `[${this.queueName}] Worker ${workerIndex} failed to fetch work`,
          error,
        );
        await sleep(this.pollIntervalMs);
      }
    }

    await worker.close();
  }

  private createWorkerJob<T extends JsonValue = JsonValue>(
    lease: Lease,
  ): QueueWorkerJob<T> {
    let settled = false;

    return {
      ...lease.job,
      payload: lease.job.payload as T,
      complete: async () => {
        if (settled) {
          return;
        }
        settled = true;
        await this.deleteLease(lease);
      },
      retry: async (error: Error) => {
        if (settled) {
          return;
        }
        settled = true;

        const result = await this.handleFailedJob(lease.job, error);
        if (result.shouldRetry) {
          await this.retryLease(lease);
        } else {
          await this.deleteLease(lease);
        }
      },
    };
  }

  private async tryLeaseNextJob(): Promise<Lease | undefined> {
    const now = new Date();
    const leaseExpiresAt = new Date(now.getTime() + this.leaseDurationMs);
    const leaseToken = uuid();

    return this.db.transaction(async trx => {
      let candidateQuery = trx<DatabaseQueueItemRow>(DB_QUEUE_ITEMS_TABLE)
        .select('id', 'payload', 'attempt')
        .where({ queue_name: this.queueName })
        .andWhere('available_at', '<=', now)
        .andWhere(builder =>
          builder
            .whereNull('lease_expires_at')
            .orWhere('lease_expires_at', '<=', now),
        )
        .orderBy('priority', 'asc')
        .orderBy('available_at', 'asc')
        .orderBy('created_at', 'asc')
        .limit(1);

      if (supportsSkipLocked(trx)) {
        candidateQuery = candidateQuery.forUpdate().skipLocked();
      }

      const row = await candidateQuery.first();
      if (!row) {
        return undefined;
      }

      const updatedRows = await trx<DatabaseQueueItemRow>(DB_QUEUE_ITEMS_TABLE)
        .where({ id: row.id, queue_name: this.queueName })
        .andWhere(builder =>
          builder
            .whereNull('lease_expires_at')
            .orWhere('lease_expires_at', '<=', now),
        )
        .update({
          lease_expires_at: leaseExpiresAt,
          lease_token: leaseToken,
          updated_at: now,
        });

      if (updatedRows === 0) {
        return undefined;
      }

      return {
        job: {
          id: row.id,
          payload: deserializePayload(row.payload),
          attempt: row.attempt + 1,
        },
        rowId: row.id,
        leaseToken,
      };
    });
  }

  private async retryLease(lease: Lease): Promise<void> {
    const now = new Date();
    const updatedRows = await this.db<DatabaseQueueItemRow>(
      DB_QUEUE_ITEMS_TABLE,
    )
      .where({
        id: lease.rowId,
        queue_name: this.queueName,
        lease_token: lease.leaseToken,
      })
      .update({
        attempt: lease.job.attempt,
        available_at: new Date(now.getTime() + retryDelayMs(lease.job.attempt)),
        lease_expires_at: null,
        lease_token: null,
        updated_at: now,
      });

    if (updatedRows === 0) {
      this.logger.debug(
        `[${this.queueName}] Retry skipped for job ${lease.job.id} because the lease was lost`,
      );
    }
  }

  private async deleteLease(lease: Lease): Promise<void> {
    const deletedRows = await this.db<DatabaseQueueItemRow>(
      DB_QUEUE_ITEMS_TABLE,
    )
      .where({
        id: lease.rowId,
        queue_name: this.queueName,
        lease_token: lease.leaseToken,
      })
      .delete();

    if (deletedRows === 0) {
      this.logger.debug(
        `[${this.queueName}] Completion skipped for job ${lease.job.id} because the lease was lost`,
      );
    }
  }
}

function supportsSkipLocked(knex: Knex | Knex.Transaction): boolean {
  return ['pg', 'mysql', 'mysql2'].includes(knex.client.config.client);
}

function deserializePayload(payload: JsonValue | string): JsonValue {
  if (typeof payload === 'string') {
    return JSON.parse(payload) as JsonValue;
  }

  return payload;
}

function retryDelayMs(attempt: number): number {
  return Math.min(1000 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
