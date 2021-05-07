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
  githubAuthApiRef,
  createApiFactory,
} from '@backstage/core';

import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';

import {
  costInsightsApiRef,
} from '@backstage/plugin-cost-insights';
import CostInsightsClient from './components/costInsights';


export const apis = [
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

  createApiFactory({
    api: costInsightsApiRef,
    deps: {},
    factory: () => new CostInsightsClient(),
  }),
];
