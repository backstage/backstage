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

import { Config, readDurationFromConfig } from '@backstage/config';
import { HumanDuration, JsonObject } from '@backstage/types';
import { Duration } from 'luxon';

/**
 * A function that can be called as a scheduled task.
 *
 * It may optionally accept an abort signal argument. When the signal triggers,
 * processing should abort and return as quickly as possible.
 *
 * @public
 */
export type SchedulerServiceTaskFunction =
  | ((abortSignal: AbortSignal) => void | Promise<void>)
  | (() => void | Promise<void>);

/**
 * A semi-opaque type to describe an actively scheduled task.
 *
 * @public
 */
export type SchedulerServiceTaskDescriptor = {
  /**
   * The unique identifier of the task.
   */
  id: string;
  /**
   * The scope of the task.
   */
  scope: 'global' | 'local';
  /**
   * The settings that control the task flow. This is a semi-opaque structure
   * that is mainly there for debugging purposes. Do not make any assumptions
   * about the contents of this field.
   */
  settings: { version: number } & JsonObject;
};

/**
 * Options that control the scheduling of a task.
 *
 * @public
 */
export interface SchedulerServiceTaskScheduleDefinition {
  /**
   * How often you want the task to run. The system does its best to avoid
   * overlapping invocations.
   *
   * @remarks
   *
   * This is the best effort value; under some circumstances there can be
   * deviations. For example, if the task runtime is longer than the frequency
   * and the timeout has not been given or not been exceeded yet, the next
   * invocation of this task will be delayed until after the previous one
   * finishes.
   *
   * This is a required field.
   */
  frequency:
    | {
        /**
         * A crontab style string.
         *
         * @remarks
         *
         * Overview:
         *
         * ```
         *   ┌────────────── second (optional)
         *   │ ┌──────────── minute
         *   │ │ ┌────────── hour
         *   │ │ │ ┌──────── day of month
         *   │ │ │ │ ┌────── month
         *   │ │ │ │ │ ┌──── day of week
         *   │ │ │ │ │ │
         *   │ │ │ │ │ │
         *   * * * * * *
         * ```
         */
        cron: string;
      }
    | Duration
    | HumanDuration;

  /**
   * The maximum amount of time that a single task invocation can take, before
   * it's considered timed out and gets "released" such that a new invocation
   * is permitted to take place (possibly, then, on a different worker).
   */
  timeout: Duration | HumanDuration;

  /**
   * The amount of time that should pass before the first invocation happens.
   *
   * @remarks
   *
   * This can be useful in cold start scenarios to stagger or delay some heavy
   * compute jobs. If no value is given for this field then the first invocation
   * will happen as soon as possible according to the cadence.
   *
   * NOTE: This is a per-worker delay. If you have a cluster of workers all
   * collaborating on a task that has its `scope` field set to `'global'`, then
   * you may still see the task being processed by other long-lived workers,
   * while any given single worker is in its initial sleep delay time e.g. after
   * a deployment. Therefore, this parameter is not useful for "globally" pausing
   * work; its main intended use is for individual machines to get a chance to
   * reach some equilibrium at startup before triggering heavy batch workloads.
   */
  initialDelay?: Duration | HumanDuration;

  /**
   * Sets the scope of concurrency control / locking to apply for invocations of
   * this task.
   *
   * @remarks
   *
   * When the scope is set to the default value `'global'`, the scheduler will
   * attempt to ensure that only one worker machine runs the task at a time,
   * according to the given cadence. This means that as the number of worker
   * hosts increases, the invocation frequency of this task will not go up.
   * Instead, the load is spread randomly across hosts. This setting is useful
   * for tasks that access shared resources, for example catalog ingestion tasks
   * where you do not want many machines to repeatedly import the same data and
   * trample over each other.
   *
   * When the scope is set to `'local'`, there is no concurrency control across
   * hosts. Each host runs the task according to the given cadence similarly to
   * `setInterval`, but the runtime ensures that there are no overlapping runs.
   *
   * @defaultValue 'global'
   */
  scope?: 'global' | 'local';
}

/**
 * Config options for {@link SchedulerServiceTaskScheduleDefinition}
 * that control the scheduling of a task.
 *
 * @public
 */
export interface SchedulerServiceTaskScheduleDefinitionConfig {
  /**
   * How often you want the task to run. The system does its best to avoid
   * overlapping invocations.
   *
   * @remarks
   *
   * This is the best effort value; under some circumstances there can be
   * deviations. For example, if the task runtime is longer than the frequency
   * and the timeout has not been given or not been exceeded yet, the next
   * invocation of this task will be delayed until after the previous one
   * finishes.
   *
   * This is a required field.
   */
  frequency:
    | {
        /**
         * A crontab style string.
         *
         * @remarks
         *
         * Overview:
         *
         * ```
         *   ┌────────────── second (optional)
         *   │ ┌──────────── minute
         *   │ │ ┌────────── hour
         *   │ │ │ ┌──────── day of month
         *   │ │ │ │ ┌────── month
         *   │ │ │ │ │ ┌──── day of week
         *   │ │ │ │ │ │
         *   │ │ │ │ │ │
         *   * * * * * *
         * ```
         */
        cron: string;
      }
    | string
    | HumanDuration;

  /**
   * The maximum amount of time that a single task invocation can take, before
   * it's considered timed out and gets "released" such that a new invocation
   * is permitted to take place (possibly, then, on a different worker).
   */
  timeout: string | HumanDuration;

