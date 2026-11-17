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
  createAssistantMessageEventStream,
  normalizeContext,
  type AnyModel,
  type AssistantMessage,
  type AssistantMessageEventStream,
  type Context,
  type Model,
  type Models,
  type ProviderHeaders,
} from '@earendil-works/pi-ai';
import * as responses from '@earendil-works/pi-ai/api/openai-responses';
import * as completions from '@earendil-works/pi-ai/api/openai-completions';
import * as azure from '@earendil-works/pi-ai/api/azure-openai-responses';
import * as codex from '@earendil-works/pi-ai/api/openai-codex-responses';
import * as anthropic from '@earendil-works/pi-ai/api/anthropic-messages';
import type { AttemptJournal } from '../journal/types';
import { assertRedactedText } from '../journal/redaction';
import type {
  ModelOperation,
  ModelOperationGuard,
  TrustedOperation,
} from './types';
import { hasTrustedOperationContext } from './types';
import { guardedRequestOptions } from './requestOptions';

/** Host-resolved credentials. Never constructed from caller request options. */
type ProviderAuthority = Readonly<{
  kind: 'apiKey' | 'oauth' | 'federation';
  apiKey?: string;
  headers?: ProviderHeaders;
  env?: Record<string, string>;
  /** Required for OAuth; automatic refresh is not permitted here. */
  expiresAt?: number;
}>;

export type GuardedModelBinding = Readonly<{
  operation: TrustedOperation;
  model: Model<any>;
  authority: ProviderAuthority;
}>;

/**
 * Host resolution failed after a trusted binding was established.
 * Untyped throws or invalid bindings still deny, but cannot be journaled:
 * the host violated the resolve contract, and audit authority is never
 * invented from caller-provided model data. The unjournaled deny is observable.
 */
export class GuardedResolutionError extends Error {
  constructor(readonly binding: GuardedModelBinding, reason: string) {
    super(reason);
    this.name = 'GuardedResolutionError';
  }
}

type ModelRequests = Pick<
  Models,
  | 'stream'
  | 'complete'
  | 'streamSimple'
  | 'completeSimple'
  | 'streamDeferred'
  | 'fetchDeferred'
  | 'cancelDeferred'
  | 'classify'
  | 'generateImages'
>;

type Adapter = {
  stream(
    model: never,
    context: never,
    options: never,
  ): AssistantMessageEventStream;
  streamSimple(
    model: never,
    context: never,
    options: never,
  ): AssistantMessageEventStream;
};
const ADAPTERS: Record<TrustedOperation['api'], Adapter> = {
  'openai-responses': responses as unknown as Adapter,
  'openai-completions': completions as unknown as Adapter,
  'azure-openai-responses': azure as unknown as Adapter,
  'openai-codex-responses': codex as unknown as Adapter,
  'anthropic-messages': anthropic as unknown as Adapter,
};

/**
 * Request-only facade. The host supplies verified, filtered catalog lookups
 * separately; no provider, credential, mutation or administrative access escapes.
 * Native Models.applyAuth is deliberately not used: it can refresh OAuth outside
 * the guarded transport. Only the pinned provider adapters above may dispatch.
 */
