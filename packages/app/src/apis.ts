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
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  discoveryApiRef,
  UrlPatternDiscovery,
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
} from '@backstage/core';

import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse';

import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';
import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { gitOpsApiRef, GitOpsRestApi } from '@backstage/plugin-gitops-profiles';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';
import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';
import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs';

import { rollbarApiRef, RollbarClient } from '@backstage/plugin-rollbar';
import { GCPClient, GCPApiRef } from '@backstage/plugin-gcp-projects';
import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';
import { jenkinsApiRef, JenkinsApi } from '@backstage/plugin-jenkins';

import {
  TravisCIApi,
  travisCIApiRef,
} from '@roadiehq/backstage-plugin-travis-ci';
import {
  GithubPullRequestsClient,
  githubPullRequestsApiRef,
} from '@roadiehq/backstage-plugin-github-pull-requests';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');
  const techdocsUrl = config.getString('techdocs.storageUrl');

  const builder = ApiRegistry.builder();

  const discoveryApi = builder.add(
    discoveryApiRef,
    UrlPatternDiscovery.compile(`${backendUrl}/{{ pluginId }}`),
  );
  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(GCPApiRef, new GCPClient());
  builder.add(
    circleCIApiRef,
    new CircleCIApi(`${backendUrl}/proxy/circleci/api`),
  );

  builder.add(jenkinsApiRef, new JenkinsApi(`${backendUrl}/proxy/jenkins/api`));

  builder.add(githubActionsApiRef, new GithubActionsClient());

  builder.add(featureFlagsApiRef, new FeatureFlags());

  builder.add(lighthouseApiRef, LighthouseRestApi.fromConfig(config));

  builder.add(travisCIApiRef, new TravisCIApi());
  builder.add(githubPullRequestsApiRef, new GithubPullRequestsClient());

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    googleAuthApiRef,
    GoogleAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(
    microsoftAuthApiRef,
    MicrosoftAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  const githubAuthApi = builder.add(
    githubAuthApiRef,
    GithubAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(
    oktaAuthApiRef,
    OktaAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(
    gitlabAuthApiRef,
    GitlabAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(
    auth0AuthApiRef,
    Auth0Auth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(
    oauth2ApiRef,
    OAuth2.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(catalogApiRef, new CatalogClient({ discoveryApi }));

  builder.add(scaffolderApiRef, new ScaffolderApi({ discoveryApi }));

  builder.add(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008'));

  builder.add(
    graphQlBrowseApiRef,
    GraphQLEndpoints.from([
      GraphQLEndpoints.create({
        id: 'gitlab',
        title: 'GitLab',
        url: 'https://gitlab.com/api/graphql',
      }),
      GraphQLEndpoints.github({
        id: 'github',
        title: 'GitHub',
        errorApi,
        githubAuthApi,
      }),
    ]),
  );

  builder.add(rollbarApiRef, new RollbarClient({ discoveryApi }));

  builder.add(
    techdocsStorageApiRef,
    new TechDocsStorageApi({
      apiOrigin: techdocsUrl,
    }),
  );

  return builder.build();
};
