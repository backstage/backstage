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
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  DocsBuildStrategy,
  Generators,
  PreparerBase,
  Preparers,
  Publisher,
  PublisherBase,
  PublisherSettings,
  PublisherType,
  RemoteProtocol,
  techdocsBuildsExtensionPoint,
  TechdocsGenerator,
  techdocsGeneratorExtensionPoint,
  techdocsPreparerExtensionPoint,
  techdocsPublisherExtensionPoint,
} from '@backstage/plugin-techdocs-node';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import * as winston from 'winston';
import { createRouter } from './service/router';

/**
 * The TechDocs plugin is responsible for serving and building documentation for any entity.
 * @public
 */
export const techdocsPlugin = createBackendPlugin({
  pluginId: 'techdocs',
  register(env) {
    let docsBuildStrategy: DocsBuildStrategy | undefined;
    let buildLogTransport: winston.transport | undefined;
    env.registerExtensionPoint(techdocsBuildsExtensionPoint, {
      setBuildStrategy(buildStrategy: DocsBuildStrategy) {
        if (docsBuildStrategy) {
          throw new Error('DocsBuildStrategy may only be set once');
        }
        docsBuildStrategy = buildStrategy;
      },
      setBuildLogTransport(transport: winston.transport) {
        if (buildLogTransport) {
          throw new Error('BuildLogTransport may only be set once');
        }
        buildLogTransport = transport;
      },
    });

    let customTechdocsGenerator: TechdocsGenerator | undefined;
    env.registerExtensionPoint(techdocsGeneratorExtensionPoint, {
      setTechdocsGenerator(generator: TechdocsGenerator) {
        if (customTechdocsGenerator) {
          throw new Error('TechdocsGenerator may only be set once');
        }

        customTechdocsGenerator = generator;
      },
    });

    const customPreparers = new Map<RemoteProtocol, PreparerBase>();
    env.registerExtensionPoint(techdocsPreparerExtensionPoint, {
      registerPreparer(protocol: RemoteProtocol, preparer: PreparerBase) {
        if (customPreparers.has(protocol)) {
          throw new Error(
            `Preparer for protocol ${protocol} is already registered`,
          );
        }
        customPreparers.set(protocol, preparer);
      },
    });

    let customTechdocsPublisher: PublisherBase | undefined;
    const publisherSettings: PublisherSettings = {};
    env.registerExtensionPoint(techdocsPublisherExtensionPoint, {
      registerPublisher(type: PublisherType, publisher: PublisherBase) {
        if (customTechdocsPublisher) {
          throw new Error(`Publisher for type ${type} is already registered`);
        }
        customTechdocsPublisher = publisher;
      },
      registerPublisherSettings<T extends keyof PublisherSettings>(
        publisher: T,
        settings: PublisherSettings[T],
      ) {
        publisherSettings[publisher] = settings;
      },
    });

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        urlReader: coreServices.urlReader,
        http: coreServices.httpRouter,
        discovery: coreServices.discovery,
        cache: coreServices.cache,
        httpAuth: coreServices.httpAuth,
        auth: coreServices.auth,
        catalog: catalogServiceRef,
      },
      async init({
        config,
        logger,
        urlReader,
        http,
        discovery,
        cache,
        httpAuth,
        auth,
        catalog,
      }) {
        // Preparers are responsible for fetching source files for documentation.
        const preparers = await Preparers.fromConfig(config, {
          reader: urlReader,
          logger: logger,
        });
        for (const [protocol, preparer] of customPreparers.entries()) {
          preparers.register(protocol, preparer);
        }

        // Generators are used for generating documentation sites.
        const generators = await Generators.fromConfig(config, {
          logger: logger,
          customGenerator: customTechdocsGenerator,
        });

        // Publisher is used for
        // 1. Publishing generated files to storage
        // 2. Fetching files from storage and passing them to TechDocs frontend.
        const publisher = await Publisher.fromConfig(config, {
          logger: logger,
          discovery: discovery,
          customPublisher: customTechdocsPublisher,
          publisherSettings,
        });

        // checks if the publisher is working and logs the result
        await publisher.getReadiness();

        http.use(
          await createRouter({
            logger: logger,
            cache,
            docsBuildStrategy,
            buildLogTransport,
            preparers,
            generators,
            publisher,
            config,
            discovery,
            httpAuth,
            auth,
            catalogClient: catalog,
          }),
        );

        http.addAuthPolicy({
          path: '/static',
          allow: 'user-cookie',
        });
      },
    });
  },
});
