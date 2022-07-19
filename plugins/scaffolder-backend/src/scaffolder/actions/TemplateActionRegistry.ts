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

import { JsonObject } from '@backstage/types';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { TemplateAction } from './types';

/**
 * Registry of all registered template actions.
 * @public
 */
export class TemplateActionRegistry {
  private readonly actions = new Map<string, TemplateAction<any>>();

  register<TInput extends JsonObject>(action: TemplateAction<TInput>) {
    if (this.actions.has(action.id)) {
      throw new ConflictError(
        `Template action with ID '${action.id}' has already been registered`,
      );
    }
    this.actions.set(action.id, action);
  }

  get(actionId: string): TemplateAction<JsonObject> {
    const action = this.actions.get(actionId);
    if (!action) {
      throw new NotFoundError(
        `Template action with ID '${actionId}' is not registered.`,
      );
    }
    return action;
  }

  list(): TemplateAction<JsonObject>[] {
    return [...this.actions.values()];
  }
}
