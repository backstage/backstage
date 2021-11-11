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
  arrayExtract,
  getCreatedByUserFilter,
  getPullRequestGroups,
  reviewerFilter,
} from './utils';

describe('getCreatedByUserFilter', () => {
  it('should filter if pull request is created by user', () => {
    const userEmail = 'user1@backstage.com';
    const pr = {
      createdBy: { uniqueName: userEmail },
    } as DashboardPullRequest;
    const result = getCreatedByUserFilter(userEmail)(pr);
    expect(result).toBe(true);
  });

  it('should not filter if pull request is not created by user', () => {
    const userEmail1 = 'user1@backstage.com';
    const userEmail2 = 'user2@backstage.com';
    const pr = {
      createdBy: { uniqueName: userEmail1 },
    } as DashboardPullRequest;
    const result = getCreatedByUserFilter(userEmail2)(pr);
    expect(result).toBe(false);
  });
});

describe('reviewerFilter', () => {
  it('should return false if reviewer has no vote and is not required', () => {
    const reviewer = {
      voteStatus: PullRequestVoteStatus.NoVote,
      isRequired: false,
    } as Reviewer;
    const result = reviewerFilter(reviewer);
    expect(result).toBe(false);
  });

  it('should return true if reviewer has no vote and is required', () => {
    const reviewer = {
      voteStatus: PullRequestVoteStatus.NoVote,
      isRequired: true,
    } as Reviewer;
    const result = reviewerFilter(reviewer);
    expect(result).toBe(true);
  });

  it('should return true if reviewer has a vote and is not a container', () => {
    const reviewer = {
      voteStatus: PullRequestVoteStatus.Approved,
      isContainer: false,
    } as Reviewer;
    const result = reviewerFilter(reviewer);
    expect(result).toBe(true);
  });

  it('should return true if reviewer has a vote and is a container', () => {
    const reviewer = {
      voteStatus: PullRequestVoteStatus.Approved,
      isContainer: true,
    } as Reviewer;
    const result = reviewerFilter(reviewer);
    expect(result).toBe(false);
  });
});

describe('arrayExtract', () => {
  it('should extract numbers greater than 3', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const numberFilter = (num: number): boolean => num > 3;
    const extractedNumbers = arrayExtract(numbers, numberFilter);
    expect(numbers).toEqual([1, 2, 3]);
    expect(extractedNumbers).toEqual([4, 5, 6]);
  });

  it('should extract even numbers', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const numberFilter = (num: number): boolean => num % 2 === 0;
    const extractedNumbers = arrayExtract(numbers, numberFilter);
    expect(numbers).toEqual([1, 3, 5]);
    expect(extractedNumbers).toEqual([2, 4, 6]);
  });
});

describe('getPullRequestGroups', () => {
  it('should create groups of pull requests based on the provided configs', () => {
    const userEmail = 'user1@backstage.com';
    const userEmail2 = 'user2@backstage.com';

    const pullRequests = [
      {
        pullRequestId: 1,
        createdBy: { uniqueName: userEmail },
      } as DashboardPullRequest,
      {
        pullRequestId: 2,
        createdBy: { uniqueName: userEmail },
      } as DashboardPullRequest,
      {
        pullRequestId: 3,
        createdBy: { uniqueName: userEmail2 },
      } as DashboardPullRequest,
      {
        pullRequestId: 4,
        createdBy: { uniqueName: userEmail2 },
      } as DashboardPullRequest,
    ];

    const configs = [
      { title: 'Created by me', filter: getCreatedByUserFilter(userEmail) },
      { title: 'Other PRs', filter: (_: unknown) => true, simplified: true },
    ];

    const result = getPullRequestGroups(pullRequests, configs);

    expect(result.length).toBe(2);

    const group1 = result[0];
    expect(group1.title).toBe('Created by me');
    expect(group1.simplified).toBeFalsy();
    expect(group1.pullRequests.length).toBe(2);
    expect(group1.pullRequests).toContainEqual(
      expect.objectContaining({ pullRequestId: 1 }),
    );
    expect(group1.pullRequests).toContainEqual(
      expect.objectContaining({ pullRequestId: 2 }),
    );

    const group2 = result[1];
    expect(group2.title).toBe('Other PRs');
    expect(group2.simplified).toBe(true);
    expect(group2.pullRequests.length).toBe(2);
    expect(group2.pullRequests).toContainEqual(
      expect.objectContaining({ pullRequestId: 3 }),
    );
    expect(group2.pullRequests).toContainEqual(
      expect.objectContaining({ pullRequestId: 4 }),
    );
  });
});
