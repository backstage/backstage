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

import { createApp } from '@backstage/app-defaults';
import { AppRouter } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { providers } from '../src/identityProviders';
import {
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { AuthProxyDiscoveryApi } from '../src/AuthProxyDiscoveryApi';

// TODO(Rugvip): make this available via some util, or maybe Utility API?
function readBasePath(configApi: typeof configApiRef.T) {
  let { pathname } = new URL(
    configApi.getOptionalString('app.baseUrl') ?? '/',
    'http://sample.dev', // baseUrl can be specified as just a path
  );
  pathname = pathname.replace(/\/*$/, '');
  return pathname;
}

const app = createApp({
  apis: [
    createApiFactory({
      api: discoveryApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => AuthProxyDiscoveryApi.fromConfig(configApi),
    }),
  ],
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

function RedirectToRoot() {
  window.location.pathname = readBasePath(useApi(configApiRef));
  return <div />;
}

const App = app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      <RedirectToRoot />
    </AppRouter>
  </>,
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
