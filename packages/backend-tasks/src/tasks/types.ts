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

import { Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';
import { z } from 'zod';

/**
 * A function that can be called as a scheduled task.
 *
 * It may optionally accept an abort signal argument. When the signal triggers,
 * processing should abort and return as quickly as possible.
 *
 * @public
 */
export type TaskFunction =
  | ((abortSignal: AbortSignal) => void | Promise<void>)
  | (() => void | Promise<void>);

/**
 * Options that apply to the invocation of a given task.
 *
 * @public
 */
export interface TaskDefinition {
  /**
   * A unique ID (within the scope of the plugin) for the task.
   */
  id: string;

  /**
   * The actual task function to be invoked regularly.
   */
  fn: TaskFunction;

  /**
   * An abort signal that, when triggered, will stop the recurring execution of
   * the task.
   */
  signal?: AbortSignal;

  /**
   * The maximum amount of time that a single task invocation can take, before
   * it's considered timed out and gets "released" such that a new invocation
   * is permitted to take place (possibly, then, on a different worker).
   *
   * If no value is given for this field then there is no timeout. This is
   * potentially dangerous.
   */
  timeout: Duration;

  /**
   * The amount of time that should pass between task invocation starts.
   * Essentially, this equals roughly how often you want the task to run.
   *
   * This is a best effort value; under some circumstances there can be
   * deviations. For example, if the task runtime is longer than the frequency
   * and the timeout has not been given or not been exceeded yet, the next
   * invocation of this task will be delayed until after the previous one
   * finishes.
   *
   * The system does its best to avoid overlapping invocations.
   *
   * If no value is given for this field then the task will only be invoked
   * once (on any worker) and then unscheduled automatically.
   */
  frequency: Duration;

  /**
   * The amount of time that should pass before the first invocation happens.
   *
   * This can be useful in cold start scenarios to stagger or delay some heavy
   * compute jobs.
   *
   * If no value is given for this field then the first invocation will happen
   * as soon as possible.
   */
  initialDelay?: Duration;
}

/**
 * Deals with management and locking related to distributed tasks, for a given
 * plugin.
 *
 * @public
 */
export interface PluginTaskManager {
  /**
   * Schedules a task function for coordinated exclusive invocation across
   * workers.
   *
   * If the task was already scheduled since before by us or by another party,
   * its options are just overwritten with the given options, and things
   * continue from there.
   *
   * @param definition - The task definition
   */
  scheduleTask(task: TaskDefinition): Promise<void>;
}

function isValidOptionalDurationString(d: string | undefined): boolean {
  try {
    return !d || Duration.fromISO(d).isValid === true;
  } catch {
    return false;
  }
}

export const taskSettingsV1Schema = z.object({
  version: z.literal(1),
  initialDelayDuration: z
    .string()
    .optional()
    .refine(isValidOptionalDurationString, { message: 'Invalid duration' }),
  recurringAtMostEveryDuration: z
    .string()
    .refine(isValidOptionalDurationString, { message: 'Invalid duration' }),
  timeoutAfterDuration: z
    .string()
    .refine(isValidOptionalDurationString, { message: 'Invalid duration' }),
});

/**
 * The properties that control a scheduled task (version 1).
 */
export type TaskSettingsV1 = z.infer<typeof taskSettingsV1Schema>;
