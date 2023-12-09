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
} from '@backstage/plugin-scaffolder-common';

type Dependencies = { [key in string]: string };

const findStepsDependencies = (spec: TaskSpec) => {
  const dependencies = {} as Dependencies;

  const stepIds = spec.steps.map(step => step.id).reverse();

  spec.steps.map(step =>
    Object.values(step.input ?? {}).forEach(value => {
      const strValue = JSON.stringify(value).trim();
      const startInd = strValue.indexOf('${{');
      const endInd = strValue.indexOf('}}');
      if (startInd > 0 && endInd > startInd) {
        const variable = strValue.substring(startInd + '${{'.length, endInd);
        const parts = variable.split('.').map(part => part.trim());
        if (parts[0] === 'steps' && parts[2] === 'output') {
          dependencies[step.id] = parts[1];
        }
      }
    }),
  );

  const findUltimateDep = (
    stepId: string,
    forStepId: string,
  ): string | undefined => {
    const depValue = dependencies[stepId];
    if (depValue) {
      return findUltimateDep(depValue, forStepId);
    }
    return stepId === forStepId ? undefined : stepId;
  };

  stepIds.forEach(stepId => {
    const stepDependency = findUltimateDep(stepId, stepId);
    if (stepDependency) {
      dependencies[stepId] = stepDependency;
    }
  });

  return dependencies;
};

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

  const dependencies = findStepsDependencies(spec);
  const dependentStepId = dependencies[lastStep.id];

  return dependentStepId ? dependentStepId : lastStep.id;
};

export const compactEvents = (
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
    if (recoverStrategy === 'start_over') {
      return {
        events: recoveredEventInd === 0 ? [] : events.slice(ind),
      };
    }
  }

  return { events };
};
