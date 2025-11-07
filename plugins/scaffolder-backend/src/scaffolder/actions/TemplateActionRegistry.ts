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
import {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { isPlainObject } from 'lodash';
import { Schema } from 'jsonschema';
import { JsonObject } from '@backstage/types';

/**
 * @internal
 */
export interface TemplateActionRegistry {
  register(action: TemplateAction<any, any, any>): void;
  get(
    actionId: string,
    options: { credentials: BackstageCredentials },
  ): Promise<TemplateAction<any, any, any>>;
  list(options: {
    credentials: BackstageCredentials;
  }): Promise<Map<string, TemplateAction<any, any, any>>>;
}

/**
 * Registry of all registered template actions.
 */
export class DefaultTemplateActionRegistry implements TemplateActionRegistry {
  private readonly actions = new Map<string, TemplateAction>();

  constructor(
    private readonly actionsRegistry: ActionsService,
    private readonly logger: LoggerService,
  ) {}

  register(action: TemplateAction<any, any, any>) {
    if (this.actions.has(action.id)) {
      throw new ConflictError(
        `Template action with ID '${action.id}' has already been registered`,
      );
    }

    this.actions.set(action.id, action);
  }

  async get(
    actionId: string,
    options: { credentials: BackstageCredentials },
  ): Promise<TemplateAction<any, any, any>> {
    const action = (await this.list(options)).get(actionId);
    if (!action) {
      throw new NotFoundError(
        `Template action with ID '${actionId}' is not registered. See https://backstage.io/docs/features/software-templates/builtin-actions/ on how to add a new action module.`,
      );
    }
    return action;
  }

  async list(options: {
    credentials: BackstageCredentials;
  }): Promise<Map<string, TemplateAction<any, any, any>>> {
    const ret = new Map(this.actions);

    const { actions } = await this.actionsRegistry.list({
      credentials: options.credentials,
    });

    for (const action of actions) {
      if (ret.has(action.id)) {
        this.logger.warn(
          `Template action with ID '${action.id}' has already been registered, skipping action provided by actions service`,
        );
        continue;
      }

      ret.set(action.id, {
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
      });
    }
    return ret;
  }
}
