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

const toLogEvent = (message: string): SerializedTaskEvent => ({
  id: 1,
  taskId: 'test-task',
  createdAt: '2026-08-17T00:00:00.000Z',
  type: 'log',
  body: { message },
});

const toRecoveredEvent = (
  recoverStrategy: 'none' | 'startOver',
): SerializedTaskEvent => ({
  id: 2,
  taskId: 'test-task',
  createdAt: '2026-08-17T00:00:01.000Z',
  type: 'recovered',
  body: {
    message: 'Task recovered',
    recoverStrategy,
  },
});

describe('taskRecoveryHelper', () => {
  describe('trimEventsTillLastRecovery', () => {
    it('should return all events for resume-based recovery', () => {
      const events = [
        toLogEvent('Step 1 completed'),
        toRecoveredEvent('none'),
        toLogEvent('Step 2 started'),
      ];

      expect(trimEventsTillLastRecovery(events)).toEqual({ events });
    });

    it('should discard events before the latest start-over recovery', () => {
      const recoveredEvent = toRecoveredEvent('startOver');
      const currentRunEvent = toLogEvent('Step 1 restarted');
      const events = [
        toLogEvent('Step 1 completed in the previous run'),
        recoveredEvent,
        currentRunEvent,
      ];

      expect(trimEventsTillLastRecovery(events)).toEqual({
        events: [recoveredEvent, currentRunEvent],
      });
    });

    it('should return no events when start-over recovery is the latest event', () => {
      const events = [
        toLogEvent('Step 1 completed in the previous run'),
        toRecoveredEvent('startOver'),
      ];

      expect(trimEventsTillLastRecovery(events)).toEqual({ events: [] });
    });

    it('should return empty array when no events', () => {
      expect(trimEventsTillLastRecovery([])).toEqual({ events: [] });
    });
  });
});
