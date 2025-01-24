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
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Entity, Validators } from '@backstage/catalog-model';
import { ForwardedError } from '@backstage/errors';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  EntityProvider,
  LocationAnalyzer,
  PlaceholderResolver,
  ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import {
  catalogAnalysisExtensionPoint,
  CatalogLocationsExtensionPoint,
  catalogLocationsExtensionPoint,
  CatalogModelExtensionPoint,
  catalogModelExtensionPoint,
  CatalogPermissionExtensionPoint,
  catalogPermissionExtensionPoint,
  CatalogProcessingExtensionPoint,
  catalogProcessingExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { Permission } from '@backstage/plugin-permission-common';
import { merge } from 'lodash';
import { CatalogBuilder, CatalogPermissionRuleInput } from './CatalogBuilder';

class CatalogLocationsExtensionPointImpl
  implements CatalogLocationsExtensionPoint
{
  #locationTypes: string[] | undefined;

  setAllowedLocationTypes(locationTypes: Array<string>) {
    this.#locationTypes = locationTypes;
  }

  get allowedLocationTypes() {
    return this.#locationTypes;
  }
}

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

class CatalogPermissionExtensionPointImpl
  implements CatalogPermissionExtensionPoint
{
  #permissions = new Array<Permission>();
  #permissionRules = new Array<CatalogPermissionRuleInput>();

  addPermissions(...permission: Array<Permission | Array<Permission>>): void {
    this.#permissions.push(...permission.flat());
  }

  addPermissionRules(
    ...rules: Array<
      CatalogPermissionRuleInput | Array<CatalogPermissionRuleInput>
    >
  ): void {
    this.#permissionRules.push(...rules.flat());
  }

  get permissions() {
    return this.#permissions;
  }

  get permissionRules() {
    return this.#permissionRules;
  }
}

class CatalogModelExtensionPointImpl implements CatalogModelExtensionPoint {
  #fieldValidators: Partial<Validators> = {};

  setFieldValidators(validators: Partial<Validators>): void {
    merge(this.#fieldValidators, validators);
  }

  get fieldValidators() {
    return this.#fieldValidators;
  }

  #entityDataParser?: CatalogProcessorParser;

  setEntityDataParser(parser: CatalogProcessorParser): void {
    if (this.#entityDataParser) {
      throw new Error(
        'Attempted to install second EntityDataParser. Only one can be set.',
      );
    }
    this.#entityDataParser = parser;
  }

  get entityDataParser() {
    return this.#entityDataParser;
  }
}

/**
 * Catalog plugin
 * @public
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

    let locationAnalyzerFactory:
      | ((options: {
          scmLocationAnalyzers: ScmLocationAnalyzer[];
        }) => Promise<{ locationAnalyzer: LocationAnalyzer }>)
      | undefined = undefined;
    const scmLocationAnalyzers = new Array<ScmLocationAnalyzer>();
    env.registerExtensionPoint(catalogAnalysisExtensionPoint, {
      setLocationAnalyzer(analyzerOrFactory) {
        if (locationAnalyzerFactory) {
          throw new Error('LocationAnalyzer has already been set');
        }
        if (typeof analyzerOrFactory === 'function') {
          locationAnalyzerFactory = analyzerOrFactory;
        } else {
          locationAnalyzerFactory = async () => ({
            locationAnalyzer: analyzerOrFactory,
          });
        }
      },
      addScmLocationAnalyzer(analyzer: ScmLocationAnalyzer) {
        scmLocationAnalyzers.push(analyzer);
      },
    });

    const permissionExtensions = new CatalogPermissionExtensionPointImpl();
    env.registerExtensionPoint(
      catalogPermissionExtensionPoint,
      permissionExtensions,
    );

    const modelExtensions = new CatalogModelExtensionPointImpl();
    env.registerExtensionPoint(catalogModelExtensionPoint, modelExtensions);

    const locationTypeExtensions = new CatalogLocationsExtensionPointImpl();
    env.registerExtensionPoint(
      catalogLocationsExtensionPoint,
      locationTypeExtensions,
    );

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        reader: coreServices.urlReader,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        lifecycle: coreServices.rootLifecycle,
        scheduler: coreServices.scheduler,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        auditor: coreServices.auditor,
        events: eventsServiceRef,
      },
      async init({
        logger,
        config,
        reader,
        database,
        permissions,
        permissionsRegistry,
        httpRouter,
        lifecycle,
        scheduler,
        discovery,
        auth,
        httpAuth,
        auditor,
        events,
      }) {
        const builder = await CatalogBuilder.create({
          config,
          reader,
          permissions,
          permissionsRegistry,
          database,
          scheduler,
          logger,
          discovery,
          auth,
          httpAuth,
          auditor,
        });

        builder.setEventBroker(events);

        if (processingExtensions.onProcessingErrorHandler) {
          builder.subscribe({
            onProcessingError: processingExtensions.onProcessingErrorHandler,
          });
        }
        builder.addProcessor(...processingExtensions.processors);
        builder.addEntityProvider(...processingExtensions.entityProviders);

        if (modelExtensions.entityDataParser) {
          builder.setEntityDataParser(modelExtensions.entityDataParser);
        }

        Object.entries(processingExtensions.placeholderResolvers).forEach(
          ([key, resolver]) => builder.setPlaceholderResolver(key, resolver),
        );
        if (locationAnalyzerFactory) {
          const { locationAnalyzer } = await locationAnalyzerFactory({
            scmLocationAnalyzers,
          }).catch(e => {
            throw new ForwardedError('Failed to create LocationAnalyzer', e);
          });
          builder.setLocationAnalyzer(locationAnalyzer);
        } else {
          builder.addLocationAnalyzers(...scmLocationAnalyzers);
        }
        builder.addPermissions(...permissionExtensions.permissions);
        builder.addPermissionRules(...permissionExtensions.permissionRules);
        builder.setFieldFormatValidators(modelExtensions.fieldValidators);

        if (locationTypeExtensions.allowedLocationTypes) {
          builder.setAllowedLocationTypes(
            locationTypeExtensions.allowedLocationTypes,
          );
        }

        const { processingEngine, router } = await builder.build();

        if (config.getOptional('catalog.processingInterval') ?? true) {
          lifecycle.addStartupHook(async () => {
            await processingEngine.start();
          });
          lifecycle.addShutdownHook(() => processingEngine.stop());
        }

        httpRouter.use(router);
      },
    });
  },
});
