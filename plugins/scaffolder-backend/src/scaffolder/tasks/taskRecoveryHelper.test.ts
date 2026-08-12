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

import { trimEventsTillLastRecovery } from './taskRecoveryHelper';
import { SerializedTaskEvent } from '@backstage/plugin-scaffolder-node';

describe('taskRecoveryHelper', () => {
  describe('trimEventsTillLastRecovery', () => {
    it('should return all events for resume-based recovery', () => {
      const logEvents = [
        { type: 'log', body: { message: 'Step 1 started' } },
        { type: 'log', body: { message: 'Step 1 completed' } },
      ] as SerializedTaskEvent[];

      const recoveredEvent = {
        type: 'recovered',
        body: {},
      } as SerializedTaskEvent;

      const events = [...logEvents, recoveredEvent];

      // All events are preserved
      expect(trimEventsTillLastRecovery(events)).toEqual({ events });
    });

    it('should return empty array when no events', () => {
      expect(trimEventsTillLastRecovery([])).toEqual({ events: [] });
    });
  });
});
