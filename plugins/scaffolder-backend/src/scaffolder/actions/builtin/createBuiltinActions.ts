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

import { UrlReader } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  createCatalogRegisterAction,
  createCatalogWriteAction,
  createFetchCatalogEntityAction,
} from './catalog';

import { TemplateFilter, TemplateGlobal } from '../../../lib';
import { createDebugLogAction, createWaitAction } from './debug';
import {
  createFetchPlainAction,
  createFetchPlainFileAction,
  createFetchTemplateAction,
} from './fetch';
import {
  createFilesystemDeleteAction,
  createFilesystemRenameAction,
} from './filesystem';
import {
  createGithubActionsDispatchAction,
  createGithubAutolinksAction,
  createGithubDeployKeyAction,
  createGithubEnvironmentAction,
  createGithubIssuesLabelAction,
  createGithubRepoCreateAction,
  createGithubRepoPushAction,
  createGithubWebhookAction,
  createPublishGithubAction,
  createPublishGithubPullRequestAction,
} from '@backstage/plugin-scaffolder-backend-module-github';

import { createPublishAzureAction } from '@backstage/plugin-scaffolder-backend-module-azure';

import { createPublishBitbucketAction } from '@backstage/plugin-scaffolder-backend-module-bitbucket';

import {
  createPublishBitbucketCloudAction,
  createBitbucketPipelinesRunAction,
} from '@backstage/plugin-scaffolder-backend-module-bitbucket-cloud';

import {
  createPublishBitbucketServerAction,
  createPublishBitbucketServerPullRequestAction,
} from '@backstage/plugin-scaffolder-backend-module-bitbucket-server';

import {
  createPublishGerritAction,
  createPublishGerritReviewAction,
} from '@backstage/plugin-scaffolder-backend-module-gerrit';

import {
  createPublishGitlabAction,
  createGitlabRepoPushAction,
  createPublishGitlabMergeRequestAction,
} from '@backstage/plugin-scaffolder-backend-module-gitlab';

/**
 * The options passed to {@link createBuiltinActions}
 * @public
 */
export interface CreateBuiltInActionsOptions {
  /**
   * The {@link @backstage/backend-common#UrlReader} interface that will be used in the default actions.
   */
  reader: UrlReader;
  /**
   * The {@link @backstage/integrations#ScmIntegrations} that will be used in the default actions.
   */
  integrations: ScmIntegrations;
  /**
   * The {@link @backstage/catalog-client#CatalogApi} that will be used in the default actions.
   */
  catalogClient: CatalogApi;
  /**
   * The {@link @backstage/config#Config} that will be used in the default actions.
   */
  config: Config;
  /**
   * Additional custom filters that will be passed to the nunjucks template engine for use in
   * Template Manifests and also template skeleton files when using `fetch:template`.
   */
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}

/**
 * A function to generate create a list of default actions that the scaffolder provides.
 * Is called internally in the default setup, but can be used when adding your own actions or overriding the default ones
 *
 * TODO(blam): version 2 of the scaffolder shouldn't ship with the additional modules. We should ship the basics, and let people install
 * modules for the providers they want to use.
 * @public
 * @returns A list of actions that can be used in the scaffolder
 *
 */
export const createBuiltinActions = (
  options: CreateBuiltInActionsOptions,
): TemplateAction[] => {
  const {
    reader,
    integrations,
    catalogClient,
    config,
    additionalTemplateFilters,
    additionalTemplateGlobals,
  } = options;

  const githubCredentialsProvider: GithubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  const actions = [
    createFetchPlainAction({
      reader,
      integrations,
    }),
    createFetchPlainFileAction({
      reader,
      integrations,
    }),
    createFetchTemplateAction({
      integrations,
      reader,
      additionalTemplateFilters,
      additionalTemplateGlobals,
    }),
    createPublishGerritAction({
      integrations,
      config,
    }),
    createPublishGerritReviewAction({
      integrations,
      config,
    }),
    createPublishGithubAction({
      integrations,
      config,
      githubCredentialsProvider,
    }),
    createPublishGithubPullRequestAction({
      integrations,
      githubCredentialsProvider,
    }),
    createPublishGitlabAction({
      integrations,
      config,
    }),
    createPublishGitlabMergeRequestAction({
      integrations,
    }),
    createGitlabRepoPushAction({
      integrations,
    }),
    createPublishBitbucketAction({
      integrations,
      config,
    }),
    createPublishBitbucketCloudAction({
      integrations,
      config,
    }),
    createPublishBitbucketServerAction({
      integrations,
      config,
    }),
    createPublishBitbucketServerPullRequestAction({
      integrations,
      config,
    }),
    createPublishAzureAction({
      integrations,
      config,
    }),
    createDebugLogAction(),
    createWaitAction(),
    createCatalogRegisterAction({ catalogClient, integrations }),
    createFetchCatalogEntityAction({ catalogClient }),
    createCatalogWriteAction(),
    createFilesystemDeleteAction(),
    createFilesystemRenameAction(),
    createGithubActionsDispatchAction({
      integrations,
      githubCredentialsProvider,
    }),
    createGithubWebhookAction({
      integrations,
      githubCredentialsProvider,
    }),
    createGithubIssuesLabelAction({
      integrations,
      githubCredentialsProvider,
    }),
    createGithubRepoCreateAction({
      integrations,
      githubCredentialsProvider,
    }),
    createGithubRepoPushAction({
      integrations,
      config,
      githubCredentialsProvider,
    }),
    createGithubEnvironmentAction({
      integrations,
    }),
    createGithubDeployKeyAction({
      integrations,
    }),
    createGithubAutolinksAction({
      integrations,
      githubCredentialsProvider,
    }),
    createBitbucketPipelinesRunAction({
      integrations,
    }),
  ];

  return actions as TemplateAction[];
};
