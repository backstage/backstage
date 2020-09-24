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
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';

import {
  TravisCIApi,
  travisCIApiRef,
} from '@roadiehq/backstage-plugin-travis-ci';
import {
  GithubPullRequestsClient,
  githubPullRequestsApiRef,
} from '@backstage/plugin-github-prs';

export const apis = [
  // TODO(Rugvip): migrate to use /api
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/{{ pluginId }}`,
      ),
  }),
  createApiFactory({
    api: graphQlBrowseApiRef,
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

  // TODO: move to plugins
  createApiFactory(travisCIApiRef, new TravisCIApi()),
  createApiFactory(githubPullRequestsApiRef, new GithubPullRequestsClient()),
];
