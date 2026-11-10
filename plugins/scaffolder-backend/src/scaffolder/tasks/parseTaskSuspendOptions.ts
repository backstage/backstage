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

import { InputError } from '@backstage/errors';
import { TaskSuspendOptions } from '@backstage/plugin-scaffolder-node';
import { JsonValue } from '@backstage/types';
import { Duration } from 'luxon';
import { z } from 'zod/v3';

const jsonValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(jsonValue),
  ]),
);

export const taskSuspendOptionsSchema = z
  .object({
    key: z.string().min(1).max(255),
    reason: z.string().max(1024).optional(),
    resumeOn: z
      .array(
        z.discriminatedUnion('type', [
          z
            .object({
              id: z.string().min(1).max(255),
              type: z.literal('manual'),
              principals: z.array(z.string().min(1)).min(1).optional(),
            })
            .strict(),
          z
            .object({
              id: z.string().min(1).max(255),
              type: z.literal('event'),
              topic: z.string().min(1).max(255),
              match: z.record(jsonValue),
            })
            .strict(),
        ]),
      )
      .min(1)
      .max(16),
    timeout: z
      .object({
        days: z.number().nonnegative().optional(),
        hours: z.number().nonnegative().optional(),
        minutes: z.number().nonnegative().optional(),
        seconds: z.number().nonnegative().optional(),
        milliseconds: z.number().nonnegative().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export function parseTaskSuspendOptions(input: unknown): TaskSuspendOptions {
  const parsed = taskSuspendOptionsSchema.safeParse(input);
  if (!parsed.success)
    throw new InputError(`Invalid suspension: ${parsed.error.message}`);
  const options = parsed.data;
  if (
    new Set(options.resumeOn.map(t => t.id)).size !== options.resumeOn.length
  ) {
    throw new InputError('Suspension trigger IDs must be unique');
  }
  if (
    options.timeout &&
    !(Duration.fromObject(options.timeout).toMillis() > 0)
  ) {
    throw new InputError('Suspension timeout must be positive');
  }
  if (JSON.stringify(options).length > 65536)
    throw new InputError('Suspension exceeds the maximum serialized length');
  return options;
}
