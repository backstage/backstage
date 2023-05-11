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
import pLimit from 'p-limit';
import { useCallback, useEffect, useState } from 'react';
import { formatPRsByReviewDecision } from '../utils/functions';
import { PullRequests, PullRequestsColumn } from '../utils/types';
import { useGetPullRequestsFromRepository } from '../api/useGetPullRequestsFromRepository';
import { useGetPullRequestsFromUser } from '../api/useGetPullRequestsFromUser';
import { useGetPullRequestDetails } from '../api/useGetPullRequestDetails';

export function usePullRequestsByTeam(
  repositories: string[],
  members: string[],
  organization?: string,
  pullRequestLimit?: number,
) {
  const [pullRequests, setPullRequests] = useState<PullRequestsColumn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getPullRequestsFromRepository = useGetPullRequestsFromRepository();
  const getPullRequestsFromUser = useGetPullRequestsFromUser();
  const getPullRequestDetails = useGetPullRequestDetails();

  const getPRsPerRepository = useCallback(
    async (repository: string): Promise<PullRequests> => {
      const concurrencyLimit = pLimit(5);
      const pullRequestsNumbers = await getPullRequestsFromRepository(
        repository,
        pullRequestLimit,
      );

      const pullRequestsWithDetails = await Promise.all(
        pullRequestsNumbers.map(node =>
          concurrencyLimit(() =>
            getPullRequestDetails(repository, node.number),
          ),
        ),
      );

      return pullRequestsWithDetails;
    },
    [getPullRequestsFromRepository, getPullRequestDetails, pullRequestLimit],
  );

  const getPRsPerTeamMember = useCallback(
    async (
      teamMember: string,
      teamOrganization?: string,
    ): Promise<PullRequests> => {
      const concurrencyLimit = pLimit(3);
      const pullRequestsNumbers = await getPullRequestsFromUser(
        teamMember,
        teamOrganization,
        pullRequestLimit,
      );

      const pullRequestsWithDetails = await Promise.all(
        pullRequestsNumbers.map(node =>
          concurrencyLimit(() =>
            getPullRequestDetails(
              `${node.repository.owner.login}/${node.repository.name}`,
              node.number,
            ),
          ),
        ),
      );

      return pullRequestsWithDetails;
    },
    [getPullRequestsFromUser, getPullRequestDetails, pullRequestLimit],
  );

  const getPRsFromTeam = useCallback(
    async (
      teamRepositories: string[],
      teamMembers: string[],
      teamOrganization?: string,
    ): Promise<PullRequests> => {
      const teamRepositoriesPromises = teamRepositories.map(repository =>
        getPRsPerRepository(repository),
      );

      const teamMembersPromises = teamMembers.map(teamMember =>
        getPRsPerTeamMember(teamMember, teamOrganization),
      );

      const teamPullRequests = await Promise.allSettled([
        ...teamRepositoriesPromises,
        ...teamMembersPromises,
      ]).then(promises =>
        promises.reduce((acc, curr) => {
          if (curr.status === 'fulfilled') {
            return [...acc, ...curr.value];
          }
          return acc;
        }, [] as PullRequests),
      );

      const uniqueTeamPullRequests = teamPullRequests.filter(
        (lhs, i) => teamPullRequests.findIndex(rhs => lhs.id === rhs.id) === i,
      );

      return uniqueTeamPullRequests;
    },
    [getPRsPerRepository, getPRsPerTeamMember],
  );

  const getAllPullRequests = useCallback(async () => {
    setLoading(true);

    const teamPullRequests = await getPRsFromTeam(
      repositories,
      members,
      organization,
    );
    setPullRequests(formatPRsByReviewDecision(teamPullRequests));
    setLoading(false);
  }, [getPRsFromTeam, repositories, members, organization]);

  useEffect(() => {
    getAllPullRequests();
  }, [getAllPullRequests]);

  return {
    pullRequests,
    loading,
    refreshPullRequests: getAllPullRequests,
  };
}
