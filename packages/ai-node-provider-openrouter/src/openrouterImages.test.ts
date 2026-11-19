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

/**
 * Behavior tests for the OpenRouter image module, restored from the
 * core's pre-extraction non-chat suites: the generation flow through the
 * real guarded facade, the error-accounting and denial discipline, the
 * malformed-request matrix, the persisted durable records for a transport
 * that ran and threw, and the real pinned catalog base accepted through
 * the durable journal's route-template check. The journal-backed tests
 * run both dialects; PostgreSQL when AI_TEST_POSTGRES_URL is set.
 */
import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { mockCredentials } from '@backstage/backend-test-utils';
import { OPENROUTER_IMAGE_MODELS } from '@earendil-works/pi-ai/providers/openrouter.models';
import type { AnyModel } from '@earendil-works/pi-ai';
import {
  createGuardedModelOperations,
  createJournalHarness,
  createModelOperationGuard,
  createProviderRegistry,
} from '@backstage/ai-node-test-utils/alpha';
import type {
  AttemptDecision,
  AttemptOutcome,
  Fence,
  TrustedOperation,
} from '@backstage/ai-node-test-utils/alpha';
import { openrouterImages } from './openrouterImages';

const providers = createProviderRegistry([openrouterImages]);

const imagesContext = {
  input: [
    { type: 'text' as const, text: 'a red circle on white canvas' },
    {
      type: 'image' as const,
      mimeType: 'image/png',
      data: 'QUJD', // "ABC" in base64; also the never-journaled marker
    },
  ],
};

type Body = Record<string, unknown>;

