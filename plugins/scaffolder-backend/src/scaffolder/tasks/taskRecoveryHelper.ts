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

import { SerializedTaskEvent } from './types';
import { TaskSpec, TaskStep } from '@backstage/plugin-scaffolder-common';

const createStepsMap = (events: SerializedTaskEvent[]) => {
  return events
    .filter(event => event.type === 'log')
    .reduce((acc, event) => {
      const stepId = event.body.stepId as string;
      const status = event.body.status as string;
      if (stepId) {
        const step = acc.get(stepId);
        acc.set(stepId, {
          min:
            step && step.min && status !== 'processing'
              ? step.min
              : event.createdAt,
          max: event.createdAt,
          ...(status && { status }),
        });
      }
      return acc;
    }, new Map<string, { min?: string; max?: string; status?: string }>());
};

export const stepIdToRunTheTask = (
  spec: TaskSpec,
  events: SerializedTaskEvent[],
): string | undefined => {
  if (!events.length) {
    return undefined;
  }
  const stepsMap = createStepsMap(events);
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
    const dependsOn = step.recovery?.dependsOn;
    if (dependsOn) {
      return compare(dependsOn as string, acc) > 0 ? dependsOn : acc;
    }
    return compare(step.id, acc) > 0 ? acc : step.id;
  }, lastExecutedStep);
};

export const getRestoredStepIds = (
  spec: TaskSpec,
  stepIdToRecoverFrom: string | undefined,
) => {
  return stepIdToRecoverFrom
    ? spec.steps.reduce(
        (acc: { stepIds: string[]; continue: boolean }, step) => {
          return acc.continue
            ? {
                stepIds: [...acc.stepIds, step.id],
                continue: step.id !== stepIdToRecoverFrom,
              }
            : acc;
        },
        { stepIds: [], continue: true },
      ).stepIds
    : [];
};
