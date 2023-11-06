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
} from '@backstage/plugin-scaffolder-common';

export const lastRecoveredStepId = (
  spec: TaskSpec,
  events: SerializedTaskEvent[],
): string | undefined => {
  if (!spec.steps.length || !events.length) {
    return undefined;
  }
  const lastStepId = events
    .slice()
    .reverse()
    .find(e => e.type === 'log' && e.body.stepId)?.body.stepId;

  const lastStep = spec.steps.find(step => step.id === lastStepId);

  if (!lastStep) {
    return undefined;
  }

  return lastStep.recovery?.dependsOn
    ? lastStep.recovery?.dependsOn
    : lastStep.id;
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

  const ind = spec.steps.findIndex(step => step.id === stepIdToRecoverFrom);
  return ind > 0 ? spec.steps.map(step => step.id).slice(0, ind) : [];
};

const findRecoverPoint = (events: SerializedTaskEvent[]): number => {
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

      const recoverPoint = findRecoverPoint(events);
      const stepIdToStart = lastRecoveredStepId(
        taskSpec,
        events.slice(0, recoverPoint),
      );

      const preservedIdSteps: string[] = [];
      const stepIds = taskSpec.steps.map(step => step.id);
      for (const stepId of stepIds) {
        if (stepId === stepIdToStart) {
          break;
        } else {
          preservedIdSteps.push(stepId);
        }
      }

      const recoveredEvents = events.filter(event => {
        const { stepId } = event.body as { stepId?: string };
        return stepId ? preservedIdSteps.includes(stepId) : false;
      });

      return {
        events: [...recoveredEvents, ...events.slice(recoverPoint)].filter(
          event => event.type === 'log',
        ),
      };
    }
  }

  return { events };
};
