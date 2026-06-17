/*
 * Copyright 2022 The Backstage Authors
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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { TemplateActionRegistry } from '../actions';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

/** @internal */
export class DecoratedActionsRegistry implements TemplateActionRegistry {
  private readonly innerActions: Map<string, TemplateAction> = new Map();
  private readonly innerRegistry: TemplateActionRegistry;

  constructor(
    innerRegistry: TemplateActionRegistry,
    extraActions: Array<TemplateAction>,
  ) {
    this.innerRegistry = innerRegistry;
    for (const action of extraActions) {
      this.innerActions.set(action.id, action);
    }
  }

  async get(
    actionId: string,
    options: { credentials: BackstageCredentials },
  ): Promise<TemplateAction> {
    try {
      return await this.innerRegistry.get(actionId, options);
    } catch (e) {
      if (!this.innerActions.has(actionId)) {
        throw e;
      }
      return this.innerActions.get(actionId)!;
    }
  }

  async list(options: {
    credentials: BackstageCredentials;
  }): Promise<Map<string, TemplateAction<any, any, any>>> {
    const inner = await this.innerRegistry.list(options);
    return new Map<string, TemplateAction<any, any, any>>([
      ...inner,
      ...this.innerActions,
    ]);
  }

  register(action: TemplateAction<any, any, any>): void {
    this.innerRegistry.register(action);
  }
}
