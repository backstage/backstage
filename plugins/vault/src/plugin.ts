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
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  DiscoveryApi,
  discoveryApiRef,
  FetchApi,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { vaultApiRef, VaultClient } from './api';

/**
 * The vault plugin.
 * @public
 */
export const vaultPlugin = createPlugin({
  id: 'vault',
  apis: [
    createApiFactory({
      api: vaultApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({
        discoveryApi,
        fetchApi,
      }: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
      }) =>
        new VaultClient({
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
});

/**
 * Card used to show the list of Vault secrets.
 * @public
 */
export const EntityVaultCard = vaultPlugin.provide(
  createComponentExtension({
    name: 'EntityVaultCard',
    component: {
      lazy: () =>
        import('./components/EntityVaultCard').then(m => m.EntityVaultCard),
    },
  }),
);
