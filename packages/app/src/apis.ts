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
  errorApiRef,
  discoveryApiRef,
  UrlPatternDiscovery,
  githubAuthApiRef,
  createApiFactory,
  configApiRef,
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

export const apis = [
  createApiFactory({
    implements: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/{{ pluginId }}`,
      ),
  }),
  createApiFactory(GCPApiRef, new GCPClient()),
  createApiFactory({
    implements: circleCIApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      new CircleCIApi(
        `${configApi.getString('backend.baseUrl')}/proxy/circleci/api`,
      ),
  }),
  createApiFactory({
    implements: jenkinsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      new JenkinsApi(
        `${configApi.getString('backend.baseUrl')}/proxy/jenkins/api`,
      ),
  }),
  createApiFactory(githubActionsApiRef, new GithubActionsClient()),
  createApiFactory({
    implements: lighthouseApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => LighthouseRestApi.fromConfig(configApi),
  }),
  createApiFactory(travisCIApiRef, new TravisCIApi()),
  createApiFactory(githubPullRequestsApiRef, new GithubPullRequestsClient()),
  createApiFactory({
    implements: techRadarApiRef,
    deps: {},
    factory: () => new TechRadar({ width: 1500, height: 800 }),
  }),
  createApiFactory({
    implements: catalogApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: ({ discoveryApi }) => new CatalogClient({ discoveryApi }),
  }),
  createApiFactory({
    implements: scaffolderApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: ({ discoveryApi }) => new ScaffolderApi({ discoveryApi }),
  }),
  createApiFactory(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008')),
  createApiFactory({
    implements: graphQlBrowseApiRef,
    deps: { errorApi: errorApiRef, githubAuthApi: githubAuthApiRef },
    factory: ({ errorApi, githubAuthApi }) =>
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
  }),
  createApiFactory({
    implements: rollbarApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: ({ discoveryApi }) => new RollbarClient({ discoveryApi }),
  }),
  createApiFactory({
    implements: techdocsStorageApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      new TechDocsStorageApi({
        apiOrigin: configApi.getString('techdocs.storageUrl'),
      }),
  }),
];
