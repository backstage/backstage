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
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { CatalogBuilder } from './CatalogBuilder';
import {
  CatalogProcessingExtensionPoint,
  catalogProcessingExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import {
  CatalogProcessor,
  EntityProvider,
  PlaceholderResolver,
} from '@backstage/plugin-catalog-node';
import { loggerToWinstonLogger } from '@backstage/backend-common';

class CatalogExtensionPointImpl implements CatalogProcessingExtensionPoint {
  #processors = new Array<CatalogProcessor>();
  #entityProviders = new Array<EntityProvider>();
  #placeholderResolvers: Record<string, PlaceholderResolver> = {};

  addProcessor(
    ...processors: Array<CatalogProcessor | Array<CatalogProcessor>>
  ): void {
    this.#processors.push(...processors.flat());
  }

  addEntityProvider(
    ...providers: Array<EntityProvider | Array<EntityProvider>>
  ): void {
    this.#entityProviders.push(...providers.flat());
  }

  addPlaceholderResolver(key: string, resolver: PlaceholderResolver) {
    if (key in this.#placeholderResolvers)
      throw new Error(
        `A placeholder resolver for '${key}' has already been set up, please check your config.`,
      );
    this.#placeholderResolvers[key] = resolver;
  }

  get processors() {
    return this.#processors;
  }

  get entityProviders() {
    return this.#entityProviders;
  }

  get placeholderResolvers() {
    return this.#placeholderResolvers;
  }
}

/**
 * Catalog plugin
 * @alpha
 */
export const catalogPlugin = createBackendPlugin({
  pluginId: 'catalog',
  register(env) {
    const processingExtensions = new CatalogExtensionPointImpl();

    env.registerExtensionPoint(
      catalogProcessingExtensionPoint,
      processingExtensions,
    );

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        permissions: coreServices.permissions,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        lifecycle: coreServices.lifecycle,
        scheduler: coreServices.scheduler,
      },
      async init({
        logger,
        config,
        reader,
        database,
        permissions,
        httpRouter,
        lifecycle,
        scheduler,
      }) {
        const winstonLogger = loggerToWinstonLogger(logger);

        const builder = await CatalogBuilder.create({
          config,
          reader,
          permissions,
          database,
          scheduler,
          logger: winstonLogger,
        });

        builder.disableDefault('entity-model');
        builder.addProcessor(...processingExtensions.processors);
        builder.addEntityProvider(...processingExtensions.entityProviders);
        Object.entries(processingExtensions.placeholderResolvers).forEach(
          ([key, resolver]) => builder.setPlaceholderResolver(key, resolver),
        );

        const { processingEngine, router } = await builder.build();
        await processingEngine.start();

        lifecycle.addShutdownHook(() => processingEngine.stop());
        httpRouter.use(router);
      },
    });
  },
});
