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
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Module } from 'graphql-modules';
import {
  createLoader,
  createGraphQLApp,
  GraphQLContext,
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
import { Config } from '@backstage/config';
import { printSchema } from 'graphql';
import { UnboxReturnedPromise } from '../types';
import { Options as DataLoaderOptions } from 'dataloader';

/** @public */
export interface RouterOptions<TContext extends Record<string, any>> {
  config: Config;
  logger: Logger;
  schema?: string | string[];
  modules?: ((() => Module | Promise<Module>) | Module | Promise<Module>)[];
  plugins?: Plugin[];
  loaders?: Record<string, BatchLoadFn<TContext & GraphQLContext>>;
  dataloaderOptions?: DataLoaderOptions<string, any>;
  additionalContext?:
    | ((initialContext: GraphQLContext) => TContext | Promise<TContext>)
    | Promise<TContext>
    | TContext;
  generateOpaqueTypes?: boolean;
}

/** @public */
export async function createRouter<TContext extends Record<string, any>>({
  config,
  logger,
  schema,
  modules,
  plugins,
  loaders,
  dataloaderOptions,
  additionalContext,
  generateOpaqueTypes,
}: RouterOptions<TContext>): Promise<express.Router> {
  let yoga: YogaServerInstance<any, any> | null = null;

  const router = Router();
  const discovery = SingleHostDiscovery.fromConfig(config);
  const catalog = new CatalogClient({ discoveryApi: discovery });
  const application = await createGraphQLApp({
    modules: await Promise.all([
      Core(),
      ...(modules?.map(m => (typeof m === 'function' ? m() : m)) ?? []),
    ]),
    generateOpaqueTypes,
    schema,
  });
  const initialContext: GraphQLContext = { application };
  const context = async (yogaContext: Record<string, any>) => ({
    ...yogaContext,
    ...initialContext,
    ...(await (additionalContext instanceof Function
      ? additionalContext(initialContext)
      : additionalContext)),
  });
  const loader = createLoader<UnboxReturnedPromise<typeof context>>(
    { [CATALOG_SOURCE]: createEntitiesLoadFn(catalog), ...loaders },
    dataloaderOptions,
  );

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
          useDataLoader('loader', loader),
          ...(plugins ?? []),
        ],
        context,
        logging: logger,
        graphqlEndpoint: req.baseUrl,
      });
    }
    return yoga(req, res, next);
  });
  router.use(errorHandler());

  return router;
}
