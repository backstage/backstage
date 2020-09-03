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
/*
 * Copyright 2020 RoadieHQ
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
import { useAsyncRetry } from 'react-use';
import { githubPullRequestsApiRef } from '../api/GithubPullRequestsApi';
import { useApi, githubAuthApiRef } from '@backstage/core';
import { PullsListResponseData } from '@octokit/types';

import moment from 'moment';
import { PullRequestState } from '../types';

export type PullRequestStats = {
  avgTimeUntilMerge: string;
  mergedToClosedRatio: string;
};

export type PullRequestStatsCount = {
  avgTimeUntilMerge: number;
  closedCount: number;
  mergedCount: number;
};
function calculateStatistics(pullRequestsData: PullsListResponseData) {
  return pullRequestsData.reduce<PullRequestStatsCount>(
    (acc, curr) => {
      acc.avgTimeUntilMerge += curr.merged_at
        ? new Date(curr.merged_at).getTime() -
          new Date(curr.created_at).getTime()
        : 0;
      acc.mergedCount += curr.merged_at ? 1 : 0;
      acc.closedCount += curr.closed_at ? 1 : 0;
      return acc;
    },
    {
      avgTimeUntilMerge: 0,
      closedCount: 0,
      mergedCount: 0,
    },
  );
}
export function usePullRequestsStatistics({
  owner,
  repo,
  branch,
  pageSize,
  state,
}: {
  owner: string;
  repo: string;
  branch?: string;
  pageSize: number;
  state: PullRequestState;
}) {
  const api = useApi(githubPullRequestsApiRef);
  const auth = useApi(githubAuthApiRef);

  const { loading, value: statsData, error } = useAsyncRetry<
    PullRequestStats
  >(async () => {
    const token = await auth.getAccessToken(['repo']);
    if (!repo) {
      return {
        avgTimeUntilMerge: '0 min',
        mergedToClosedRatio: '0%',
      };
    }
    return api
      .listPullRequests({
        token,
        owner,
        repo,
        pageSize,
        page: 1,
        branch,
        state,
      })
      .then(
        ({ pullRequestsData }: { pullRequestsData: PullsListResponseData }) => {
          const calcResult = calculateStatistics(pullRequestsData);
          const avgTimeUntilMergeDiff = moment.duration(
            calcResult.avgTimeUntilMerge / calcResult.mergedCount,
          );

          const avgTimeUntilMerge = avgTimeUntilMergeDiff.humanize();
          return {
            avgTimeUntilMerge: avgTimeUntilMerge,
            mergedToClosedRatio: `${Math.round(
              (calcResult.mergedCount / calcResult.closedCount) * 100,
            )}%`,
          };
        },
      );
  }, [pageSize, repo, owner]);

  return [
    {
      loading,
      statsData,
      projectName: `${owner}/${repo}`,
      error,
    },
  ] as const;
}
