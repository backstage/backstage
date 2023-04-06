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
export type GraphQlPullRequest<T> = {
  repository: {
    pullRequest: T;
  };
};

export type Connection<T> = {
  nodes: T;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
};

export type GraphQlPullRequests<T> = {
  repository: {
    pullRequests: Connection<T>;
  };
};

export type GraphQlUserPullRequests<T> = {
  user: {
    pullRequests: Connection<T>;
  };
};

export type PullRequestsNumber = {
  number: number;
};

export type PullRequestsNumberAndOwner = {
  number: number;
  repository: Repository;
};

export type Review = {
  state:
    | 'PENDING'
    | 'COMMENTED'
    | 'APPROVED'
    | 'CHANGES_REQUESTED'
    | 'DISMISSED';
  author: Author;
};

export type Reviews = Review[];

export type Author = {
  login: string;
  avatarUrl: string;
  id: string;
  email: string;
  name: string;
};

export type Repository = {
  name: string;
  owner: {
    login: string;
  };
};

export type PullRequest = {
  id: string;
  repository: Repository;
  title: string;
  url: string;
  lastEditedAt: string;
  latestReviews: {
    nodes: Reviews;
  };
  mergeable: boolean;
  state: string;
  reviewDecision: ReviewDecision | null;
  isDraft: boolean;
  createdAt: string;
  author: Author;
};

export type PullRequests = PullRequest[];

export type PullRequestsColumn = {
  title: string;
  content: PullRequests;
};

export type PRCardFormating = 'compacted' | 'fullscreen' | 'draft' | 'team';

export type ReviewDecision = 'IN_PROGRESS' | 'APPROVED' | 'REVIEW_REQUIRED';

export type PullRequestsSourceType = 'TeamRepositories' | 'TeamMembers';