  /**
   * The amount of time that should pass before the first invocation happens.
   *
   * @remarks
   *
   * This can be useful in cold start scenarios to stagger or delay some heavy
   * compute jobs. If no value is given for this field then the first invocation
   * will happen as soon as possible according to the cadence.
   *
   * NOTE: This is a per-worker delay. If you have a cluster of workers all
   * collaborating on a task that has its `scope` field set to `'global'`, then
   * you may still see the task being processed by other long-lived workers,
   * while any given single worker is in its initial sleep delay time e.g. after
   * a deployment. Therefore, this parameter is not useful for "globally" pausing
   * work; its main intended use is for individual machines to get a chance to
   * reach some equilibrium at startup before triggering heavy batch workloads.
   */
  initialDelay?: string | HumanDuration;

  /**
   * Sets the scope of concurrency control / locking to apply for invocations of
   * this task.
   *
   * @remarks
   *
   * When the scope is set to the default value `'global'`, the scheduler will
   * attempt to ensure that only one worker machine runs the task at a time,
   * according to the given cadence. This means that as the number of worker
   * hosts increases, the invocation frequency of this task will not go up.
   * Instead, the load is spread randomly across hosts. This setting is useful
   * for tasks that access shared resources, for example catalog ingestion tasks
   * where you do not want many machines to repeatedly import the same data and
   * trample over each other.
   *
   * When the scope is set to `'local'`, there is no concurrency control across
   * hosts. Each host runs the task according to the given cadence similarly to
   * `setInterval`, but the runtime ensures that there are no overlapping runs.
   *
   * @defaultValue 'global'
   */
  scope?: 'global' | 'local';
}

/**
 * Options that apply to the invocation of a given task.
 *
 * @public
 */
export interface SchedulerServiceTaskInvocationDefinition {
  /**
   * A unique ID (within the scope of the plugin) for the task.
   */
  id: string;

  /**
   * The actual task function to be invoked regularly.
   */
  fn: SchedulerServiceTaskFunction;

  /**
   * An abort signal that, when triggered, will stop the recurring execution of
   * the task.
   */
  signal?: AbortSignal;
}

/**
 * A previously prepared task schedule, ready to be invoked.
 *
 * @public
 */
export interface SchedulerServiceTaskRunner {
  /**
   * Takes the schedule and executes an actual task using it.
   *
   * @param task - The actual runtime properties of the task
   */
  run(task: SchedulerServiceTaskInvocationDefinition): Promise<void>;
}

/**
 * Deals with the scheduling of distributed tasks, for a given plugin.
 *
 * @public
 */
export interface SchedulerService {
  /**
   * Manually triggers a task by ID.
   *
   * If the task doesn't exist, a NotFoundError is thrown. If the task is
   * currently running, a ConflictError is thrown.
   *
   * @param id - The task ID
   */
  triggerTask(id: string): Promise<void>;

  /**
   * Schedules a task function for recurring runs.
   *
   * @remarks
   *
   * The `scope` task field controls whether to use coordinated exclusive
   * invocation across workers, or to just coordinate within the current worker.
   *
   * This convenience method performs both the scheduling and invocation in one
   * go.
   *
   * @param task - The task definition
   */
  scheduleTask(
    task: SchedulerServiceTaskScheduleDefinition &
      SchedulerServiceTaskInvocationDefinition,
  ): Promise<void>;

  /**
   * Creates a scheduled but dormant recurring task, ready to be launched at a
   * later time.
   *
   * @remarks
   *
   * This method is useful for pre-creating a schedule in outer code to be
   * passed into an inner implementation, such that the outer code controls
   * scheduling while inner code controls implementation.
   *
   * @param schedule - The task schedule
   */
  createScheduledTaskRunner(
    schedule: SchedulerServiceTaskScheduleDefinition,
  ): SchedulerServiceTaskRunner;

  /**
   * Returns all scheduled tasks registered to this scheduler.
   *
   * @remarks
   *
   * This method is useful for triggering tasks manually using the triggerTask
   * functionality. Note that the returned tasks contain only tasks that have
   * been initialized in this instance of the scheduler.
   *
   * @returns Scheduled tasks
   */
  getScheduledTasks(): Promise<SchedulerServiceTaskDescriptor[]>;
}

function readDuration(config: Config, key: string): Duration | HumanDuration {
  if (typeof config.get(key) === 'string') {
    const value = config.getString(key);
    const duration = Duration.fromISO(value);
    if (!duration.isValid) {
      throw new Error(`Invalid duration: ${value}`);
    }
    return duration;
  }

  return readDurationFromConfig(config, { key });
}

function readCronOrDuration(
  config: Config,
  key: string,
): { cron: string } | Duration | HumanDuration {
  const value = config.get(key);
  if (typeof value === 'object' && (value as { cron?: string }).cron) {
    return value as { cron: string };
  }

  return readDuration(config, key);
}

/**
 * Reads a {@link SchedulerServiceTaskScheduleDefinition} from config. Expects
 * the config not to be the root config, but the config for the definition.
 *
 * @param config - config for a TaskScheduleDefinition.
 * @public
 */
export function readSchedulerServiceTaskScheduleDefinitionFromConfig(
  config: Config,
): SchedulerServiceTaskScheduleDefinition {
  const frequency = readCronOrDuration(config, 'frequency');
  const timeout = readDuration(config, 'timeout');

  const initialDelay = config.has('initialDelay')
    ? readDuration(config, 'initialDelay')
    : undefined;

  const scope = config.getOptionalString('scope');
  if (scope && !['global', 'local'].includes(scope)) {
    throw new Error(
      `Only "global" or "local" are allowed for TaskScheduleDefinition.scope, but got: ${scope}`,
    );
  }

  return {
    frequency,
    timeout,
    initialDelay,
    scope: scope as 'global' | 'local' | undefined,
  };
}
