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
} from '@backstage/backend-plugin-api';
import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';

import {
  CatalogCollatorEntityTransformer,
  DefaultCatalogCollatorFactory,
  DefaultCatalogCollatorFactoryOptions,
} from './collators';

export type {
  CatalogCollatorEntityTransformer,
  DefaultCatalogCollatorFactory,
  DefaultCatalogCollatorFactoryOptions,
};

/**
 * @alpha
 * Options for {@link searchModuleCatalogCollator}.
 */
export type SearchModuleCatalogCollatorOptions = Omit<
  DefaultCatalogCollatorFactoryOptions,
  'discovery' | 'tokenManager'
> & {
  schedule?: TaskScheduleDefinition;
};

/**
 * @alpha
 * Search backend module for the Catalog index.
 */
export const searchModuleCatalogCollator = createBackendModule(
  (options?: SearchModuleCatalogCollatorOptions) => ({
    moduleId: 'catalogCollator',
    pluginId: 'search',
    register(env) {
      env.registerInit({
        deps: {
          config: coreServices.config,
          discovery: coreServices.discovery,
          tokenManager: coreServices.tokenManager,
          scheduler: coreServices.scheduler,
          indexRegistry: searchIndexRegistryExtensionPoint,
        },
        async init({
          config,
          discovery,
          tokenManager,
          scheduler,
          indexRegistry,
        }) {
          const defaultSchedule = {
            frequency: { minutes: 10 },
            timeout: { minutes: 15 },
            initialDelay: { seconds: 3 },
          };

          indexRegistry.addCollator({
            schedule: scheduler.createScheduledTaskRunner(
              options?.schedule ?? defaultSchedule,
            ),
            factory: DefaultCatalogCollatorFactory.fromConfig(config, {
              ...options,
              discovery,
              tokenManager,
            }),
          });
        },
      });
    },
  }),
);
