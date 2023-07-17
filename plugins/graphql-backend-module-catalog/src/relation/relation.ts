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
import { TypeDefs, createModule } from 'graphql-modules';
import { relationDirectiveMapper } from '../relationDirectiveMapper';
import { createDirectiveMapperProvider } from '@backstage/plugin-graphql-common';
import { loadFiles, loadFilesSync } from '@graphql-tools/load-files';
import { resolvePackagePath } from '@backstage/backend-common';

const relationSchemaPath = resolvePackagePath(
  '@backstage/plugin-graphql-backend-module-catalog',
  'src/relation/relation.graphql',
);

/** @public */
export const RelationSync = (
  typeDefs: TypeDefs = loadFilesSync(relationSchemaPath),
) =>
  createModule({
    id: 'relation',
    typeDefs,
    providers: [
      createDirectiveMapperProvider('relation', relationDirectiveMapper),
    ],
  });

/** @public */
export const Relation = async () =>
  RelationSync(await loadFiles(relationSchemaPath));
