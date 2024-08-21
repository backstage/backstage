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
  createExtensionInput,
  IconBundleBlueprint,
  ApiBlueprint,
  createApiFactory,
  iconsApiRef,
} from '@backstage/frontend-plugin-api';

import { DefaultIconsApi } from '../apis/implementations/IconsApi';

/**
 * Contains the shareable icons installed into the app.
 *
 * @public
 */
export const IconsApi = ApiBlueprint.makeWithOverrides({
  name: 'icons',
  inputs: {
    icons: createExtensionInput([IconBundleBlueprint.dataRefs.icons]),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory({
      factory: createApiFactory(
        iconsApiRef,
        new DefaultIconsApi(
          inputs.icons
            .map(i => i.get(IconBundleBlueprint.dataRefs.icons))
            .reduce((acc, bundle) => ({ ...acc, ...bundle }), {}),
        ),
      ),
    });
  },
});
