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
import * as github from '@backstage/plugin-scaffolder-backend-module-github';
import * as gitlab from '@backstage/plugin-scaffolder-backend-module-gitlab';
import * as azure from '@backstage/plugin-scaffolder-backend-module-azure';
import * as bitbucket from '@backstage/plugin-scaffolder-backend-module-bitbucket';
import * as bitbucketCloud from '@backstage/plugin-scaffolder-backend-module-bitbucket-cloud';
import * as bitbucketServer from '@backstage/plugin-scaffolder-backend-module-bitbucket-server';
import * as gerrit from '@backstage/plugin-scaffolder-backend-module-gerrit';

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubActionsDispatchAction =
  github.createGithubActionsDispatchAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubDeployKeyAction = github.createGithubDeployKeyAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubEnvironmentAction =
  github.createGithubEnvironmentAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubIssuesLabelAction =
  github.createGithubIssuesLabelAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export type CreateGithubPullRequestActionOptions =
  github.CreateGithubPullRequestActionOptions;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubRepoCreateAction = github.createGithubRepoCreateAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubRepoPushAction = github.createGithubRepoPushAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createGithubWebhookAction = github.createGithubWebhookAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createPublishGithubAction = github.createPublishGithubAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-github instead
 */
export const createPublishGithubPullRequestAction =
  github.createPublishGithubPullRequestAction;

/**
 * @public @deprecated use "createPublishBitbucketCloudAction" from \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud or "createPublishBitbucketServerAction" from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketAction =
  bitbucket.createPublishBitbucketAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud instead
 */
export const createPublishBitbucketCloudAction =
  bitbucketCloud.createPublishBitbucketCloudAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketServerAction =
  bitbucketServer.createPublishBitbucketServerAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketServerPullRequestAction =
  bitbucketServer.createPublishBitbucketServerPullRequestAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-azure instead
 */
export const createPublishAzureAction = azure.createPublishAzureAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-gerrit instead
 */
export const createPublishGerritAction = gerrit.createPublishGerritAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-gerrit instead
 */
export const createPublishGerritReviewAction =
  gerrit.createPublishGerritReviewAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-gitlab instead
 */
export const createPublishGitlabAction = gitlab.createPublishGitlabAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-gitlab instead
 */
export const createPublishGitlabMergeRequestAction =
  gitlab.createPublishGitlabMergeRequestAction;
