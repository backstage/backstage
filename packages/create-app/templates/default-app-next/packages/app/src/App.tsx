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
import { Route } from 'react-router';
import { FlatRoutes } from '@backstage/core-app-api';
import {
  convertLegacyApp,
  convertLegacyPageExtension,
  convertLegacyPlugin,
} from '@backstage/core-compat-api';
import { createApp } from '@backstage/frontend-defaults';
import {
  coreExtensionData,
  createExtension,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import homePlugin, {
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import searchPlugin from '@backstage/plugin-search/alpha';
import {
  techdocsPlugin,
  TechDocsIndexPage,
  TechDocsReaderPage,
  EntityTechdocsContent,
} from '@backstage/plugin-techdocs';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';

import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import { pagesPlugin } from './examples/pagesPlugin';
import { homePage } from './HomePage';

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
    // Plugins made using new API.
    appVisualizerPlugin,
    catalogPlugin,
    homePlugin,
    kubernetesPlugin,
    pagesPlugin,
    scaffolderPlugin,
    searchPlugin,
    userSettingsPlugin,

    // Plugins converted from legacy API.
    convertedTechdocsPlugin,

    // Modules made using new API.
    customHomePageModule,
    notFoundErrorPageModule,

    // App converted from legacy API.
    ...collectedLegacyPlugins,
  ],
});

export default app.createRoot();