export function createGuardedModelOperations(options: {
  guard: ModelOperationGuard;
  journal: AttemptJournal;
  resolve(model: AnyModel, operation: ModelOperation): GuardedModelBinding;
}): ModelRequests {
  class PolicyRejection extends Error {}
  class ResolveContractViolation extends Error {}
  const reject = async (
    binding: GuardedModelBinding,
    operation: string,
    reason: string,
  ) => {
    const op = binding.operation;
    op.controller.abort();
    if (!options.journal) throw new Error('Attempt journal is not bound');
    await options.journal.recordDecisionAndIntent(op.fence, {
      actor: op.actor,
      conversationId: op.provenance.conversationId,
      taskId: op.provenance.taskId,
      callId: op.provenance.callId,
      definitionVersion: op.definitionVersion,
      configVersion: op.configVersion,
      provider: op.provider,
      model: op.modelId,
      operation,
      attempt: 1,
      decision: 'deny',
      reason,
    });
    throw new PolicyRejection(reason);
  };
  const matches = (
    binding: GuardedModelBinding,
    model: AnyModel,
    operation: ModelOperation,
  ) => {
    const op = binding.operation;
    return (
      op.operation === operation &&
      op.provider === model.provider &&
      op.modelId === model.id &&
      binding.model?.provider === op.provider &&
      binding.model?.id === op.modelId &&
      binding.model?.api === op.api &&
      model.api === op.api
    );
  };
  const resolveBinding = async (model: AnyModel, operation: ModelOperation) => {
    try {
      return options.resolve(model, operation);
    } catch (error) {
      if (
        error instanceof GuardedResolutionError &&
        error.binding &&
        hasTrustedOperationContext(error.binding.operation) &&
        matches(error.binding, model, operation)
      ) {
        let reason = 'unsupported operation';
        try {
          reason = assertRedactedText(error.message, 'reason', {
            required: true,
          })!;
        } catch {
          /* keep fixed reason */
        }
        return reject(error.binding, `models.${operation}`, reason);
      }
      throw new ResolveContractViolation(
        'Model operation denied: resolve contract violation',
      );
    }
  };
  const errorMessage = (
    model: AnyModel,
    reason = 'Managed model operation denied or failed',
  ): AssistantMessage => ({
    role: 'assistant',
    content: [],
    api: model.api as AssistantMessage['api'],
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: 'error',
    errorMessage: reason,
    timestamp: Date.now(),
  });
  function start(
    model: AnyModel,
    context: Context,
    caller: Record<string, unknown> | undefined,
    operation: ModelOperation,
    simple: boolean,
  ): AssistantMessageEventStream {
    const output = createAssistantMessageEventStream();
    void (async () => {
      let guarded: ReturnType<ModelOperationGuard['bind']> | undefined;
      try {
        const binding = await resolveBinding(model, operation);
        const op: TrustedOperation = {
          ...binding.operation,
          ...(binding.authority.kind === 'oauth'
            ? { providerCredentialExpiresAt: binding.authority.expiresAt }
            : {}),
        };
        if (
          !hasTrustedOperationContext(op) ||
          !matches(binding, model, operation)
        ) {
          await reject(
            binding,
            `models.${operation}`,
            'unverified model operation',
          );
        }
        if (
          !['apiKey', 'oauth', 'federation'].includes(binding.authority.kind)
        ) {
          await reject(
            binding,
            'auth.token',
            'unsupported provider credentials',
          );
        }
        // Pi can discover federation credentials from the process environment.
        // Do not permit that path under a static or OAuth authority binding.
        if (binding.authority.kind === 'federation') {
          await reject(
            binding,
            'auth.token-exchange',
            'federation token exchange is not certified',
          );
        }
        const hasAuth =
          !!binding.authority.apiKey ||
          Object.entries(binding.authority.headers ?? {}).some(
            ([key, value]) =>
              ['authorization', 'x-api-key', 'cf-aig-authorization'].includes(
                key.toLowerCase(),
              ) &&
              typeof value === 'string' &&
              !!value.trim(),
          );
        if (!hasAuth) {
          await reject(binding, 'auth.token', 'provider credentials required');
        }
        if (
          binding.authority.kind === 'oauth' &&
          (typeof binding.authority.expiresAt !== 'number' ||
            !Number.isFinite(binding.authority.expiresAt) ||
            binding.authority.expiresAt <= Date.now())
        ) {
          await reject(
            binding,
            'auth.token',
            'credential expired; re-authentication required',
          );
        }
        guarded = options.guard.bind(op);
        let requestOptions: Record<string, unknown>;
        try {
          requestOptions = guardedRequestOptions(op, guarded, caller);
        } catch {
          await reject(
            binding,
            `models.${operation}`,
            'unsupported model options',
          );
          throw new Error('unreachable');
        }
        const adapter = ADAPTERS[op.api];
        if (!adapter)
          await reject(
            binding,
            `models.${operation}`,
            'unsupported model transport',
          );
        // Provider callbacks receive model objects. Never expose the host's
        // canonical object to an extension that could mutate later headers.
        for (const key of [
          'onPayload',
          'onResponse',
          'onProviderStreamEvent',
        ] as const) {
          const callback = requestOptions[key];
          if (typeof callback === 'function') {
            requestOptions[key] = (value: unknown, callbackModel: AnyModel) =>
              callback(value, structuredClone(callbackModel));
          }
        }
        const callOptions = {
          ...requestOptions,
          apiKey: binding.authority.apiKey,
          headers: binding.authority.headers,
          env: binding.authority.env,
          // No trusted or caller options may displace the enforcement boundary.
          fetch: guarded.fetch.bind(guarded),
        };
        const input = normalizeContext(context);
        const native = (simple ? adapter.streamSimple : adapter.stream)(
          binding.model as never,
          input as never,
          callOptions as never,
        );
        let terminal: Parameters<typeof output.push>[0] | undefined;
        for await (const event of native) {
          if (event.type === 'done' || event.type === 'error') terminal = event;
          else output.push(event);
        }
        const result = await native.result();
        let outcome: 'cancelled' | 'failed' | 'completed' = 'completed';
        if (result.stopReason === 'aborted') outcome = 'cancelled';
        else if (result.stopReason === 'error') outcome = 'failed';
        await guarded.finish(outcome);
        if (!terminal) throw new Error('Missing model terminal event');
        output.push(terminal);
        output.end();
      } catch (error) {
        if (guarded) {
          try {
            await guarded.finish('failed');
          } catch {
            /* Already finished or uncertain. */
          }
        }
        output.push({
          type: 'error',
          reason: 'error',
          error: errorMessage(
            model,
            error instanceof PolicyRejection ||
              error instanceof ResolveContractViolation
              ? error.message
              : undefined,
          ),
        });
        output.end();
      }
    })();
    return output;
  }
  const unsupported = async (
    model: AnyModel,
    operation: ModelOperation,
  ): Promise<never> => {
    const binding = await resolveBinding(model, operation);
    return reject(
      binding,
      `models.${operation}`,
      'unsupported model operation',
    );
  };
  return {
    stream: (model, context, caller) =>
      start(model, context, caller as Record<string, unknown>, 'stream', false),
    complete: (model, context, caller) =>
      start(
        model,
        context,
        caller as Record<string, unknown>,
        'complete',
        false,
      ).result(),
    streamSimple: (model, context, caller) =>
      start(
        model,
        context,
        caller as Record<string, unknown>,
        'streamSimple',
        true,
      ),
    completeSimple: (model, context, caller) =>
      start(
        model,
        context,
        caller as Record<string, unknown>,
        'completeSimple',
        true,
      ).result(),
    streamDeferred: model => {
      const output = createAssistantMessageEventStream();
      void unsupported(model, 'streamDeferred').catch(error => {
        output.push({
          type: 'error',
          reason: 'error',
          error: errorMessage(
            model,
            error instanceof PolicyRejection ||
              error instanceof ResolveContractViolation
              ? error.message
              : undefined,
          ),
        });
        output.end();
      });
      return output;
    },
    fetchDeferred: model => unsupported(model, 'fetchDeferred'),
    cancelDeferred: model => unsupported(model, 'cancelDeferred'),
    classify: model => unsupported(model, 'classify'),
    generateImages: model => unsupported(model, 'generateImages'),
  };
}
