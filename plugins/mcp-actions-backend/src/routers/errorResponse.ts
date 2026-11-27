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
import {
  AuthenticationError,
  ErrorLike,
  NotAllowedError,
} from '@backstage/errors';

/**
 * Return the JSON-RPC error object for the given error.
 * @param err - The error to convert to a JSON-RPC error.
 * @returns The JSON-RPC error object.
 */
export function toJsonRpcError(err: ErrorLike) {
  switch (err.name) {
    case AuthenticationError.name:
      return { status: 401, code: -32001, message: 'Unauthorized' };
    case NotAllowedError.name:
      return { status: 403, code: -32002, message: 'Forbidden' };
    default:
      return { status: 500, code: -32603, message: 'Internal server error' };
  }
}
