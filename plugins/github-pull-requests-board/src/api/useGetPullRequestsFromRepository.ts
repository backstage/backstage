/*
 * Copyright 2022 The Backstage Authors
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
import React from 'react';

import { GraphQlPullRequests, PullRequestsNumber } from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const PULL_REQUEST_LIMIT = 10;
const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export const useGetPullRequestsFromRepository = () => {
  const graphql =
    useOctokitGraphQl<GraphQlPullRequests<PullRequestsNumber[]>>();

  const fn = React.useRef(
    async (
      repo: string,
      pullRequestLimit?: number,
    ): Promise<PullRequestsNumber[]> => {
      const limit = pullRequestLimit ?? PULL_REQUEST_LIMIT;
      const [organisation, repositoryName] = repo.split('/');

      return await getPullRequestNodes(
        graphql,
        repositoryName,
        organisation,
        limit,
      );
    },
  );

  return fn.current;
};

async function getPullRequestNodes(
  graphql: (
    path: string,
    options?: any,
  ) => Promise<GraphQlPullRequests<PullRequestsNumber[]>>,
  repositoryName: string,
  organisation: string,
  pullRequestLimit: number,
): Promise<PullRequestsNumber[]> {
  const pullRequestNodes: PullRequestsNumber[] = [];
  let result: GraphQlPullRequests<PullRequestsNumber[]> | undefined = undefined;

  do {
    result = await graphql(
      `
        query (
          $name: String!
          $owner: String!
          $first: Int
          $endCursor: String
        ) {
          repository(name: $name, owner: $owner) {
            pullRequests(states: OPEN, first: $first, after: $endCursor) {
              nodes {
                number
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      {
        name: repositoryName,
        owner: organisation,
        first:
          pullRequestLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : pullRequestLimit,
        endCursor: result
          ? result.repository.pullRequests.pageInfo.endCursor
          : undefined,
      },
    );

    pullRequestNodes.push(...result.repository.pullRequests.nodes);

    if (pullRequestNodes.length >= pullRequestLimit) return pullRequestNodes;
  } while (result.repository.pullRequests.pageInfo.hasNextPage);

  return pullRequestNodes;
}
