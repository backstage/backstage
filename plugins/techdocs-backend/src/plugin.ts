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
  DockerContainerRunner,
  loggerToWinstonLogger,
  cacheToPluginCacheManager,
} from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

import {
  DocsBuildStrategy,
  Preparers,
  Generators,
  Publisher,
  techdocsBuildsExtensionPoint,
  techdocsGeneratorExtensionPoint,
  TechdocsGenerator,
} from '@backstage/plugin-techdocs-node';
import Docker from 'dockerode';
import { createRouter } from '@backstage/plugin-techdocs-backend';

/**
 * The TechDocs plugin is responsible for serving and building documentation for any entity.
 * @alpha
 */
export const techdocsPlugin = createBackendPlugin({
  pluginId: 'techdocs',
  register(env) {
    let docsBuildStrategy: DocsBuildStrategy | undefined;
    env.registerExtensionPoint(techdocsBuildsExtensionPoint, {
      setBuildStrategy(buildStrategy: DocsBuildStrategy) {
        if (docsBuildStrategy) {
          throw new Error('DocsBuildStrategy may only be set once');
        }
        docsBuildStrategy = buildStrategy;
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

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        urlReader: coreServices.urlReader,
        http: coreServices.httpRouter,
        discovery: coreServices.discovery,
        cache: coreServices.cache,
        httpAuth: coreServices.httpAuth,
      },
      async init({
        config,
        logger,
        urlReader,
        http,
        discovery,
        cache,
        httpAuth,
      }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        // Preparers are responsible for fetching source files for documentation.
        const preparers = await Preparers.fromConfig(config, {
          reader: urlReader,
          logger: winstonLogger,
        });

        // Docker client (conditionally) used by the generators, based on techdocs.generators config.
        const dockerClient = new Docker();
        const containerRunner = new DockerContainerRunner({ dockerClient });

        // Generators are used for generating documentation sites.
        const generators = await Generators.fromConfig(config, {
          logger: winstonLogger,
          containerRunner,
          customGenerator: customTechdocsGenerator,
        });

        // Publisher is used for
        // 1. Publishing generated files to storage
        // 2. Fetching files from storage and passing them to TechDocs frontend.
        const publisher = await Publisher.fromConfig(config, {
          logger: winstonLogger,
          discovery: discovery,
        });

        // checks if the publisher is working and logs the result
        await publisher.getReadiness();

        const cacheManager = cacheToPluginCacheManager(cache);
        http.use(
          await createRouter({
            logger: winstonLogger,
            cache: cacheManager,
            docsBuildStrategy,
            preparers,
            generators,
            publisher,
            config,
            discovery,
            httpAuth,
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
