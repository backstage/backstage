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
import { get, isEqual } from 'lodash';
import {
  GraphQLFieldConfigMap,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isInterfaceType,
} from 'graphql';
import { DirectiveMapperAPI, ResolverContext } from './types';

function getObjectTypeName(
  interfaceName: string,
  directive?: Record<string, any>,
): string {
  if (directive && 'generatedTypeName' in directive)
    return directive.generatedTypeName;

  return interfaceName.slice(1);
}

function validateInheritDirective(
  interfaceName: string,
  directive: Record<string, any>,
  api: DirectiveMapperAPI,
  { inheritsWithoutArgs }: { inheritsWithoutArgs: Set<string> },
) {
  if (!/^I[A-Z].*/.test(interfaceName)) {
    if (!('generatedTypeName' in directive)) {
      throw new Error(
        `The interface name "${interfaceName}" should started from capitalized 'I', like: "I${interfaceName}"`,
      );
    }
    if (api.typeMap[directive.generatedTypeName]) {
      throw new Error(
        `The type "${directive.generatedTypeName}" described in the @inherit directive for "${interfaceName}" interface is already declared in the schema`,
      );
    }
  }
  if ('when' in directive !== 'is' in directive) {
    throw new Error(
      `The @inherit directive for "${interfaceName}" should have both "when" and "is" arguments or none of them`,
    );
  }
  if (directive.interface) {
    const parentType = api.typeMap[directive.interface];
    if (!parentType) {
      // TODO Write a test
      throw new Error(
        `The interface "${directive.interface}" described in the @inherit directive for "${interfaceName}" interface is not declared in the schema`,
      );
    }
    if (!isInterfaceType(parentType)) {
      // TODO Write a test
      throw new Error(
        `The type "${directive.interface}" described in the @inherit directive for "${interfaceName}" interface is not an interface`,
      );
    }
  }
  if (!('when' in directive)) {
    if (
      'interface' in directive &&
      inheritsWithoutArgs.has(directive.interface)
    ) {
      throw new Error(
        `The @inherit directive of "${directive.interface}" without "when" and "is" arguments could be used only once`,
      );
    } else {
      inheritsWithoutArgs.add(directive.interface);
    }
  }
  if (
    'when' in directive &&
    (typeof directive.when !== 'string' ||
      (Array.isArray(directive.when) &&
        directive.when.some(a => typeof a !== 'string')))
  ) {
    throw new Error(
      `The "when" argument of @inherit directive must be a string or an array of strings`,
    );
  }
}

function defineResolver(
  interfaceName: string,
  directive: Record<string, any>,
  api: DirectiveMapperAPI,
) {
  const iface = api.typeMap[interfaceName];
  if (!isInterfaceType(iface)) return;

  if (!iface.resolveType) {
    const interfaceConfig = iface.toConfig();
    interfaceConfig.resolveType = () =>
      getObjectTypeName(iface.name, directive);
    api.typeMap[interfaceName] = new GraphQLInterfaceType(interfaceConfig);
  }

  const inheritedInterface = api.typeMap[directive.interface];
  if (!isInterfaceType(inheritedInterface)) return;

  const [inheritDirective] =
    api.getDirective(inheritedInterface, 'inherit') ?? [];
  const resolveType =
    inheritedInterface.resolveType ??
    (inheritedInterface.name === 'Node'
      ? () => undefined
      : () => getObjectTypeName(inheritedInterface.name, inheritDirective));
  const inheritedInterfaceConfig = inheritedInterface.toConfig();
  inheritedInterfaceConfig.resolveType = async (
    source: { id: string },
    context: ResolverContext,
    info,
    abstractType,
  ) => {
    if ('when' in directive && 'is' in directive) {
      const { id } = source;
      const { loader } = context;
      const entity = await loader.load(id);
      if (!entity) return undefined;
      if (isEqual(get(entity, directive.when), directive.is)) {
        return (
          (api.typeMap[interfaceName] as GraphQLInterfaceType).resolveType?.(
            source,
            context,
            info,
            abstractType,
          ) ?? undefined
        );
      }
      return resolveType(source, context, info, abstractType) ?? undefined;
    }
    return (
      (api.typeMap[interfaceName] as GraphQLInterfaceType).resolveType?.(
        source,
        context,
        info,
        abstractType,
      ) ?? undefined
    );
  };
  api.typeMap[directive.interface] = new GraphQLInterfaceType(
    inheritedInterfaceConfig,
  );
}

function traverseInherits(
  interfaceName: string,
  api: DirectiveMapperAPI,
): string[] {
  const iface = api.typeMap[interfaceName];
  if (!isInterfaceType(iface)) return [];

  const [inheritDirective] = api.getDirective(iface, 'inherit') ?? [];
  return [
    ...(typeof inheritDirective?.interface === 'string'
      ? [
          inheritDirective.interface,
          ...traverseInherits(inheritDirective.interface, api),
        ]
      : []),
    ...iface
      .getInterfaces()
      .flatMap(parent => [parent.name, ...traverseInherits(parent.name, api)]),
  ];
}

export function mapInterfaceType(
  interfaceName: string,
  api: DirectiveMapperAPI,
  options: { inheritsWithoutArgs: Set<string> },
) {
  const [inheritDirective] =
    api.getDirective(
      api.typeMap[interfaceName] as GraphQLInterfaceType,
      'inherit',
    ) ?? [];
  if (!inheritDirective) return;

  validateInheritDirective(interfaceName, inheritDirective, api, options);
  defineResolver(interfaceName, inheritDirective, api);

  const interfaces = [...new Set(traverseInherits(interfaceName, api))];
  const fields = [...interfaces].reverse().reduce(
    (acc, name) => ({
      ...acc,
      ...(api.typeMap[name] as GraphQLInterfaceType).toConfig().fields,
    }),
    {} as GraphQLFieldConfigMap<any, any>,
  );

  const { astNode, extensionASTNodes, ...interfaceConfig } = (
    api.typeMap[interfaceName] as GraphQLInterfaceType
  ).toConfig();
  interfaceConfig.fields = {
    ...fields,
    ...interfaceConfig.fields,
  };
  interfaceConfig.interfaces = interfaces.map(
    name => api.typeMap[name] as GraphQLInterfaceType,
  );

  api.typeMap[interfaceName] = new GraphQLInterfaceType({
    ...interfaceConfig,
    astNode,
    extensionASTNodes,
  });

  const objectTypeName = getObjectTypeName(interfaceName, inheritDirective);
  api.typeMap[objectTypeName] = new GraphQLObjectType({
    ...interfaceConfig,
    name: objectTypeName,
    interfaces: [
      api.typeMap[interfaceName] as GraphQLInterfaceType,
      ...interfaceConfig.interfaces,
    ],
  });
}
