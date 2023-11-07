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

import {
  compactEvents,
  getRestoredStepIds,
  lastRecoveredStepId,
} from './taskRecoveryHelper';
import { SerializedTaskEvent } from './types';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';

const toLogEvent = (stepId: string) =>
  ({
    type: 'log',
    body: { stepId },
  } as unknown as SerializedTaskEvent);

const toRecoveredEvent = (recoverStrategy: string) =>
  ({
    type: 'recovered',
    body: { recoverStrategy },
  } as unknown as SerializedTaskEvent);

describe('taskRecoveryHelper', () => {
  describe('lastRecoveredStepId', () => {
    it('should find the last recovered step id. Scenario 1', () => {
      const taskSpec = {
        steps: [
          { id: 'fetch' },
          { id: 'mock-step-1' },
          { id: 'mock-step-2' },
          { id: 'mock-step-3', recovery: { dependsOn: 'mock-step-2' } },
          { id: 'publish' },
        ],
      } as TaskSpec;

      const events = ['fetch', 'mock-step-1', 'mock-step-2', 'mock-step-3'].map(
        toLogEvent,
      );

      expect(lastRecoveredStepId(taskSpec, events)).toEqual('mock-step-2');
    });

    it('should find the last recovered step id. Scenario 2', () => {
      const taskSpec = {
        steps: [{ id: 'fetch' }, { id: 'mock-step-1' }, { id: 'mock-step-2' }],
      } as TaskSpec;

      const events = ['fetch', 'mock-step-1'].map(toLogEvent);

      expect(lastRecoveredStepId(taskSpec, events)).toEqual('mock-step-1');
    });

    it('should find the last recovered step id. Scenario 3', () => {
      const taskSpec = {
        steps: [{ id: 'fetch' }, { id: 'mock-step-1' }],
      } as TaskSpec;

      const events = [].map(toLogEvent);

      expect(lastRecoveredStepId(taskSpec, events)).toBeUndefined();
    });
  });

  describe('getRestoredStepIds', () => {
    it('should return the sequence of step IDs which are restored', () => {
      const taskSpec = {
        steps: [
          { id: 'fetch' },
          { id: 'mock-step-1' },
          { id: 'mock-step-2' },
          { id: 'mock-step-3' },
          { id: 'mock-step-4' },
        ],
      } as TaskSpec;

      expect(getRestoredStepIds(taskSpec, 'mock-step-3')).toEqual([
        'fetch',
        'mock-step-1',
        'mock-step-2',
      ]);

      expect(getRestoredStepIds(taskSpec, 'mock-step-1')).toEqual(['fetch']);

      expect(getRestoredStepIds(taskSpec, 'non-existing')).toEqual([]);
      expect(getRestoredStepIds(taskSpec, undefined)).toEqual([]);
    });
  });

  describe('compactEvents', () => {
    it('should return only events related to a restarted task. Recover strategy: "restart"', () => {
      const taskSpec = {
        steps: [
          { id: 'fetch' },
          { id: 'mock-step-1' },
          { id: 'mock-step-2' },
          { id: 'mock-step-3' },
          { id: 'mock-step-4' },
        ],
      } as TaskSpec;

      const logEvents = [
        'fetch',
        'mock-step-1',
        'mock-step-2',
        'mock-step-3',
      ].map(toLogEvent);

      const events = [...logEvents, toRecoveredEvent('restart')];

      expect(compactEvents(taskSpec, events)).toEqual({ events: [] });
    });

    it('should return only events related to a restarted task. Recover strategy: "idempotent"', () => {
      const taskSpec = {
        steps: [
          { id: 'fetch' },
          { id: 'mock-step-1' },
          { id: 'mock-step-2' },
          { id: 'mock-step-3', recovery: { dependsOn: 'mock-step-2' } },
          { id: 'mock-step-4' },
        ],
      } as TaskSpec;

      const logEvents = [
        'fetch',
        'mock-step-1',
        'mock-step-2',
        'mock-step-3',
      ].map(toLogEvent);

      const events = [...logEvents, toRecoveredEvent('idempotent')];

      expect(compactEvents(taskSpec, events)).toEqual({
        events: ['fetch', 'mock-step-1'].map(toLogEvent),
      });
    });

    it('should return only events related to a restarted task. Recover strategy: "idempotent". Scenario without dependent steps', () => {
      const taskSpec = {
        steps: [
          { id: 'fetch' },
          { id: 'mock-step-1' },
          { id: 'mock-step-2' },
          { id: 'mock-step-3' },
          { id: 'mock-step-4' },
        ],
      } as TaskSpec;

      const logEvents = [
        'fetch',
        'mock-step-1',
        'mock-step-2',
        'mock-step-3',
      ].map(toLogEvent);

      const events = [...logEvents, toRecoveredEvent('idempotent')];

      expect(compactEvents(taskSpec, events)).toEqual({
        events: ['fetch', 'mock-step-1', 'mock-step-2'].map(toLogEvent),
      });
    });
  });
});
