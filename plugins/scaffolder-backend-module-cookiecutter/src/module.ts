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
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createFetchCookiecutterAction, ContainerRunner } from './actions';
import { ScmIntegrations } from '@backstage/integration';

export const cookieCutterContainerRunnerServiceRef =
  createServiceRef<ContainerRunner>({
    id: 'scaffolder.cookiecutter.containerRunner',
    scope: 'plugin',
    multiton: true,
  });

/**
 * @public
 * The Cookiecutter Module for the Scaffolder Backend
 */
export const cookiecutterModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'cookiecutter',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        containerRunner: cookieCutterContainerRunnerServiceRef,
      },
      async init({ scaffolder, config, reader, containerRunner }) {
        if (containerRunner.length > 1) {
          throw new Error('Multiple container runners are not supported');
        }

        const integrations = ScmIntegrations.fromConfig(config);
        scaffolder.addActions(
          createFetchCookiecutterAction({
            reader,
            integrations,
            containerRunner: containerRunner[0],
          }),
        );
      },
    });
  },
});
