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

import { once } from 'node:events';
import {
  createGuardedModelOperations,
  createModelOperationGuard,
} from '@backstage/ai-node/testUtils';
import type {
  AttemptDecision,
  AttemptOutcome,
} from '@backstage/ai-node/testUtils';
import { createServer, type Server } from 'node:http';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { AnyModel } from '@earendil-works/pi-ai';
import { OPENAI_CLASSIFIER_MODELS } from '@earendil-works/pi-ai/providers/openai.models';
import {
  createJournalHarness,
  createProviderRegistry,
  validateHttpEnvelope,
  type AiProviderModule,
  type Fence,
  type ModelOperation,
  type TrustedOperation,
} from '@backstage/ai-node/testUtils';
import { openaiDecisions } from './decisions';

const providers = createProviderRegistry([openaiDecisions]);

const classifierContext = {
  state: { text: 'hello' },
  questions: {
    q1: {
      type: 'bool' as const,
      instructions: 'Is this a greeting?',
      criteria: { true: 'it greets', false: 'it does not' },
    },
  },
};

type Body = Record<string, unknown>;

async function startServer(
  handle: (
    pathname: string,
    body: Body,
    headers: Record<string, string>,
  ) => Body,
): Promise<{
  server: Server;
  origin: string;
  requests: Array<{
    pathname: string;
    body: Body;
    headers: Record<string, string>;
  }>;
}> {
  const requests: Array<{
    pathname: string;
    body: Body;
    headers: Record<string, string>;
  }> = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const headers = Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, String(v)]),
      );
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as Body;
      requests.push({ pathname: req.url ?? '', body, headers });
      const response = handle(req.url ?? '', body, headers);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, origin: `http://127.0.0.1:${address.port}`, requests };
}

function harness(model: AnyModel, operation: ModelOperation) {
  const events: string[] = [];
  const journal = {
    recordDecisionAndIntent: jest.fn(
      async (_fence: Fence, event: AttemptDecision) => {
        events.push(`${event.decision}:${event.attempt}`);
        return String(event.attempt);
      },
    ),
    recordOutcome: jest.fn(
      async (_fence: Fence, _id: string, outcome: AttemptOutcome) => {
        events.push(`outcome:${outcome.status}`);
      },
    ),
    recordRecovery: jest.fn(async () => {}),
    read: jest.fn(async () => ({ items: [] })),
  };
  const transport = jest.fn(async (request: Request) => {
    events.push('send');
    return globalThis.fetch(request);
  });
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
    provider: model.provider,
    modelId: model.id,
    resolvedModel: model.id,
    operation,
    api: model.api,
    destination: providers.get(model.api)!.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
  const guard = createModelOperationGuard({
    providers,
    journal: journal as never,
    recheck: async () => {
      events.push('check');
      return true;
    },
    transport: transport as unknown as typeof fetch,
  });
  const facade = createGuardedModelOperations({
    providers,
    guard,
    journal: journal as never,
    resolve: () => ({
      model,
      operation: op,
      authority: { kind: 'apiKey', apiKey: 'test-key' },
    }),
  });
  // Denials latch the operation, so every probe gets a fresh binding.
  const probe = async (body: unknown, url: URL | string = op.destination) => {
    const fresh = guard.bind({
      ...op,
      controller: new AbortController(),
    });
    await expect(
      fresh.fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    ).rejects.toThrow();
  };
  return { events, transport, guard: guard.bind(op), op, facade, probe };
}

