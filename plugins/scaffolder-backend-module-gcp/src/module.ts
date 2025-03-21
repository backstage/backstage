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
import { scaffolderWorkspaceProviderExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { GcpBucketWorkspaceProvider } from './providers/GcpBucketWorkspaceProvider';

/**
 * @public
 * The Azure Module for the Scaffolder Backend
 */
export const gcpBucketModule = createBackendModule({
  moduleId: 'gcp',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderWorkspaceProviders: scaffolderWorkspaceProviderExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async init({ config, logger, scaffolderWorkspaceProviders }) {
        scaffolderWorkspaceProviders.addProviders({
          gcpBucket: GcpBucketWorkspaceProvider.create(logger, config),
        });
      },
    });
  },
});
