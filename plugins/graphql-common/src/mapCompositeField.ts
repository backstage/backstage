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
import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { DirectiveMapperAPI, FieldDirectiveMapper } from './types';

export function mapCompositeFields<
  T extends GraphQLInterfaceType | GraphQLObjectType,
>(
  typeConfig: ReturnType<T['toConfig']>,
  api: DirectiveMapperAPI,
  {
    directiveMappers = {},
  }: {
    directiveMappers?: Record<string, FieldDirectiveMapper>;
  } = {},
) {
  Object.entries(typeConfig.fields).forEach(([fieldName, fieldConfig]) => {
    const directives = Object.entries(directiveMappers).flatMap<{
      directiveName: string;
      directive: Record<string, any>;
      mapper: FieldDirectiveMapper;
    }>(([directiveName, mapper]) => {
      const [directive] = api.getDirective(fieldConfig, directiveName) ?? [];
      return directive ? [{ directiveName, directive, mapper }] : [];
    });
    if (directives.length > 1) {
      throw new Error(
        `It's ambiguous how to resolve the field "${fieldName}" of "${typeConfig.name}" type with more than one directives on it`,
      );
    }
    if (directives.length === 0) return;

    const [{ directiveName, directive, mapper }] = directives;
    try {
      mapper(fieldConfig, directive, api);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      throw new Error(
        `Error while processing ${directiveName} directive on the field "${fieldName}" of "${typeConfig.name}":\n${errorMessage}`,
      );
    }
  });
}
