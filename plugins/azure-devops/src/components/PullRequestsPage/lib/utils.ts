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

import {
  DashboardPullRequest,
  PullRequestVoteStatus,
  Reviewer,
} from '@backstage/plugin-azure-devops-common';
import {
  PullRequestFilter,
  PullRequestGroup,
  PullRequestGroupConfig,
} from './types';

/**
 * Creates a filter that matches pull requests created by `userEmail`.
 * @param userEmail an email to filter by.
 * @returns a filter for pull requests created by `userEmail`.
 */
export function getCreatedByUserFilter(
  userEmail: string | undefined,
): PullRequestFilter {
  return (pullRequest: DashboardPullRequest): boolean =>
    pullRequest.createdBy?.uniqueName?.toLocaleLowerCase() ===
    userEmail?.toLocaleLowerCase();
}

/**
 * Filters a reviewer based on vote status and if the reviewer is required.
 * @param reviewer a reviewer to filter.
 * @returns whether or not to filter the `reviewer`.
 */
export function reviewerFilter(reviewer: Reviewer): boolean {
  return reviewer.voteStatus === PullRequestVoteStatus.NoVote
    ? !!reviewer.isRequired
    : !reviewer.isContainer;
}

/**
 * Removes values from the provided array and returns them.
 * @param arr the array to extract values from.
 * @param filter a filter used to extract values from the provided array.
 * @returns the values that were extracted from the array.
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const numberFilter = (num: number): boolean => num > 3;
 * const extractedNumbers = arrayExtract(numbers, numberFilter);
 * console.log(numbers); // [1, 2, 3]
 * console.log(extractedNumbers); // [4, 5, 6]
 * ```
 *
 * @example
 * ```ts
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const numberFilter = (num: number): boolean => num % 2 === 0;
 * const extractedNumbers = arrayExtract(numbers, numberFilter);
 * console.log(numbers); // [1, 3, 5]
 * console.log(extractedNumbers); // [2, 4, 6]
 * ```
 */
export function arrayExtract<T>(arr: T[], filter: (value: T) => unknown): T[] {
  const extractedValues: T[] = [];

  for (let i = 0; i - extractedValues.length < arr.length; i++) {
    const offsetIndex = i - extractedValues.length;

    const value = arr[offsetIndex];

    if (filter(value)) {
      arr.splice(offsetIndex, 1);
      extractedValues.push(value);
    }
  }

  return extractedValues;
}

/**
 * Creates groups of pull requests based on a list of `PullRequestGroupConfig`.
 * @param pullRequests all pull requests to be split up into groups.
 * @param configs the config used for splitting up the pull request groups.
 * @returns a list of pull request groups.
 */
export function getPullRequestGroups(
  pullRequests: DashboardPullRequest[],
  configs: PullRequestGroupConfig[],
): PullRequestGroup[] {
  const remainingPullRequests: DashboardPullRequest[] = [...pullRequests];
  const pullRequestGroups: PullRequestGroup[] = [];

  configs.forEach(({ title, filter: configFilter, simplified }) => {
    const groupPullRequests = arrayExtract(remainingPullRequests, configFilter);

    pullRequestGroups.push({
      title,
      pullRequests: groupPullRequests,
      simplified,
    });
  });

  return pullRequestGroups;
}
