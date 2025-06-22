/*
 * Copyright 2024 The Backstage Authors
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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  scaffolderActionsExtensionPoint,
  scaffolderAutocompleteExtensionPoint,
} from '@backstage/plugin-scaffolder-node/alpha';
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
  createGithubPagesEnableAction,
  createGithubBranchProtectionAction,
} from './actions';
import {
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createHandleAutocompleteRequest } from './autocomplete/autocomplete';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

/**
 * @public
 * The GitHub Module for the Scaffolder Backend
 */
export const githubModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'github',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        catalog: catalogServiceRef,
        autocomplete: scaffolderAutocompleteExtensionPoint,
      },
      async init({ scaffolder, config, autocomplete, catalog }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const githubCredentialsProvider =
          DefaultGithubCredentialsProvider.fromIntegrations(integrations);

        scaffolder.addActions(
          createGithubActionsDispatchAction({
            integrations,
            githubCredentialsProvider,
          }),
          createGithubAutolinksAction({
            integrations,
            githubCredentialsProvider,
          }),
          createGithubDeployKeyAction({
            integrations,
          }),
          createGithubEnvironmentAction({
            integrations,
            catalog,
          }),
          createGithubIssuesLabelAction({
            integrations,
            githubCredentialsProvider,
          }),
          createGithubRepoCreateAction({
            integrations,
            githubCredentialsProvider,
          }),
          createGithubRepoPushAction({ integrations, config }),
          createGithubWebhookAction({
            integrations,
            githubCredentialsProvider,
          }),
          createPublishGithubAction({
            integrations,
            config,
            githubCredentialsProvider,
          }),
          createPublishGithubPullRequestAction({
            integrations,
            githubCredentialsProvider,
            config,
          }),
          createGithubPagesEnableAction({
            integrations,
            githubCredentialsProvider,
          }),
          createGithubBranchProtectionAction({
            integrations,
          }),
        );

        autocomplete.addAutocompleteProvider({
          id: 'github',
          handler: createHandleAutocompleteRequest({ integrations }),
        });
      },
    });
  },
});
