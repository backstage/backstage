/*
 * Copyright 2022 The Backstage Authors
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
} from '@backstage/connections-node';
import { ScmIntegrations } from '@backstage/integration';
import { DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { AwsS3EntityProvider } from '../providers';

/**
 * Registers the AwsS3EntityProvider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleAwsS3EntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'aws-s3-entity-provider',
  register(env) {
    declareConnection(env, {
      type: 'aws-s3',
      description: 'Discovers catalog files stored in AWS S3 buckets',
    });
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        connections: connectionsServiceRef,
      },
      async init({ config, catalog, logger, scheduler, connections }) {
        const integration = ScmIntegrations.fromConfig(config).awsS3.list()[0];
        if (!integration) {
          throw new Error('No integration found for awsS3');
        }
        const awsCredentialsManager =
          DefaultAwsCredentialsManager.fromConnections(connections, {
            type: 'aws-s3',
            url:
              integration.config.endpoint ??
              `https://${integration.config.host}`,
          });

        catalog.addEntityProvider(
          AwsS3EntityProvider.fromConfig(config, {
            logger,
            scheduler,
            awsCredentialsManager,
          }),
        );
      },
    });
  },
});
