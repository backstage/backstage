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

import {
  coreExtensionData,
  pluginHeaderActionsApiRef,
  createExtensionInput,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import { DefaultPluginHeaderActionsApi } from '../apis/PluginHeaderActionsApi';

/**
 * Contains the plugin-scoped header actions installed into the app.
 */
export const PluginHeaderActionsApi = ApiBlueprint.makeWithOverrides({
  name: 'plugin-header-actions',
  inputs: {
    actions: createExtensionInput([coreExtensionData.reactElement]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: pluginHeaderActionsApiRef,
        deps: {},
        factory: () => {
          return DefaultPluginHeaderActionsApi.fromActions(
            inputs.actions.map(actionInput => ({
              element: actionInput.get(coreExtensionData.reactElement),
              pluginId: actionInput.node.spec.plugin.pluginId,
            })),
          );
        },
      }),
    );
  },
});
