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
  SerializedTaskEvent,
  TaskSpec,
  TaskStatus,
  TaskStep,
} from './TaskSpec';

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

export const stepIdToRunTheTask = (spec: TaskSpec, stepsMap: StepsMap) => {
  const steps = spec.steps.slice().reverse();
  const stepIds = steps.map(step => step.id);

  const compare = (stepId1: string, stepId2: string) =>
    stepIds.findIndex(id => id === stepId1) -
    stepIds.findIndex(id => id === stepId2);

  const lastExecutedStep =
    Array.from(stepsMap.keys()).sort(compare)[0] ?? spec.steps[0].id;

  return steps.reduce((acc: string, step: TaskStep) => {
    const enrichedStep = stepsMap.get(step.id);
    if (!enrichedStep) {
      return acc;
    }
    if (step.recovery?.dependsOn) {
      return compare(step.recovery?.dependsOn as string, acc) > 0
        ? step.recovery?.dependsOn
        : acc;
    }
    return compare(step.id, acc) > 0 ? acc : step.id;
  }, lastExecutedStep);
};

const stepEnrichment = (
  spec: TaskSpec,
  status: TaskStatus,
  events: SerializedTaskEvent[],
) => {
  const stepsMap = createStepsMap(events);

  if (status === 'processing') {
    const stepIds = spec.steps.map(step => step.id);
    const stepIdToStart = stepIdToRunTheTask(spec, stepsMap);

    const preservedIdSteps = [];
    for (const stepId of stepIds) {
      if (stepId === stepIdToStart) {
        break;
      } else {
        preservedIdSteps.push(stepId);
      }
    }

    for (const stepMapKey of stepsMap.keys()) {
      if (!preservedIdSteps.includes(stepMapKey)) {
        stepsMap.delete(stepMapKey);
      }
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
    spec: string | TaskSpec;
    status: TaskStatus;
  },
  events: SerializedTaskEvent[],
): Promise<TaskSpec> => {
  const spec =
    typeof task.spec === 'string'
      ? (JSON.parse(task.spec) as TaskSpec)
      : task.spec;
  const taskStrategy = spec.recovery?.strategy ?? 'none';

  if (task.status === 'open' && taskStrategy === 'restart') {
    return spec;
  }

  const { toStartedAt, toEndedAt, toStatus } = stepEnrichment(
    spec,
    task.status,
    events,
  );

  const res = {
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
  return res;
};
