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
  SwappableComponentBlueprint,
  createExtensionInput,
  ApiBlueprint,
  swappableComponentsApiRef,
} from '@backstage/frontend-plugin-api';
import { DefaultSwappableComponentsApi } from '../apis/SwappableComponentsApi';

/**
 * Contains the shareable components installed into the app.
 */
export const SwappableComponentsApi = ApiBlueprint.makeWithOverrides({
  name: 'swappable-components',
  inputs: {
    components: createExtensionInput([
      SwappableComponentBlueprint.dataRefs.component,
    ]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: swappableComponentsApiRef,
        deps: {},
        factory: () => {
          const nonAppExtensions = inputs.components.filter(
            i => i.node.spec.plugin?.id !== 'app',
          );

          if (nonAppExtensions.length > 0) {
            // eslint-disable-next-line no-console
            console.warn(
              `SwappableComponents should only be installed as an extension in the app plugin. You can either use appPlugin.override(), or provide a module for the app-plugin with the extension there instead. Invalid extensions: ${nonAppExtensions
                .map(i => i.node.spec.id)
                .join(', ')}`,
            );
          }

          const appExtensions = inputs.components.filter(
            i => i.node.spec.plugin?.id === 'app',
          );

          return DefaultSwappableComponentsApi.fromComponents(
            appExtensions.map(i =>
              i.get(SwappableComponentBlueprint.dataRefs.component),
            ),
          );
        },
      }),
    );
  },
});
