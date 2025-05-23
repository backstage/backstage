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

import { durationToMilliseconds } from '@backstage/types';
import { once } from 'events';
import { HistoryConfig } from '../../config';

// TODO(freben): Implement a more efficient way to wait for new events. See
// the events backend using LISTEN/NOTIFY for inspiration. For now, wait for
// up until the deadline and stop early if the request closes, or if we are
// shutting down, or we start finding some rows.
export async function waitForEvents(options: {
  historyConfig: HistoryConfig;
  checker: () => Promise<boolean>;
  signal: AbortSignal;
}): Promise<'timeout' | 'aborted' | 'ready'> {
  const { historyConfig, checker, signal } = options;

  const deadline =
    Date.now() + durationToMilliseconds(historyConfig.blockDuration);

  while (Date.now() < deadline) {
    // Not using AbortSignal.timeout() because https://github.com/nodejs/node/pull/57867
    const timeoutController = new AbortController();
    const timeoutHandle = setTimeout(
      () => timeoutController.abort(),
      durationToMilliseconds(historyConfig.blockPollFrequency),
    );

    try {
      const inner = AbortSignal.any([
        timeoutController.signal,
        ...(signal ? [signal] : []),
      ]);
      // The event won't ever fire if the signal is already aborted, so we
      // need this check.
      if (!inner.aborted) {
        await once(inner, 'abort');
      }
      if (signal?.aborted) {
        return 'aborted';
      }
      const result = await checker();
      if (result) {
        return 'ready';
      }
    } finally {
      // Clean up
      clearTimeout(timeoutHandle);
      timeoutController.abort();
    }
  }

  return 'timeout';
}
