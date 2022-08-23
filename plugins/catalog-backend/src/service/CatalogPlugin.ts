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
  createBackendPlugin,
  databaseServiceRef,
  loggerServiceRef,
  loggerToWinstonLogger,
  permissionsServiceRef,
  urlReaderServiceRef,
  httpRouterServiceRef,
} from '@backstage/backend-plugin-api';
import { CatalogBuilder } from './CatalogBuilder';
import {
  CatalogProcessor,
  CatalogProcessingExtensionPoint,
  catalogProcessingExtensionPoint,
  EntityProvider,
} from '@backstage/plugin-catalog-node';

class CatalogExtensionPointImpl implements CatalogProcessingExtensionPoint {
  #processors = new Array<CatalogProcessor>();
  #entityProviders = new Array<EntityProvider>();

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

  get processors() {
    return this.#processors;
  }

  get entityProviders() {
    return this.#entityProviders;
  }
}

/**
 * Catalog plugin
 * @alpha
 */
export const catalogPlugin = createBackendPlugin({
  id: 'catalog',
  register(env) {
    const processingExtensions = new CatalogExtensionPointImpl();
    // plugins depending on this API will be initialized before this plugins init method is executed.
    env.registerExtensionPoint(
      catalogProcessingExtensionPoint,
      processingExtensions,
    );

    env.registerInit({
      deps: {
        logger: loggerServiceRef,
        config: configServiceRef,
        reader: urlReaderServiceRef,
        permissions: permissionsServiceRef,
        database: databaseServiceRef,
        httpRouter: httpRouterServiceRef,
      },
      async init({
        logger,
        config,
        reader,
        database,
        permissions,
        httpRouter,
      }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const builder = await CatalogBuilder.create({
          config,
          reader,
          permissions,
          database,
          logger: winstonLogger,
        });
        builder.addProcessor(...processingExtensions.processors);
        builder.addEntityProvider(...processingExtensions.entityProviders);
        const { processingEngine, router } = await builder.build();

        await processingEngine.start();

        httpRouter.use(router);
      },
    });
  },
});
