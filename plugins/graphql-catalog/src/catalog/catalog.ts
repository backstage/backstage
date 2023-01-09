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
import { resolvePackagePath } from '@backstage/backend-common';
import { createModule } from 'graphql-modules';
import { loadFilesSync } from '@graphql-tools/load-files';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import type { ResolverContext } from '@backstage/plugin-graphql-common';

export const Catalog = createModule({
  id: 'catalog',
  typeDefs: loadFilesSync(
    resolvePackagePath(
      '@backstage/plugin-graphql-catalog',
      'src/catalog/catalog.graphql',
    ),
  ),
  resolvers: {
    Lifecycle: {
      EXPERIMENTAL: 'experimental',
      PRODUCTION: 'production',
      DEPRECATED: 'deprecated',
    },
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {
      entity: (
        _: any,
        {
          name,
          kind,
          namespace,
        }: { name: string; kind: string; namespace?: string },
        { refToId }: ResolverContext,
      ): { id: string } => ({ id: refToId({ name, kind, namespace }) }),
    },
  },
});
