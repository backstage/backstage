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

import { mockCredentials } from '@backstage/backend-test-utils';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import { createGuardedModelOperations } from '../guard/modelOperations';
import type { ModelOperation, TrustedOperation } from '../guard/types';
import type { AttemptDecision } from '../journal/types';
import type { Fence } from '../contracts';
import { validateHttpEnvelope } from './httpEnvelope';
import { createProviderRegistry } from './registry';
import type { AiProviderModule } from './types';

it('registers and enforces non-chat modules without guard or journal edits', async () => {
  const events: string[] = [];
  let validationFails = false;
  let mutateEnvelope = false;
  let oversized = false;
  let displaceFetch = false;
  let skipGuard = false;
  const bypass = jest.fn(async () => new Response('unguarded'));
  const module: AiProviderModule = {
    id: 'example-classifier',
    certifiedOperations: ['classify', 'generateImages'],
    destinationTemplates: [[{ literal: '/v1/classify' }]],
    destination: () => 'https://provider.example/v1/classify',
    validateEnvelope: async (op, request) => {
      events.push('validate');
      if (validationFails) throw new Error('bad envelope');
      if (mutateEnvelope)
        Object.assign(op, {
          destination: 'https://elsewhere.example/v1/classify',
          fence: {},
        });
      request.headers.set('x-provider-mutation', 'not forwarded');
      return validateHttpEnvelope({ endpoint: '/classify' }, op, request);
    },
    adapter: {
      kind: 'custom',
      invoke: async ({ operation, model, options }) => {
        if (displaceFetch) {
          (options as Record<string, unknown>).fetch = bypass;
        }
        if (!skipGuard) {
          const fetch = options.fetch as typeof globalThis.fetch;
          const response = await fetch('https://provider.example/v1/classify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              model: model.id,
              ...(oversized ? { data: 'x'.repeat(16 * 1024 * 1024) } : {}),
            }),
          });
          await response.text();
        }
        return { value: { operation }, outcome: 'completed' };
      },
    },
  };
  const providers = createProviderRegistry([module]);
  const model = { ...openaiProvider().getModels()[0], api: module.id } as never;
  const canonical = model as unknown as ReturnType<
    ReturnType<typeof openaiProvider>['getModels']
  >[number];
  const journal = {
    recordDecisionAndIntent: async (_fence: Fence, event: AttemptDecision) => {
      events.push(`decision:${event.decision}`);
      return '1';
    },
    recordOutcome: async () => {
      events.push('outcome');
    },
    recordRecovery: async () => {},
    read: async () => ({ items: [] }),
  };
  const transport = jest.fn(async (_request: Request) => {
    events.push('send');
    return new Response('ok');
  });
  const guard = createModelOperationGuard({
    providers,
    journal,
    recheck: async () => {
      events.push('recheck');
      return true;
    },
    transport: transport as unknown as typeof fetch,
  });
  const operations = createGuardedModelOperations({
    providers,
    guard,
    journal,
    resolve: (_model, operation: ModelOperation) => {
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
        provider: canonical.provider,
        modelId: canonical.id,
        resolvedModel: canonical.id,
        operation,
        api: module.id,
        destination: module.destination(canonical, undefined),
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        credentialGeneration: '1',
        controller: new AbortController(),
      };
      return {
        operation: op,
        model: canonical,
        authority: { kind: 'apiKey', apiKey: 'key' },
      };
    },
  });
  expect(await operations.classify(model, {} as never)).toEqual({
    operation: 'classify',
  });
  expect(events).toEqual([
    'validate',
    'recheck',
    'decision:allow',
    'send',
    'outcome',
  ]);
  expect(
    (transport.mock.calls[0][0] as unknown as Request).headers.has(
      'x-provider-mutation',
    ),
  ).toBe(false);
  events.length = 0;
  expect(await operations.generateImages(model, {} as never)).toEqual({
    operation: 'generateImages',
  });
  expect(events).toEqual([
    'validate',
    'recheck',
    'decision:allow',
    'send',
    'outcome',
  ]);
  events.length = 0;
  validationFails = true;
  await expect(operations.classify(model, {} as never)).rejects.toThrow(
    'bad envelope',
  );
  expect(events).toEqual(['validate', 'decision:deny']);
  validationFails = false;
  mutateEnvelope = true;
  events.length = 0;
  await expect(operations.classify(model, {} as never)).rejects.toThrow();
  expect(events).toEqual(['validate', 'decision:deny']);
  mutateEnvelope = false;
  oversized = true;
  events.length = 0;
  await expect(operations.classify(model, {} as never)).rejects.toThrow(
    'exceeds limit',
  );
  expect(events).toEqual(['decision:deny']);
  oversized = false;
  events.length = 0;
  skipGuard = true;
  await expect(operations.classify(model, {} as never)).rejects.toThrow(
    'guarded transport',
  );
  expect(events).toEqual(['decision:deny']);
  skipGuard = false;
  displaceFetch = true;
  events.length = 0;
  await expect(operations.classify(model, {} as never)).rejects.toThrow(
    'before guarded send',
  );
  expect(events).toEqual(['decision:deny']);
  expect(bypass).not.toHaveBeenCalled();
  displaceFetch = false;
  events.length = 0;
  await expect(
    operations.classify(model, {} as never, { fetch: jest.fn() } as never),
  ).rejects.toThrow('unsupported model options');
  expect(events).toEqual(['decision:deny']);
  events.length = 0;
  await expect(operations.fetchDeferred(model, {} as never)).rejects.toThrow(
    'unsupported model operation',
  );
  expect(events).toEqual(['decision:deny']);
  expect(transport).toHaveBeenCalledTimes(2);
});

