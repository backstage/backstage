/*
 * Copyright 2026 The Backstage Authors
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

import type {
  BackstageCredentials,
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { createProviderRegistry } from '../providers/registry';
import type { AiProviderRegistry } from '../providers/registry';
import { toolModuleAsProviderModule } from './types';
import type { ToolDeclaration, ToolModule } from './types';

export type ToolIdentity = Readonly<{ serverId: string; toolName: string }>;

type BasicPermission = Extract<
  Parameters<PermissionsRegistryService['addPermissions']>[0][number],
  { type: 'basic' }
>;

/** `ai.tool.<server>.<tool>.use`, following the model permission encoding. */
export function toolPermissionName({
  serverId,
  toolName,
}: ToolIdentity): string {
  function segment(value: string): string {
    if (typeof value !== 'string' || !value.length) {
      throw new Error('Tool permission segments must be nonempty strings');
    }
    return encodeURIComponent(value).replace(/\./g, '%2E');
  }
  return `ai.tool.${segment(serverId)}.${segment(toolName)}.use`;
}

/**
 * A validated set of tool modules: the provider-registry view the guard and
 * journal consume unchanged, plus tool lookup for the mediation.
 *
 * @alpha
 */
export type ToolRegistry = Readonly<{
  /** The guard/journal view: tool modules adapted to provider modules. */
  providerRegistry: AiProviderRegistry;
  /** Resolves one declared tool, or undefined when unknown. */
  resolve(
    identity: ToolIdentity,
  ): { module: ToolModule; tool: ToolDeclaration } | undefined;
}>;

export function createToolRegistry(
  modules: readonly ToolModule[],
): ToolRegistry {
  const byId = new Map<string, ToolModule>();
  for (const module of modules) {
    if (byId.has(module.id)) {
      throw new Error(`Duplicate tool module id: ${module.id}`);
    }
    for (const tool of module.tools) {
      if (
        typeof tool.name !== 'string' ||
        tool.name.length === 0 ||
        tool.name !== tool.name.trim()
      ) {
        throw new Error(`Invalid tool declaration in ${module.id}`);
      }
    }
    byId.set(module.id, module);
  }
  const providerRegistry = createProviderRegistry(
    modules.map(toolModuleAsProviderModule),
  );
  return Object.freeze({
    providerRegistry,
    resolve: ({ serverId, toolName }) => {
      const module = byId.get(serverId);
      const tool = module?.tools.find(entry => entry.name === toolName);
      return module && tool ? { module, tool } : undefined;
    },
  });
}

/** Registers one basic permission per declared tool, mirroring model permissions. */
export function createToolPermissions(options: {
  tools: readonly ToolIdentity[];
  authorizer: Pick<PermissionsService, 'authorize'>;
  registry: Pick<PermissionsRegistryService, 'addPermissions'>;
}) {
  const byName = new Map<
    string,
    { identity: ToolIdentity; permission: BasicPermission }
  >();
  for (const identity of options.tools) {
    const name = toolPermissionName(identity);
    if (!byName.has(name)) {
      byName.set(name, {
        identity: Object.freeze({ ...identity }),
        permission: Object.freeze({
          type: 'basic',
          name,
          attributes: Object.freeze({}),
        }),
      });
    }
  }
  options.registry.addPermissions([...byName.values()].map(p => p.permission));

  async function authorize(
    credentials: BackstageCredentials,
    identities: readonly ToolIdentity[],
  ) {
    const requests = identities
      .map(identity => byName.get(toolPermissionName(identity)))
      .filter(
        (
          entry,
        ): entry is { identity: ToolIdentity; permission: BasicPermission } =>
          !!entry,
      )
      .map(({ permission }) => ({
        permission,
        credentials,
      }));
    if (requests.length === 0) return [] as Array<{ result: string }>;
    return options.authorizer.authorize(requests, { credentials });
  }

  return { authorize, toolPermissionName };
}
