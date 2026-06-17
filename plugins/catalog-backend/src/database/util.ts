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

import { Entity } from '@backstage/catalog-model';
import { ErrorLike, isError } from '@backstage/errors';
import stableStringify from 'fast-json-stable-stringify';
import { Knex } from 'knex';
import { createHash } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';

export function generateStableHash(entity: Entity) {
  return createHash('sha1')
    .update(stableStringify({ ...entity }))
    .digest('hex');
}

export function generateTargetKey(target: string) {
  return target.length > 255
    ? `${target.slice(0, 180)}#sha256:${createHash('sha256')
        .update(target)
        .digest('hex')}`
    : target;
}

/**
 * Retries an operation on database deadlock errors.
 */
export async function retryOnDeadlock<T>(
  fn: () => Promise<T>,
  knex: Knex | Knex.Transaction,
  retries = 3,
  baseMs = 25,
): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (e: unknown) {
      if (isDeadlockError(knex, e) && attempt < retries) {
        await sleep(baseMs * Math.pow(2, attempt));
        attempt++;
        continue;
      }
      throw e;
    }
  }
}

/**
 * Checks if the given error is a deadlock error for the database engine in use.
 */
function isDeadlockError(
  knex: Knex | Knex.Transaction,
  e: unknown,
): e is ErrorLike {
  if (knex.client.config.client.includes('pg')) {
    // PostgreSQL deadlock detection via error code
    return isError(e) && e.code === '40P01';
  }

  // Add more database engine checks here as needed
  return false;
}
