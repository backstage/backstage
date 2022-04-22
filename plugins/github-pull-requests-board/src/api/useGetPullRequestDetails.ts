import React from 'react';

import { GraphQlPullRequest, PullRequest } from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

export const useGetPullRequestDetails = () => {
  const graphql = useOctokitGraphQl<GraphQlPullRequest<PullRequest>>();

  const fn = React.useRef(async (repo: string, number: number): Promise<PullRequest> => {
    const [ organisation, repositoryName ] = repo.split('/');

    const { repository } = await graphql(`
    query($name: String!, $owner: String!, $pull_number: Int!) {
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
    `, {
      'name': repositoryName,
      'owner': organisation,
      'pull_number': number
    });

    return repository.pullRequest
  });

  return fn.current;
};
