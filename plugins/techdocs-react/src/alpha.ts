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
import { createElement, ComponentType } from 'react';

import { TechDocsAddonOptions, TechDocsTransformerOptions } from './types';
import {
  attachComponentData,
  getComponentData,
} from '@backstage/core-plugin-api';
import { getDataKeyByName, TECHDOCS_ADDONS_KEY } from './addons';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/** @alpha */
export type {
  TechDocsAddonOptions,
  TechDocsAddonLocations,
  TechDocsTransformerOptions,
  Transformer,
  TransformerPhase,
} from './types';

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
  const element = createElement(techDocsAddon as ComponentType);

  const isDataAttached = getComponentData<TechDocsAddonOptions>(
    element,
    TECHDOCS_ADDONS_KEY,
  );
  if (!isDataAttached) {
    attachComponentData(techDocsAddon, TECHDOCS_ADDONS_KEY, data);
  }

  const dataKey = getDataKeyByName(data.name);
  const isDataKeyAttached = getComponentData<boolean>(element, dataKey);
  if (!isDataKeyAttached) {
    attachComponentData(techDocsAddon, dataKey, true);
  }
};

/** @alpha */
export const techDocsTransformerDataRef =
  createExtensionDataRef<TechDocsTransformerOptions>().with({
    id: 'techdocs.transformer',
  });

/**
 * Creates an extension to add custom DOM transformers to TechDocs rendering.
 * Transformers can run in two phases:
 * - pre: Before the DOM is attached (faster, no event listeners)
 * - post: After the DOM is attached (can attach event listeners)
 * @alpha
 */
export const TransformerBlueprint = createExtensionBlueprint({
  kind: 'transformer',
  attachTo: [{ id: 'api:techdocs/reader-transformers', input: 'transformers' }],
  output: [techDocsTransformerDataRef],
  factory: (params: TechDocsTransformerOptions, { node }) => {
    // Use the extension's name as the transformer name
    const autoName = node.spec.id.split('/').pop() || 'unknown';
    return [
      techDocsTransformerDataRef({
        name: autoName,
        ...params,
      }),
    ];
  },
  dataRefs: {
    transformer: techDocsTransformerDataRef,
  },
});
