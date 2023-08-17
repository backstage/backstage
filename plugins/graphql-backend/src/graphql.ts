/*
 * Copyright 2020 The Backstage Authors
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

import { errorHandler } from '@backstage/backend-common';
import Router from 'express-promise-router';
import { Module } from 'graphql-modules';
import {
  createLoader,
  createGraphQLApp,
  GraphQLContext as GraphQLCoreContext,
  BatchLoadFn,
  Core,
} from '@backstage/plugin-graphql-common';
import helmet from 'helmet';
import { createYoga, Plugin, YogaServerInstance } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useDataLoader } from '@envelop/dataloader';
import { printSchema } from 'graphql';
import { Options as DataLoaderOptions } from 'dataloader';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  graphqlAppOptionsExtensionPoint,
  graphqlContextExtensionPoint,
  graphqlDataloaderOptionsExtensionPoint,
  graphqlModulesExtensionPoint,
  graphqlPluginsExtensionPoint,
  graphqlLoadersExtensionPoint,
  graphqlSchemasExtensionPoint,
} from '@backstage/plugin-graphql-backend-node';

/** @public */
export const graphqlPlugin = createBackendPlugin({
  pluginId: 'graphql',
  register(env) {
    const appOptions = {};
    env.registerExtensionPoint(graphqlAppOptionsExtensionPoint, {
      setAppOptions(newAppOptions) {
        Object.assign(appOptions, newAppOptions);
      },
    });

    const schemas = new Set<string>();
    env.registerExtensionPoint(graphqlSchemasExtensionPoint, {
      addSchemas(newSchemas) {
        for (const schema of newSchemas) schemas.add(schema);
      },
    });

    const modules = new Map<string, Module>();
    env.registerExtensionPoint(graphqlModulesExtensionPoint, {
      async addModules(newModules) {
        for (const module of newModules) {
          const resolvedModule = await (typeof module === 'function'
            ? module()
            : module);
          if (modules.has(resolvedModule.id)) {
            throw new Error(
              `A module with id "${resolvedModule.id}" has already been registered`,
            );
          }
          modules.set(resolvedModule.id, resolvedModule);
        }
      },
    });

    const plugins: Plugin[] = [];
    env.registerExtensionPoint(graphqlPluginsExtensionPoint, {
      addPlugins(newPlugins) {
        plugins.push(...newPlugins);
      },
    });

    const loaders = new Map<string, BatchLoadFn<any>>();
    env.registerExtensionPoint(graphqlLoadersExtensionPoint, {
      addLoaders(newLoaders) {
        for (const [name, loader] of Object.entries(newLoaders)) {
          if (loaders.has(name)) {
            throw new Error(
              `A loader with name "${name}" has already been registered`,
            );
          }
          loaders.set(name, loader);
        }
      },
    });

    const dataloaderOptions: DataLoaderOptions<string, any> = {};
    env.registerExtensionPoint(graphqlDataloaderOptionsExtensionPoint, {
      setDataloaderOptions(options) {
        Object.assign(dataloaderOptions, options);
      },
    });

    let context:
      | ((
          initialContext: GraphQLCoreContext,
        ) => Record<string, any> | Promise<Record<string, any>>)
      | Promise<Record<string, any>>
      | Record<string, any>
      | undefined;
    env.registerExtensionPoint(graphqlContextExtensionPoint, {
      setContext(newContext) {
        const oldContext = context;
        context = async (init: Record<string, any> & GraphQLCoreContext) => {
          const merged = {
            ...init,
            ...(await (oldContext instanceof Function
              ? oldContext(init)
              : oldContext)),
          };
          return {
            ...merged,
            ...(await (newContext instanceof Function
              ? newContext(merged)
              : newContext)),
          };
        };
      },
    });

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        http: coreServices.httpRouter,
      },
      async init({ logger, http }) {
        const router = Router();

        let yoga: YogaServerInstance<any, any> | null = null;
        const application = await createGraphQLApp({
          modules: [await Core(), ...modules.values()],
          schema: [...schemas],
          ...appOptions,
        });

        router.get('/health', (_, response) => {
          response.json({ status: 'ok' });
        });

        router.get('/schema', (_, response) => {
          response.set('Content-Type', 'text/plain');
          response.send(printSchema(application.schema));
        });

        if (process.env.NODE_ENV === 'development')
          router.use(
            helmet.contentSecurityPolicy({
              directives: {
                defaultSrc: ["'self'", "'unsafe-inline'", 'http://*'],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://*'],
                imgSrc: ["'self'", 'https: data:'],
              },
            }),
          );

        router.use((req, res, next) => {
          if (!yoga) {
            yoga = createYoga({
              plugins: [
                useGraphQLModules(application),
                useDataLoader(
                  'loader',
                  createLoader(
                    Object.fromEntries([...loaders.entries()]),
                    dataloaderOptions,
                  ),
                ),
                ...plugins,
              ],
              context: async (yogaContext: Record<string, any>) => {
                const ctx = {
                  ...yogaContext,
                  application,
                };
                return {
                  ...ctx,
                  ...(await (context instanceof Function
                    ? context(ctx)
                    : context)),
                };
              },
              logging: logger,
              graphqlEndpoint: req.baseUrl,
            });
          }
          return yoga(req, res, next);
        });
        router.use(errorHandler());

        http.use(router);
      },
    });
  },
});
