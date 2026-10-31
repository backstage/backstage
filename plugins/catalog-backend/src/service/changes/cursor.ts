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
import { z } from 'zod/v3';

const cursorSchema = z.object({
  v: z.literal(1),
  afterGeneration: z.string().regex(/^\d+$/),
  scope: z.array(z.string()).optional(),
  limit: z.number().int().positive(),
  block: z.boolean(),
});

/**
 * The state of a stateless read of entity changes, which a client passes back
 * to continue reading.
 */
export type EntityChangesCursor = Omit<z.infer<typeof cursorSchema>, 'v'>;

export function encodeEntityChangesCursor(cursor: EntityChangesCursor): string {
  return Buffer.from(JSON.stringify({ v: 1, ...cursor }), 'utf8').toString(
    'base64url',
  );
}

export function decodeEntityChangesCursor(value: string): EntityChangesCursor {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch {
    throw new InputError('Malformed cursor');
  }
  const result = cursorSchema.safeParse(parsed);
  if (!result.success) {
    throw new InputError('Malformed cursor');
  }
  const { v: _, ...cursor } = result.data;
  return cursor;
}
