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
import { DocumentNode, Kind } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { validateSchema } from 'graphql';
import { Module, Resolvers } from 'graphql-modules';
import { Core } from './core';
import { mapDirectives } from './mapDirectives';
import { FieldDirectiveMapper, Logger } from './types';
import { toPrivateProp } from './mapperProvider';

/** @public */
export function transformSchema(
  modules: Module[] = [],
  { logger }: { logger?: Logger } = {},
) {
  const directiveMappers: Record<string, FieldDirectiveMapper> = {};
  const allModules = [Core, ...modules];
  const typeDefs: DocumentNode[] = allModules.flatMap(module => {
    const documents = module.typeDefs;
    documents.forEach(document => {
      document.definitions.forEach(definition => {
        if (definition.kind !== Kind.DIRECTIVE_DEFINITION) return;
        const directiveName = definition.name.value;
        const provider = module.providers?.find(
          p => toPrivateProp(directiveName) in p,
        );
        if (provider)
          directiveMappers[directiveName] = (provider as any)[
            toPrivateProp(directiveName)
          ];
      });
    });
    return documents;
  });
  const resolvers: Resolvers = allModules.flatMap(
    module => module.config.resolvers ?? [],
  );

  const schema = mapDirectives(makeExecutableSchema({ typeDefs, resolvers }), {
    directiveMappers,
    logger,
  });

  const errors = validateSchema(schema);

  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join('\n'));
  }
  return schema;
}
