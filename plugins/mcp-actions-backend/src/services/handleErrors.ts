/*
 * Copyright 2025 The Backstage Authors
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
  ErrorLike,
  ForwardedError,
  isError,
  serializeError,
} from '@backstage/errors';

import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';

const knownErrors = new Set([
  'InputError',
  'AuthenticationError',
  'NotAllowedError',
  'NotFoundError',
  'ConflictError',
  'NotModifiedError',
  'NotImplementedError',
  'ResponseError',
  'ServiceUnavailableError',
]);

// Extracts the cause error, if the provided error is `ResponseError` or
// `ForwardedError` with a cause.
function extractCause(err: ErrorLike): ErrorLike {
  if (
    (err.name === 'ResponseError' || err instanceof ForwardedError) &&
    isError(err.cause)
  ) {
    return err.cause;
  }
  return err;
}

export type DescribeBackstageErrorForMcpResult =
  | { handled: true; description: string }
  | { handled: false; error: unknown };

/**
 * Maps a thrown value to either a stable MCP-facing description (for known
 * Backstage error names) or marks it as unhandled so callers can rethrow.
 *
 * This function does not throw; {@link handleErrors} propagates unhandled
 * errors unchanged.
 */
export function describeBackstageErrorForMcp(
  err: unknown,
): DescribeBackstageErrorForMcpResult {
  if (err instanceof Error) {
    const serialized = serializeError(err);

    const { name, message } = extractCause(serialized);

    if (knownErrors.has(name)) {
      return { handled: true, description: `${name}: ${message}` };
    }
  }

  return { handled: false, error: err };
}

type RequestResultType = ReturnType<
  Parameters<McpServer['setRequestHandler']>[1]
>;
/**
 * Wraps a request function with an error handler that turns known Backstage
 * errors into user-friendly messages, instead of failing the request
 * generically with a 500.
 */
export async function handleErrors(
  fn: () => RequestResultType | Promise<RequestResultType>,
): Promise<RequestResultType> {
  try {
    return await fn();
  } catch (err) {
    const outcome = describeBackstageErrorForMcp(err);
    if (!outcome.handled) {
      throw outcome.error;
    }
    return {
      content: [{ type: 'text', text: outcome.description }],
      isError: true,
    };
  }
}
