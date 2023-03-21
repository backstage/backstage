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
import {
  GraphQLInterfaceType,
  GraphQLUnionType,
  isInterfaceType,
} from 'graphql';
import { DirectiveMapperAPI, NamedType } from './types';

export function mapUnionType(
  unionType: GraphQLUnionType,
  api: DirectiveMapperAPI,
  { implementationsMap }: { implementationsMap: Map<string, NamedType> },
) {
  const typeConfig = unionType.toConfig();

  if (typeConfig.types.every(type => !implementationsMap.has(type.name)))
    return;

  typeConfig.types = typeConfig.types.flatMap(type =>
    isInterfaceType(type)
      ? api.getImplementingTypes((type as GraphQLInterfaceType).name)
      : [type],
  );

  const resolveType = typeConfig.resolveType;
  if (resolveType)
    throw new Error(
      `The "resolveType" function has already been implemented for "${unionType.name}" union which may lead to undefined behavior`,
    );
  typeConfig.resolveType = (...args) =>
    (api.typeMap.Node as GraphQLInterfaceType).resolveType?.(...args);

  api.typeMap[unionType.name] = new GraphQLUnionType(typeConfig);
}
