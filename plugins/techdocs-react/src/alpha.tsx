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
import { createElement, ComponentType, JSX } from 'react';

import { TechDocsAddonOptions } from './types';
import {
  attachComponentData,
  getComponentData,
} from '@backstage/core-plugin-api';
import { getDataKeyByName, TECHDOCS_ADDONS_KEY } from './addons';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
  ExtensionBoundary,
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
export const attachTechDocsAddonComponentData = <P,>(
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

/**
 * Props for TechDocs reader layout components.
 * @alpha
 */
export interface TechDocsReaderLayoutProps {
  /**
   * Show or hide the header, defaults to true.
   */
  withHeader?: boolean;
  /**
   * Show or hide the content search bar, defaults to true.
   */
  withSearch?: boolean;
}

/**
 * Creates an extension that provides a custom layout for the TechDocs reader page.
 *
 * @alpha
 * @example
 * ```tsx
 * TechDocsReaderLayoutBlueprint.make({
 *   params: {
 *     loader: () => import('./MyCustomLayout').then(m => m.MyCustomLayout),
 *   },
 * })
 * ```
 */
export const TechDocsReaderLayoutBlueprint = createExtensionBlueprint({
  kind: 'techdocs-reader-layout',
  attachTo: { id: 'page:techdocs/reader', input: 'layout' },
  output: [coreExtensionData.reactElement],
  config: {
    schema: {
      withHeader: z => z.boolean().optional(),
      withSearch: z => z.boolean().optional(),
    },
  },
  *factory(
    params: {
      loader: () => Promise<(props: TechDocsReaderLayoutProps) => JSX.Element>;
    },
    { config, node },
  ) {
    const Component = ExtensionBoundary.lazyComponent(node, params.loader);
    yield coreExtensionData.reactElement(<Component {...config} />);
  },
});
