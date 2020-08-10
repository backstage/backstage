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
import { makeExecutableSchema } from 'apollo-server';
import { GraphQLModule } from '@graphql-modules/core';
import {
  Resolvers,
  CatalogQuery,
  CatalogEntityTypes,
  EntityMetadataResolvers,
} from './types';
import { Config } from '@backstage/config';
import { CatalogClient } from '../service/client';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

export interface ModuleOptions {
  logger: Logger;
  config: Config;
}

const schemaPath = path.resolve(
  require.resolve('@backstage/plugin-catalog-graphql/package.json'),
  '../schema.gql',
);

const getSpecTypenameForEntity = (e: { kind?: string }) => {
  switch (e.kind) {
    case 'Component':
      return 'ComponentEntity';
    case 'Location':
      return 'LocationEntity';
    case 'Template':
      return 'TemplateEntity';
    default:
      return null;
  }
};

export async function createModule(
  options: ModuleOptions,
): Promise<GraphQLModule> {
  const typeDefs = await fs.promises.readFile(schemaPath, 'utf-8');

  const catalogClient = new CatalogClient(
    options.config.getString('backend.baseUrl'),
  );

  const resolvers: Resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {
      catalog: () => ({} as CatalogQuery),
    },
    CatalogQuery: {
      list: async () => {
        return await catalogClient.list();
      },
    },
    ComponentMetadata: {
      relationships: () => 'boop',
    },
    TemplateMetadata: {
      updatedBy: () => 'blam',
    },
    CatalogEntity: {
      metadata: e => ({ ...e.metadata!, catalogEntity: e }),
    },
    EntityMetadata: {
      __resolveType: (obj: any) => {
        const kind = obj.catalogEntity!.kind;
        switch (kind) {
          case 'Component':
            return 'ComponentMetadata';
          case 'Template':
            return 'TemplateMetadata';
          default:
            return 'DefaultEntityMetadata';
        }
      },
      annotation: (e, { name }) => e.annotations?.[name] ?? null,
      labels: e => e ?? {},
      annotations: e => e ?? {},
      label: (e, { name }) => e.labels?.[name] ?? null,
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    inheritResolversFromInterfaces: true,
    resolverValidationOptions: {
      allowResolversNotInSchema: true,
    },
  });

  const module = new GraphQLModule({
    resolverValidationOptions: {},
    extraSchemas: [schema],
    logger: options.logger as any,
  });

  return module;
}
