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

import { ConflictError, InputError } from '@backstage/errors';
import { DateTime } from 'luxon';

/**
 * Takes a TIMESTAMP type column and converts it to a DateTime.
 *
 * Some engines return the SQL string form (e.g. 'YYYY-MM-DD hh:mm:ss'), some
 * return ISO string form (e.g. 'YYYY-MM-DDThh:mm:ss.SSSZ'), some return a js
 * Date object.
 */
export function timestampToDateTime(input: Date | string): DateTime {
  try {
    if (typeof input === 'object') {
      return DateTime.fromJSDate(input).toUTC();
    }

    const result = input.includes(' ')
      ? DateTime.fromSQL(input, { zone: 'utc' })
      : DateTime.fromISO(input, { zone: 'utc' });
    if (!result.isValid) {
      throw new TypeError('Not valid');
    }

    return result;
  } catch (e) {
    throw new InputError(`Failed to parse database timestamp ${input}`, e);
  }
}

/**
 * Rethrows an error, possibly translating it to a more precise error type.
 */
export function rethrowError(e: any): never {
  if (
    /SQLITE_CONSTRAINT: UNIQUE/.test(e.message) ||
    /unique constraint/.test(e.message)
  ) {
    throw new ConflictError(`Rejected due to a conflicting entity`, e);
  }

  throw e;
}
