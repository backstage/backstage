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
  AlertApiForwarder,
  NoOpAnalyticsApi,
  ErrorApiForwarder,
  ErrorAlerter,
  GoogleAuth,
  GithubAuth,
  OktaAuth,
  GitlabAuth,
  MicrosoftAuth,
  BitbucketAuth,
  BitbucketServerAuth,
  OAuthRequestManager,
  WebStorage,
  OneLoginAuth,
  UnhandledErrorForwarder,
  AtlassianAuth,
  createFetchApi,
  FetchMiddlewares,
  VMwareCloudAuth,
  FrontendHostDiscovery,
} from '@backstage/core-app-api';

import {
  createApiFactory,
  alertApiRef,
  analyticsApiRef,
  errorApiRef,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  oauthRequestApiRef,
  googleAuthApiRef,
  githubAuthApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  microsoftAuthApiRef,
  storageApiRef,
  configApiRef,
  oneloginAuthApiRef,
  bitbucketAuthApiRef,
  bitbucketServerAuthApiRef,
  atlassianAuthApiRef,
  vmwareCloudAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  permissionApiRef,
  IdentityPermissionApi,
} from '@backstage/plugin-permission-react';

export const apis = [
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => FrontendHostDiscovery.fromConfig(configApi),
  }),
  createApiFactory({
    api: alertApiRef,
    deps: {},
    factory: () => new AlertApiForwarder(),
  }),
  createApiFactory({
    api: analyticsApiRef,
    deps: {},
    factory: () => new NoOpAnalyticsApi(),
  }),
  createApiFactory({
    api: errorApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) => {
      const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
      UnhandledErrorForwarder.forward(errorApi, { hidden: false });
      return errorApi;
    },
  }),
  createApiFactory({
    api: storageApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) => WebStorage.create({ errorApi }),
  }),
  createApiFactory({
    api: fetchApiRef,
    deps: {
      configApi: configApiRef,
      identityApi: identityApiRef,
      discoveryApi: discoveryApiRef,
    },
    factory: ({ configApi, identityApi, discoveryApi }) => {
      return createFetchApi({
        middleware: [
          FetchMiddlewares.resolvePluginProtocol({
            discoveryApi,
          }),
          FetchMiddlewares.injectIdentityAuth({
            identityApi,
            config: configApi,
          }),
        ],
      });
    },
  }),
  createApiFactory({
    api: oauthRequestApiRef,
    deps: {},
    factory: () => new OAuthRequestManager(),
  }),
  createApiFactory({
    api: googleAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GoogleAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: microsoftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      MicrosoftAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GithubAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oktaAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OktaAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: gitlabAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GitlabAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oneloginAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OneLoginAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: bitbucketAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      BitbucketAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['account'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: bitbucketServerAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      BitbucketServerAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['REPO_READ'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: atlassianAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return AtlassianAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      });
    },
  }),
  createApiFactory({
    api: vmwareCloudAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return VMwareCloudAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      });
    },
  }),
  createApiFactory({
    api: permissionApiRef,
    deps: {
      discovery: discoveryApiRef,
      identity: identityApiRef,
      config: configApiRef,
    },
    factory: ({ config, discovery, identity }) =>
      IdentityPermissionApi.create({ config, discovery, identity }),
  }),
];
