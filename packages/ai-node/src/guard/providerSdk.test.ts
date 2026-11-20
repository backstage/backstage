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

import { createServer } from 'node:http';
import { once } from 'node:events';
import { mockCredentials } from '@backstage/backend-test-utils';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import { anthropicProvider } from '@earendil-works/pi-ai/providers/anthropic';
import { openaiCodexProvider } from '@earendil-works/pi-ai/providers/openai-codex';
import { azureProvider } from '@earendil-works/pi-ai/providers/azure';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import { streamSimple as openaiStream } from '@earendil-works/pi-ai/api/openai-responses';
import { streamSimple as anthropicStream } from '@earendil-works/pi-ai/api/anthropic-messages';
import { streamSimple as codexStream } from '@earendil-works/pi-ai/api/openai-codex-responses';
import { streamSimple as completionsStream } from '@earendil-works/pi-ai/api/openai-completions';
import { streamSimple as azureStream } from '@earendil-works/pi-ai/api/azure-openai-responses';
import { createModelOperationGuard as createModelOperationGuardBase } from './createModelOperationGuard';
import { createGuardedModelOperations as createGuardedModelOperationsBase } from './modelOperations';
import type { TrustedOperation } from './types';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { Fence } from '../contracts';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });
const createGuardedModelOperations = (
  options: Parameters<typeof createGuardedModelOperationsBase>[0],
) =>
  createGuardedModelOperationsBase({
    providers: builtinProviderRegistry,
    ...options,
  });

jest.setTimeout(15000);

it('rejects and latches a real undici redirect without following it', async () => {
  const paths: string[] = [];
  const server = createServer((req, res) => {
    paths.push(req.url ?? '');
    req.resume();
    res.writeHead(307, { location: '/stolen' });
    res.end();
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('No test port');
    const destination = `http://127.0.0.1:${address.port}/v1/responses`;
    const op: TrustedOperation = {
      actor: 'user:default/alice',
      credentials: mockCredentials.user('user:default/alice'),
      provenance: {
        origin: 'verified',
        conversationId: '1',
        taskId: '2',
        callId: '3',
      },
      fence: {
        namespace: { pluginId: 'test', sessionId: 's' },
        owner: 'owner',
        token: '1',
      },
      definitionVersion: 'v1',
      configVersion: 'v1',
      provider: 'openai',
      modelId: 'gpt',
      resolvedModel: 'gpt',
      operation: 'stream',
      api: 'openai-responses',
      destination,
      credentialScope: { kind: 'user', id: 'user:default/alice' },
      credentialGeneration: '1',
      controller: new AbortController(),
    };
    const journal = {
      recordDecisionAndIntent: jest.fn(async () => '1'),
      recordOutcome: jest.fn(async () => {}),
      recordRecovery: jest.fn(async () => {}),
      read: jest.fn(async () => ({ items: [] })),
    };
    const guard = createModelOperationGuard({
      journal,
      transport: globalThis.fetch,
      recheck: async () => true,
    }).bind(op);
    const request = () =>
      guard.fetch(destination, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"model":"gpt"}',
      });
    await expect(request()).rejects.toThrow('redirects');
    await expect(request()).rejects.toThrow('blocked');
    expect(paths).toEqual(['/v1/responses']);
    expect(op.controller.signal.aborted).toBe(true);
    expect(journal.recordOutcome).toHaveBeenCalledWith(op.fence, '1', {
      status: 'failed',
      httpStatus: 307,
    });
  } finally {
    server.close();
    await once(server, 'close');
  }
});

