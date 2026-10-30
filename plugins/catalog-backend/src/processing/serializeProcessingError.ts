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

import { serializeError, SerializedError } from '@backstage/errors';
import { JsonValue } from '@backstage/types';

// Processing errors are stored in the database and copied into the entity
// status, so they must be bounded. Errors from HTTP clients for example can
// carry the entire response body, sometimes several times over in the message
// and cause chain.
export const MAX_ERROR_STRING_LENGTH = 4096;
export const MAX_SERIALIZED_ERROR_LENGTH = 32768;

function truncateString(value: string): string {
  if (value.length <= MAX_ERROR_STRING_LENGTH) {
    return value;
  }
  const truncated = value.length - MAX_ERROR_STRING_LENGTH;
  return `${value.slice(
    0,
    MAX_ERROR_STRING_LENGTH,
  )}... (${truncated} characters truncated)`;
}

function truncateStrings(value: JsonValue | undefined): JsonValue | undefined {
  if (typeof value === 'string') {
    return truncateString(value);
  }
  if (Array.isArray(value)) {
    return value.map(item => truncateStrings(item) as JsonValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, truncateStrings(item)]),
    );
  }
  return value;
}

/**
 * Serializes an error thrown during processing, so that it can be safely
 * stored. Long strings are truncated, and if the result is still too large
 * only the name, message and code are kept.
 */
export function serializeProcessingError(error: Error): SerializedError {
  const serialized = truncateStrings(serializeError(error)) as SerializedError;
  if (JSON.stringify(serialized).length <= MAX_SERIALIZED_ERROR_LENGTH) {
    return serialized;
  }
  return {
    name: serialized.name,
    message: serialized.message,
    ...(serialized.code !== undefined && { code: serialized.code }),
  };
}
