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

import { AppError } from '@backstage/frontend-app-api';

/**
 * Throws for every app error that `isExpectedError` does not accept, so that
 * tests fail instead of rendering an app that is broken.
 */
export function throwOnAppErrors(
  errors: AppError[] | undefined,
  options: {
    description: string;
    isExpectedError?: (error: AppError) => boolean;
  },
): void {
  const unexpected = errors?.filter(e => !options.isExpectedError?.(e));
  if (!unexpected?.length) {
    return;
  }
  throw new Error(
    `${options.description}: ${unexpected
      .map(e => e.message)
      .join(', ')}\nIf an error is expected, allow it with the ` +
      `isExpectedError option, for example: error => error.code === '${unexpected[0].code}'`,
  );
}
