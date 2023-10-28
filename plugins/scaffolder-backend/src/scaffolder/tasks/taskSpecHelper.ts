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

import { TaskSpec, TaskStep } from '@backstage/plugin-scaffolder-common';
import { SerializedTaskEvent } from '@backstage/plugin-scaffolder-node';

type StepsMap = Map<string, { min?: string; max?: string; status?: string }>;

const createStepsMap = (events: SerializedTaskEvent[]) => {
  return events
    .filter(event => event.type === 'log')
    .reduce((acc, event) => {
      const stepId = event.body.stepId as string;
      if (stepId) {
        const value = acc.get(stepId);
        acc.set(stepId, {
          min: value && value.min ? value.min : event.createdAt,
          max: event.createdAt,
          ...(event.body.status && { status: event.body.status as string }),
        });
      }
      return acc;
    }, new Map<string, { min?: string; max?: string; status?: string }>());
};

const stepIdToRunTheTask = (spec: TaskSpec, stepsMap: StepsMap) => {
  const steps = spec.steps.map(step => step).reverse();
  const stepIds = steps.map(step => step.id);

  const compare = (stepId1: string, stepId2: string) =>
    stepIds.findIndex(id => id === stepId1) -
    stepIds.findIndex(id => id === stepId2);

  return steps.reduce((acc: string, step: TaskStep) => {
    const enrichedStep = stepsMap.get(step.id);
    if (enrichedStep && step.strategy?.dependsOn) {
      return step.strategy?.dependsOn;
    }
    return compare(step.id, acc) ? step.id : acc;
  }, spec.steps[0].id);
};

const stepEnrichment = (spec: TaskSpec, events: SerializedTaskEvent[]) => {
  const stepsMap = createStepsMap(events);

  const steps = spec.steps.map(step => step).reverse();
  const stepIds = steps.map(step => step.id);

  const stepIdToStart = stepIdToRunTheTask(spec, stepsMap);

  const preservedIdSteps = [];
  for (const stepId of stepIds) {
    preservedIdSteps.push(stepId);
    if (stepId === stepIdToStart) {
      break;
    }
  }

  for (const stepMapKey of stepsMap.keys()) {
    if (!preservedIdSteps.includes(stepMapKey)) {
      stepsMap.delete(stepMapKey);
    }
  }

  const toStartedAt = (stepId: string) => {
    const value = stepsMap.get(stepId);
    return value ? value.min : undefined;
  };

  const toEndedAt = (stepId: string) => {
    const value = stepsMap.get(stepId);
    return value ? value.max : undefined;
  };

  const toStatus = (stepId: string) => {
    const value = stepsMap.get(stepId);
    return value ? value.status : undefined;
  };

  return { toStartedAt, toEndedAt, toStatus };
};

export const getEnrichedTaskSpec = async (
  task: {
    id: string;
    spec: string;
  },
  events: SerializedTaskEvent[],
): Promise<TaskSpec> => {
  const spec = JSON.parse(task.spec) as TaskSpec;
  const taskStrategy = spec.recovery?.strategy ?? 'none';

  if (taskStrategy === 'restart') {
    return spec;
  }

  const { toStartedAt, toEndedAt, toStatus } = stepEnrichment(spec, events);

  return {
    ...spec,
    steps: spec.steps.map(
      step =>
        ({
          ...step,
          status: toStatus(step.id),
          startedAt: toStartedAt(step.id),
          endedAt: toEndedAt(step.id),
        } as TaskStep),
    ),
  };
};
