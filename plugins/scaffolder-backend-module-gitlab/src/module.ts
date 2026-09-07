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
import { ScmIntegrations } from '@backstage/integration';
import { scaffolderAutocompleteExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import {
  createGitlabGroupEnsureExistsAction,
  createGitlabGroupAccessAction,
  createGitlabIssueAction,
  createGitlabProjectAccessTokenAction,
  createGitlabProjectDeployTokenAction,
  createGitlabProjectVariableAction,
  createGitlabRepoPushAction,
  createGitlabUserInfoAction,
  createPublishGitlabAction,
  createPublishGitlabMergeRequestAction,
  createTriggerGitlabPipelineAction,
  editGitlabIssueAction,
} from './actions';
import { createGitlabProjectMigrateAction } from './actions/gitlabProjectMigrate';
import { createHandleAutocompleteRequest } from './autocomplete/autocomplete';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';

/**
 * @public
 * The GitLab Module for the Scaffolder Backend
 */
export const gitlabModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'gitlab',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        autocomplete: scaffolderAutocompleteExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, autocomplete, config }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const requireScmUserCredentials =
          config.getOptionalBoolean('scaffolder.requireScmUserCredentials') ??
          false;

        scaffolder.addActions(
          createGitlabGroupEnsureExistsAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabGroupAccessAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabProjectMigrateAction({ integrations }),
          createGitlabIssueAction({ integrations, requireScmUserCredentials }),
          createGitlabProjectAccessTokenAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabProjectDeployTokenAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabProjectVariableAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabRepoPushAction({
            integrations,
            requireScmUserCredentials,
          }),
          createGitlabUserInfoAction({ integrations }),
          editGitlabIssueAction({ integrations, requireScmUserCredentials }),
          createPublishGitlabAction({ config, integrations }),
          createPublishGitlabMergeRequestAction({
            integrations,
            requireScmUserCredentials,
          }),
          createTriggerGitlabPipelineAction({
            integrations,
            requireScmUserCredentials,
          }),
        );

        autocomplete.addAutocompleteProvider({
          id: 'gitlab',
          handler: createHandleAutocompleteRequest({ integrations }),
        });
      },
    });
  },
});
