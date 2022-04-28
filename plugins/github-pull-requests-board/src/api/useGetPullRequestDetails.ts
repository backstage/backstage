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

import { GraphQlPullRequest, PullRequest } from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

export const useGetPullRequestDetails = () => {
  const graphql = useOctokitGraphQl<GraphQlPullRequest<PullRequest>>();

  const fn = React.useRef(
    async (repo: string, number: number): Promise<PullRequest> => {
      const [organisation, repositoryName] = repo.split('/');

      const { repository } = await graphql(
        `
          query ($name: String!, $owner: String!, $pull_number: Int!) {
            repository(name: $name, owner: $owner) {
              pullRequest(number: $pull_number) {
                id
                repository {
                  name
                }
                title
                url
                createdAt
                lastEditedAt
                latestReviews(first: 10) {
                  nodes {
                    author {
                      login
                      avatarUrl
                      ... on User {
                        id
                        email
                        name
                        login
                      }
                    }
                    state
                  }
                }
                mergeable
                state
                reviewDecision
                isDraft
                createdAt
                author {
                  ... on User {
                    id
                    email
                    avatarUrl
                    name
                    login
                  }
                  ... on Bot {
                    id
                    avatarUrl
                    login
                  }
                }
              }
            }
          }
        `,
        {
          name: repositoryName,
          owner: organisation,
          pull_number: number,
        },
      );

      return repository.pullRequest;
    },
  );

  return fn.current;
};
