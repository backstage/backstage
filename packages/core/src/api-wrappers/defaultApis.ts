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
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  discoveryApiRef,
  GoogleAuth,
  GithubAuth,
  OAuth2,
  OktaAuth,
  GitlabAuth,
  Auth0Auth,
  MicrosoftAuth,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  githubAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  auth0AuthApiRef,
  microsoftAuthApiRef,
  storageApiRef,
  WebStorage,
  createApiFactory,
  configApiRef,
  UrlPatternDiscovery,
} from '@backstage/core-api';

export const defaultApis = [
  createApiFactory({
    implements: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/api/{{ pluginId }}`,
      ),
  }),
  createApiFactory(alertApiRef, new AlertApiForwarder()),
  createApiFactory({
    implements: errorApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) =>
      new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  }),
  createApiFactory({
    implements: storageApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) => WebStorage.create({ errorApi }),
  }),
  createApiFactory(featureFlagsApiRef, new FeatureFlags()),
  createApiFactory(oauthRequestApiRef, new OAuthRequestManager()),
  createApiFactory({
    implements: googleAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      GoogleAuth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: microsoftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      MicrosoftAuth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      GithubAuth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: oktaAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      OktaAuth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: gitlabAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      GitlabAuth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: auth0AuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      Auth0Auth.create({ discoveryApi, oauthRequestApi }),
  }),
  createApiFactory({
    implements: oauth2ApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi }) =>
      OAuth2.create({ discoveryApi, oauthRequestApi }),
  }),
];
