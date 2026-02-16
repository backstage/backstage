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

import { ReactNode } from 'react';
import { type PluginHeaderActionsApi } from '@backstage/frontend-plugin-api';

type ActionInput = {
  element: JSX.Element;
  pluginId: string;
};

/**
 * Default implementation of PluginHeaderActionsApi.
 *
 * @internal
 */
export class DefaultPluginHeaderActionsApi implements PluginHeaderActionsApi {
  constructor(private readonly actionsByPlugin: Map<string, ReactNode[]>) {}

  getPluginHeaderActions(pluginId: string): ReactNode[] {
    return this.actionsByPlugin.get(pluginId) ?? [];
  }

  static fromActions(
    actions: Array<ActionInput>,
  ): DefaultPluginHeaderActionsApi {
    const actionsByPlugin = new Map<string, ReactNode[]>();

    for (const action of actions) {
      let pluginActions = actionsByPlugin.get(action.pluginId);
      if (!pluginActions) {
        pluginActions = [];
        actionsByPlugin.set(action.pluginId, pluginActions);
      }

      pluginActions.push(action.element);
    }

    return new DefaultPluginHeaderActionsApi(actionsByPlugin);
  }
}
