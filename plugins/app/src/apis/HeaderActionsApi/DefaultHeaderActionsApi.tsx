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

import { Suspense, lazy } from 'react';
import {
  type HeaderActionsApi,
  type HeaderAction,
} from '@backstage/frontend-plugin-api';

type ActionInput = {
  loader: () => Promise<JSX.Element>;
  pluginId: string;
  nodeId: string;
};

/**
 * Default implementation of HeaderActionsApi.
 *
 * @internal
 */
export class DefaultHeaderActionsApi implements HeaderActionsApi {
  constructor(
    private readonly actionsByPlugin: Map<string, HeaderAction[]>,
  ) {}

  getHeaderActions(pluginId: string): HeaderAction[] {
    return this.actionsByPlugin.get(pluginId) ?? [];
  }

  static fromActions(
    actions: Array<ActionInput>,
  ): DefaultHeaderActionsApi {
    const actionsByPlugin = new Map<string, HeaderAction[]>();

    for (const action of actions) {
      let pluginActions = actionsByPlugin.get(action.pluginId);
      if (!pluginActions) {
        pluginActions = [];
        actionsByPlugin.set(action.pluginId, pluginActions);
      }

      const LazyAction = lazy(async () => {
        const element = await action.loader();
        return { default: () => element };
      });

      pluginActions.push({
        nodeId: action.nodeId,
        element: (
          <Suspense key={action.nodeId} fallback={null}>
            <LazyAction />
          </Suspense>
        ),
      });
    }

    return new DefaultHeaderActionsApi(actionsByPlugin);
  }
}
