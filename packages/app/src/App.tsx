/*
 * Copyright 2020 Spotify AB
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
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  createRouteRef,
} from '@backstage/core';
import React from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import { Router as LighthouseRouter } from '@backstage/plugin-lighthouse';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
import { Router as ImportComponentRouter } from '@backstage/plugin-catalog-import';
import { ApiDocsExplorerPage } from '@backstage/plugin-api-docs';
import { Route, Routes, Navigate } from 'react-router';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});

const routes = (
  <Routes>
    <Navigate key="/" to="/catalog" />
    <Route
      path="/catalog-import/*"
      element={<ImportComponentRouter catalogRouteRef={catalogRouteRef} />}
    />
    <Route
      path={`${catalogRouteRef.path}/*`}
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/docs/*" element={<DocsRouter />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/lighthouse/*" element={<LighthouseRouter />} />
    <Route
      path="/register-component"
      element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
    />

    <Route path="/api-docs" element={<ApiDocsExplorerPage />} />
    <Route path="/settings" element={<SettingsRouter />} />
    {...deprecatedAppRoutes}
  </Routes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
