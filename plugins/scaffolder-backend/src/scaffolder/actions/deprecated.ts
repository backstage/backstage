/*
 * Copyright 2023 The Backstage Authors
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
  createGithubActionsDispatchAction as githubActionsDispatch,
  createGithubDeployKeyAction as githubDeployKey,
  createGithubEnvironmentAction as githubEnvironment,
  createGithubIssuesLabelAction as githubIssuesLabel,
  CreateGithubPullRequestActionOptions as GithubPullRequestActionOptions,
  createGithubRepoCreateAction as githubRepoCreate,
  createGithubRepoPushAction as githubRepoPush,
  createGithubWebhookAction as githubWebhook,
  createPublishGithubAction as publishGithub,
  createPublishGithubPullRequestAction as publishGithubPullRequest,
} from '@backstage/plugin-scaffolder-backend-module-github';

import {
  createPublishGitlabAction as publishGitlab,
  createPublishGitlabMergeRequestAction as publishGitlabMergeRequest,
} from '@backstage/plugin-scaffolder-backend-module-gitlab';

import { createPublishAzureAction as publishAzure } from '@backstage/plugin-scaffolder-backend-module-azure';

import { createPublishBitbucketAction as publishBitbucket } from '@backstage/plugin-scaffolder-backend-module-bitbucket';

import { createPublishBitbucketCloudAction as publishBitbucketCloud } from '@backstage/plugin-scaffolder-backend-module-bitbucket-cloud';

import {
  createPublishBitbucketServerAction as publishBitbucketServer,
  createPublishBitbucketServerPullRequestAction as publishBitbucketServerPullRequest,
} from '@backstage/plugin-scaffolder-backend-module-bitbucket-server';

import {
  createPublishGerritAction as publishGerrit,
  createPublishGerritReviewAction as publishGerritReview,
} from '@backstage/plugin-scaffolder-backend-module-gerrit';

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubActionsDispatchAction = githubActionsDispatch;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubDeployKeyAction = githubDeployKey;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubEnvironmentAction = githubEnvironment;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubIssuesLabelAction = githubIssuesLabel;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export type CreateGithubPullRequestActionOptions =
  GithubPullRequestActionOptions;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubRepoCreateAction = githubRepoCreate;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubRepoPushAction = githubRepoPush;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createGithubWebhookAction = githubWebhook;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createPublishGithubAction = publishGithub;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-github` instead
 */
export const createPublishGithubPullRequestAction = publishGithubPullRequest;

/**
 * @public @deprecated use "createPublishBitbucketCloudAction" from \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud or "createPublishBitbucketServerAction" from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketAction = publishBitbucket;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` instead
 */
export const createPublishBitbucketCloudAction = publishBitbucketCloud;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-bitbucket-server` instead
 */
export const createPublishBitbucketServerAction = publishBitbucketServer;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-bitbucket-server` instead
 */
export const createPublishBitbucketServerPullRequestAction =
  publishBitbucketServerPullRequest;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-azure` instead
 */
export const createPublishAzureAction = publishAzure;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-gerrit` instead
 */
export const createPublishGerritAction = publishGerrit;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-gerrit` instead
 */
export const createPublishGerritReviewAction = publishGerritReview;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-gitlab` instead
 */
export const createPublishGitlabAction = publishGitlab;

/**
 * @public
 * @deprecated use import from `@backstage/plugin-scaffolder-backend-module-gitlab` instead
 */
export const createPublishGitlabMergeRequestAction = publishGitlabMergeRequest;
