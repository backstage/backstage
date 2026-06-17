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

import { stringifyError } from '@backstage/errors';

/**
 * Polls a probe function until it succeeds or the timeout is reached.
 *
 * @param probe - An async function that should return `true` when the
 *   service is ready. Throwing is treated as "not ready yet".
 * @param label - A human-readable label used in the timeout error message.
 * @param timeoutMs - Maximum time to wait in milliseconds (default 30 000).
 */
export async function waitForReady(
  probe: () => Promise<boolean>,
  label: string,
  timeoutMs: number = 30_000,
): Promise<void> {
  const startTime = Date.now();

  let lastError: unknown;
  let attempts = 0;
  for (;;) {
    attempts += 1;

    try {
      if (await probe()) {
        return;
      }
    } catch (e) {
      lastError = e;
    }

    if (Date.now() - startTime > timeoutMs) {
      throw new Error(
        `Timed out waiting for ${label} to be ready for connections, ${attempts} attempts, ${
          lastError
            ? `last error was ${stringifyError(lastError)}`
            : '(no errors thrown)'
        }`,
      );
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
