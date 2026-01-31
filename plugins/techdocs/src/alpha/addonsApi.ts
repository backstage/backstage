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
  ApiBlueprint,
  createApiRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { AddonBlueprint } from '@backstage/plugin-techdocs-react/alpha';
import { TechDocsAddonOptions } from '@backstage/plugin-techdocs-react';

interface TechDocsAddonsApi {
  getAddons(): TechDocsAddonOptions[];
}

export const techdocsAddonsApiRef = createApiRef<TechDocsAddonsApi>({
  id: 'plugin.techdocs.addons',
});

export const TechDocsAddonsApiExtension = ApiBlueprint.makeWithOverrides({
  name: 'addons',
  inputs: {
    addons: createExtensionInput([AddonBlueprint.dataRefs.addon]),
  },
  factory(originalFactory, { inputs }) {
    const addons = inputs.addons.map(output =>
      output.get(AddonBlueprint.dataRefs.addon),
    );
    return originalFactory(defineParams =>
      defineParams({
        api: techdocsAddonsApiRef,
        deps: {},
        factory: () => ({
          getAddons: () => addons,
        }),
      }),
    );
  },
});
