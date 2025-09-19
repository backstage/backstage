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

import { ConflictError, NotFoundError } from '@backstage/errors';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { AuthService } from '@backstage/backend-plugin-api';
import { isPlainObject } from 'lodash';
import { Schema } from 'jsonschema';
import { JsonObject } from '@backstage/types';
import { TemplateActionRegistry } from './types.ts';

/**
 * Registry of all registered template actions.
 * @public
 * @deprecated this type is deprecated, and there will be a new way to create Workers in the next major version.
 */
export class DefaultTemplateActionRegistry implements TemplateActionRegistry {
  private readonly actions: TemplateAction[] = [];
  private distributedActions: TemplateAction[] = [];

  constructor(
    private readonly actionsRegistry: ActionsService,
    private readonly auth: AuthService,
  ) {}

  register(action: TemplateAction<any, any, any>) {
    if (
      this.actions.some(act => act.id === action.id) ||
      this.distributedActions.some(act => act.id === action.id)
    ) {
      throw new ConflictError(
        `Template action with ID '${action.id}' has already been registered`,
      );
    }

    this.actions.push(action);
  }

  async get(actionId: string): Promise<TemplateAction<any, any, any>> {
    // We do not want to call list() here as that would refresh the distributed actions
    // on every get() call which would be bad for performance especially with many plugins
    // providing actions.
    const action =
      this.actions.find(act => act.id === actionId) ??
      this.distributedActions.find(act => act.id === actionId);
    if (!action) {
      throw new NotFoundError(
        `Template action with ID '${actionId}' is not registered. See https://backstage.io/docs/features/software-templates/builtin-actions/ on how to add a new action module.`,
      );
    }
    return action;
  }

  async list(): Promise<TemplateAction<any, any, any>[]> {
    await this.refreshDistributedActions();
    return [...this.actions.values(), ...this.distributedActions];
  }

  async refreshDistributedActions(): Promise<void> {
    const { actions } = await this.actionsRegistry.list({
      credentials: await this.auth.getOwnServiceCredentials(),
    });

    const actionIds = actions.map(action => action.id);
    const existingIds = this.distributedActions.map(action => action.id);

    if (actionIds.every(actionId => existingIds.includes(actionId))) {
      // No changes in the distributed actions
      return;
    }

    this.distributedActions = actions.map(action => ({
      id: action.id,
      description: action.description,
      examples: [],
      supportsDryRun:
        action.attributes?.readOnly === true &&
        action.attributes?.destructive === false,
      handler: async ctx => {
        const { output } = await this.actionsRegistry.invoke({
          id: action.id,
          input: ctx.input,
          credentials: await ctx.getInitiatorCredentials(),
        });

        if (isPlainObject(output)) {
          for (const [key, value] of Object.entries(output as JsonObject)) {
            ctx.output(key as keyof typeof output, value);
          }
        }
      },
      schema: {
        input: action.schema.input as Schema,
        output: action.schema.output as Schema,
      },
    }));
  }
}
