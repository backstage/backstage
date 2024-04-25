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

import {
  SchedulerServiceTaskDescriptor,
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { CronTime } from 'cron';
import { Duration } from 'luxon';
import { z } from 'zod';

/**
 * Deals with the scheduling of distributed tasks, for a given plugin.
 */
export interface PluginTaskScheduler {
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

function isValidOptionalDurationString(d: string | undefined): boolean {
  try {
    return !d || Duration.fromISO(d).isValid;
  } catch {
    return false;
  }
}

function isValidCronFormat(c: string | undefined): boolean {
  try {
    if (!c) {
      return false;
    }
    // parse cron format to ensure it's a valid format.
    // eslint-disable-next-line no-new
    new CronTime(c);
    return true;
  } catch {
    return false;
  }
}

export const taskSettingsV1Schema = z.object({
  version: z.literal(1),
  initialDelayDuration: z
    .string()
    .optional()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
  recurringAtMostEveryDuration: z
    .string()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
  timeoutAfterDuration: z.string().refine(isValidOptionalDurationString, {
    message: 'Invalid duration, expecting ISO Period',
  }),
});

/**
 * The properties that control a scheduled task (version 1).
 */
export type TaskSettingsV1 = z.infer<typeof taskSettingsV1Schema>;

export const taskSettingsV2Schema = z.object({
  version: z.literal(2),
  cadence: z
    .string()
    .refine(isValidCronFormat, { message: 'Invalid cron' })
    .or(
      z.string().refine(isValidOptionalDurationString, {
        message: 'Invalid duration, expecting ISO Period',
      }),
    ),
  timeoutAfterDuration: z.string().refine(isValidOptionalDurationString, {
    message: 'Invalid duration, expecting ISO Period',
  }),
  initialDelayDuration: z
    .string()
    .optional()
    .refine(isValidOptionalDurationString, {
      message: 'Invalid duration, expecting ISO Period',
    }),
});

/**
 * The properties that control a scheduled task (version 2).
 */
export type TaskSettingsV2 = z.infer<typeof taskSettingsV2Schema>;
