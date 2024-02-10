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
import { Entity } from '@backstage/catalog-model';
import { CatalogBuilder, CatalogPermissionRuleInput } from './CatalogBuilder';
import {
  CatalogAnalysisExtensionPoint,
  catalogAnalysisExtensionPoint,
  CatalogProcessingExtensionPoint,
  catalogProcessingExtensionPoint,
  CatalogPermissionExtensionPoint,
  catalogPermissionExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import {
  CatalogProcessor,
  EntityProvider,
  ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { PlaceholderResolver } from '../modules';

class CatalogProcessingExtensionPointImpl
  implements CatalogProcessingExtensionPoint
{
  #processors = new Array<CatalogProcessor>();
  #entityProviders = new Array<EntityProvider>();
  #placeholderResolvers: Record<string, PlaceholderResolver> = {};
  #onProcessingErrorHandler?: (event: {
    unprocessedEntity: Entity;
    errors: Error[];
  }) => Promise<void> | void;

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

  setOnProcessingErrorHandler(
    handler: (event: {
      unprocessedEntity: Entity;
      errors: Error[];
    }) => Promise<void> | void,
  ) {
    this.#onProcessingErrorHandler = handler;
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

  get onProcessingErrorHandler() {
    return this.#onProcessingErrorHandler;
  }
}

class CatalogAnalysisExtensionPointImpl
  implements CatalogAnalysisExtensionPoint
{
  #locationAnalyzers = new Array<ScmLocationAnalyzer>();

  addLocationAnalyzer(analyzer: ScmLocationAnalyzer): void {
    this.#locationAnalyzers.push(analyzer);
  }

  get locationAnalyzers() {
    return this.#locationAnalyzers;
  }
}

class CatalogPermissionExtensionPointImpl
  implements CatalogPermissionExtensionPoint
{
  #permissionRules = new Array<CatalogPermissionRuleInput>();

  addPermissionRules(
    ...rules: Array<
      CatalogPermissionRuleInput | Array<CatalogPermissionRuleInput>
    >
  ): void {
    this.#permissionRules.push(...rules.flat());
  }

  get permissionRules() {
    return this.#permissionRules;
  }
}

/**
 * Catalog plugin
 * @alpha
 */
export const catalogPlugin = createBackendPlugin({
  pluginId: 'catalog',
  register(env) {
    const processingExtensions = new CatalogProcessingExtensionPointImpl();
    // plugins depending on this API will be initialized before this plugins init method is executed.
    env.registerExtensionPoint(
      catalogProcessingExtensionPoint,
      processingExtensions,
    );

    const analysisExtensions = new CatalogAnalysisExtensionPointImpl();
    env.registerExtensionPoint(
      catalogAnalysisExtensionPoint,
      analysisExtensions,
    );

    const permissionExtensions = new CatalogPermissionExtensionPointImpl();
    env.registerExtensionPoint(
      catalogPermissionExtensionPoint,
      permissionExtensions,
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
        if (processingExtensions.onProcessingErrorHandler) {
          builder.subscribe({
            onProcessingError: processingExtensions.onProcessingErrorHandler,
          });
        }
        builder.addProcessor(...processingExtensions.processors);
        builder.addEntityProvider(...processingExtensions.entityProviders);
        Object.entries(processingExtensions.placeholderResolvers).forEach(
          ([key, resolver]) => builder.setPlaceholderResolver(key, resolver),
        );
        builder.addLocationAnalyzers(...analysisExtensions.locationAnalyzers);
        builder.addPermissionRules(...permissionExtensions.permissionRules);

        const { processingEngine, router } = await builder.build();

        await processingEngine.start();
        lifecycle.addShutdownHook(() => processingEngine.stop());
        httpRouter.use(router);
      },
    });
  },
});
