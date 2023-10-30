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

import { getEnrichedTaskSpec, stepIdToRunTheTask } from './taskSpecHelper';
import {
  ScaffolderStep,
  SerializedTaskEvent,
  TaskSpec,
  TaskStatus,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';
import taskMock from './task-mock.json';
import taskMockEvents from './task-events-mock.json';

describe('stepIdToRunTheTask', () => {
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

    expect(stepIdToRunTheTask(taskSpec, stepsMap)).toEqual('step-3');
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

    expect(stepIdToRunTheTask(taskSpec, stepsMap)).toEqual('step-2');
  });

  it('should find the step id which has to be restarted. Scenario 3', () => {
    const taskSpec = {
      steps: [{ id: 'step-1' }, { id: 'step-2' }, { id: 'step-3' }],
    } as TaskSpec;

    const stepsMap = new Map<
      string,
      { min?: string; max?: string; status?: string }
    >();

    expect(stepIdToRunTheTask(taskSpec, stepsMap)).toEqual('step-1');
  });
});

type TaskType = {
  spec: string | TaskSpec;
  status: TaskStatus;
};

describe('getEnrichedTaskSpec', () => {
  const initialTask = taskMock as TaskType;

  const findStep = (enrichedTask: TaskSpec, stepId: string) =>
    enrichedTask.steps.find(step => step.id === stepId) as TaskStep &
      ScaffolderStep;

  const toEnrichedTaskSpec = async (task: TaskType) =>
    await getEnrichedTaskSpec(task, taskMockEvents as SerializedTaskEvent[]);

  it('should enrich a failed task back with timestamps and step statuses', async () => {
    const enrichedTaskSpec = await toEnrichedTaskSpec(initialTask);
    expect(findStep(enrichedTaskSpec, 'fetch').startedAt).toBeDefined();
  });

  it('should enrich a processing task with restart strategy back with timestamps and step statuses', async () => {
    const enrichedTaskSpec = await toEnrichedTaskSpec({
      ...initialTask,
      status: 'processing',
    });
    expect(findStep(enrichedTaskSpec, 'fetch').startedAt).toBeUndefined();
    expect(findStep(enrichedTaskSpec, 'mock-step-1').startedAt).toBeUndefined();
    expect(findStep(enrichedTaskSpec, 'mock-step-2').startedAt).toBeUndefined();
  });

  it('should enrich a processing task with restart idempotent back with timestamps and step statuses', async () => {
    const task: { spec: TaskSpec; status: TaskStatus } = {
      spec: {
        ...taskMock.spec,
        recovery: { strategy: 'idempotent' },
      } as TaskSpec,
      status: 'processing',
    };
    const enrichedTaskSpec = await toEnrichedTaskSpec(task);
    expect(findStep(enrichedTaskSpec, 'fetch').startedAt).toBeUndefined();
    expect(findStep(enrichedTaskSpec, 'mock-step-1').startedAt).toBeUndefined();
    expect(findStep(enrichedTaskSpec, 'mock-step-2').startedAt).toBeUndefined();
  });

  it(
    'should enrich a processing task with restart idempotent back with timestamps ' +
      'and step statuses, when steps do not depend on each other',
    async () => {
      const task: { spec: TaskSpec; status: TaskStatus } = {
        spec: {
          ...taskMock.spec,
          steps: taskMock.spec.steps.map((step: TaskStep) => {
            delete step.recovery;
            return step;
          }),
          recovery: { strategy: 'idempotent' },
        } as TaskSpec,
        status: 'processing',
      };
      const enrichedTaskSpec = await toEnrichedTaskSpec(task);
      expect(findStep(enrichedTaskSpec, 'fetch').startedAt).toEqual(
        '2023-10-30T08:40:22.390Z',
      );
      expect(findStep(enrichedTaskSpec, 'mock-step-1').startedAt).toEqual(
        '2023-10-30T08:40:23.310Z',
      );
      expect(findStep(enrichedTaskSpec, 'mock-step-2').startedAt).toEqual(
        '2023-10-30T08:40:38.317Z',
      );
      expect(findStep(enrichedTaskSpec, 'mock-step-2').endedAt).toEqual(
        '2023-10-30T08:41:08.322Z',
      );
    },
  );
});