describe.each([
  'openai',
  'anthropic',
  'codex',
  'completions',
  'azure',
] as const)('%s native SDK transport', provider => {
  it('gates real SDK retries and rejects a final payload model substitution', async () => {
    const received: string[] = [];
    const authHeaders: Array<string | undefined> = [];
    const server = createServer((req, res) => {
      received.push(req.url ?? '');
      authHeaders.push(req.headers.authorization);
      req.resume();
      if (received.length === 5) {
        req.socket.destroy();
        return;
      }
      if (received.length === 4) {
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.write(': keep-alive\n\n');
        setTimeout(() => res.destroy(), 30);
        return;
      }
      const status = [429, 503][received.length - 1] ?? 400;
      res.writeHead(status, {
        'content-type': 'application/json',
        'retry-after-ms': '0',
        'retry-after': '0',
      });
      res.end(
        JSON.stringify({
          type: 'error',
          error: { type: 'invalid_request_error', message: 'test error' },
        }),
      );
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const address = server.address();
      if (!address || typeof address === 'string')
        throw new Error('No test port');
      const baseUrl = `http://127.0.0.1:${address.port}`;
      const providers = {
        openai: openaiProvider,
        anthropic: anthropicProvider,
        codex: openaiCodexProvider,
        completions: openaiProvider,
        azure: azureProvider,
      };
      const model = {
        ...providers[provider]().getModels()[0],
        baseUrl: `${baseUrl}${
          {
            openai: '/v1',
            completions: '/v1',
            azure: '/openai/v1',
            anthropic: '',
            codex: '/backend-api',
          }[provider]
        }`,
        ...(provider === 'completions'
          ? { api: 'openai-completions' as const }
          : {}),
      };
      const operation: TrustedOperation = {
        actor: 'user:default/alice',
        credentials: mockCredentials.user('user:default/alice'),
        provenance: {
          origin: 'verified',
          conversationId: '1',
          taskId: '2',
          callId: '3',
        },
        fence: {
          namespace: { pluginId: 'test', sessionId: 's' },
          owner: 'owner',
          token: '1',
        },
        definitionVersion: 'v1',
        configVersion: 'v1',
        provider: model.provider,
        modelId: model.id,
        resolvedModel: model.id,
        operation: 'streamSimple',
        api: model.api as TrustedOperation['api'],
        destination: `${baseUrl}${
          {
            openai: '/v1/responses',
            anthropic: '/v1/messages',
            codex: '/backend-api/codex/responses',
            completions: '/v1/chat/completions',
            azure: '/openai/v1/responses?api-version=v1',
          }[provider]
        }`,
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        credentialGeneration: '1',
        controller: new AbortController(),
      };
      const decisions: string[] = [];
      const outcomes: AttemptOutcome[] = [];
      // Explicitly non-production, non-durable test double.
      const journal = {
        recordDecisionAndIntent: async (
          _fence: Fence,
          event: AttemptDecision,
        ) => {
          decisions.push(`${event.decision}:${event.attempt}`);
          return String(event.attempt);
        },
        recordOutcome: async (
          _fence: Fence,
          _id: string,
          outcome: AttemptOutcome,
        ) => {
          outcomes.push(outcome);
        },
        recordRecovery: async () => {},
        read: async () => ({ items: [] }),
      };
      const guard = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck: async () => true,
      }).bind(operation);
      const stream = {
        openai: openaiStream,
        anthropic: anthropicStream,
        codex: codexStream,
        completions: completionsStream,
        azure: azureStream,
      }[provider];
      const apiKey =
        provider === 'codex'
          ? `x.${Buffer.from(
              JSON.stringify({
                'https://api.openai.com/auth': {
                  chatgpt_account_id: 'account',
                },
              }),
            ).toString('base64url')}.x`
          : 'test-key';
      const result = await stream(
        model as never,
        normalizeContext({ messages: [] }),
        {
          apiKey,
          transport: 'sse',
          fetch: guard.fetch,
          maxRetries: 2,
          signal: operation.controller.signal,
        },
      ).result();
      expect(result.stopReason).toBe('error');
      expect(received).toHaveLength(3);
      expect(decisions).toEqual(['allow:1', 'allow:2', 'allow:3']);
      const blocked = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck: async () => true,
      }).bind({ ...operation, controller: new AbortController() });
      await stream(model as never, normalizeContext({ messages: [] }), {
        apiKey,
        transport: 'sse',
        fetch: blocked.fetch,
        maxRetries: 0,
        onPayload: body => ({ ...(body as object), model: 'other' }),
      }).result();
      expect(received).toHaveLength(3);
      expect(decisions.at(-1)).toBe('deny:1');
      const interrupted = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck: async () => true,
      }).bind({ ...operation, controller: new AbortController() });
      const broken = await stream(
        model as never,
        normalizeContext({ messages: [] }),
        {
          apiKey,
          transport: 'sse',
          fetch: interrupted.fetch,
          maxRetries: 0,
        },
      ).result();
      expect(broken.stopReason).toBe('error');
      expect(received).toHaveLength(4);
      expect(outcomes.at(-1)).toMatchObject({
        status: 'stream-failed',
        httpStatus: 200,
      });
      const disconnected = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck: async () => true,
      }).bind({ ...operation, controller: new AbortController() });
      await stream(model as never, normalizeContext({ messages: [] }), {
        apiKey,
        transport: 'sse',
        fetch: disconnected.fetch,
        maxRetries: 0,
      }).result();
      expect(received).toHaveLength(5);
      expect(outcomes.at(-1)).toMatchObject({ status: 'unknown' });
      const facade = createGuardedModelOperations({
        journal,
        guard: createModelOperationGuard({
          transport: globalThis.fetch,
          journal,
          recheck: async () => true,
        }),
        resolve: (_model, method) => ({
          operation: {
            ...operation,
            operation: method,
            controller: new AbortController(),
          },
          model,
          authority: { kind: 'apiKey', apiKey },
        }),
      });
      await facade.completeSimple(
        model,
        { messages: [] },
        {
          maxRetries: 0,
          onPayload: (body, callbackModel) => {
            callbackModel.headers = { authorization: 'Bearer attacker' };
            return body;
          },
        },
      );
      expect(authHeaders[5]).toBe(
        {
          openai: `Bearer ${apiKey}`,
          completions: `Bearer ${apiKey}`,
          codex: `Bearer ${apiKey}`,
          anthropic: undefined,
          azure: undefined,
        }[provider],
      );
      expect(model.headers?.authorization).toBeUndefined();
    } finally {
      server.close();
      await once(server, 'close');
    }
  });
});
