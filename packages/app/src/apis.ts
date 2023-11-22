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
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  ExampleCostInsightsClient,
  costInsightsApiRef,
} from '@backstage/plugin-cost-insights';
import {
  GraphQLEndpoints,
  graphQlBrowseApiRef,
} from '@backstage/plugin-graphiql';
import { AuthProxyDiscoveryApi } from './AuthProxyDiscoveryApi';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => AuthProxyDiscoveryApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: scmAuthApiRef,
    deps: {
      gitlabAuthApi: gitlabAuthApiRef,
    },
    factory: ({ gitlabAuthApi }) => ScmAuth.forGitlab(gitlabAuthApi),
  }),

  // ScmAuth.createDefaultApiFactory(),

  createApiFactory({
    api: graphQlBrowseApiRef,
    deps: {
      errorApi: errorApiRef,
      fetchApi: fetchApiRef,
      githubAuthApi: githubAuthApiRef,
    },
    factory: ({ errorApi, fetchApi, githubAuthApi }) =>
      GraphQLEndpoints.from([
        // GraphQLEndpoints.create({
        //   id: 'gitlab',
        //   title: 'GitLab',
        //   url: 'https://gitlab.com/api/graphql',
        //   fetchApi,
        // }),
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          fetchApi,
          githubAuthApi,
        }),
      ]),
  }),

  createApiFactory(costInsightsApiRef, new ExampleCostInsightsClient()),
];
