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

import { ComponentType, ReactNode } from 'react';
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '../wiring';

const wrapperDataRef = createExtensionDataRef<
  () => Promise<{ component: ComponentType<{ children: ReactNode }> }>
>().with({ id: 'core.plugin-wrapper.loader' });

/**
 * Creates extensions that wrap plugin extensions with providers.
 *
 * @alpha
 */
export const PluginWrapperBlueprint = createExtensionBlueprint({
  kind: 'plugin-wrapper',
  attachTo: { id: 'api:app/plugin-wrapper', input: 'wrappers' },
  output: [wrapperDataRef],
  dataRefs: {
    wrapper: wrapperDataRef,
  },
  defineParams(params: {
    loader: () => Promise<{
      component: ComponentType<{ children: ReactNode }>;
    }>;
  }) {
    return createExtensionBlueprintParams(params);
  },
  *factory(params) {
    yield wrapperDataRef(params.loader);
  },
});
