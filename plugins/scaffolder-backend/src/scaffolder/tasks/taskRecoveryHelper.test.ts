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

import { stepIdToRunTheTask } from './taskRecoveryHelper';
import { SerializedTaskEvent } from './types';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';

describe('stepIdToRunTheTask', () => {
  const toEvent = (stepId: string) =>
    ({
      type: 'log',
      body: { stepId },
    } as unknown as SerializedTaskEvent);

  it('Should find the step id which has to be restarted. Scenario 1', () => {
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
      toEvent,
    );

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('mock-step-2');
  });

  it('should find the step id which has to be restarted. Scenario 2', () => {
    const taskSpec = {
      steps: [{ id: 'fetch' }, { id: 'mock-step-1' }, { id: 'mock-step-2' }],
    } as TaskSpec;

    const events = ['fetch', 'mock-step-1'].map(toEvent);

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('mock-step-1');
  });

  it('should find the step id which has to be restarted. Scenario 3', () => {
    const taskSpec = {
      steps: [{ id: 'fetch' }, { id: 'mock-step-1' }],
    } as TaskSpec;

    const events = [].map(toEvent);

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('fetch');
  });
});
