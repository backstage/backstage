/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { createApp } from '@backstage/frontend-defaults';
import { pagesPlugin } from './examples/pagesPlugin';
import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin, {
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';

import {
  coreExtensionData,
  createExtension,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import {
  techdocsPlugin,
  TechDocsIndexPage,
  TechDocsReaderPage,
  EntityTechdocsContent,
} from '@backstage/plugin-techdocs';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import { homePage } from './HomePage';
import { convertLegacyApp } from '@backstage/core-compat-api';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { convertLegacyPageExtension } from '@backstage/core-compat-api';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';

/**
 * TechDocs does support the new frontend system so this conversion is not
 * strictly necessary, but it's left here to provide a demo of the utilities for
 * converting legacy plugins.
 */
const convertedTechdocsPlugin = convertLegacyPlugin(techdocsPlugin, {
  extensions: [
    convertLegacyPageExtension(TechDocsIndexPage, {
      name: 'index',
      defaultPath: '/docs',
    }),
    convertLegacyPageExtension(TechDocsReaderPage, {
      defaultPath: '/docs/:namespace/:kind/:name/*',
    }),
    convertLegacyEntityContentExtension(EntityTechdocsContent),
  ],
});

const customHomePageModule = createFrontendModule({
  pluginId: 'home',
  extensions: [
    createExtension({
      name: 'my-home-page',
      attachTo: { id: 'page:home', input: 'props' },
      output: [coreExtensionData.reactElement, titleExtensionDataRef],
      factory() {
        return [
          coreExtensionData.reactElement(homePage),
          titleExtensionDataRef('just a title'),
        ];
      },
    }),
  ],
});

const notFoundErrorPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [notFoundErrorPage],
});

const collectedLegacyPlugins = convertLegacyApp(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  features: [
    pagesPlugin,
    convertedTechdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    appVisualizerPlugin,
    kubernetesPlugin,
    notFoundErrorPageModule,
    customHomePageModule,
    ...collectedLegacyPlugins,
  ],
});

export default app.createRoot();
