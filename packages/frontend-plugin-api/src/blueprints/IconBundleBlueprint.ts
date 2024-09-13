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

import { IconComponent } from '../icons';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

const iconsDataRef = createExtensionDataRef<{
  [key in string]: IconComponent;
}>().with({ id: 'core.icons' });

/** @public */
export const IconBundleBlueprint = createExtensionBlueprint({
  kind: 'icon-bundle',
  attachTo: { id: 'api:app/icons', input: 'icons' },
  output: [iconsDataRef],
  factory: (params: { icons: { [key in string]: IconComponent } }) => [
    iconsDataRef(params.icons),
  ],
  dataRefs: {
    icons: iconsDataRef,
  },
});
