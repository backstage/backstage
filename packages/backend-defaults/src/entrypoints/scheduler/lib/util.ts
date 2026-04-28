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
  InputError,
  serializeError as internalSerializeError,
} from '@backstage/errors';
import { Knex } from 'knex';
import { DateTime, Duration } from 'luxon';

export const TRACER_ID = 'backstage-service-scheduler';

// Keep the IDs compatible with e.g. Prometheus labels
export function validateId(id: string) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new InputError(`${id} is not a valid ID, expected non-empty string`);
  }
}

export function dbTime(t: Date | string): DateTime {
  if (typeof t === 'string') {
    return DateTime.fromSQL(t);
  }
  return DateTime.fromJSDate(t);
}

export function nowPlus(duration: Duration | undefined, knex: Knex) {
  const seconds = duration?.as('seconds') ?? 0;
  if (!seconds) {
    return knex.fn.now();
  }

  if (knex.client.config.client.includes('sqlite3')) {
    return knex.raw(`datetime('now', ?)`, [`${seconds} seconds`]);
  }

  if (knex.client.config.client.includes('mysql')) {
    return knex.raw(`now() + interval ${seconds} second`);
  }

  return knex.raw(`now() + interval '${seconds} seconds'`);
}

// Node.js setTimeout uses a 32-bit signed integer internally, so timeouts
// longer than 2^31-1 ms (~24.8 days) fire immediately. We cap each individual
// wait at 2^30 ms (~12.4 days) and loop until the full duration has elapsed.
const MAX_TIMEOUT_MS = 2 ** 30;

/**
 * Sleep for the given duration, but return sooner if the abort signal
 * triggers.
 *
 * @param duration - The amount of time to sleep, at most
 * @param abortSignal - An optional abort signal that short circuits the wait
 */
export async function sleep(
  duration: Duration,
  abortSignal?: AbortSignal,
): Promise<void> {
  if (abortSignal?.aborted) {
    return;
  }

  let remaining = duration.as('milliseconds');
  if (!Number.isFinite(remaining) || remaining <= 0) {
    return;
  }

  await new Promise<void>(resolve => {
    let timeoutHandle: NodeJS.Timeout | undefined;

    const finish = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      abortSignal?.removeEventListener('abort', finish);
      resolve();
    };

    const tick = () => {
      if (remaining <= 0) {
        finish();
        return;
      }
      const chunk = Math.min(remaining, MAX_TIMEOUT_MS);
      remaining -= chunk;
      timeoutHandle = setTimeout(tick, chunk);
    };

    abortSignal?.addEventListener('abort', finish);
    tick();
  });
}

/**
 * Creates a new AbortController that, in addition to working as a regular
 * standalone controller, also gets aborted if the given parent signal
 * reaches aborted state.
 *
 * @param parent - The "parent" signal that can trigger the delegate
 */
export function delegateAbortController(parent?: AbortSignal): AbortController {
  const delegate = new AbortController();

  if (parent) {
    if (parent.aborted) {
      delegate.abort();
    } else {
      const onParentAborted = () => {
        delegate.abort();
      };

      const onChildAborted = () => {
        parent.removeEventListener('abort', onParentAborted);
      };

      parent.addEventListener('abort', onParentAborted, { once: true });
      delegate.signal.addEventListener('abort', onChildAborted, { once: true });
    }
  }

  return delegate;
}

export function serializeError(error: Error): string {
  return JSON.stringify(
    internalSerializeError(error, {
      includeStack: process.env.NODE_ENV === 'development',
    }),
  );
}
