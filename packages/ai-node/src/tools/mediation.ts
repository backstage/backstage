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
import type { AnyModel } from '@earendil-works/pi-ai';
import type { ToolRegistry } from './registry';

/**
 * The guarded dispatch entry tool calls route through.
 *
 * @alpha
 */
export type GuardedToolDispatch = Readonly<{
  callTool(
    model: AnyModel,
    context: unknown,
    caller?: Record<string, unknown>,
  ): Promise<{
    /** The adapter's payload, returned to the caller untouched on success. */
    value: unknown;
    /** The adapter's settlement, so the boundary never infers from payload. */
    outcome: 'completed' | 'failed' | 'cancelled';
  }>;
}>;

/**
 * Tool calls mediated through the guard: an MCP tool call — a fetch to the
 * tool server with the scoped token — is a journaled, authorized, guarded
 * operation like any model dispatch. This facade contains NO per-attempt
 * enforcement of its own: it resolves the declared tool, shapes the call as
 * a model dispatch (the tool name rides the model identity, the server id
 * the provider, and the caller's credentials travel on the model for the
 * host's resolve to bind), and dispatches through the shared guarded model
 * operations entry. Every per-attempt invariant — ordinals, envelope
 * validation, permission recheck, journal-before-send, latch, expiry
 * propagation, used-from-invocation, per-invocation response and rejection
 * attribution, fabricated-completion rejection, detached-fetch abort — is
 * enforced by that shared machinery, the same one model dispatches use.
 *
 * The host constructs the guarded model operations with a resolve that maps
 * tool models to bindings: the operation carries `toolCall` as its
 * operation, the tool module id as its api, and the destination from the
 * tool module; the authority carries the interpreted MCP server credential
 * (bearer headers, and `kind: 'oauth'` with `expiresAt` when the stored
 * entry carries an expiry, so the guard's pre- and post-recheck expiry
 * checks apply to tool calls).
 *
 * @alpha
 */
export function createGuardedToolOperations(options: {
  tools: ToolRegistry;
  models: GuardedToolDispatch;
}) {
  return {
    async callTool(input: {
      serverId: string;
      toolName: string;
      arguments: unknown;
      credentials: BackstageCredentials;
      caller?: Record<string, unknown>;
    }): Promise<unknown> {
      const resolved = options.tools.resolve({
        serverId: input.serverId,
        toolName: input.toolName,
      });
      if (!resolved) {
        // No trusted binding exists to journal against: fail closed.
        throw new Error('unknown tool or unverified operation');
      }
      // No authorization here: this facade delegates straight into the shared
      // guarded dispatch, where the single per-attempt check is made against
      // `ai.tool.use` with the caller's own credentials and every denial is
      // journaled. A pre-check here would spend a second query per attempt and
      // leave a denial with no audit row.
      //
      // The guarded path reports the closed-vocabulary reason (and the journal
      // row carries the identity); this boundary names the tool the caller
      // asked for, so the error a host sees is actionable on its own. Both
      // contracts hold: the reason code is untouched, only the boundary text
      // gains identification.
      const model = Object.freeze({
        id: input.toolName,
        provider: input.serverId,
        api: resolved.module.id,
        // The caller's credentials travel on the model for the host's
        // resolve; the shared dispatch path never reads them itself.
        credentials: input.credentials,
      }) as never as AnyModel;
      const tool = `the tool '${input.serverId}/${input.toolName}'`;
      const result = await options.models.callTool(
        model,
        { arguments: input.arguments },
        input.caller,
      );
      // A completed tool call returns its payload exactly as the tool produced
      // it: a successful result whose data happens to contain an `errorMessage`
      // field is application data, not a failure, and is never rewritten. The
      // boundary names the tool only on a non-completed settlement, which the
      // dispatch path reports explicitly.
      if (result.outcome === 'completed') {
        return result.value;
      }
      const value = result.value;
      if (
        value !== null &&
        typeof value === 'object' &&
        typeof (value as { errorMessage?: unknown }).errorMessage === 'string'
      ) {
        return {
          ...(value as Record<string, unknown>),
          errorMessage: `Tool call to ${tool} failed: ${
            (value as { errorMessage: string }).errorMessage
          }`,
        };
      }
      return value;
    },
  };
}

/**
 * The guarded tool facade produced by {@link createGuardedToolOperations}.
 *
 * @alpha
 */
export type GuardedToolOperations = ReturnType<
  typeof createGuardedToolOperations
>;
