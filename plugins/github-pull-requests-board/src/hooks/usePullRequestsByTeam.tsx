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
import { useCallback, useEffect, useState } from 'react';
import { formatPRsByReviewDecision } from '../utils/functions';
import { PullRequests, PullRequestsColumn } from '../utils/types';
import { useGetPullRequestsFromRepository } from '../api/useGetPullRequestsFromRepository';
import { useGetPullRequestDetails } from '../api/useGetPullRequestDetails';

export function usePullRequestsByTeam(repositories: string[]) {
  const [pullRequests, setPullRequests] = useState<PullRequestsColumn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getPullRequests = useGetPullRequestsFromRepository();
  const getPullRequestDetails = useGetPullRequestDetails();

  const getPRsPerRepository = useCallback(
    async (repository: string): Promise<PullRequests> => {
      const pullRequestsNumbers = await getPullRequests(repository);

      const pullRequestsWithDetails = await Promise.all(
        pullRequestsNumbers.map(({ node }) =>
          getPullRequestDetails(repository, node.number),
        ),
      );

      return pullRequestsWithDetails;
    },
    [getPullRequests, getPullRequestDetails],
  );

  const getPRsFromTeam = useCallback(
    async (teamRepositories: string[]): Promise<PullRequests> => {
      const teamRepositoriesPromises = teamRepositories.map(repository =>
        getPRsPerRepository(repository),
      );

      const teamPullRequests = await Promise.allSettled(
        teamRepositoriesPromises,
      ).then(promises =>
        promises.reduce((acc, curr) => {
          if (curr.status === 'fulfilled') {
            return [...acc, ...curr.value];
          }
          return acc;
        }, [] as PullRequests),
      );

      return teamPullRequests;
    },
    [getPRsPerRepository],
  );

  const getAllPullRequests = useCallback(async () => {
    setLoading(true);

    const teamPullRequests = await getPRsFromTeam(repositories);
    setPullRequests(formatPRsByReviewDecision(teamPullRequests));
    setLoading(false);
  }, [getPRsFromTeam, repositories]);

  useEffect(() => {
    getAllPullRequests();
  }, [getAllPullRequests]);

  return {
    pullRequests,
    loading,
    refreshPullRequests: getAllPullRequests,
  };
}