function trustedOperation(
  model: AnyModel,
  fence: Fence,
  operation: ModelOperation,
): TrustedOperation {
  return {
    actor: 'user:default/alice',
    credentials: mockCredentials.user('user:default/alice'),
    provenance: {
      origin: 'verified',
      conversationId: '1',
      taskId: '2',
      callId: '3',
    },
    fence,
    definitionVersion: 'v1',
    configVersion: 'v1',
    provider: model.provider,
    modelId: model.id,
    resolvedModel: model.id,
    operation,
    api: model.api,
    destination: providers.get(model.api)!.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

describe('OpenAI Decisions module', () => {
  it('classifies through the OpenAI Decisions API', async () => {
    const { server, origin, requests } = await startServer(() => ({
      answers: [{ name: 'q1', type: 'predicate', probability: 0.91 }],
      stop_reason: 'stop',
      usage: { total_tokens: 10 },
    }));
    try {
      const model = {
        ...OPENAI_CLASSIFIER_MODELS['gpt-6-luna'],
        baseUrl: `${origin}/v1`,
      } as never as AnyModel;
      const f = harness(model, 'classify');
      const result = (await f.facade.classify(
        model as never,
        classifierContext as never,
      )) as unknown as {
        answers: { q1: { type: string; probability: number } };
      };
      expect(result.answers.q1).toEqual({
        type: 'bool',
        probability: 0.91,
      });
      expect(f.events).toEqual([
        'check',
        'allow:1',
        'send',
        'outcome:completed',
      ]);
      expect(requests[0].pathname).toBe('/v1/decisions');
      expect(requests[0].body.model).toBe('gpt-6-luna');
      expect(requests[0].body.questions).toEqual([
        expect.objectContaining({ type: 'predicate', name: 'q1' }),
      ]);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('denies decisions requests with substituted models or routes', async () => {
    const model = {
      ...(OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel),
      baseUrl: 'https://provider.example/v1',
    } as AnyModel;
    const f = harness(model, 'classify');
    await f.probe({ model: 'other', state: {}, questions: {} });
    const wrong = new URL(f.op.destination);
    wrong.pathname = '/v1/other';
    await f.probe({ model: model.id }, wrong);
    const query = new URL(f.op.destination);
    query.searchParams.set('unexpected', 'true');
    await f.probe({ model: model.id }, query);
    expect(f.events).toEqual(['deny:1', 'deny:1', 'deny:1']);
    expect(f.transport).not.toHaveBeenCalled();
  });

  it('accounts a transport that ran and threw as used, with no follow-on denial', async () => {
    const model = {
      ...(OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel),
      baseUrl: 'http://127.0.0.1:1/v1',
    } as never as AnyModel;
    const f = harness(model, 'classify');
    f.transport.mockImplementation(async () => {
      throw new Error('network disconnected');
    });
    const result = (await f.facade.classify(
      model as never,
      classifierContext as never,
      { maxRetries: 0 } as never,
    )) as { stopReason: string; errorMessage?: string };
    // The dispatch settles in-band with the transport failure, and the
    // journal shows exactly one allow with an uncertain outcome — never a
    // contradictory "did not use guarded transport" denial.
    expect(result.stopReason).toBe('error');
    expect(result.errorMessage).toContain('network disconnected');
    expect(f.events).toEqual(['check', 'allow:1', 'outcome:unknown']);
    expect(f.transport).toHaveBeenCalledTimes(1);
  });

  it('persists the per-attempt fabrication rejection for multi-attempt dispatches', async () => {
    // An earlier response cannot validate a completion claimed after a
    // later request was denied: the durable journal must show the two
    // attempt decisions and never a fabricated completed outcome.
    const module: AiProviderModule = {
      id: 'multi-attempt-classifier',
      credentialKinds: ['api_key'],
      certifiedOperations: ['classify'],
      destinationTemplates: [[{ literal: '/v1/classify' }]],
      destination: () => 'https://provider.example/v1/classify',
      validateEnvelope: (op, envelopeRequest) =>
        validateHttpEnvelope({ endpoint: '/classify' }, op, envelopeRequest),
      adapter: {
        kind: 'custom',
        invoke: async ({ model, options }) => {
          const fetch = options.fetch as typeof globalThis.fetch;
          const dispatch = (bodyModel: string) =>
            fetch('https://provider.example/v1/classify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ model: bodyModel }),
            });
          // A legitimate first request with a real guarded response,
          // then a denied second request the provider misreports.
          const first = await dispatch(model.id as string);
          await first.text();
          try {
            await dispatch('substituted');
          } catch {
            /* provider incorrectly swallows the denial */
          }
          return { value: 'fabricated', outcome: 'completed' };
        },
      },
    };
    const multiProviders = createProviderRegistry([module]);
    const storeMulti = await createJournalHarness({
      providers: multiProviders,
    });
    try {
      const model = {
        ...(OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel),
        api: module.id,
      } as AnyModel;
      const op: TrustedOperation = {
        ...trustedOperation(
          OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel,
          storeMulti.fence,
          'classify',
        ),
        api: module.id,
        destination: module.destination(model, undefined),
      };
      const send = jest.fn(async () => new Response('{}'));
      const guard = createModelOperationGuard({
        providers: multiProviders,
        journal: storeMulti.journal,
        recheck: async () => true,
        transport: send as unknown as typeof fetch,
      });
      const facade = createGuardedModelOperations({
        providers: multiProviders,
        guard,
        journal: storeMulti.journal as never,
        resolve: () => ({
          model,
          operation: op,
          authority: { kind: 'apiKey', apiKey: 'test-key' },
        }),
      });
      await expect(
        facade.classify(model as never, {} as never),
      ).rejects.toThrow('fabricated provider result');
      expect(send).toHaveBeenCalledTimes(1);
      const rows = await storeMulti
        .db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'attempt', 'status');
      expect(rows).toMatchObject([
        { kind: 'decision', decision: 'allow', attempt: 1 },
        { kind: 'decision', decision: 'deny', attempt: 2 },
        // The settled first attempt records an honest non-success outcome;
        // the fabricated completion is never recorded.
        { kind: 'outcome', status: 'stream-failed' },
      ]);
      expect(rows.filter(row => row.status === 'completed')).toEqual([]);
    } finally {
      await storeMulti.cleanup();
    }
  });

  it('accepts the real pinned catalog base URL through the durable route-template check', async () => {
    // Route templates must match the real catalog base, not only the
    // localhost substitutions used for transport control: a template or
    // catalog drift makes the durable journal reject the allow intent.
    const store = await createJournalHarness({ providers });
    try {
      const model = OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel;
      const op = trustedOperation(model, store.fence, 'classify');
      const send = jest.fn(async () => new Response('{}'));
      const guard = createModelOperationGuard({
        providers,
        journal: store.journal,
        recheck: async () => true,
        transport: send as unknown as typeof fetch,
      }).bind(op);
      await guard.fetch(op.destination, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: model.id }),
      });
      expect(send).toHaveBeenCalledTimes(1);
    } finally {
      await store.cleanup();
    }
  });
});
