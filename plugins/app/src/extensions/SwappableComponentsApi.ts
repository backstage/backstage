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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { DefaultSwappableComponentsApi } from '../../../../packages/frontend-app-api/src/apis/implementations/SwappableComponentsApi';

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
        factory: () =>
          DefaultSwappableComponentsApi.fromComponents(
            inputs.components.map(i =>
              i.get(SwappableComponentBlueprint.dataRefs.component),
            ),
          ),
      }),
    );
  },
});
