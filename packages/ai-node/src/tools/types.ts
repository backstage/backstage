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

import type { AnyModel } from '@earendil-works/pi-ai';
import type { DestinationTemplate } from '../providers/templates';
import type { AiProviderModule } from '../providers/types';

/**
 * One tool a server exposes, as declared for registration.
 *
 * @alpha
 */
export type ToolDeclaration = Readonly<{
  name: string;
  description?: string;
}>;

/**
 * The result of one mediated tool dispatch.
 *
 * @alpha
 */
export type ToolCallResult = Readonly<{
  value: unknown;
  outcome: 'completed' | 'failed' | 'cancelled';
}>;

/**
 * Provider-visible tool-call envelope metadata, without authorization
 * state.
 *
 * @alpha
 */
export type ToolCallEnvelope = Readonly<{
  /** The registered tool module (server) identifier. */
  serverId: string;
  /** The declared tool being called. */
  toolName: string;
  /** The exact host-constructed tool endpoint URL. */
  destination: string;
}>;

/**
 * The input a tool adapter dispatch receives.
 *
 * @alpha
 */
export type ToolDispatchInput = Readonly<{
  tool: ToolDeclaration;
  arguments: unknown;
  options: Readonly<Record<string, unknown>>;
}>;

/**
 * A host-trusted tool server registration, mirroring the provider module
 * seam. Two kinds share the seam:
 *
 * - an **HTTP tool server** (MCP today) mediates a guarded fetch to the
 *   server, with a scoped credential, a pinned destination and a route
 *   template;
 * - a **local tool server** runs a host function in process. It declares no
 *   credential, no destination and no envelope validator, because nothing
 *   leaves the process: `run` executes arbitrary host code under the guard's
 *   decision, fence and per-attempt permission recheck, and the outcome is
 *   journaled by identity. The guard's guarantee narrows there — it cannot
 *   see or constrain what that function does. Modules are not sandboxed; register only code trusted as your own
 * plugin. Dispatch goes through the guarded transport the host injects via
 * `options.fetch`; the mediation fails a call closed when a dispatch
 * completes without a guarded send, exactly as fabricated provider results
 * are rejected.
 *
 * The registry category flows through the extensible journal seam: a tool
 * call journals as `models.toolCall` because the tool module certifies the
 * `toolCall` operation, with no journal-core edits per tool type.
 *
 * @alpha
 */
export type ToolModule = Readonly<{
  id: string;
  tools: readonly ToolDeclaration[];
  /**
   * Exact tool endpoint URL for one declared tool. Required for an HTTP tool
   * server; a local one has no destination.
   */
  destination?(toolName: string): string;
  /** Approved route shapes for the journal. HTTP tool servers only. */
  destinationTemplates?: readonly DestinationTemplate[];
  /** Validates the final adapter-produced tool-call envelope. HTTP only. */
  validateToolCall?(
    operation: ToolCallEnvelope,
    request: Request,
  ): Promise<void>;
  /** The adapter of an HTTP tool server, the guarded-fetch kind. */
  adapter?: Readonly<{
    kind: 'tool';
    invoke(input: ToolDispatchInput): Promise<ToolCallResult>;
  }>;
  /**
   * Runs one tool call on the backend host, in process — the local tool kind.
   *
   * @remarks
   * UNSANDBOXED BY DESIGN: this is host code with the backend's own
   * privileges, so a tool here can read files, spawn processes and open
   * sockets. The guard authorizes the attempt, checks the fence and the
   * per-attempt permission with the caller's credentials before this runs,
   * and journals the decision and the outcome by identity; it does not
   * constrain what the function does. Register a local tool server only when
   * the deployment deliberately wants that.
   */
  run?(input: ToolDispatchInput): Promise<ToolCallResult>;
}>;

/**
 * Adapts one tool module to the provider module shape the guard and journal
 * already consume: the tool name rides the model identity fields and the
 * `toolCall` operation is certified like any provider operation.
 *
 * @alpha
 */
export function toolModuleAsProviderModule(
  module: ToolModule,
): AiProviderModule {
  if (module.run !== undefined) {
    // Local tool server: host code in process. No credential is interpreted
    // and no destination exists, so the module registers with no credential
    // kinds and the guard takes its local branch for the `toolCall` operation.
    return {
      id: module.id,
      credentialKinds: [],
      certifiedOperations: ['toolCall'],
      adapter: {
        kind: 'local',
        run: async ({ model, context }) => {
          const input = context as { arguments?: unknown } | undefined;
          return module.run!({
            tool: { name: model.id },
            arguments: input?.arguments,
            options: {},
          });
        },
      },
    };
  }
  return {
    id: module.id,
    // MCP servers take either an API key or an OAuth access token; the
    // interpretation below decides from the stored credential's shape.
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: ['toolCall'],
    destinationTemplates: module.destinationTemplates ?? [],
    destination: (model: AnyModel) => module.destination!(model.id),
    validateEnvelope: async (envelope, request) => {
      await module.validateToolCall!(
        {
          serverId: envelope.api,
          toolName: envelope.modelId,
          destination: envelope.destination,
        },
        request,
      );
      return 'model';
    },
    adapter: {
      kind: 'custom',
      invoke: async ({ model, context, options }) => {
        const input = context as { arguments?: unknown } | undefined;
        return module.adapter!.invoke({
          tool: { name: model.id },
          arguments: input?.arguments,
          options,
        });
      },
    },
  };
}
