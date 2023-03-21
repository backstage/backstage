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
import { DirectiveMapperAPI, NamedType, ResolverContext } from './types';

export function mapObjectType(
  objectName: string,
  api: DirectiveMapperAPI,
  { implementationsMap }: { implementationsMap: Map<string, NamedType> },
) {
  const implementsInterfaceName =
    implementationsMap.get(objectName)?.implements;

  if (!implementsInterfaceName) return;

  const objectType = api.typeMap[objectName] as GraphQLObjectType;
  const implementsInterface = api.typeMap[
    implementsInterfaceName
  ] as GraphQLInterfaceType;

  if (objectType.getInterfaces().some(i => implementationsMap.has(i.name))) {
    throw new Error(
      `The "${objectName}" type implements some interface without @implements directive`,
    );
  }

  api.typeMap[objectName] = new GraphQLObjectType<
    { id: string },
    ResolverContext
  >({
    ...objectType.toConfig(),
    interfaces: [
      implementsInterface,
      ...implementsInterface.getInterfaces(),
      ...objectType.getInterfaces(),
    ],
    fields: {
      ...implementsInterface.toConfig().fields,
      ...objectType.toConfig().fields,
    },
  });
}
