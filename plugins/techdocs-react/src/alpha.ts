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
import { TechDocsAddonOptions } from './types';
import { attachComponentData } from '@backstage/core-plugin-api';
import { ComponentType } from 'react';
import { getDataKeyByName, TECHDOCS_ADDONS_KEY } from './addons';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/** @alpha */
export type { TechDocsAddonOptions, TechDocsAddonLocations } from './types';

/** @alpha */
export const techDocsAddonDataRef =
  createExtensionDataRef<TechDocsAddonOptions>().with({
    id: 'techdocs.addon',
  });

/**
 * Creates an extension to add addons to the TechDocs standalone reader and entity pages.
 * @alpha
 */
export const AddonBlueprint = createExtensionBlueprint({
  kind: 'addon',
  attachTo: [
    { id: 'page:techdocs/reader', input: 'addons' },
    { id: 'entity-content:techdocs', input: 'addons' },
  ],
  output: [techDocsAddonDataRef],
  factory: (params: TechDocsAddonOptions) => [techDocsAddonDataRef(params)],
  dataRefs: {
    addon: techDocsAddonDataRef,
  },
});

/** @alpha */
export const attachTechDocsAddonComponentData = <P>(
  techDocsAddon: ComponentType<P>,
  data: TechDocsAddonOptions,
) => {
  attachComponentData(techDocsAddon, TECHDOCS_ADDONS_KEY, data);
  attachComponentData(techDocsAddon, getDataKeyByName(data.name), true);
};
