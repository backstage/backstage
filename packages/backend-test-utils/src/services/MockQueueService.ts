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
  coreServices,
  createServiceFactory,
  DLQHandler,
  Job,
  JobOptions,
  ProcessOptions,
  Queue,
  QueueOptions,
  QueueService,
} from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';

/**
 * Mock implementation of a Queue for testing purposes.
 *
 * @remarks
 *
 * This mock queue processes jobs synchronously in-memory without any external
 * dependencies. It supports all Queue interface methods including pause/resume,
 * job counting, and disconnection.
 *
 * @public
 */
export class MockQueue implements Queue {
  private jobs: Array<{
    id: string;
    payload: JsonValue;
    attempt: number;
    options?: JobOptions;
    priority?: number;
    availableAt?: number;
  }> = [];
  private readonly activeJobs = new Set<string>();
  private nextJobId = 1;
  private handler?: (job: Job) => Promise<void>;
  private isPaused = false;
  private isDisconnected = false;
  private readonly maxAttempts: number;
  private readonly dlqHandler?: DLQHandler;
  private concurrency: number = 1;
  private activeProcessingCount: number = 0;

  constructor(options?: QueueOptions & { maxAttempts?: number }) {
    this.maxAttempts = options?.maxAttempts ?? 5;
    this.dlqHandler = options?.dlqHandler;
  }

  async add(payload: JsonValue, options?: JobOptions): Promise<void> {
    if (this.isDisconnected) {
      throw new Error('Queue is disconnected');
    }

    const job = {
      id: `job-${this.nextJobId++}`,
      payload,
      attempt: 0,
      options,
      priority: options?.priority ?? 20,
      availableAt: options?.delay ? Date.now() + options.delay : Date.now(),
    };

    this.jobs.push(job);
    this.sortJobs();

    if (this.handler && !this.isPaused) {
      await this.processNextJob();
    }
  }

  process(
    handler: (job: Job) => Promise<void>,
    options?: ProcessOptions,
  ): void {
    if (this.handler) {
      throw new Error('Handler already set for this queue');
    }
    this.handler = handler;
    this.concurrency = options?.concurrency ?? 1;

    if (!this.isPaused) {
      void this.processAllJobs();
    }
  }

  private sortJobs() {
    this.jobs.sort((a, b) => {
      if (a.availableAt !== b.availableAt) {
        return (a.availableAt ?? 0) - (b.availableAt ?? 0);
      }
      return (a.priority ?? 20) - (b.priority ?? 20);
    });
  }

  private async processNextJob(): Promise<void> {
    if (this.isPaused || this.isDisconnected || !this.handler) {
      return;
    }

    if (this.activeProcessingCount >= this.concurrency) {
      return;
    }

    const now = Date.now();
    const jobIndex = this.jobs.findIndex(j => (j.availableAt ?? 0) <= now);

    if (jobIndex === -1) {
      return;
    }

    const [jobData] = this.jobs.splice(jobIndex, 1);

    this.activeJobs.add(jobData.id);
    this.activeProcessingCount++;
    jobData.attempt++;

    try {
      const job: Job = {
        id: jobData.id,
        payload: jobData.payload,
        attempt: jobData.attempt,
      };
      await this.handler(job);
    } catch (error) {
      if (jobData.attempt < this.maxAttempts) {
        this.jobs.push(jobData);
        this.sortJobs();
        if (!this.isPaused && !this.isDisconnected) {
          void this.processAllJobs();
        }
      } else if (this.dlqHandler) {
        try {
          const job: Job = {
            id: jobData.id,
            payload: jobData.payload,
            attempt: jobData.attempt,
          };
          await this.dlqHandler(job, error as Error);
        } catch {
          // NOOP
        }
      }
    } finally {
      this.activeJobs.delete(jobData.id);
      this.activeProcessingCount--;
    }
  }

  private async processAllJobs(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.concurrency; i++) {
      if (this.jobs.length > 0) {
        promises.push(this.processNextJob());
      }
    }

    await Promise.all(promises);

    if (this.jobs.length > 0 && !this.isPaused && !this.isDisconnected) {
      await this.processAllJobs();
    }
  }

  async getJobCount(): Promise<number> {
    return this.jobs.length + this.activeJobs.size;
  }

  async pause(): Promise<void> {
    this.isPaused = true;
  }

  async resume(): Promise<void> {
    this.isPaused = false;
    if (this.handler) {
      await this.processAllJobs();
    }
  }

  async disconnect(): Promise<void> {
    this.isDisconnected = true;
    this.jobs = [];
    this.activeJobs.clear();
    this.handler = undefined;
  }

  /**
   * Test helper to check if the queue is paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Test helper to get all pending jobs
   */
  getPendingJobs(): ReadonlyArray<{
    id: string;
    payload: JsonValue;
    attempt: number;
  }> {
    return [...this.jobs];
  }

  /**
   * Test helper to get active job IDs
   */
  getActiveJobIds(): ReadonlyArray<string> {
    return Array.from(this.activeJobs);
  }
}

/**
 * Mock implementation of QueueService for testing purposes.
 *
 * @remarks
 *
 * This mock service creates in-memory queues that process jobs synchronously
 * without any external dependencies. It's suitable for unit and integration
 * testing.
 *
 * @example
 * Basic usage in tests:
 * ```ts
 * const queueService = mockServices.queue();
 * const queue = await queueService.getQueue('test-queue');
 *
 * const handler = jest.fn();
 * queue.process(handler);
 *
 * await queue.add({ message: 'test' });
 * // Handler will be called synchronously
 * ```
 *
 * @example
 * Using with test backend:
 * ```ts
 * await startTestBackend({
 *   features: [
 *     mockServices.queue.factory(),
 *     myPlugin,
 *   ],
 * });
 * ```
 *
 * @public
 */
export class MockQueueService implements QueueService {
  private queues = new Map<string, MockQueue>();

  async getQueue(name: string, options?: QueueOptions): Promise<Queue> {
    let queue = this.queues.get(name);
    if (!queue) {
      queue = new MockQueue({
        dlqHandler: options?.dlqHandler,
      });
      this.queues.set(name, queue);
    }
    return queue;
  }

  /**
   * Creates a service factory for this mock queue service instance, which can be installed in a test backend
   */
  factory() {
    return createServiceFactory({
      service: coreServices.queue,
      deps: {},
      factory: async () => this,
    });
  }

  /**
   * Test helper to get a specific queue by name if it exists
   */
  getExistingQueue(name: string): MockQueue | undefined {
    return this.queues.get(name);
  }

  /**
   * Test helper to get all queue names
   */
  getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }

  /**
   * Test helper to clear all queues
   */
  async clearAllQueues(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.disconnect();
    }
    this.queues.clear();
  }
}
