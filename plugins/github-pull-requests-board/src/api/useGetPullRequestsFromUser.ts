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

import {
  GraphQlUserPullRequests,
  PullRequestsNumberAndOwner,
} from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

const PULL_REQUEST_LIMIT = 10;
const GITHUB_GRAPHQL_MAX_ITEMS = 100;

export const useGetPullRequestsFromUser = () => {
  const graphql =
    useOctokitGraphQl<GraphQlUserPullRequests<PullRequestsNumberAndOwner[]>>();

  const fn = React.useRef(
    async (
      userLogin: string,
      organization?: string,
      pullRequestLimit?: number,
    ): Promise<PullRequestsNumberAndOwner[]> => {
      const limit = pullRequestLimit ?? PULL_REQUEST_LIMIT;

      return await getPullRequestNodes(graphql, userLogin, limit, organization);
    },
  );

  return fn.current;
};

async function getPullRequestNodes(
  graphql: (
    path: string,
    options?: any,
  ) => Promise<GraphQlUserPullRequests<PullRequestsNumberAndOwner[]>>,
  userLogin: string,
  pullRequestLimit: number,
  organization?: string,
): Promise<PullRequestsNumberAndOwner[]> {
  const pullRequestNodes: PullRequestsNumberAndOwner[] = [];
  let result:
    | GraphQlUserPullRequests<PullRequestsNumberAndOwner[]>
    | undefined = undefined;

  do {
    result = await graphql(
      `
        query ($login: String!, $first: Int, $endCursor: String) {
          user(login: $login) {
            pullRequests(states: OPEN, first: $first, after: $endCursor) {
              nodes {
                number
                repository {
                  name
                  owner {
                    login
                  }
                }
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
        login: userLogin,
        first:
          pullRequestLimit > GITHUB_GRAPHQL_MAX_ITEMS
            ? GITHUB_GRAPHQL_MAX_ITEMS
            : pullRequestLimit,
        endCursor: result
          ? result.user.pullRequests.pageInfo.endCursor
          : undefined,
      },
    );

    pullRequestNodes.push(
      ...result.user.pullRequests.nodes.filter(
        edge =>
          !organization ||
          edge?.repository?.owner?.login?.toLocaleLowerCase('en-US') ===
            organization.toLocaleLowerCase('en-US'),
      ),
    );

    if (pullRequestNodes.length >= pullRequestLimit) return pullRequestNodes;
  } while (result.user.pullRequests.pageInfo.hasNextPage);

  return pullRequestNodes;
}
