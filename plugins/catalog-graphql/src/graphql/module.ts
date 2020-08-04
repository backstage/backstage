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
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { GraphQLModule } from '@graphql-modules/core';
import { QueryResolvers } from './types';

export interface ModuleOptions {
  logger: Logger;
}

// function wrapLogger(logger: Logger) {
//   return {
//     log: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//     debug: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//     info: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//     error: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//     clientError: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//     warn: (msg: string | Error, ...extra: any[]) =>
//       logger.info(String(msg), ...extra),
//   };
// }

class CatalogClient {
  async list() {
    const res = await fetch('http://localhost:7000/catalog/entities');
    if (!res.ok) {
      throw new Error(`NOPE, ${await res.text()}`);
    }

    return res.json();
  }
}

export async function createModule(
  options: ModuleOptions,
): Promise<GraphQLModule> {
  const typeDefs = await fs.promises.readFile(
    path.resolve(__dirname, '..', 'schema.gql'),
    'utf-8',
  );

  const catalogClient = new CatalogClient();

  const resolvers = {
    Query: {
      catalog: () => true,
    },
    CatalogQuery: {
      list: () => catalogClient.list(),
    },
    CatalogEntity: () => ({}),
  };

  const module = new GraphQLModule({
    typeDefs,
    resolvers,
    logger: options.logger as any,
  });

  return module;
}
