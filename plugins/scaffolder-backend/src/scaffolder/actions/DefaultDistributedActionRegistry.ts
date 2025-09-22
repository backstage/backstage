/*
 * Copyright 2025 The Backstage Authors
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

import { TemplateActionRegistry } from './TemplateActionRegistry';
import {
  AuthService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { Schema } from 'jsonschema';
import { JsonObject } from '@backstage/types';
import { isPlainObject } from 'lodash';
import { DistributedActionRegistry } from './DistributedActionRegistry';

/**
 * DefaultDistributedActionRegistry is the default implementation of the
 * DistributedActionRegistry interface. It aggregates both built-in and remotely
 * registered actions into a single registry that can be used by the Scaffolder.
 * @internal
 */
export class DefaultDistributedActionRegistry
  implements DistributedActionRegistry
{
  constructor(
    private registry: TemplateActionRegistry,
    private readonly actionsRegistry: ActionsService,
    private readonly auth: AuthService,
  ) {}

  async list(options?: {
    credentials?: BackstageCredentials;
  }): Promise<Map<string, TemplateAction<any, any, any>>> {
    const ret = new Map<string, TemplateAction<any, any, any>>();

    const builtinActions = this.registry.list();
    for (const action of builtinActions) {
      if (ret.has(action.id)) {
        throw new Error(`Duplicate action id '${action.id}' found`);
      }
      ret.set(action.id, action);
    }

    const { actions } = await this.actionsRegistry.list({
      credentials:
        options?.credentials ?? (await this.auth.getOwnServiceCredentials()),
    });

    const distributedActions: TemplateAction<any, any, any>[] = actions.map(
      action => ({
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
      }),
    );

    for (const action of distributedActions) {
      if (ret.has(action.id)) {
        throw new Error(`Duplicate action id '${action.id}' found`);
      }
      ret.set(action.id, action);
    }

    return ret;
  }
}
