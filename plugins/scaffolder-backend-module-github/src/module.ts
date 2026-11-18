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
  connectionsServiceRef,
  declareConnection,
} from '@backstage/backend-plugin-api/alpha';
import { scaffolderAutocompleteExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import {
  createGithubActionsDispatchAction,
  createGithubAutolinksAction,
  createGithubDeployKeyAction,
  createGithubEnvironmentAction,
  createGithubIssuesLabelAction,
  createGithubIssuesCreateAction,
  createGithubRepoCreateAction,
  createGithubRepoPushAction,
  createGithubWebhookAction,
  createPublishGithubAction,
  createPublishGithubPullRequestAction,
  createGithubPagesEnableAction,
  createGithubBranchProtectionAction,
  createGithubRepoRulesetsCreateAction,
} from './actions';
import { createGitHubCredentialsProviderFromConnection } from '@backstage/integration/alpha';
import {
  ScmIntegrations,
  type GithubCredentialsProvider,
} from '@backstage/integration';
import { createHandleAutocompleteRequest } from './autocomplete/autocomplete';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';

/**
 * @public
 * The GitHub Module for the Scaffolder Backend
 */
export const githubModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'github',
  register(reg) {
    declareConnection(reg, {
      type: 'github',
      description:
        'Used by the Scaffolder GitHub module to look up GitHub credentials via the connections service',
    });

    reg.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        catalog: catalogServiceRef,
        autocomplete: scaffolderAutocompleteExtensionPoint,
        connections: connectionsServiceRef,
      },
      async init({ scaffolder, config, autocomplete, catalog, connections }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const requireScmUserCredentials =
          config.getOptionalBoolean('scaffolder.requireScmUserCredentials') ??
          false;
        const githubCredentialsProvider: GithubCredentialsProvider =
          createGitHubCredentialsProviderFromConnection(connections);

        scaffolder.addActions(
          createGithubActionsDispatchAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubAutolinksAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubDeployKeyAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubEnvironmentAction({
            integrations,
            catalog,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubIssuesLabelAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubIssuesCreateAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubRepoCreateAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubRepoPushAction({
            integrations,
            config,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubWebhookAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createPublishGithubAction({
            integrations,
            config,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createPublishGithubPullRequestAction({
            integrations,
            githubCredentialsProvider,
            config,
            requireScmUserCredentials,
          }),
          createGithubPagesEnableAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubBranchProtectionAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
          }),
          createGithubRepoRulesetsCreateAction({
            integrations,
            githubCredentialsProvider,
            requireScmUserCredentials,
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
