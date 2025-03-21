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

import {
  ApiBlueprint,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import {
  KubernetesBackendClient,
  kubernetesApiRef,
  kubernetesProxyApiRef,
  kubernetesAuthProvidersApiRef,
  KubernetesAuthProviders,
  KubernetesProxyClient,
  kubernetesClusterLinkFormatterApiRef,
  getDefaultFormatters,
  KubernetesClusterLinkFormatter,
  DEFAULT_FORMATTER_NAME,
} from '@backstage/plugin-kubernetes-react';
import {
  gitlabAuthApiRef,
  googleAuthApiRef,
  microsoftAuthApiRef,
  oktaAuthApiRef,
  oneloginAuthApiRef,
} from '@backstage/core-plugin-api';

export const kubernetesApiExtension = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: kubernetesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        kubernetesAuthProvidersApi: kubernetesAuthProvidersApiRef,
      },
      factory: ({ discoveryApi, fetchApi, kubernetesAuthProvidersApi }) =>
        new KubernetesBackendClient({
          discoveryApi,
          fetchApi,
          kubernetesAuthProvidersApi,
        }),
    }),
  },
});

export const kubernetesProxyApi = ApiBlueprint.make({
  name: 'proxy',
  params: {
    factory: createApiFactory({
      api: kubernetesProxyApiRef,
      deps: {
        kubernetesApi: kubernetesApiRef,
      },
      factory: ({ kubernetesApi }) =>
        new KubernetesProxyClient({
          kubernetesApi,
        }),
    }),
  },
});

export const kubernetesAuthProvidersApi = ApiBlueprint.make({
  name: 'auth-providers',
  params: {
    factory: createApiFactory({
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
  },
});

export const kubernetesClusterLinkFormatterApi = ApiBlueprint.make({
  name: 'cluster-link-formatter',
  params: {
    factory: createApiFactory({
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
  },
});
