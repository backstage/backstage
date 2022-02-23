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

import { ContainerRunner, UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { CatalogApi } from '@backstage/catalog-client';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
} from '@backstage/integration';
import { Config } from '@backstage/config';
import {
  createCatalogWriteAction,
  createCatalogRegisterAction,
} from './catalog';

import { createDebugLogAction } from './debug';
import { createFetchPlainAction, createFetchTemplateAction } from './fetch';
import { createFetchCookiecutterAction } from '@backstage/plugin-scaffolder-backend-module-cookiecutter';
import {
  createFilesystemDeleteAction,
  createFilesystemRenameAction,
} from './filesystem';
import {
  createPublishAzureAction,
  createPublishBitbucketAction,
  createPublishGithubAction,
  createPublishGithubPullRequestAction,
  createPublishGitlabAction,
  createPublishGitlabMergeRequestAction,
} from './publish';
import {
  createGithubActionsDispatchAction,
  createGithubWebhookAction,
} from './github';
import { TemplateFilter } from '../../../lib';
import { TemplateAction } from '../types';
import { getRootLogger } from '@backstage/backend-common';

/**
 * The options passed to {@link createBuiltinActions}
 * @public
 */
export interface CreateBuiltInActionsOptions {
  reader: UrlReader;
  integrations: ScmIntegrations;
  catalogClient: CatalogApi;
  /** @deprecated when the cookiecutter action is removed this won't be necessary */
  containerRunner?: ContainerRunner;
  config: Config;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
}

/**
 * A function to generate create a list of default actions that the scaffolder provides.
 * Is called internally in the default setup, but can be used when adding your own actions or overriding the default ones
 *
 * @public
 * @returns A list of actions that can be used in the scaffolder
 */
export const createBuiltinActions = (
  options: CreateBuiltInActionsOptions,
): TemplateAction<JsonObject>[] => {
  const {
    reader,
    integrations,
    containerRunner,
    catalogClient,
    config,
    additionalTemplateFilters,
  } = options;
  const githubCredentialsProvider: GithubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  const actions = [
    createFetchPlainAction({
      reader,
      integrations,
    }),
    createFetchTemplateAction({
      integrations,
      reader,
      additionalTemplateFilters,
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
    createPublishBitbucketAction({
      integrations,
      config,
    }),
    createPublishAzureAction({
      integrations,
      config,
    }),
    createDebugLogAction(),
    createCatalogRegisterAction({ catalogClient, integrations }),
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
  ];

  if (containerRunner) {
    getRootLogger().warn(
      `[DEPRECATED] The fetch:cookiecutter action will be removed part of the default scaffolder actions in later versions. 
You can install the package seperately and remove the containerRunner from the createBuiltInActions to remove this warning,
or you can migrate to using fetch:template https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetchcookiecutter-to-fetchtemplate`,
    );
    actions.push(
      createFetchCookiecutterAction({
        reader,
        integrations,
        containerRunner,
      }),
    );
  }

  return actions as TemplateAction<JsonObject>[];
};
