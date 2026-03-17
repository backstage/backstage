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
  OpenShiftAuth,
} from '../../../packages/core-app-api/src/apis/implementations';
import { ToastApiForwarder, toastApiForwarderRef } from './apis';

import {
  alertApiRef,
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
  openshiftAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  ApiBlueprint,
  dialogApiRef,
  toastApiRef,
} from '@backstage/frontend-plugin-api';
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
import { analyticsApi } from './extensions/AnalyticsApi';

export const apis = [
  ApiBlueprint.make({
    name: 'dialog',
    params: defineParams =>
      defineParams({
        api: dialogApiRef,
        deps: {},
        factory: () => new DefaultDialogApi(),
      }),
  }),
  ApiBlueprint.make({
    name: 'discovery',
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
        api: alertApiRef,
        deps: {},
        factory: () => new AlertApiForwarder(),
      }),
  }),
  ApiBlueprint.make({
    name: 'toast-forwarder',
    params: defineParams =>
      defineParams({
        api: toastApiForwarderRef,
        deps: {},
        factory: () => new ToastApiForwarder(),
      }),
  }),
  ApiBlueprint.make({
    name: 'toast',
    params: defineParams =>
      defineParams({
        api: toastApiRef,
        deps: { forwarder: toastApiForwarderRef },
        factory: ({ forwarder }) => forwarder,
      }),
  }),
  analyticsApi,
  ApiBlueprint.make({
    name: 'error',
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
        api: storageApiRef,
        deps: { errorApi: errorApiRef },
        factory: ({ errorApi }) => WebStorage.create({ errorApi }),
      }),
  }),
  ApiBlueprint.make({
    name: 'fetch',
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
        api: oauthRequestApiRef,
        deps: {},
        factory: () => new OAuthRequestManager(),
      }),
  }),
  ApiBlueprint.make({
    name: 'google-auth',
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams =>
      defineParams({
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
    name: 'openshift-auth',
    params: defineParams =>
      defineParams({
        api: openshiftAuthApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          oauthRequestApi: oauthRequestApiRef,
          configApi: configApiRef,
        },
        factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
          return OpenShiftAuth.create({
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
    params: defineParams =>
      defineParams({
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
    params: defineParams => defineParams(ScmAuth.createDefaultApiFactory()),
  }),
  ApiBlueprint.make({
    name: 'scm-integrations',
    params: defineParams =>
      defineParams({
        api: scmIntegrationsApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
      }),
  }),
] as const;
