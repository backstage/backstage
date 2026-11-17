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
