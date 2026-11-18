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

/** One tool a server exposes, as declared for registration. */
export type ToolDeclaration = Readonly<{
  name: string;
  description?: string;
}>;

/** The result of one mediated tool dispatch. */
export type ToolCallResult = Readonly<{
  value: unknown;
  outcome: 'completed' | 'failed' | 'cancelled';
}>;

/** Provider-visible tool-call envelope metadata, without authorization state. */
export type ToolCallEnvelope = Readonly<{
  /** The registered tool module (server) identifier. */
  serverId: string;
  /** The declared tool being called. */
  toolName: string;
  /** The exact host-constructed tool endpoint URL. */
  destination: string;
}>;

/** The input a tool adapter dispatch receives. */
export type ToolDispatchInput = Readonly<{
  tool: ToolDeclaration;
  arguments: unknown;
  options: Readonly<Record<string, unknown>>;
}>;

/**
 * A host-trusted tool server registration, mirroring the provider module
 * seam. Modules are not sandboxed; register only code trusted as your own
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
  /** Server identifier; also the credential key namespace via `mcpCredentialId`. */
  id: string;
  tools: readonly ToolDeclaration[];
  /** Exact tool endpoint URL for one declared tool. */
  destination(toolName: string): string;
  /** Approved route shapes for the journal, covering every destination. */
  destinationTemplates: readonly DestinationTemplate[];
  /** Validates the final adapter-produced tool-call envelope. */
  validateToolCall(
    operation: ToolCallEnvelope,
    request: Request,
  ): Promise<void>;
  adapter: Readonly<{
    kind: 'tool';
    invoke(input: ToolDispatchInput): Promise<ToolCallResult>;
  }>;
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
  return {
    id: module.id,
    certifiedOperations: ['toolCall'],
    destinationTemplates: module.destinationTemplates,
    destination: (model: AnyModel) => module.destination(model.id),
    validateEnvelope: async (envelope, request) => {
      await module.validateToolCall(
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
        return module.adapter.invoke({
          tool: { name: model.id },
          arguments: input?.arguments,
          options,
        });
      },
    },
  };
}
