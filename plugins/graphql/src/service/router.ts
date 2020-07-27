/*
 * Copyright 2020 Spotify AB
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
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import fs from 'fs';
import path from 'path';
import { GraphQLModule } from '@graphql-modules/core';
import { ApolloServer } from 'apollo-server-express';
import { createModule as createCatalogModule } from '@backstage/plugin-catalog-graphql';
import { createModule as createBogusModule } from '@backstage/plugin-bogus-graphql';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const typeDefs = await fs.promises.readFile(
    path.resolve(__dirname, '..', 'schema.gql'),
    'utf-8',
  );

  const catalogModule = await createCatalogModule(options);
  const bogusModule = await createBogusModule(options);
  const { schema } = new GraphQLModule({
    imports: [catalogModule, bogusModule],
    typeDefs,
  });

  const server = new ApolloServer({ schema, logger: options.logger });
  const router = Router();

  const apolloMiddlware = server.getMiddleware({ path: '/' });
  router.use(apolloMiddlware);

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  router.use(errorHandler());

  return router;
}
