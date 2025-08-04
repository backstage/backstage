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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
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
  UrlPatternDiscovery,
  OneLoginAuth,
  UnhandledErrorForwarder,
  AtlassianAuth,
  createFetchApi,
  FetchMiddlewares,
  VMwareCloudAuth,
} from '../../../packages/core-app-api/src/apis/implementations';

import {
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
import { ApiBlueprint, dialogApiRef } from '@backstage/frontend-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  permissionApiRef,
  IdentityPermissionApi,
} from '@backstage/plugin-permission-react';
import { DefaultDialogApi } from './apis/DefaultDialogApi';

export const apis = [
  ApiBlueprint.make({
    name: 'dialog',
    params: define =>
      define({
        api: dialogApiRef,
        deps: {},
        factory: () => new DefaultDialogApi(),
      }),
  }),
  ApiBlueprint.make({
    name: 'discovery',
    params: define =>
      define({
        api: discoveryApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) =>
          UrlPatternDiscovery.compile(
            `${configApi.getString('backend.baseUrl')}/api/{{ pluginId }}`,
          ),
      }),
  }),
  ApiBlueprint.make({
    name: 'alert',
    params: define =>
      define({
        api: alertApiRef,
        deps: {},
        factory: () => new AlertApiForwarder(),
      }),
  }),
  ApiBlueprint.make({
    name: 'analytics',
    params: define =>
      define({
        api: analyticsApiRef,
        deps: {},
        factory: () => new NoOpAnalyticsApi(),
      }),
  }),
  ApiBlueprint.make({
    name: 'error',
    params: define =>
      define({
        api: errorApiRef,
        deps: { alertApi: alertApiRef },
        factory: ({ alertApi }) => {
          const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
          UnhandledErrorForwarder.forward(errorApi, { hidden: false });
          return errorApi;
        },
      }),
  }),
  ApiBlueprint.make({
    name: 'storage',
    params: define =>
      define({
        api: storageApiRef,
        deps: { errorApi: errorApiRef },
        factory: ({ errorApi }) => WebStorage.create({ errorApi }),
      }),
  }),
  ApiBlueprint.make({
    name: 'fetch',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'oauth-request',
    params: define =>
      define({
        api: oauthRequestApiRef,
        deps: {},
        factory: () => new OAuthRequestManager(),
      }),
  }),
  ApiBlueprint.make({
    name: 'google-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'microsoft-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'github-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'okta-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'gitlab-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'onelogin-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'bitbucket-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'bitbucket-server-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'atlassian-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'vmware-cloud-auth',
    params: define =>
      define({
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
  }),
  ApiBlueprint.make({
    name: 'permission',
    params: define =>
      define({
        api: permissionApiRef,
        deps: {
          discovery: discoveryApiRef,
          identity: identityApiRef,
          config: configApiRef,
        },
        factory: ({ config, discovery, identity }) =>
          IdentityPermissionApi.create({ config, discovery, identity }),
      }),
  }),
  ApiBlueprint.make({
    name: 'scm-auth',
    params: define => define(ScmAuth.createDefaultApiFactory()),
  }),
  ApiBlueprint.make({
    name: 'scm-integrations',
    params: define =>
      define({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
      }),
  }),
] as const;
