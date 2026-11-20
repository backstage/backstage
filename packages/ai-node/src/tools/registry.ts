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

import {
  interpretMcpCredential,
  mcpCredentialGeneration,
  mcpCredentialId,
} from '../credentials/mcp';
import { createProviderRegistry } from '../providers/registry';
import type { AiProviderRegistry } from '../providers/registry';
import type { AiProviderModule } from '../providers/types';
import type { DestinationTemplate } from '../providers/templates';
import { toolModuleAsProviderModule } from './types';
import type { ToolDeclaration, ToolModule } from './types';

/**
 * Presents one tool module through the generic module resolution seam: the
 * credential key, interpretation and generation for its scoped MCP
 * credential, and the `toolCall` binding facts. The permission is fixed
 * (`ai.tool.use`) and selected by operation kind in the guard's recheck, so
 * the module supplies no permission hook.
 * The integration consumes these hooks generically — the same seam provider
 * modules use — so adding a tool module requires no integration changes.
 */
function toolModuleWithResolution(module: ToolModule): AiProviderModule {
  if (module.run !== undefined) {
    // Local tool server: no credential key, no interpretation, no destination.
    // The dispatch facts are the module identity plus the local authority, and
    // the guard journals the call by identity with no destination at all.
    return {
      ...toolModuleAsProviderModule(module),
      resolveDispatch: async model => {
        if (model.provider !== module.id) {
          return {
            resolved: false as const,
            reason: `tool dispatch does not match the registered tool server: '${model.provider}' is not '${module.id}'`,
          };
        }
        if (!module.tools.some(entry => entry.name === model.id)) {
          return {
            resolved: false as const,
            reason: `tool not registered: '${model.provider}/${model.id}' is not a declared tool of this installation`,
          };
        }
        return {
          resolved: true as const,
          api: module.id,
          authority: { kind: 'local' as const },
          credentialScope: { kind: 'org' as const },
          credentialGeneration: 'local',
        };
      },
    };
  }
  return {
    ...toolModuleAsProviderModule(module),
    credentialKey: providerId => mcpCredentialId(providerId),
    interpretCredential: (scope, credential) => {
      const interpreted = interpretMcpCredential(credential);
      const secret =
        credential.type === 'api_key' ? credential.key : credential.access;
      return {
        authority:
          interpreted.expiresAt === undefined
            ? { kind: 'apiKey', headers: interpreted.headers }
            : {
                kind: 'oauth',
                headers: interpreted.headers,
                expiresAt: interpreted.expiresAt,
              },
        generation: mcpCredentialGeneration(scope, secret ?? ''),
      };
    },
    resolveDispatch: async (model, resolveCredential) => {
      // Identity binding: the caller's provider string must name this
      // module. Cross-server dispatch facts — a forged model or a
      // incorrectly registered module — fail closed here, and the credential below
      // is always resolved through the module's own identity.
      if (model.provider !== module.id) {
        return {
          resolved: false as const,
          reason: `tool dispatch does not match the registered tool server: '${model.provider}' is not '${module.id}'`,
        };
      }
      const tool = module.tools.find(entry => entry.name === model.id);
      if (tool === undefined) {
        return {
          resolved: false as const,
          reason: `tool not registered: '${model.provider}/${model.id}' is not a declared tool of this installation`,
        };
      }
      const credential = await resolveCredential();
      if (credential === undefined) {
        return {
          resolved: false as const,
          reason: `MCP server credentials are not configured for tool server '${module.id}'`,
        };
      }
      return {
        resolved: true as const,
        api: module.id,
        destination: module.destination!(model.id),
        authority: credential.authority,
        credentialScope: credential.scope,
        credentialGeneration: credential.generation,
      };
    },
  };
}

/**
 * Identifies one declared tool: its server and its name.
 *
 * @alpha
 */
export type ToolIdentity = Readonly<{ serverId: string; toolName: string }>;

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
  /** The validated tool modules, in registration order. */
  readonly modules: readonly ToolModule[];
}>;

/**
 * The required route shape for tool modules: literal `/mcp/`, a digested
 * server segment, literal `/tools/`, and a digested tool segment. Enforced
 * at registration so no static or malformed template can journal arbitrary
 * raw paths as approved routes.
 */
function isRequiredToolTemplate(template: DestinationTemplate): boolean {
  return (
    template.length === 4 &&
    'literal' in template[0] &&
    template[0].literal === '/mcp/' &&
    'digest' in template[1] &&
    (template[1] as { digest: unknown }).digest === 'server' &&
    'literal' in template[2] &&
    template[2].literal === '/tools/' &&
    'digest' in template[3] &&
    (template[3] as { digest: unknown }).digest === 'tool'
  );
}

export function createToolRegistry(
  modules: readonly ToolModule[],
): ToolRegistry {
  const byId = new Map<string, ToolModule>();
  for (const module of modules) {
    if (byId.has(module.id)) {
      throw new Error(`Duplicate tool module id: ${module.id}`);
    }
    // A local tool server sends nothing, so it declares no route: the /mcp
    // template check applies only to the HTTP kind.
    if (
      module.run === undefined &&
      (module.destinationTemplates?.length !== 1 ||
        !isRequiredToolTemplate(module.destinationTemplates[0]))
    ) {
      throw new Error(
        `Invalid tool module route template: ${module.id} must declare exactly the digested /mcp/{server}/tools/{tool} route`,
      );
    }
    if (
      module.run === undefined &&
      (module.adapter === undefined ||
        typeof module.adapter.invoke !== 'function')
    ) {
      throw new Error(`Invalid tool module adapter: ${module.id}`);
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
    modules.map(toolModuleWithResolution),
  );
  return Object.freeze({
    providerRegistry,
    modules: Object.freeze([...byId.values()]),
    resolve: ({ serverId, toolName }) => {
      const module = byId.get(serverId);
      const tool = module?.tools.find(entry => entry.name === toolName);
      return module && tool ? { module, tool } : undefined;
    },
  });
}

/**
 * Composes a model provider registry with a tool registry's provider view:
 * the guard and journal consume one registry. Id collisions between tool
 * modules and provider modules are rejected at composition — never silently
 * shadowed in either direction, since the losing side would silently lose
 * its dispatch semantics.
 */
export function composeWithToolRegistry(
  modelRegistry: AiProviderRegistry,
  tools: ToolRegistry,
): AiProviderRegistry {
  for (const module of tools.modules) {
    if (modelRegistry.get(module.id) !== undefined) {
      throw new Error(
        `Module id collision: the tool module '${module.id}' matches a registered provider module. Tool module ids must be distinct from provider module ids so neither side silently loses its dispatch`,
      );
    }
  }
  const toolView = tools.providerRegistry;
  return Object.freeze({
    get: id => toolView.get(id) ?? modelRegistry.get(id),
    hasOperation: operation =>
      toolView.hasOperation(operation) || modelRegistry.hasOperation(operation),
    canonicalPath: path =>
      toolView.canonicalPath(path) ?? modelRegistry.canonicalPath(path),
  });
}