async function startServer(
  handle: (pathname: string, body: Body) => Body,
): Promise<{
  server: Server;
  origin: string;
  requests: Array<{ pathname: string; body: Body }>;
}> {
  const requests: Array<{ pathname: string; body: Body }> = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as Body;
      requests.push({ pathname: req.url ?? '', body });
      const response = handle(req.url ?? '', body);
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

function harness(model: AnyModel) {
  const events: string[] = [];
  const journalCalls: unknown[] = [];
  const journal = {
    recordDecisionAndIntent: jest.fn(
      async (_fence: Fence, event: AttemptDecision) => {
        journalCalls.push(event);
        events.push(`${event.decision}:${event.attempt}`);
        return String(event.attempt);
      },
    ),
    recordOutcome: jest.fn(
      async (_fence: Fence, _id: string, outcome: AttemptOutcome) => {
        journalCalls.push(outcome);
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
    operation: 'generateImages',
    api: model.api,
    destination: providers.get(model.api)!.destination!(model, undefined),
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
  const probe = async (body: unknown, url: URL | string = op.destination!) => {
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
  return { events, journal, journalCalls, transport, facade, probe, op };
}

const withBase = (model: AnyModel, origin: string) =>
  ({ ...model, baseUrl: `${origin}/v1` } as AnyModel);

function trustedOperation(model: AnyModel, fence: Fence): TrustedOperation {
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
    operation: 'generateImages',
    api: model.api,
    destination: providers.get(model.api)!.destination!(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

const imageModel = () =>
  OPENROUTER_IMAGE_MODELS[
    'black-forest-labs/flux-3-image'
  ] as never as AnyModel;

describe('openrouter images', () => {
  it('generates images over OpenRouter chat completions', async () => {
    const { server, origin, requests } = await startServer(() => ({
      id: 'resp-1',
      choices: [
        {
          message: {
            content: 'a red circle',
            images: [
              {
                type: 'image_url',
                image_url: { url: 'data:image/png;base64,QUJD' },
              },
            ],
          },
        },
      ],
      usage: { prompt_tokens: 2, completion_tokens: 3 },
    }));
    try {
      const model = withBase(imageModel(), origin);
      const f = harness(model);
      const result = (await f.facade.generateImages(
        model as never,
        imagesContext as never,
      )) as unknown as {
        output: Array<{ type: string; data?: string; text?: string }>;
        stopReason: string;
      };
      expect(result.stopReason).toBe('stop');
      expect(result.output).toEqual([
        { type: 'text', text: 'a red circle' },
        { type: 'image', mimeType: 'image/png', data: 'QUJD' },
      ]);
      expect(f.events).toEqual([
        'check',
        'allow:1',
        'send',
        'outcome:completed',
      ]);
      expect(requests[0].pathname).toBe('/v1/chat/completions');
      expect(requests[0].body.model).toBe('black-forest-labs/flux-3-image');
      expect(requests[0].body.stream).toBe(false);
      const content = (
        requests[0].body.messages as Array<{
          content: Array<Record<string, unknown>>;
        }>
      )[0].content;
      expect(content).toEqual([
        { type: 'text', text: 'a red circle on white canvas' },
        {
          type: 'image_url',
          image_url: { url: 'data:image/png;base64,QUJD' },
        },
      ]);
      // Image blobs never reach the journal: decisions and outcomes only.
      expect(JSON.stringify(f.journalCalls)).not.toContain('QUJD');
      expect(JSON.stringify(f.journalCalls)).not.toContain('base64');
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('accounts a transport that ran and threw as used, with no follow-on denial', async () => {
    const model = {
      ...imageModel(),
      baseUrl: 'http://127.0.0.1:1/v1',
    } as never as AnyModel;
    const f = harness(model);
    f.transport.mockImplementation(async () => {
      throw new Error('network disconnected');
    });
    const result = (await f.facade.generateImages(
      model as never,
      { input: [{ type: 'text', text: 'a red circle' }] } as never,
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

  it('records exactly one denial for a guard-rejected image request', async () => {
    const model = {
      ...imageModel(),
      baseUrl: 'http://127.0.0.1:1/v1',
    } as never as AnyModel;
    const f = harness(model);
    const result = (await f.facade.generateImages(
      model as never,
      { input: [{ type: 'image', mimeType: 'image/png', data: 'A' }] } as never,
      { maxRetries: 0 } as never,
    )) as { stopReason: string };
    // The malformed image reference is denied once by the guard; the
    // dispatch settles in-band (the denial aborts the operation's
    // controller, so the adapter reports it as aborted) without a
    // duplicate denial.
    expect(['error', 'aborted']).toContain(result.stopReason);
    expect(f.events).toEqual(['deny:1']);
    expect(f.transport).not.toHaveBeenCalled();
  });

  it('denies malformed image requests before sending', async () => {
    const { server, origin } = await startServer(() => ({}));
    try {
      const model = withBase(imageModel(), origin);
      const f = harness(model);
      const validBody = {
        model: model.id,
        messages: [
          { role: 'user', content: [{ type: 'text', text: 'a red circle' }] },
        ],
        stream: false,
      };
      await f.probe({ ...validBody, model: 'other' });
      await f.probe({ ...validBody, messages: [] });
      await f.probe({
        ...validBody,
        messages: [
          {
            role: 'user',
            content: [{ type: 'video', url: 'https://elsewhere.example' }],
          },
        ],
      });
      await f.probe({
        ...validBody,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: 'https://elsewhere.example/a.png' },
              },
            ],
          },
        ],
      });
      await f.probe({
        ...validBody,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: 'data:image/png;base64,not base64!' },
              },
            ],
          },
        ],
      });
      // Malformed base64 is denied before send: wrong length and padding.
      for (const malformed of ['A', 'A=', 'AA=', '']) {
        await f.probe({
          ...validBody,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: `data:image/png;base64,${malformed}` },
                },
              ],
            },
          ],
        });
      }
      await f.probe({ ...validBody, stream: true });
      await f.probe({ ...validBody, modalities: ['video'] });
      await f.probe({
        ...validBody,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${'A'.repeat(16 * 1024 * 1024)}`,
                },
              },
            ],
          },
        ],
      });
      const wrong = new URL(f.op.destination!);
      wrong.pathname = '/v1/elsewhere';
      await f.probe(validBody, wrong);
      expect(f.events).toEqual(Array(13).fill('deny:1'));
      expect(f.transport).not.toHaveBeenCalled();
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('persists corrected records for a transport that ran and threw', async () => {
    // The durable journal must hold exactly the allow decision and its
    // uncertain outcome — no contradictory follow-on denial.
    const store = await createJournalHarness({ providers });
    try {
      const model = {
        ...imageModel(),
        baseUrl: 'http://127.0.0.1:1/v1',
      } as AnyModel;
      const op = trustedOperation(model, store.fence);
      const send = jest.fn(async () => {
        throw new Error('network disconnected');
      });
      const guard = createModelOperationGuard({
        providers,
        journal: store.journal,
        recheck: async () => true,
        transport: send as unknown as typeof fetch,
      });
      const facade = createGuardedModelOperations({
        providers,
        guard,
        journal: store.journal as never,
        resolve: () => ({
          model,
          operation: op,
          authority: { kind: 'apiKey', apiKey: 'test-key' },
        }),
      });
      const result = (await facade.generateImages(
        model as never,
        { input: [{ type: 'text', text: 'a red circle' }] } as never,
        { maxRetries: 0 } as never,
      )) as { stopReason: string; errorMessage?: string };
      expect(result.stopReason).toBe('error');
      expect(result.errorMessage).toContain('network disconnected');
      expect(send).toHaveBeenCalledTimes(1);
      const rows = await store
        .db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'attempt', 'status', 'reason');
      expect(rows).toMatchObject([
        { kind: 'decision', decision: 'allow', attempt: 1 },
        { kind: 'outcome', status: 'unknown' },
      ]);
      expect(rows).toHaveLength(2);
    } finally {
      await store.cleanup();
    }
  });

  it('accepts the real pinned catalog base URL through the durable route-template check', async () => {
    // Route templates must match the real catalog base, not only the
    // localhost substitutions used for transport control: a template or
    // catalog drift makes the durable journal reject the allow intent.
    const store = await createJournalHarness({ providers });
    try {
      const model = imageModel();
      const op = trustedOperation(model, store.fence);
      const send = jest.fn(async () => new Response('{}'));
      const guard = createModelOperationGuard({
        providers,
        journal: store.journal,
        recheck: async () => true,
        transport: send as unknown as typeof fetch,
      }).bind(op);
      await guard.fetch(op.destination!, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: model.id,
          messages: [
            { role: 'user', content: [{ type: 'text', text: 'a red circle' }] },
          ],
          stream: false,
        }),
      });
      expect(send).toHaveBeenCalledTimes(1);
    } finally {
      await store.cleanup();
    }
  });
});
