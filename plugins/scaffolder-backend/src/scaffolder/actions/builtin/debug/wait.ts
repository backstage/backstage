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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { HumanDuration } from '@backstage/types';
import { Duration } from 'luxon';
import { examples } from './wait.examples';

const id = 'debug:wait';

const MAX_WAIT_TIME_IN_ISO = 'T00:10:00';

/**
 * Waits for a certain period of time.
 *
 * @remarks
 *
 * This task is useful to give some waiting time for manual intervention.
 * Has to be used in a combination with other actions.
 *
 * @public
 */
export function createWaitAction(options?: {
  maxWaitTime?: Duration | HumanDuration;
}) {
  const toDuration = (
    maxWaitTime: Duration | HumanDuration | undefined,
  ): Duration => {
    if (maxWaitTime) {
      if (maxWaitTime instanceof Duration) {
        return maxWaitTime;
      }
      return Duration.fromObject(maxWaitTime);
    }
    return Duration.fromISOTime(MAX_WAIT_TIME_IN_ISO);
  };

  return createTemplateAction<HumanDuration>({
    id,
    description: 'Waits for a certain period of time.',
    examples,
    schema: {
      input: {
        type: 'object',
        properties: {
          minutes: {
            title: 'Waiting period in minutes.',
            type: 'number',
          },
          seconds: {
            title: 'Waiting period in seconds.',
            type: 'number',
          },
          milliseconds: {
            title: 'Waiting period in milliseconds.',
            type: 'number',
          },
        },
      },
    },
    async handler(ctx) {
      const delayTime = Duration.fromObject(ctx.input);
      const maxWait = toDuration(options?.maxWaitTime);

      if (delayTime.minus(maxWait).toMillis() > 0) {
        throw new Error(
          `Waiting duration is longer than the maximum threshold of ${maxWait.toHuman()}`,
        );
      }

      await new Promise(resolve => {
        const controller = new AbortController();
        const timeoutHandle = setTimeout(abort, delayTime.toMillis());
        ctx.signal?.addEventListener('abort', abort);

        function abort() {
          ctx.signal?.removeEventListener('abort', abort);
          clearTimeout(timeoutHandle!);
          controller.abort();
          resolve('finished');
        }
      });
    },
  });
}
