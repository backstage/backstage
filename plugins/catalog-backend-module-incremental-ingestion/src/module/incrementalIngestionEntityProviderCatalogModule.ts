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
  configServiceRef,
  createBackendModule,
  databaseServiceRef,
  loggerServiceRef,
  schedulerServiceRef,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import {
  IncrementalEntityProvider,
  IncrementalEntityProviderOptions,
} from '../types';
import { WrapperProviders } from './WrapperProviders';

/**
 * Registers the incremental entity provider with the catalog processing extension point.
 *
 * @alpha
 */
export const incrementalIngestionEntityProviderCatalogModule =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'incrementalIngestionEntityProvider',
    register(
      env,
      options: {
        providers: Array<{
          provider: IncrementalEntityProvider<unknown, unknown>;
          options: IncrementalEntityProviderOptions;
        }>;
      },
    ) {
      env.registerInit({
        deps: {
          catalog: catalogProcessingExtensionPoint,
          config: configServiceRef,
          logger: loggerServiceRef,
          database: databaseServiceRef,
          scheduler: schedulerServiceRef,
        },
        async init({ catalog, ...otherDeps }) {
          const providers = new WrapperProviders(otherDeps);
          for (const entry of options.providers) {
            catalog.addEntityProvider(
              providers.wrap(entry.provider, entry.options),
            );
          }
        },
      });
    },
  });
