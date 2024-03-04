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
import useAsync from 'react-use/lib/useAsync';
import ReactDOM from 'react-dom/client';
import { providers } from '../src/identityProviders';
import {
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { AuthProxyDiscoveryApi } from '../src/AuthProxyDiscoveryApi';

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
  const identityApi = useApi(identityApiRef);

  const { value, loading, error } = useAsync(async () => {
    const { token } = await identityApi.getCredentials();
    if (!token) {
      throw new Error('Expected Backstage token in sign-in response');
    }
    return token;
  }, [identityApi]);

  if (loading) {
    return null;
  } else if (error) {
    return <>An error occurred: {error}</>;
  }

  return (
    <form
      ref={form => form?.submit()}
      action={window.location.href}
      method="POST"
    >
      <input type="hidden" name="type" value="sign-in" />
      <input type="hidden" name="token" value={value} />
      <input type="submit" value="Continue" />
    </form>
  );
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
