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

import { JsonValue } from '@backstage/types';

/**
 * Handler for jobs that have exceeded the maximum number of attempts.
 *
 * @alpha
 */
export type DLQHandler = (job: Job, error: Error) => Promise<void>;

/**
 * Store type for the queue service.
 *
 * @alpha
 */
export type QueueStore = 'database' | 'memory' | 'redis' | 'kafka' | 'sqs';

/**
 * Options passed to {@link QueueService.getQueue}.
 *
 * @alpha
 */
export type QueueOptions = {
  /**
   * Handler for jobs that have exceeded the maximum number of attempts.
   * If not provided, failed jobs will be logged and discarded.
   */
  dlqHandler?: DLQHandler;
  /**
   * Store type for the queue. If not specified, the default store from configuration
   * will be used.
   */
  store?: QueueStore;
};

/**
 * Options passed to {@link Queue.add}.
 *
 * @alpha
 */
export type JobOptions = {
  /**
   * Delay in milliseconds before the job is available to be processed.
   */
  delay?: number;
  /**
   * Priority of the job. Lower number means higher priority.
   * Default is 20.
   */
  priority?: number;
};

/**
 * Represents a job in the queue.
 *
 * @alpha
 */
export interface Job<T extends JsonValue = JsonValue> {
  /**
   * Unique identifier for the job.
   */
  id: string;
  /**
   * The payload of the job.
   */
  payload: T;
  /**
   * The number of times the job has been attempted.
   */
  attempt: number;
}

/**
 * A claimed queue job with explicit completion control.
 *
 * @alpha
 */
export interface QueueWorkerJob<T extends JsonValue = JsonValue>
  extends Job<T> {
  /**
   * Marks the job as successfully processed.
   */
  complete(): Promise<void>;

  /**
   * Marks the job as failed, triggering retry or DLQ handling.
   */
  retry(error: Error): Promise<void>;
}

/**
 * Handler invoked for each claimed queue job.
 *
 * @alpha
 */
export type ProcessHandler<T extends JsonValue = JsonValue> = (
  job: Job<T>,
) => Promise<void>;

/**
 * Internal process invocation shape shared by queue implementations.
 *
 * @alpha
 */
export type ProcessInput<T extends JsonValue = JsonValue> =
  | ProcessHandler<T>
  | ProcessOptions;

/**
 * Options passed to queue processing.
 *
 * @alpha
 */
export type ProcessOptions = {
  /**
   * Number of jobs to process concurrently.
   *
   * The default is 1.
   */
  concurrency?: number;
  /**
   * Maximum number of jobs to claim in each lower-level worker poll.
   *
   * The default is 1.
   */
  batchSize?: number;
};

/**
 * Lower-level stateful worker API for advanced queue consumers.
 *
 * @alpha
 */
export interface QueueWorker<T extends JsonValue = JsonValue> {
  /**
   * Claims the next batch of jobs.
   *
   * Returns `undefined` when the worker has been closed.
   */
  next(): Promise<QueueWorkerJob<T>[] | undefined>;

  /**
   * Closes the worker and stops further claims.
   */
  close(): Promise<void>;
}

/**
 * A queue that can be used to add and process jobs.
 *
 * @alpha
 */
export interface Queue<T extends JsonValue = JsonValue> {
  /**
   * Adds a job to the queue.
   */
  add(payload: T, options?: JobOptions): Promise<void>;

  /**
   * Starts processing jobs depending on the queue implementation.
   *
   * Throwing an error from the process function will automatically retry
   * the processing after a backoff period up to the configured maximum number
   * of attempts.
   *
   * @param handler - Function to process each job
   * @param options - Processing options including concurrency control
   */
  process(handler: ProcessHandler<T>, options?: ProcessOptions): QueueWorker<T>;

  /**
   * Creates a lower-level worker for direct batch-based queue processing.
   */
  process(options?: ProcessOptions): QueueWorker<T>;

  /**
   * Returns a backend-specific count of queued work.
   *
   * The exact semantics depend on the queue implementation. Some backends
   * include actively processing jobs, while others report queue depth or lag
   * using the underlying backend's native capabilities.
   */
  getJobCount(): Promise<number>;

  /**
   * Disconnects from the queue backend and cleans up resources.
   * This does NOT delete the jobs in the queue.
   */
  disconnect(): Promise<void>;
}

/**
 * A service for creating and retrieving queues.
 *
 * @alpha
 */
export interface QueueService {
  /**
   * Returns a queue with the given name. A new queue will be
   * created in case it doesn't exist.
   */
  getQueue<T extends JsonValue = JsonValue>(
    name: string,
    options?: QueueOptions,
  ): Promise<Queue<T>>;
}
