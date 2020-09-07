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
} from '@backstage/core';
import React, { FC } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
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

const AppRoutes = () => (
  <Routes>
    <Route
      path="/catalog/*"
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/docs/*" element={<DocsRouter />} />
    <Navigate key="/" to="/catalog" />
    {...deprecatedAppRoutes}
  </Routes>
);

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
