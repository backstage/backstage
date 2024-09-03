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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { DefaultIconsApi } from '../../../../packages/frontend-app-api/src/apis/implementations/IconsApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { icons as defaultIcons } from '../../../../packages/app-defaults/src/defaults';

/**
 * Contains the shareable icons installed into the app.
 */
export const IconsApi = ApiBlueprint.makeWithOverrides({
  name: 'icons',
  inputs: {
    icons: createExtensionInput([IconBundleBlueprint.dataRefs.icons], {
      replaces: [{ id: 'app', input: 'icons' }],
    }),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory({
      factory: createApiFactory(
        iconsApiRef,
        new DefaultIconsApi(
          inputs.icons
            .map(i => i.get(IconBundleBlueprint.dataRefs.icons))
            .reduce((acc, bundle) => ({ ...acc, ...bundle }), defaultIcons),
        ),
      ),
    });
  },
});
