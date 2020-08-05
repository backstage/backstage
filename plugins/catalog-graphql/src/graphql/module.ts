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

import { Logger } from 'winston';
import fs from 'fs';
import path from 'path';
import { GraphQLModule } from '@graphql-modules/core';
import { Resolvers, CatalogEntity, CatalogQuery } from './types';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { CatalogClient } from '../service/client';

export interface ModuleOptions {
  logger: Logger;
  config: Config;
}

const parseToCatalogEntities = (e: Entity): CatalogEntity => ({
  ...e,
  metadata: {
    ...e.metadata,
    annotations: Object.entries(
      e.metadata.annotations ?? {},
    ).map(([key, value]) => ({ key, value })),
  },
});

export async function createModule(
  options: ModuleOptions,
): Promise<GraphQLModule> {
  const typeDefs = await fs.promises.readFile(
    path.resolve(__dirname, '..', 'schema.gql'),
    'utf-8',
  );

  const catalogClient = new CatalogClient(
    options.config.getString('backend.baseUrl'),
  );

  const resolvers: Resolvers = {
    Query: {
      catalog: () => ({} as CatalogQuery),
    },
    CatalogQuery: {
      list: async () => {
        const list = await catalogClient.list();
        return list.map(parseToCatalogEntities);
      },
    },
    EntityMetadata: {
      annotation: (e, { name }) =>
        e.annotations?.find(a => a.key === name) ?? null,
    },
  };

  const module = new GraphQLModule({
    typeDefs,
    resolvers,
    logger: options.logger as any,
  });

  return module;
}
