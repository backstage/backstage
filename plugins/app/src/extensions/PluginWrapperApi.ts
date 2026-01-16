/*
 * Copyright 2024 The Backstage Authors
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
  PluginWrapperBlueprint,
  pluginWrapperApiRef,
} from '@backstage/frontend-plugin-api/alpha';
import {
  createExtensionInput,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import { DefaultPluginWrapperApi } from '../apis/PluginWrapperApi';

/**
 * Contains the plugin wrappers installed into the app.
 */
export const PluginWrapperApi = ApiBlueprint.makeWithOverrides({
  name: 'plugin-wrapper',
  inputs: {
    wrappers: createExtensionInput([PluginWrapperBlueprint.dataRefs.wrapper]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: pluginWrapperApiRef,
        deps: {},
        factory: () => {
          return DefaultPluginWrapperApi.fromWrappers(
            inputs.wrappers.map(wrapperInput => ({
              loader: wrapperInput.get(PluginWrapperBlueprint.dataRefs.wrapper),
              pluginId: wrapperInput.node.spec.plugin.id ?? 'app',
            })),
          );
        },
      }),
    );
  },
});
