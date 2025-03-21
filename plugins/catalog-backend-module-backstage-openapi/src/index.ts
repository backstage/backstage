/*
 * Copyright 2023 The Backstage Authors
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
import { InternalOpenApiDocumentationProvider } from './InternalOpenApiDocumentationProvider';

/**
 * @public
 */
export type MetaApiDocsPluginOptions = { exampleOption: boolean };

/**
 * @public
 */
export const metaOpenApiDocsPluginId = 'meta-api-docs';

/**
 * @public
 */
export const catalogModuleInternalOpenApiSpec = createBackendModule({
  moduleId: metaOpenApiDocsPluginId,
  pluginId: 'catalog',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        logger: coreServices.logger,
        auth: coreServices.auth,
      },
      async init({ catalog, config, discovery, scheduler, logger, auth }) {
        catalog.addEntityProvider(
          InternalOpenApiDocumentationProvider.fromConfig(config, {
            discovery,
            schedule: scheduler,
            logger,
            auth,
          }),
        );
      },
    });
  },
});

export default catalogModuleInternalOpenApiSpec;
