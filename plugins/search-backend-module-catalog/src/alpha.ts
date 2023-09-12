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

/**
 * @packageDocumentation
 * A module for the search backend that exports Catalog modules.
 */

import {
  coreServices,
  createBackendModule,
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import {
  CatalogCollatorEntityTransformer,
  DefaultCatalogCollatorFactory,
} from '@backstage/plugin-search-backend-module-catalog';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { readScheduleConfigOptions } from './collators/config';

/**
 * Options for {@link catalogCollatorExtensionPoint}.
 *
 * @alpha
 */
export type CatalogCollatorExtensionPoint = {
  /**
   * Allows you to customize how entities are shaped into documents.
   */
  setEntityTransformer(transformer: CatalogCollatorEntityTransformer): void;
};

/**
 * Extension point for customizing how catalog entities are shaped into
 * documents for the search backend.
 *
 * @alpha
 */
export const catalogCollatorExtensionPoint =
  createExtensionPoint<CatalogCollatorExtensionPoint>({
    id: 'search.catalogCollator.extension',
  });

/**
 * Search backend module for the Catalog index.
 *
 * @alpha
 */
export default createBackendModule({
  moduleId: 'catalogCollator',
  pluginId: 'search',
  register(env) {
    let entityTransformer: CatalogCollatorEntityTransformer | undefined;

    env.registerExtensionPoint(catalogCollatorExtensionPoint, {
      setEntityTransformer(transformer) {
        if (entityTransformer) {
          throw new Error('setEntityTransformer can only be called once');
        }
        entityTransformer = transformer;
      },
    });

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        tokenManager: coreServices.tokenManager,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({
        config,
        discovery,
        tokenManager,
        scheduler,
        indexRegistry,
        catalog,
      }) {
        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(
            readScheduleConfigOptions(config),
          ),
          factory: DefaultCatalogCollatorFactory.fromConfig(config, {
            entityTransformer,
            discovery,
            tokenManager,
            catalogClient: catalog,
          }),
        });
      },
    });
  },
});
