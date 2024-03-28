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

import { SerializedTaskEvent } from '@backstage/plugin-scaffolder-node';
import { TaskRecoverStrategy } from '@backstage/plugin-scaffolder-common';

export const trimEventsTillLastRecovery = (
  events: SerializedTaskEvent[],
): { events: SerializedTaskEvent[] } => {
  const recoveredEventInd = events
    .slice()
    .reverse()
    .findIndex(event => event.type === 'recovered');

  if (recoveredEventInd >= 0) {
    const ind = events.length - recoveredEventInd - 1;
    const { recoverStrategy } = events[ind].body as {
      recoverStrategy: TaskRecoverStrategy;
    };
    if (recoverStrategy === 'startOver') {
      return {
        events: recoveredEventInd === 0 ? [] : events.slice(ind),
      };
    }
  }

  return { events };
};
