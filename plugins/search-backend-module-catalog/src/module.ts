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
 *
 * A collator module for the search backend that indexes your software catalog.
 */

import {
  coreServices,
  createBackendModule,
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { readScheduleConfigOptions } from './collators/config';
import { CatalogCollatorEntityTransformer } from './collators';
import { DefaultCatalogCollatorFactory } from './collators/DefaultCatalogCollatorFactory';

/**
 * Options for {@link catalogCollatorExtensionPoint}.
 *
 * @public
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
 * @public
 */
export const catalogCollatorExtensionPoint =
  createExtensionPoint<CatalogCollatorExtensionPoint>({
    id: 'search.catalogCollator.extension',
  });

/**
 * Search backend module for the Catalog index.
 *
 * @public
 */
export const searchModuleCatalogCollator = createBackendModule({
  pluginId: 'search',
  moduleId: 'catalog-collator',
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
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({ auth, config, scheduler, indexRegistry, catalog }) {
        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(
            readScheduleConfigOptions(config),
          ),
          factory: DefaultCatalogCollatorFactory.fromConfig(config, {
            auth,
            catalog,
            entityTransformer,
          }),
        });
      },
    });
  },
});
