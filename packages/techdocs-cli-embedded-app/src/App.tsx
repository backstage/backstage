/*
 * Copyright 2020 The Backstage Authors
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
import { Navigate, Route } from 'react-router';

import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import {
  createTechDocsAddonExtension,
  TechDocsAddons,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import { CatalogEntityPage } from '@backstage/plugin-catalog';

import { apis } from './apis';
import * as plugins from './plugins';
import { configLoader } from './config';
import { Root } from './components/Root';
import { techDocsPage, TechDocsThemeToggle } from './components/TechDocsPage';

const app = createApp({
  apis,
  configLoader,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const ThemeToggleAddon = techdocsPlugin.provide(
  createTechDocsAddonExtension({
    name: 'ThemeToggleAddon',
    component: TechDocsThemeToggle,
    location: TechDocsAddonLocations.Header,
  }),
);

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="/docs/default/component/local/" />
    {/* we need this route as TechDocs header links relies on it */}
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    />
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      {techDocsPage}
      <TechDocsAddons>
        <ThemeToggleAddon />
      </TechDocsAddons>
    </Route>
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
