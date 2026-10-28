/*
 * Copyright 2026 The Backstage Authors
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
  ApiBlueprint,
  coreExtensionData,
  createExtensionInput,
  coreApis,
} from '@backstage/frontend-plugin-api';
import { DefaultExtensionFragmentsApi } from '../apis/ExtensionFragmentsApi/DefaultExtensionFragmentsApi';

export const ExtensionFragmentsApi = ApiBlueprint.makeWithOverrides({
  name: 'extension-fragments',
  inputs: {
    fragments: createExtensionInput([coreExtensionData.reactElement]),
  },
  factory: (originalFactory, { inputs }) =>
    originalFactory(defineParams =>
      defineParams({
        api: coreApis.extensionFragments,
        deps: {},
        factory: () =>
          new DefaultExtensionFragmentsApi(
            new Map(
              inputs.fragments.map(fragment => [
                fragment.node.spec.id,
                fragment.get(coreExtensionData.reactElement),
              ]),
            ),
          ),
      }),
    ),
});
