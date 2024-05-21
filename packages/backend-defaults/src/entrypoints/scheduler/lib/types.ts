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

import { CronTime } from 'cron';
import { Duration } from 'luxon';
import { z } from 'zod';

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
