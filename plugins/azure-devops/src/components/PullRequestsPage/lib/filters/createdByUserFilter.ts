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

import { BaseFilter, FilterType, PullRequestFilter } from './types';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { equalsIgnoreCase } from '../../../../utils';

export type CreatedByUserFilter = BaseFilter &
  (
    | {
        type: FilterType.CreatedByUser;
        email: string;
      }
    | {
        type: FilterType.CreatedByCurrentUser;
        email?: string;
      }
  );

export function createCreatedByUserFilter(
  filter: CreatedByUserFilter,
): PullRequestFilter {
  const email = filter.email;

  return (pullRequest: DashboardPullRequest): boolean => {
    const uniqueName = pullRequest.createdBy?.uniqueName;

    if (!email || !uniqueName) {
      return false;
    }

    return equalsIgnoreCase(email, uniqueName);
  };
}
