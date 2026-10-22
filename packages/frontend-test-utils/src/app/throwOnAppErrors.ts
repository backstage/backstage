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

import { AppError, AppErrorTypes } from '@backstage/frontend-app-api';

// Keep in sync with DEFAULT_WARNING_CODES in maybeCreateErrorPage from
// @backstage/frontend-defaults. A real app only logs these, so tests ignore them.
const WARNING_CODES = new Set<keyof AppErrorTypes>([
  'EXTENSION_IGNORED',
  'INVALID_EXTENSION_CONFIG_KEY',
  'EXTENSION_INPUT_DATA_IGNORED',
  'EXTENSION_INPUT_INTERNAL_IGNORED',
  'EXTENSION_OUTPUT_IGNORED',
  'EXTENSION_BOOTSTRAP_PREDICATE_IGNORED',
  'EXTENSION_BOOTSTRAP_API_UNAVAILABLE',
  'FEATURE_FLAG_INVALID',
]);

/**
 * Throws for app errors that would replace a real app with its error page,
 * so that tests fail instead of rendering an app that could never start.
 */
export function throwOnAppErrors(app: { errors?: AppError[] }): void {
  const errors = app.errors?.filter(e => !WARNING_CODES.has(e.code));
  if (errors?.length) {
    throw new Error(
      `Failed to create the test app: ${errors
        .map(e => `${e.code}: ${e.message}`)
        .join(', ')}`,
    );
  }
}
