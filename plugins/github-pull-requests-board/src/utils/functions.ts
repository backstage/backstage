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
import { Entity } from '@backstage/catalog-model';
import { DateTime } from 'luxon';
import {
  Reviews,
  PullRequests,
  ReviewDecision,
  PullRequestsColumn,
  Author,
  PRCardFormating,
  Repository,
} from './types';
import { COLUMNS } from './constants';

const GITHUB_PULL_REQUESTS_ANNOTATION = 'github.com/project-slug';
const GITHUB_USER_LOGIN_ANNOTATION = 'github.com/user-login';

export const getProjectNameFromEntity = (
  entity: Entity,
): string | undefined => {
  return entity?.metadata.annotations?.[GITHUB_PULL_REQUESTS_ANNOTATION];
};

export const getUserNameFromEntity = (entity: Entity): string | undefined => {
  return entity?.metadata.annotations?.[GITHUB_USER_LOGIN_ANNOTATION];
};

export const getGithubOrganizationFromEntity = (entity: Entity): string => {
  return (
    entity?.metadata?.annotations?.['github.com/team-slug']?.split('/')?.[0] ??
    ''
  );
};

export const getApprovedReviews = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'APPROVED');
};

export const getCommentedReviews = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'COMMENTED');
};
export const getChangeRequests = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'CHANGES_REQUESTED');
};

export const filterSameUser = (users: Author[]): Author[] => {
  const filterGhostUsers = (usersToFilter: Author[]): Author[] => {
    return usersToFilter.filter(user => user !== null);
  };

  return filterGhostUsers(users).reduce((acc, curr) => {
    const containsUser = acc.find(({ login }) => login === curr.login);

    if (!containsUser) {
      return [...acc, curr];
    }

    return acc;
  }, [] as Author[]);
};

export const getElapsedTime = (start: string): string => {
  return DateTime.fromISO(start).toRelative() ?? start;
};

export const formatPRsByReviewDecision = (
  prs: PullRequests,
): PullRequestsColumn[] => {
  const reviewDecisions = prs.reduce(
    (acc, curr) => {
      const decision = curr.reviewDecision || 'REVIEW_REQUIRED';

      if (decision !== 'APPROVED' && curr.latestReviews.nodes.length === 0) {
        return {
          ...acc,
          REVIEW_REQUIRED: [...acc.REVIEW_REQUIRED, curr],
        };
      }

      if (decision !== 'APPROVED' && curr.latestReviews.nodes.length > 0) {
        return {
          ...acc,
          IN_PROGRESS: [...acc.IN_PROGRESS, curr],
        };
      }

      if (decision === 'APPROVED') {
        return {
          ...acc,
          APPROVED: [...acc.APPROVED, curr],
        };
      }

      return acc;
    },
    {
      REVIEW_REQUIRED: [],
      IN_PROGRESS: [],
      APPROVED: [],
    } as Record<ReviewDecision, PullRequests>,
  );

  return [
    {
      title: COLUMNS.REVIEW_REQUIRED,
      content: reviewDecisions.REVIEW_REQUIRED,
    },
    { title: COLUMNS.REVIEW_IN_PROGRESS, content: reviewDecisions.IN_PROGRESS },
    { title: COLUMNS.APPROVED, content: reviewDecisions.APPROVED },
  ];
};

export const shouldDisplayCard = (
  repository: Repository,
  author: Author,
  teamRepositories: string[],
  teamMembers: string[],
  infoCardFormat: PRCardFormating[],
  isDraft: boolean,
) => {
  // hide draft PRs unless "draft" filter is toggled
  if (infoCardFormat.includes('draft') !== isDraft) {
    return false;
  }

  // when "team" filter is toggled on, only shows PR from team members
  if (infoCardFormat.includes('team')) {
    return teamMembers.includes(author.login);
  }

  const fullRepoName =
    `${repository.owner.login}/${repository.name}`.toLocaleLowerCase('en-US');

  const repositories = teamRepositories.map(repo =>
    repo.toLocaleLowerCase('en-US'),
  );

  // when "team" filter is toggled off, only shows PR on team repos
  return repositories.includes(fullRepoName);
};
