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
import { createGraphQLApp } from '@backstage/plugin-graphql-common';
import {
  ResolverContext,
  createLoader as createCatalogLoader,
} from '@backstage/plugin-graphql-catalog';
import helmet from 'helmet';
import DataLoader from 'dataloader';
import { CatalogClient } from '@backstage/catalog-client';
import { createYoga, Plugin, YogaServerInstance } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { useDataLoader } from '@envelop/dataloader';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { printSchema } from 'graphql';

/** @public */
export interface RouterOptions {
  config: Config;
  logger: Logger;
  modules?: Module[];
  plugins?: Plugin[];
  createLoader?: (
    context: Omit<ResolverContext, 'loader'>,
  ) => DataLoader<string, any>;
  refToId?: (ref: CompoundEntityRef | string) => string;
}

/** @public */
export async function createRouter({
  config,
  logger,
  modules,
  plugins,
  createLoader,
  refToId,
}: RouterOptions): Promise<express.Router> {
  let yoga: YogaServerInstance<any, any> | null = null;

  const router = Router();
  const discovery = SingleHostDiscovery.fromConfig(config);
  const catalog = new CatalogClient({ discoveryApi: discovery });
  const application = createGraphQLApp({ modules, logger });

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.get('/schema', (_, response) => {
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
          useDataLoader('loader', createLoader ?? createCatalogLoader),
          ...(plugins ?? []),
        ],
        context: { application, catalog, refToId },
        logging: logger,
        graphqlEndpoint: req.baseUrl,
      });
    }
    return yoga(req, res, next);
  });
  router.use(errorHandler());

  return router;
}
