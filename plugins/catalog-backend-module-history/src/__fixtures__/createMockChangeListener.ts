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
import { ChangeListener } from '../database/changeListener/types';

export function createMockChangeListener(options?: {
  timeout?: HumanDuration;
}): ChangeListener {
  const deadline = options?.timeout
    ? Date.now() + durationToMilliseconds(options.timeout)
    : undefined;

  return {
    setupListener: async ({ signal, checker }) => {
      return {
        waitForUpdate: async () => {
          while (!signal.aborted) {
            if (await checker()) {
              return 'ready';
            }
            if (deadline && Date.now() > deadline) {
              return 'timeout';
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          return 'aborted';
        },
      };
    },
  };
}
