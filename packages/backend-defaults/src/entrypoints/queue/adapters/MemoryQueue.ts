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
import { BaseQueue, BaseQueueOptions } from './BaseQueue';

type QueueItem = {
  job: Job;
  priority: number;
  runAt: number;
};

export type MemoryQueueOptions = BaseQueueOptions & {
  interval?: number;
};

/**
 * Queue implementation for local memory queue.
 *
 * @internal
 */
export class MemoryQueue extends BaseQueue {
  private readonly items: QueueItem[] = [];
  private readonly activeJobs = new Set<string>();

  private processLoopActive: boolean = false;
  private readonly interval: number;
  private processLoopPromise?: Promise<void>;
  private concurrency: number = 1;

  constructor(options: MemoryQueueOptions) {
    super(options);
    this.interval = options?.interval ?? 50;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    const id = uuid();
    const job: Job = {
      id,
      payload,
      attempt: 0,
    };

    const priority = options?.priority ?? 20;
    const delay = options?.delay ?? 0;
    const runAt = Date.now() + delay;

    this.items.push({ job, priority, runAt });
    this.sortItems();
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
    this.startLoop();
    return processing.worker;
  }

  async getJobCount(): Promise<number> {
    return this.items.length + this.activeJobs.size;
  }

  protected async onDisconnect(): Promise<void> {
    await this.waitForPromisesToSettle(
      this.processLoopPromise ? [this.processLoopPromise] : [],
      {
        timeoutMessage: 'Timed out waiting for process loop to complete',
      },
    );

    await this.waitForActiveProcessingToComplete({ pollIntervalMs: 50 });
  }

  private sortItems() {
    this.items.sort((a, b) => {
      if (a.runAt !== b.runAt) {
        return a.runAt - b.runAt;
      }
      return a.priority - b.priority;
    });
  }

  private startLoop() {
    if (this.processLoopActive) return;
    this.processLoopActive = true;

    this.processLoopPromise = (async () => {
      try {
        while (!this.isDisconnecting) {
          if (this.items.length === 0 || !this.handler) {
            await new Promise(resolve => setTimeout(resolve, this.interval));
            continue;
          }

          while (
            this.activeProcessingCount < this.concurrency &&
            this.items.length > 0 &&
            !this.isDisconnecting
          ) {
            const now = Date.now();
            const candidateIndex = this.items.findIndex(i => i.runAt <= now);

            if (candidateIndex === -1) {
              break;
            }

            const [item] = this.items.splice(candidateIndex, 1);
            this.activeJobs.add(item.job.id);
            this.activeProcessingCount++;

            this.processJob(item).finally(() => {
              this.activeJobs.delete(item.job.id);
              this.activeProcessingCount--;
            });
          }

          await new Promise(resolve => setTimeout(resolve, this.interval));
        }
      } finally {
        this.processLoopActive = false;
        this.processLoopPromise = undefined;
      }
    })();
  }

  private async processJob(item: QueueItem): Promise<void> {
    item.job.attempt++;

    try {
      if (this.handler) {
        await this.handler(item.job);
      }
    } catch (error) {
      const result = await this.handleFailedJob(item.job, error);

      if (result.shouldRetry) {
        const backoffDelay = 1000 * Math.pow(2, item.job.attempt - 1);
        item.runAt = Date.now() + backoffDelay;
        this.items.push(item);
        this.sortItems();
      }
    }
  }
}
