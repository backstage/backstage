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
 * Handler function for jobs that have exceeded the maximum number of attempts.
 * This allows custom handling of failed jobs (e.g., logging, alerting, storage).
 *
 * @public
 */
export type DLQHandler = (job: Job, error: Error) => Promise<void>;

/**
 * Store type for the queue service.
 *
 * @public
 */
export type QueueStore = 'memory' | 'redis' | 'kafka' | 'sqs' | 'postgres';

/**
 * Options passed to {@link QueueService.getQueue}.
 *
 * @public
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
 * @public
 */
export type JobOptions = {
  /**
   * Delay in milliseconds before the job is available to be processed.
   */
  delay?: number;
  /**
   * Priority of the job. Lower number means higher priority (like Unix process priorities).
   * Default is 20.
   */
  priority?: number;
};

/**
 * Represents a job in the queue.
 *
 * @public
 */
export interface Job {
  /**
   * Unique identifier for the job.
   */
  id: string;
  /**
   * The payload of the job.
   */
  payload: JsonValue;
  /**
   * The number of times the job has been attempted.
   */
  attempt: number;
}

/**
 * Options passed to {@link Queue.process}.
 *
 * @public
 */
export type ProcessOptions = {
  /**
   * Number of jobs to process concurrently.
   *
   * The default is 1.
   */
  concurrency?: number;
};

/**
 * A queue that can be used to add and process jobs.
 *
 * @public
 */
export interface Queue {
  /**
   * Adds a job to the queue.
   */
  add(payload: JsonValue, options?: JobOptions): Promise<void>;

  /**
   * Starts processing jobs depending on the queue implementation.
   *
   * Throwing an error from the process function will automatically retry
   * the processing after backoff period maximum of config `backend.queue.maxAttempts`
   * of times (default 5).
   *
   * @param handler - Function to process each job
   * @param options - Processing options including concurrency control
   */
  process(handler: (job: Job) => Promise<void>, options?: ProcessOptions): void;

  /**
   * Returns the number of jobs in the queue (waiting + active).
   */
  getJobCount(): Promise<number>;

  /**
   * Pauses the queue. Workers will stop picking up new jobs.
   */
  pause(): Promise<void>;

  /**
   * Resumes the queue. Workers will start picking up jobs again.
   */
  resume(): Promise<void>;

  /**
   * Disconnects from the queue backend and cleans up resources.
   * This does NOT delete the jobs in the queue.
   */
  disconnect(): Promise<void>;
}

/**
 * A service for creating and retrieving queues.
 *
 * @public
 */
export interface QueueService {
  /**
   * Returns a queue with the given name. A new queue will be
   * created in case it doesn't exist.
   */
  getQueue(name: string, options?: QueueOptions): Promise<Queue>;
}