it('rejects fabricated completions while preserving honest error settlements', async () => {
  const events: string[] = [];
  // The dispatch modes under test:
  // - swallow: catches a guard denial (substituted model) and fabricates success
  // - revoked: the permission recheck denies; the dispatch fabricates success
  // - detached: fires the guarded fetch without awaiting and fabricates success
  // - thrown: an honest in-band failed settlement after a transport error
  // - legit: an honest completed settlement after a real guarded response
  let mode:
    | 'swallow'
    | 'revoked'
    | 'detached'
    | 'thrown'
    | 'legit'
    | 'multi-denied'
    | 'multi-revoked'
    | 'multi-thrown' = 'legit';
  let denyPermission = false;
  let checkCount = 0;
  const transport = jest.fn(async () => new Response('ok'));
  const module: AiProviderModule = {
    id: 'example-classifier',
    certifiedOperations: ['classify'],
    destinationTemplates: [[{ literal: '/v1/classify' }]],
    destination: () => 'https://provider.example/v1/classify',
    validateEnvelope: (op, request) =>
      validateHttpEnvelope({ endpoint: '/classify' }, op, request),
    adapter: {
      kind: 'custom',
      invoke: async ({ model, options }) => {
        const fetch = options.fetch as typeof globalThis.fetch;
        const send = (bodyModel: string) =>
          fetch('https://provider.example/v1/classify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ model: bodyModel }),
          });
        if (
          mode === 'multi-denied' ||
          mode === 'multi-revoked' ||
          mode === 'multi-thrown'
        ) {
          // A legitimate first request with a real guarded response...
          const first = await send(model.id);
          await first.text();
          if (mode === 'multi-thrown') {
            transport.mockImplementationOnce(async () => {
              throw new Error('network disconnected');
            });
          }
          // ...then a second request whose outcome the provider misreports.
          try {
            const second = await send(
              mode === 'multi-denied' ? 'substituted' : model.id,
            );
            await second.text();
          } catch (error) {
            if (mode === 'multi-thrown') {
              return {
                value: { errorMessage: String(error) },
                outcome: 'failed',
              };
            }
            return { value: { fake: true }, outcome: 'completed' };
          }
          return { value: { fake: true }, outcome: 'completed' };
        }
        if (mode === 'detached') {
          void send(model.id).catch(() => {
            /* provider detaches its fetch */
          });
          return { value: { fake: true }, outcome: 'completed' };
        }
        try {
          const response = await send(
            mode === 'swallow' || mode === 'revoked' ? 'substituted' : model.id,
          );
          if (mode === 'thrown') {
            throw new Error('network disconnected');
          }
          await response.text();
        } catch (error) {
          if (mode === 'swallow' || mode === 'revoked') {
            // The provider incorrectly swallows the denial and fabricates.
            return { value: { fake: true }, outcome: 'completed' };
          }
          return {
            value: { errorMessage: String(error) },
            outcome: 'failed',
          };
        }
        return { value: { ok: true }, outcome: 'completed' };
      },
    },
  };
  const providers = createProviderRegistry([module]);
  const model = { ...openaiProvider().getModels()[0], api: module.id } as never;
  const canonical = model as unknown as ReturnType<
    ReturnType<typeof openaiProvider>['getModels']
  >[number];
  const journal = {
    recordDecisionAndIntent: async (_fence: Fence, event: AttemptDecision) => {
      events.push(`decision:${event.decision}:${event.attempt}`);
      return String(event.attempt);
    },
    recordOutcome: async () => {
      events.push('outcome');
    },
    recordRecovery: async () => {},
    read: async () => ({ items: [] }),
  };
  const guard = createModelOperationGuard({
    providers,
    journal: journal as never,
    recheck: async () => {
      checkCount += 1;
      if (mode === 'multi-revoked') return checkCount < 2;
      return !denyPermission;
    },
    transport: transport as unknown as typeof fetch,
  });
  const operations = createGuardedModelOperations({
    providers,
    guard,
    journal: journal as never,
    resolve: (_model, operation: ModelOperation) => {
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
        provider: canonical.provider,
        modelId: canonical.id,
        resolvedModel: canonical.id,
        operation,
        api: module.id,
        destination: module.destination(canonical, undefined),
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        credentialGeneration: '1',
        controller: new AbortController(),
      };
      return {
        operation: op,
        model: canonical,
        authority: { kind: 'apiKey', apiKey: 'key' },
      };
    },
  });
  const classify = () => operations.classify(model, {} as never);

  // A legitimate completed settlement after a real guarded response passes.
  mode = 'legit';
  await expect(classify()).resolves.toEqual({ ok: true });
  expect(events).toEqual(['decision:allow:1', 'outcome']);
  events.length = 0;

  // A guard-denied fetch that is caught and fabricated is rejected: the
  // guard's own denial is the only journal record — no duplicate deny.
  mode = 'swallow';
  await expect(classify()).rejects.toThrow('fabricated provider result');
  expect(events).toEqual(['decision:deny:1']);
  expect(transport).toHaveBeenCalledTimes(1);
  events.length = 0;

  // A revoked permission that is caught and fabricated is likewise
  // rejected without a second deny record.
  mode = 'revoked';
  denyPermission = true;
  await expect(classify()).rejects.toThrow('fabricated provider result');
  expect(events).toEqual(['decision:deny:1']);
  expect(transport).toHaveBeenCalledTimes(1);
  denyPermission = false;
  events.length = 0;

  // A detached fetch with an immediate fabricated completion is rejected;
  // the fabrication deny is the only denial record (the background fetch
  // settles through the guard's own accounting).
  mode = 'detached';
  await expect(classify()).rejects.toThrow('fabricated provider result');
  expect(events.filter(event => event.startsWith('decision:deny'))).toEqual([
    'decision:deny:1',
  ]);
  events.length = 0;

  // An honest failed settlement after a transport that ran and threw
  // settles in-band with allow plus an uncertain outcome — never a
  // follow-on "did not use guarded transport" denial.
  mode = 'thrown';
  transport.mockImplementation(async () => {
    throw new Error('network disconnected');
  });
  await expect(classify()).resolves.toMatchObject({
    errorMessage: expect.stringContaining('network disconnected'),
  });
  expect(events).toEqual(['decision:allow:1', 'outcome']);
  expect(transport).toHaveBeenCalledTimes(2);
  events.length = 0;

  // A response to an EARLIER request cannot validate a completion claimed
  // after a LATER request was denied: the completion guard is per-attempt.
  transport.mockImplementation(async () => new Response('ok'));
  mode = 'multi-denied';
  await expect(classify()).rejects.toThrow('fabricated provider result');
  expect(events).toEqual(['decision:allow:1', 'decision:deny:2', 'outcome']);
  expect(transport).toHaveBeenCalledTimes(3);
  events.length = 0;

  // The same per-attempt discipline holds when the later denial comes
  // from the permission recheck.
  mode = 'multi-revoked';
  checkCount = 0;
  await expect(classify()).rejects.toThrow('fabricated provider result');
  expect(events).toEqual(['decision:allow:1', 'decision:deny:2', 'outcome']);
  expect(transport).toHaveBeenCalledTimes(4);
  events.length = 0;

  // The honest multi-attempt shape: an earlier response plus a later
  // transport failure settles in-band for that attempt — no denial.
  mode = 'multi-thrown';
  await expect(classify()).resolves.toMatchObject({
    errorMessage: expect.stringContaining('network disconnected'),
  });
  expect(events).toEqual([
    'decision:allow:1',
    'decision:allow:2',
    'outcome',
    'outcome',
  ]);
  expect(transport).toHaveBeenCalledTimes(6);
});
