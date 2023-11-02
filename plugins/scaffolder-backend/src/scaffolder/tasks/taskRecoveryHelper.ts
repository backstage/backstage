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
import {
  TaskRecoverStrategy,
  TaskSpec,
  TaskStep,
} from '@backstage/plugin-scaffolder-common';

const fetchStepIdsFromEvents = (events: SerializedTaskEvent[]) => {
  return events
    .filter(event => event.type === 'log')
    .reduce((acc, event) => {
      const { stepId } = event.body;
      if (stepId) {
        acc.add(stepId as string);
      }
      return acc;
    }, new Set<string>());
};

export const lastRecoveredStepId = (
  spec: TaskSpec,
  events: SerializedTaskEvent[],
): string | undefined => {
  if (!spec.steps.length || !events.length) {
    return undefined;
  }
  const eventStepIds = fetchStepIdsFromEvents(events);
  const steps = spec.steps.slice().reverse();
  const stepIds = steps.map(step => step.id);

  const compare = (stepId1: string, stepId2: string) =>
    stepIds.findIndex(id => id === stepId1) -
    stepIds.findIndex(id => id === stepId2);

  const lastStep =
    Array.from(eventStepIds).sort(compare)[0] ?? spec.steps[0].id;

  return steps.reduce((acc: string, step: TaskStep) => {
    if (!eventStepIds.has(step.id)) {
      return acc;
    }
    const dependsOn = step.recovery?.dependsOn;
    if (dependsOn) {
      return compare(dependsOn as string, acc) > 0 ? dependsOn : acc;
    }
    return compare(step.id, acc) > 0 ? acc : step.id;
  }, lastStep);
};

export const getRestoredStepIds = (
  spec: TaskSpec,
  stepIdToRecoverFrom: string | undefined,
) => {
  if (
    !stepIdToRecoverFrom ||
    !spec.steps.map(step => step.id).includes(stepIdToRecoverFrom)
  ) {
    return [];
  }

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

const findLastRunInd = (events: SerializedTaskEvent[]): number => {
  const lastRunReversedInd = events
    .slice()
    .reverse()
    .findIndex(event => event.type === 'recovered');

  return lastRunReversedInd < 0 ? 0 : events.length - lastRunReversedInd - 1;
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

      const lastRunInd = findLastRunInd(events);
      const historyEvents = events.slice(0, lastRunInd);
      const stepIdToStart = lastRecoveredStepId(taskSpec, historyEvents);

      const preservedIdSteps: string[] = [];
      const stepIds = taskSpec.steps.map(step => step.id);
      for (const stepId of stepIds) {
        if (stepId === stepIdToStart) {
          break;
        } else {
          preservedIdSteps.push(stepId);
        }
      }

      const recoveredEvents = historyEvents.filter(event => {
        const { stepId } = event.body as { stepId?: string };
        return stepId ? preservedIdSteps.includes(stepId) : false;
      });

      return {
        events: [...recoveredEvents, ...events.slice(lastRunInd)].filter(
          event => event.type === 'log',
        ),
      };
    }
  }

  return { events };
};
