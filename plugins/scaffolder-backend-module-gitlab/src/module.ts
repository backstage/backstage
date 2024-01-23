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
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import {
  createGitlabGroupEnsureExistsAction,
  createGitlabIssueAction,
  createGitlabProjectAccessTokenAction,
  createGitlabProjectDeployTokenAction,
  createGitlabProjectVariableAction,
  createGitlabRepoPushAction,
  createPublishGitlabAction,
  createPublishGitlabMergeRequestAction,
} from './actions';
import { ScmIntegrations } from '@backstage/integration';

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
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, config }) {
        const integrations = ScmIntegrations.fromConfig(config);

        scaffolder.addActions(
          createGitlabGroupEnsureExistsAction({ integrations }),
          createGitlabIssueAction({ integrations }),
          createGitlabProjectAccessTokenAction({ integrations }),
          createGitlabProjectDeployTokenAction({ integrations }),
          createGitlabProjectVariableAction({ integrations }),
          createGitlabRepoPushAction({ integrations }),
          createPublishGitlabAction({ config, integrations }),
          createPublishGitlabMergeRequestAction({ integrations }),
        );
      },
    });
  },
});
