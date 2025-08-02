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
import { ErrorLike, stringifyError } from '@backstage/errors';

const hasBodyError = (b: unknown): b is { error: unknown } =>
  typeof b === 'object' && b !== null && 'error' in b;

const hasCause = (e: unknown): e is { cause: ErrorLike } =>
  typeof e === 'object' && e !== null && 'cause' in e;

export function extractDefaultResponseErrorMessage(e: ErrorLike) {
  if (
    e.name === 'ResponseError' &&
    hasBodyError(e.body) &&
    hasCause(e.body.error)
  ) {
    return stringifyError(e.body.error.cause);
  }

  return undefined;
}
