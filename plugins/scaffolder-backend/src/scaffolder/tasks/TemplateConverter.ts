/*
 * Copyright 2021 Spotify AB
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

import { JsonValue } from '@backstage/config';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { Logger } from 'winston';
import type { Writable } from 'stream';
import {
  getTemplaterKey,
  parseLocationAnnotation,
  TemplaterValues,
} from '../jobs/actions';
import { TaskSpec } from './types';
import { ConflictError, NotFoundError } from '@backstage/backend-common';

function templateEntityToSpec(
  template: TemplateEntityV1alpha1,
  values: TemplaterValues,
): TaskSpec {
  const steps: TaskSpec['steps'] = [];

  const { protocol, location: pullPath } = parseLocationAnnotation(template);
  const templater = getTemplaterKey(template);

  steps.push({
    id: 'prepare',
    name: 'Prepare',
    action: 'legacy:prepare',
    parameters: {
      protocol,
      pullPath,
    },
  });

  steps.push({
    id: 'template',
    name: 'Template',
    action: 'legacy:template',
    parameters: {
      templater,
      values,
    },
  });

  steps.push({
    id: 'publish',
    name: 'Publishing',
    action: 'publish',
    parameters: {
      values,
      directory,
    },
  });

  return { steps };
}

type ActionContext = {
  logger: Logger;
  logStream: Writable;

  workspaceDir: string;
  parameters: { [name: string]: JsonValue };
  output(name: string, value: JsonValue): void;
};

type TemplateAction = {
  id: string;
  handler: (ctx: ActionContext) => Promise<void>;
};

export class TemplateActionRegistry {
  private readonly actions = new Map<string, TemplateAction>();

  register(action: TemplateAction) {
    if (this.actions.has(action.id)) {
      throw new ConflictError(
        `Template action with id ${action.id} as already been registered`,
      );
    }
    this.actions.set(action.id, action);
  }

  // validate
  // ensure that action exist.
  // template variables exist.

  get(actionId: string): TemplateAction {
    const action = this.actions.get(actionId);
    if (!action) {
      throw new NotFoundError(
        `Template action with id ${actionId} is not registered.`,
      );
    }
    return action;
  }
}
