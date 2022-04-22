import React from 'react';

import { GraphQlPullRequests, PullRequestsNumber } from '../utils/types';
import { useOctokitGraphQl } from './useOctokitGraphQl';

export const useGetPullRequestsFromRepository = () => {
  const graphql = useOctokitGraphQl<GraphQlPullRequests<PullRequestsNumber[]>>();

  const fn = React.useRef(async (repo: string): Promise<PullRequestsNumber[]> => {
    const [ organisation, repositoryName ] = repo.split('/');

    const { repository } = await graphql(`
    query($name: String!, $owner: String!) {
      repository(name: $name, owner: $owner) {
        pullRequests(states: OPEN, first: 10) {
          edges {
            node {
              number
            }
          }
        }
      }
    }
    `, {
      'name': repositoryName,
      'owner': organisation,
    });

    return repository.pullRequests.edges
  });

  return fn.current;
};
