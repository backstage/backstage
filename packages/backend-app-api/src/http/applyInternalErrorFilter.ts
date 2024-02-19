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

import { LoggerService } from '@backstage/backend-plugin-api';
import { assertError } from '@backstage/errors';
import { randomBytes } from 'crypto';

function handleBadError(error: Error, logger: LoggerService) {
  const logId = randomBytes(10).toString('hex');
  logger
    .child({ logId })
    .error(`Filtered internal error with logId=${logId} from response`, error);
  const newError = new Error(`An internal error occurred logId=${logId}`);
  delete newError.stack; // Trim the stack since it's not particularly useful
  return newError;
}

/**
 * Filters out certain known error types that should never be returned in responses.
 *
 * @internal
 */
export function applyInternalErrorFilter(
  error: unknown,
  logger: LoggerService,
): Error {
  try {
    assertError(error);
  } catch (assertionError: unknown) {
    assertError(assertionError);
    return handleBadError(assertionError, logger);
  }

  const constructorName = error.constructor.name;

  // DatabaseError are thrown by the pg-protocol module
  if (constructorName === 'DatabaseError') {
    return handleBadError(error, logger);
  }

  return error;
}
