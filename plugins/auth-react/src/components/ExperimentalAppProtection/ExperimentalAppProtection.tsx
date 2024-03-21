/*
 * Copyright 2024 The Backstage Authors
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

import React, { ReactNode } from 'react';
import {
  configApiRef,
  fetchApiRef,
  useApi,
  useApp,
} from '@backstage/core-plugin-api';
import { CookieAuthRefreshProvider } from '@backstage/plugin-auth-react';
import { useAsync, useMountEffect } from '@react-hookz/web';

/**
 * @public
 * A provider that will protect the app when running in public experimental mode.
 */
export function ExperimentalAppProtection(props: {
  children: ReactNode;
}): JSX.Element {
  const { children } = props;
  const fetchApi = useApi(fetchApiRef);
  const configApi = useApi(configApiRef);
  const Components = useApp().getComponents();

  const [state, actions] = useAsync(async () => {
    const baseUrl = configApi.getString('backend.baseUrl');
    const response = await fetchApi.fetch(`${baseUrl}/public/index.html`);
    return response.ok;
  });

  useMountEffect(actions.execute);

  if (state.status === 'not-executed' || state.status === 'loading') {
    return <Components.Progress />;
  }

  // Request failed, or the public index is not available
  if (state.status === 'error' || !state.result) {
    return <>{children}</>;
  }

  // The public index is available
  // That means the app is running in public experimental mode
  return (
    <CookieAuthRefreshProvider pluginId="app">
      {children}
    </CookieAuthRefreshProvider>
  );
}
