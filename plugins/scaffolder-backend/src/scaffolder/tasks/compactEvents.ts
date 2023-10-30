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
import {
  TaskRecoverStrategy,
  TaskSpec,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';

const findIndForRecoveredEvents = (
  events: SerializedTaskEvent[],
): {
  beforeLastRunInd: number;
  lastRunInd: number;
} => {
  const lastRunReversedInd = events
    .slice()
    .reverse()
    .findIndex(event => event.type === 'recovered');

  const lastRunInd =
    lastRunReversedInd < 0 ? 0 : events.length - lastRunReversedInd - 1;

  if (lastRunInd === 0) {
    return { beforeLastRunInd: 0, lastRunInd: 0 };
  }

  const beforeLastRunReversedInd = events
    .slice(0, lastRunInd - 1)
    .reverse()
    .findIndex(event => event.type === 'recovered');

  const beforeLastRunInd = events.length - beforeLastRunReversedInd - 1;

  return {
    beforeLastRunInd: beforeLastRunReversedInd < 0 ? 0 : beforeLastRunInd,
    lastRunInd,
  };
};

type StepsMap = Map<string, { min?: string; max?: string; status?: string }>;

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
    const dependsOn = step.recovery?.dependsOn;
    if (dependsOn) {
      return compare(dependsOn as string, acc) > 0 ? dependsOn : acc;
    }
    return compare(step.id, acc) > 0 ? acc : step.id;
  }, lastExecutedStep);
};

export const compactEvents = (
  taskSpec: TaskSpec | undefined,
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
    if (recoverStrategy === 'restart') {
      return {
        events: recoveredEventInd === 0 ? [] : events.slice(ind),
      };
    } else if (recoverStrategy === 'idempotent') {
      if (!taskSpec) {
        return { events };
      }

      const { beforeLastRunInd, lastRunInd } =
        findIndForRecoveredEvents(events);

      const slicedEvents = events.slice(beforeLastRunInd, lastRunInd);

      const stepsMap = createStepsMap(
        events.slice(beforeLastRunInd, lastRunInd),
      );
      const stepIdToStart = stepIdToRunTheTask(taskSpec, stepsMap);

      const preservedIdSteps: string[] = [];
      const stepIds = taskSpec.steps.map(step => step.id);
      for (const stepId of stepIds) {
        if (stepId === stepIdToStart) {
          break;
        } else {
          preservedIdSteps.push(stepId);
        }
      }

      const recoveredEvents = slicedEvents.filter(event => {
        const { stepId } = event.body as { stepId?: string };
        return stepId ? preservedIdSteps.includes(stepId) : false;
      });

      return { events: [...recoveredEvents, ...events.slice(lastRunInd)] };
    }
  }

  return { events };
};
