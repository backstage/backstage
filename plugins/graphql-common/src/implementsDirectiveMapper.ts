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
  GraphQLObjectType,
  isInterfaceType,
} from 'graphql';
import { DirectiveMapperAPI, NamedType } from './types';

export function implementsDirectiveMapper(
  type: GraphQLInterfaceType | GraphQLObjectType,
  api: DirectiveMapperAPI,
  implementationsMap: Map<string, NamedType>,
) {
  if (type.getInterfaces().find(i => i.name === 'Node')) {
    throw new Error(
      `Interface "${type.name}" cannot implement "Node" interface directly. Please use @implements directive instead`,
    );
  }
  const [implementsDirective] = api.getDirective(type, 'implements') ?? [];
  if (implementsDirective) {
    const implementingInterface = api.typeMap[implementsDirective.interface];
    if (!implementingInterface) {
      throw new Error(
        `The "${implementsDirective.interface}" in \`interface ${type.name} @implements(interface: "${implementsDirective.interface}")\` is not defined in the schema`,
      );
    }
    if (!isInterfaceType(implementingInterface)) {
      throw new Error(
        `The "${implementsDirective.interface}" in \`interface ${type.name} @implements(interface: "${implementsDirective.interface}")\` is not an interface type`,
      );
    }
    implementationsMap.set(type.name, {
      implements: implementingInterface.name,
      discriminates:
        implementationsMap.get(type.name)?.discriminates ?? new Set(),
    });
    implementationsMap.set(implementingInterface.name, {
      implements:
        implementationsMap.get(implementingInterface.name)?.implements ?? null,
      discriminates: (
        implementationsMap.get(implementingInterface.name)?.discriminates ??
        new Set()
      ).add(type.name),
    });
  }
}
