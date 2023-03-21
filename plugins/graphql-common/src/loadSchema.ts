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
import { CodeFileLoader } from '@graphql-tools/code-file-loader';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadTypedefsSync } from '@graphql-tools/load';
import {
  getResolversFromSchema,
  printSchemaWithDirectives,
} from '@graphql-tools/utils';
import { createModule, gql } from 'graphql-modules';

export function loadSchema(schema: string | string[]) {
  const sources = loadTypedefsSync(schema, {
    sort: true,
    loaders: [new CodeFileLoader(), new GraphQLFileLoader()],
  });
  return sources.map((source, index) =>
    createModule({
      id: source.location ?? `unknown_${index}`,
      typeDefs: source.schema
        ? gql(printSchemaWithDirectives(source.schema))
        : source.document ?? gql(source.rawSDL ?? ''),
      resolvers: source.schema
        ? getResolversFromSchema(source.schema)
        : undefined,
    }),
  );
}
