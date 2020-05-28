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
  LoginPage,
} from '@backstage/core';
import React, { FC } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Root from './components/Root';
import * as plugins from './plugins';
import apis from './apis';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  configLoader: async () => ({
    app: {
      title: 'Backstage Example App',
      baseUrl: 'http://localhost:3000',
    },
    backend: {
      baseUrl: 'http://localhost:7000',
    },
    organization: {
      name: 'Spotify',
    },
  }),
});

const AppProvider = app.getProvider();
const AppComponent = app.getRootComponent();

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <Router>
      <Root>
        <Route key="login" path="/login" component={LoginPage} exact />
        <AppComponent />
      </Root>
    </Router>
  </AppProvider>
);

export default App;
