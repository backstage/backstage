/*
 * Copyright 2021 The Backstage Authors
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

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { BaseFilter, FilterType, PullRequestFilter } from './types';
import { stringArrayHas } from '../../../../utils';

/** @public */
export type AssignedToTeamFilter = BaseFilter & {
  type: FilterType.AssignedToTeam;
  teamId: string;
};

export function createAssignedToTeamFilter(
  filter: AssignedToTeamFilter,
): PullRequestFilter {
  return (pullRequest: DashboardPullRequest): boolean => {
    const reviewerIds = pullRequest.reviewers?.map(reviewer => reviewer.id);

    if (!reviewerIds) {
      return false;
    }

    return stringArrayHas(reviewerIds, filter.teamId, true);
  };
}
