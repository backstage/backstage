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
  HeaderActionBlueprint,
  headerActionsApiRef,
  createExtensionInput,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import { DefaultHeaderActionsApi } from '../apis/HeaderActionsApi';

/**
 * Contains the plugin-scoped header actions installed into the app.
 */
export const HeaderActionsApi = ApiBlueprint.makeWithOverrides({
  name: 'header-actions',
  inputs: {
    actions: createExtensionInput([HeaderActionBlueprint.dataRefs.action]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: headerActionsApiRef,
        deps: {},
        factory: () => {
          return DefaultHeaderActionsApi.fromActions(
            inputs.actions.map(actionInput => ({
              loader: actionInput.get(HeaderActionBlueprint.dataRefs.action),
              pluginId: actionInput.node.spec.plugin.pluginId,
              nodeId: actionInput.node.spec.id,
            })),
          );
        },
      }),
    );
  },
});
