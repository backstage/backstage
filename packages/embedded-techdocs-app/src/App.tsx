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
import { createApp, FlatRoutes } from '@backstage/core-app-api';
import { CatalogEntityPage } from '@backstage/plugin-catalog';

import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { apis } from './apis';
import { Root } from './components/Root';
import * as plugins from './plugins';
import { techDocsPage } from './components/techdocs/TechDocsPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

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
