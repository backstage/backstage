/*
 * Copyright 2024 The Backstage Authors
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
import { z } from 'zod';

const cursorSchema = z.object({
  version: z.literal(1),
  afterEventId: z.string().optional(),
  entityRef: z.string().optional(),
  entityId: z.string().optional(),
  order: z.enum(['asc', 'desc']),
  limit: z.number().positive().int(),
  block: z.boolean(),
});

export type Cursor = z.TypeOf<typeof cursorSchema>;

export function parseCursor(cursor: string): Cursor {
  try {
    return cursorSchema.parse(
      JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')),
    );
  } catch {
    throw new InputError('Invalid cursor');
  }
}

export function stringifyCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf-8').toString('base64url');
}
