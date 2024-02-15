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
  kubernetesApiRef,
  kubernetesAuthProvidersApiRef,
  kubernetesClusterLinkFormatterApiRef,
  kubernetesProxyApiRef,
} from '@backstage/plugin-kubernetes-react/api';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  oktaAuthApiRef,
  oneloginAuthApiRef,
} from '@backstage/core-plugin-api';
import { rootCatalogKubernetesRouteRef } from './routes';
import { EntityKubernetesContentProps } from './types';
import {
  DEFAULT_FORMATTER_NAME,
  KubernetesAuthProviders,
  KubernetesBackendClient,
  KubernetesClusterLinkFormatter,
  KubernetesProxyClient,
  getDefaultFormatters,
} from './api';

export const kubernetesPlugin = createPlugin({
  id: 'kubernetes',
  apis: [
    createApiFactory({
      api: kubernetesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        kubernetesAuthProvidersApi: kubernetesAuthProvidersApiRef,
      },
      factory: ({ discoveryApi, identityApi, kubernetesAuthProvidersApi }) =>
        new KubernetesBackendClient({
          discoveryApi,
          identityApi,
          kubernetesAuthProvidersApi,
        }),
    }),
    createApiFactory({
      api: kubernetesProxyApiRef,
      deps: {
        kubernetesApi: kubernetesApiRef,
      },
      factory: ({ kubernetesApi }) =>
        new KubernetesProxyClient({
          kubernetesApi,
        }),
    }),
    createApiFactory({
      api: kubernetesAuthProvidersApiRef,
      deps: {
        gitlabAuthApi: gitlabAuthApiRef,
        googleAuthApi: googleAuthApiRef,
        microsoftAuthApi: microsoftAuthApiRef,
        oktaAuthApi: oktaAuthApiRef,
        oneloginAuthApi: oneloginAuthApiRef,
      },
      factory: ({
        gitlabAuthApi,
        googleAuthApi,
        microsoftAuthApi,
        oktaAuthApi,
        oneloginAuthApi,
      }) => {
        const oidcProviders = {
          gitlab: gitlabAuthApi,
          google: googleAuthApi,
          microsoft: microsoftAuthApi,
          okta: oktaAuthApi,
          onelogin: oneloginAuthApi,
        };

        return new KubernetesAuthProviders({
          microsoftAuthApi,
          googleAuthApi,
          oidcProviders,
        });
      },
    }),
    createApiFactory({
      api: kubernetesClusterLinkFormatterApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory: deps => {
        const formatters = getDefaultFormatters(deps);
        return new KubernetesClusterLinkFormatter({
          formatters,
          defaultFormatterName: DEFAULT_FORMATTER_NAME,
        });
      },
    }),
  ],
  routes: {
    entityContent: rootCatalogKubernetesRouteRef,
  },
});

export const EntityKubernetesContent: (
  props: EntityKubernetesContentProps,
) => JSX.Element = kubernetesPlugin.provide(
  createRoutableExtension({
    name: 'EntityKubernetesContent',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootCatalogKubernetesRouteRef,
  }),
);
