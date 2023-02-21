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
import { DirectiveMapperAPI, Logger } from './types';

export function mapUnionType(
  unionType: GraphQLUnionType,
  api: DirectiveMapperAPI,
  { logger = console }: { logger?: Logger } = {},
) {
  const typeConfig = unionType.toConfig();
  let hasUnionInterfaces = false;

  typeConfig.types = typeConfig.types.flatMap(type => {
    if (isInterfaceType(type)) {
      hasUnionInterfaces = true;
      return api.getImplementingTypes((type as GraphQLInterfaceType).name);
    }
    return [type];
  });

  if (!hasUnionInterfaces) return;

  const resolveType = typeConfig.resolveType;
  if (resolveType)
    logger.warn(
      `The "resolveType" function has already been implemented for "${unionType.name}" union which may lead to undefined behavior`,
    );
  typeConfig.resolveType = (...args) =>
    resolveType?.(...args) ??
    (api.typeMap.Node as GraphQLInterfaceType).resolveType?.(...args);

  api.typeMap[unionType.name] = new GraphQLUnionType(typeConfig);
}
