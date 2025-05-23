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

import { durationToMilliseconds, HumanDuration } from '@backstage/types';

/**
 * Sleep for the given duration, but return sooner if the abort signal
 * triggers.
 *
 * @param duration - The amount of time to sleep, at most
 * @param abortSignal - An optional abort signal that short circuits the wait
 */
export async function sleep(
  duration: HumanDuration,
  abortSignal?: AbortSignal,
): Promise<void> {
  if (abortSignal?.aborted) {
    return;
  }

  await new Promise<void>(resolve => {
    let timeoutHandle: NodeJS.Timeout | undefined = undefined;

    const done = () => {
      clearTimeout(timeoutHandle);
      abortSignal?.removeEventListener('abort', done);
      resolve();
    };

    timeoutHandle = setTimeout(done, durationToMilliseconds(duration));
    abortSignal?.addEventListener('abort', done);
  });
}
