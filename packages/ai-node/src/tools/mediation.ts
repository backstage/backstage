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

import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Fence } from '../contracts';
import type { AttemptDecision } from '../journal/types';
import { hasTrustedOperationContext } from '../guard/types';
import type { ModelOperationGuard, TrustedOperation } from '../guard/types';
import type { ToolRegistry } from './registry';
import type { ToolIdentity } from './registry';

/** The host-resolved authority for one tool call, mirroring model bindings. */
export type ToolCallBinding = Readonly<{
  operation: TrustedOperation;
  authority: Readonly<{
    headers: Readonly<Record<string, string>>;
    expiresAt?: number;
  }>;
}>;

/** Resolves the binding for a call, or undefined to fail closed. */
export type ToolCallResolver = (
  identity: ToolIdentity,
  credentials: BackstageCredentials,
) => Promise<ToolCallBinding | undefined> | ToolCallBinding | undefined;

/** The journal surface the mediation uses for its own denials. */
export type ToolJournal = Pick<
  {
    recordDecisionAndIntent(
      fence: Fence,
      event: AttemptDecision,
    ): Promise<string>;
  },
  'recordDecisionAndIntent'
>;

/**
 * Tool calls mediated through the model operation guard: an MCP tool call —
 * a fetch to the tool server with the scoped token — is a journaled,
 * authorized, guarded operation like any model dispatch. The guard supplies
 * the per-attempt invariants (ordinal, envelope validation, recheck,
 * journal-before-send, latch, fail-closed on unverified combinations); this
 * mediation adds the tool dispatch discipline: a guarded send counts as used
 * from invocation, response receipt and fetch rejection are attributed per
 * attempt, and a completed tool result claimed without a guarded response is
 * rejected as fabricated exactly like a fabricated provider result.
 *
 * The guard must be constructed with the tool registry's provider view and
 * the journal with the same registry, so tool destinations and the
 * `models.toolCall` category flow through the existing seams.
 *
 * @alpha
 */
export function createGuardedToolOperations(options: {
  tools: ToolRegistry;
  guard: ModelOperationGuard;
  journal: ToolJournal;
  resolve: ToolCallResolver;
}) {
  class ToolPolicyRejection extends Error {}
  const reject = async (
    operation: TrustedOperation,
    reason: string,
  ): Promise<never> => {
    operation.controller.abort();
    await options.journal.recordDecisionAndIntent(operation.fence, {
      actor: operation.actor,
      conversationId: operation.provenance.conversationId,
      taskId: operation.provenance.taskId,
      callId: operation.provenance.callId,
      definitionVersion: operation.definitionVersion,
      configVersion: operation.configVersion,
      provider: operation.provider,
      model: operation.modelId,
      operation: 'models.toolCall',
      attempt: 1,
      decision: 'deny',
      reason,
    });
    throw new ToolPolicyRejection(reason);
  };

  return {
    async callTool(input: {
      serverId: string;
      toolName: string;
      arguments: unknown;
      credentials: BackstageCredentials;
      caller?: Record<string, unknown>;
    }): Promise<unknown> {
      const identity: ToolIdentity = {
        serverId: input.serverId,
        toolName: input.toolName,
      };
      const resolved = options.tools.resolve(identity);
      const binding = await options.resolve(identity, input.credentials);
      if (!resolved || !binding) {
        // No trusted binding exists to journal against: fail closed.
        throw new ToolPolicyRejection('unknown tool or unverified operation');
      }
      const { operation } = binding;
      const valid =
        hasTrustedOperationContext(operation) &&
        operation.operation === 'toolCall' &&
        operation.api === resolved.module.id &&
        operation.provider === identity.serverId &&
        operation.modelId === identity.toolName &&
        operation.resolvedModel === identity.toolName &&
        operation.destination ===
          resolved.module.destination(identity.toolName);
      if (!valid) {
        return reject(operation, 'unverified tool operation');
      }
      if (
        binding.authority.expiresAt !== undefined &&
        (!Number.isFinite(binding.authority.expiresAt) ||
          binding.authority.expiresAt <= Date.now())
      ) {
        return reject(operation, 'credential expired; re-authenticate');
      }
      const caller = input.caller ?? {};
      for (const key of ['fetch', 'headers'] as const) {
        if (caller[key] !== undefined) {
          return reject(operation, 'unsupported tool options');
        }
      }
      const guarded = options.guard.bind(operation);
      // Per-attempt accounting, mirroring the provider dispatch path: a
      // guarded send is used from invocation, response receipt and fetch
      // rejection are attributed per invocation, and detached fetches are
      // settled on fabrication.
      let guardAttempted = false;
      let invocationCount = 0;
      let respondedInvocation: number | null = null;
      let rejectedInvocation: number | null = null;
      const pendingFetches = new Set<Promise<unknown>>();
      const callOptions: Record<string, unknown> = {
        ...caller,
        headers: binding.authority.headers,
        ...(caller.signal instanceof AbortSignal
          ? {
              signal: AbortSignal.any([
                caller.signal,
                operation.controller.signal,
              ]),
            }
          : { signal: operation.controller.signal }),
        fetch: async (requestInput: RequestInfo | URL, init?: RequestInit) => {
          guardAttempted = true;
          const invocation = ++invocationCount;
          const attempt = (async () => {
            try {
              const response = await guarded.fetch(requestInput, init);
              respondedInvocation = invocation;
              return response;
            } catch (error) {
              rejectedInvocation = invocation;
              throw error;
            }
          })();
          pendingFetches.add(attempt);
          try {
            return await attempt;
          } finally {
            pendingFetches.delete(attempt);
          }
        },
      };
      try {
        const result = await resolved.module.adapter.invoke({
          tool: resolved.tool,
          arguments: input.arguments,
          options: Object.freeze(callOptions),
        });
        if (!guardAttempted) {
          return reject(operation, 'tool did not use guarded transport');
        }
        if (
          !result ||
          !['completed', 'failed', 'cancelled'].includes(result.outcome)
        ) {
          throw new Error('Invalid tool outcome');
        }
        if (
          result.outcome === 'completed' &&
          respondedInvocation !== invocationCount
        ) {
          // A claimed success is valid only when the LATEST guarded fetch
          // received its own response. A fabrication on top of a guard
          // denial is rejected without a second deny record; a detached
          // fetch is aborted and settled first.
          if (rejectedInvocation !== invocationCount) {
            operation.controller.abort();
            await Promise.allSettled([...pendingFetches]);
          }
          if (rejectedInvocation !== invocationCount) {
            return reject(operation, 'fabricated tool result');
          }
          throw new ToolPolicyRejection('fabricated tool result');
        }
        await guarded.finish(result.outcome);
        return result.value;
      } catch (error) {
        try {
          await guarded.finish('failed');
        } catch {
          /* already settled or uncertain */
        }
        if (!guardAttempted && !(error instanceof ToolPolicyRejection)) {
          return reject(operation, 'tool dispatch failed before guarded send');
        }
        throw error;
      }
    },
  };
}
