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
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { AwsOrganizationEntityProvider } from '../providers/AwsOrganizationProvider';

/**
 * Registers the AwsOrganizationEntityProvider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleAwsOrganization = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'aws-org',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        catalogProcessor: catalogProcessingExtensionPoint,
      },
      async init({ logger, config, scheduler, catalogProcessor }) {
        catalogProcessor.addEntityProvider(
          await AwsOrganizationEntityProvider.fromConfig(config, {
            logger,
            scheduler: scheduler,
          }),
        );
      },
    });
  },
});
