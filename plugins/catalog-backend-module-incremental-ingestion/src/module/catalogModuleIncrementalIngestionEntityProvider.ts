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
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import {
  IncrementalEntityProvider,
  IncrementalEntityProviderOptions,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { WrapperProviders } from './WrapperProviders';
import { eventsServiceRef } from '@backstage/plugin-events-node';

/**
 * @public
 * Interface for {@link incrementalIngestionProvidersExtensionPoint}.
 */
export interface IncrementalIngestionProviderExtensionPoint {
  /** Adds a new incremental entity provider */
  addProvider<TCursor, TContext>(config: {
    options: IncrementalEntityProviderOptions;
    provider: IncrementalEntityProvider<TCursor, TContext>;
  }): void;
}

/**
 * @public
 *
 * Extension point for registering incremental ingestion providers.
 * The `catalogModuleIncrementalIngestionEntityProvider` must be installed for these providers to work.
 *
 * @example
 *
 * ```ts
 * backend.add(createBackendModule({
 *   pluginId: 'catalog',
 *   moduleId: 'my-incremental-provider',
 *   register(env) {
 *     env.registerInit({
 *       deps: {
 *         extension: incrementalIngestionProvidersExtensionPoint,
 *       },
 *       async init({ extension }) {
 *         extension.addProvider({
 *           burstInterval: ...,
 *           burstLength: ...,
 *           restLength: ...,
 *         }, {
 *           next(context, cursor) {
 *             ...
 *           },
 *           ...
 *         })
 *       })
 *     })
 *   }
 * }))
 * ```
 */
export const incrementalIngestionProvidersExtensionPoint =
  createExtensionPoint<IncrementalIngestionProviderExtensionPoint>({
    id: 'catalog.incrementalIngestionProvider.providers',
  });

/**
 * Registers the incremental entity provider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleIncrementalIngestionEntityProvider =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'incremental-ingestion-entity-provider',
    register(env) {
      const addedProviders = new Array<{
        provider: IncrementalEntityProvider<unknown, unknown>;
        options: IncrementalEntityProviderOptions;
      }>();

      env.registerExtensionPoint(incrementalIngestionProvidersExtensionPoint, {
        addProvider({ options, provider }) {
          addedProviders.push({ options, provider });
        },
      });

      env.registerInit({
        deps: {
          catalog: catalogProcessingExtensionPoint,
          config: coreServices.rootConfig,
          database: coreServices.database,
          httpRouter: coreServices.httpRouter,
          logger: coreServices.logger,
          scheduler: coreServices.scheduler,
          events: eventsServiceRef,
        },
        async init({
          catalog,
          config,
          database,
          httpRouter,
          logger,
          scheduler,
          events,
        }) {
          const client = await database.getClient();

          const providers = new WrapperProviders({
            config,
            logger,
            client,
            scheduler,
            events,
          });

          for (const entry of addedProviders) {
            const wrapped = providers.wrap(entry.provider, entry.options);
            catalog.addEntityProvider(wrapped);
          }

          httpRouter.use(providers.adminRouter());
        },
      });
    },
  });
