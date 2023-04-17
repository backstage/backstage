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

import { errorHandler, SingleHostDiscovery } from '@backstage/backend-common';
import Router from 'express-promise-router';
import { Module } from 'graphql-modules';
import {
  createLoader,
  createGraphQLApp,
  GraphQLContext as GraphQLCoreContext,
  BatchLoadFn,
  Core,
} from '@backstage/plugin-graphql-common';
import {
  CATALOG_SOURCE,
  createEntitiesLoadFn,
} from '@backstage/plugin-graphql-catalog';
import helmet from 'helmet';
import { CatalogClient } from '@backstage/catalog-client';
import { createYoga, Plugin, YogaServerInstance } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useDataLoader } from '@envelop/dataloader';
import { printSchema } from 'graphql';
import DataLoader, { Options as DataLoaderOptions } from 'dataloader';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  graphqlApplicationExtensionPoint,
  GraphQLApplicationExtensionPoint,
} from './extensions/graphqlApplicationExtension';
import {
  graphqlYogaExtensionPoint,
  GraphQLYogaExtensionPoint,
} from './extensions/graphqlYogaExtension';

class GraphQLApplication implements GraphQLApplicationExtensionPoint {
  private schemas = new Set<string>();
  private modules: Module[] = [];

  addSchema(schema: string): void {
    this.schemas.add(schema);
  }
  getSchemas(): string[] {
    return [...this.schemas];
  }
  async addModule(
    module: (() => Module | Promise<Module>) | Module | Promise<Module>,
  ): Promise<void> {
    this.modules.push(await (typeof module === 'function' ? module() : module));
  }
  getModules(): Module[] {
    return this.modules;
  }
}

class GraphQLYoga<TContext extends Record<string, any>>
  implements GraphQLYogaExtensionPoint
{
  private plugins: Plugin[] = [];
  private loaders: Record<string, BatchLoadFn<TContext & GraphQLCoreContext>> =
    {};
  private dataloaderOptions: DataLoaderOptions<string, any> = {};
  private context:
    | ((
        initialContext: GraphQLCoreContext,
      ) => Record<string, any> | Promise<Record<string, any>>)
    | Promise<Record<string, any>>
    | Record<string, any>
    | undefined;

  addPlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
  getPlugins(): Plugin[] {
    return this.plugins;
  }
  addLoader(
    name: string,
    loader: BatchLoadFn<TContext & GraphQLCoreContext>,
  ): void {
    this.loaders[name] = loader;
  }
  setDataloaderOptions(options: DataLoaderOptions<string, any>): void {
    this.dataloaderOptions = options;
  }
  getDataLoader(
    catalog: CatalogClient,
  ): (ctx: GraphQLCoreContext) => DataLoader<string, any> {
    return createLoader(
      { [CATALOG_SOURCE]: createEntitiesLoadFn(catalog), ...this.loaders },
      this.dataloaderOptions,
    );
  }
  setContext(
    context:
      | ((
          initialContext: GraphQLCoreContext,
        ) =>
          | (Record<string, any> & GraphQLCoreContext)
          | Promise<Record<string, any> & GraphQLCoreContext>)
      | Promise<Record<string, any>>
      | Record<string, any>,
  ): void {
    this.context = context;
  }
  getContext(
    initialContext: GraphQLCoreContext,
  ): (yogaContext: Record<string, any>) => Promise<Record<string, any>> {
    return async (yogaContext: Record<string, any>) => ({
      ...yogaContext,
      ...initialContext,
      ...(await (this.context instanceof Function
        ? this.context(initialContext)
        : this.context)),
    });
  }
}

/** @public */
export interface RouterOptions {
  generateOpaqueTypes?: boolean;
}

/** @public */
export const graphqlPlugin = createBackendPlugin((options?: RouterOptions) => ({
  pluginId: 'graphql',
  register(env) {
    const graphqlApp = new GraphQLApplication();
    const graphqlYoga = new GraphQLYoga();
    env.registerExtensionPoint(graphqlApplicationExtensionPoint, graphqlApp);
    env.registerExtensionPoint(graphqlYogaExtensionPoint, graphqlYoga);

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.config,
        http: coreServices.httpRouter,
      },
      async init({ config, logger, http }) {
        const router = Router();

        let yoga: YogaServerInstance<any, any> | null = null;
        const discovery = SingleHostDiscovery.fromConfig(config);
        const catalog = new CatalogClient({ discoveryApi: discovery });
        const application = await createGraphQLApp({
          modules: [await Core(), ...graphqlApp.getModules()],
          generateOpaqueTypes: options?.generateOpaqueTypes,
          schema: graphqlApp.getSchemas(),
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
                useDataLoader('loader', graphqlYoga.getDataLoader(catalog)),
                ...graphqlYoga.getPlugins(),
              ],
              context: graphqlYoga.getContext({ application }),
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
}));
