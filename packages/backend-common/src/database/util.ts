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

/**
 * Tries to deduce whether a thrown error is a database conflict.
 *
 * @public
 * @param e - A thrown error
 * @returns True if the error looks like it was a conflict error thrown by a
 *          known database engine
 */
export function isDatabaseConflictError(e: unknown) {
  const message = (e as any)?.message;

  return (
    typeof message === 'string' &&
    (/SQLITE_CONSTRAINT: UNIQUE/.test(message) ||
      /unique constraint/.test(message))
  );
}
