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
import taskMockEvents from './task-events-mock.json';
import { SerializedTaskEvent } from './types';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';

describe('stepIdToRunTheTask', () => {
  const events = taskMockEvents as SerializedTaskEvent[];

  it('Should find the step id which has to be restarted. Scenario 1', () => {
    const taskSpec = {
      steps: [
        { id: 'step-1' },
        { id: 'step-2' },
        { id: 'step-3' },
        { id: 'step-4', recovery: { dependsOn: 'step-3' } },
        { id: 'step-5', recovery: { dependsOn: 'step-4' } },
        { id: 'step-6' },
      ],
    } as TaskSpec;

    const stepsMap = new Map<
      string,
      { min?: string; max?: string; status?: string }
    >();
    stepsMap.set('step-1', { min: '1', max: '2', status: 'completed' });
    stepsMap.set('step-2', { min: '2', max: '3', status: 'completed' });
    stepsMap.set('step-3', { min: '3', max: '4', status: 'completed' });
    stepsMap.set('step-4', { min: '4', max: '5', status: 'completed' });
    stepsMap.set('step-5', { min: '5', max: '6', status: 'processing' });

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('step-3');
  });

  it('should find the step id which has to be restarted. Scenario 2', () => {
    const taskSpec = {
      steps: [{ id: 'step-1' }, { id: 'step-2' }, { id: 'step-3' }],
    } as TaskSpec;

    const stepsMap = new Map<
      string,
      { min?: string; max?: string; status?: string }
    >();
    stepsMap.set('step-1', { min: '1', max: '2', status: 'completed' });
    stepsMap.set('step-2', { min: '2', max: '3', status: 'processing' });

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('step-2');
  });

  it('should find the step id which has to be restarted. Scenario 3', () => {
    const taskSpec = {
      steps: [{ id: 'step-1' }, { id: 'step-2' }, { id: 'step-3' }],
    } as TaskSpec;

    expect(stepIdToRunTheTask(taskSpec, events)).toEqual('step-1');
  });
});
