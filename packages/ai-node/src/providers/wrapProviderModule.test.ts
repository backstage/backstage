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

import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { AnyModel } from '@earendil-works/pi-ai';
import { ANTHROPIC_MODELS } from '@earendil-works/pi-ai/providers/anthropic.models';
import { TYPESAFE_CLASSIFIER_MODELS } from '@earendil-works/pi-ai/providers/typesafe.models';
import {
  createJournalHarness,
  createModelOperationGuard,
  createProviderRegistry,
  fixtureProviderModules,
} from '@backstage/ai-node-test-utils/alpha';
import type {
  Fence,
  TrustedOperation,
} from '@backstage/ai-node-test-utils/alpha';
import { wrapProviderModule as wrap } from './wrapProviderModule';

const anthropicFixture = fixtureProviderModules.find(
  module => module.id === 'anthropic-messages',
)!;
const typesafeFixture = fixtureProviderModules.find(
  module => module.id === 'typesafe-system-one',
)!;

describe('wrapProviderModule construction', () => {
  it('composes the gateway path prefix onto every certified route template', () => {
    const wrapped = wrap(anthropicFixture, {
      baseUrl: 'https://gateway.example/v1/acc-1/gw-1/anthropic',
    });
    expect(wrapped.destinationTemplates).toEqual([
      [{ literal: '/v1/acc-1/gw-1/anthropic/v1/messages' }],
    ]);
    // The typesafe family's template carries the provider's own '/v1' base
    // path; the probe aligns the composite to the route actually appended.
    const typesafe = wrap(typesafeFixture, {
      baseUrl: 'https://gateway.example/typesafe/v1',
    });
    expect(typesafe.destinationTemplates).toEqual([
      [{ literal: '/typesafe/v1/systemone' }],
      [{ literal: '/typesafe/v1/api/v1/systemone' }],
    ]);
    expect(wrapped.id).toBe('anthropic-messages');
    expect(wrapped.credentialKinds).toEqual(['api_key']);
    // The wrapped module's adapter and envelope validation carry over.
    expect(wrapped.adapter).toBe(anthropicFixture.adapter);
    expect(wrapped.validateEnvelope).toBe(anthropicFixture.validateEnvelope);
  });

  it('prefixes multi-part templates, digests included', () => {
    const wrapped = wrap(
      {
        ...typesafeFixture,
        destinationTemplates: [
          [
            { literal: '/deployments/' },
            { digest: 'deployment' },
            { literal: '/responses' },
          ],
        ],
      },
      { baseUrl: 'https://gateway.example/prefix' },
    );
    // The probe destination is '<base>/systemone', which no template
    // matches, so composition falls back to the declared-prefix join.
    expect(wrapped.destinationTemplates).toEqual([
      [
        { literal: '/prefix/deployments/' },
        { digest: 'deployment' },
        { literal: '/responses' },
      ],
    ]);
  });

  it('refuses OAuth through a gateway with guidance', () => {
    expect(() =>
      wrap(anthropicFixture, {
        baseUrl: 'https://gateway.example',
        credentialKinds: ['api_key', 'oauth'],
      }),
    ).toThrow(/OAuth through a gateway is not supported/);
  });

  it('refuses a base URL that is not a bare http(s) origin with a literal path', () => {
    for (const baseUrl of [
      'ftp://gateway.example',
      'https://user:pass@gateway.example',
      'https://gateway.example/?tenant=1',
      'https://gateway.example/#frag',
      'not a url',
      'https://gateway.example/spaced path',
    ]) {
      expect(() => wrap(anthropicFixture, { baseUrl })).toThrow();
    }
  });
});

describe('wrapProviderModule dispatch through the durable journal', () => {
  type Probe = {
    origin: string;
    requests: Array<{ url?: string; body: unknown }>;
    respond(pathname: string, body: unknown): void;
    close(): Promise<void>;
  };

  async function probe(
    respondsWith: (pathname: string) => unknown,
  ): Promise<Probe> {
    const requests: Probe['requests'] = [];
    const server: Server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
        requests.push({ url: req.url, body });
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(respondsWith(req.url ?? '')));
      });
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address() as { port: number };
    return {
      origin: `http://127.0.0.1:${address.port}`,
      requests,
      respond: () => undefined,
      close: async () => {
        server.closeAllConnections();
        server.close();
      },
    };
  }

  const fence: Fence = {
    namespace: { pluginId: 'test', sessionId: 's' },
    owner: 'owner',
    token: '1',
  };

  function trustedOperation(
    model: AnyModel,
    providers: ReturnType<typeof createProviderRegistry>,
    operation: 'streamSimple' | 'classify',
  ): TrustedOperation {
    return {
      actor: 'user:default/alice',
      credentials: mockCredentials.user('user:default/alice'),
      provenance: {
        origin: 'verified' as const,
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

  async function rows(
    db: Awaited<ReturnType<typeof createJournalHarness>>['db'],
  ) {
    return db('ai_journal_events')
      .orderBy('id')
      .select('kind', 'decision', 'status', 'destination', 'provider');
  }

  it('dispatches anthropic-messages through a path-prefixed cloudflare-shaped gateway', async () => {
    // The W3-5 real-catalog pattern: the pinned anthropic model, its base
    // URL re-pinned onto a gateway that re-roots the API under its own path.
    const real = ANTHROPIC_MODELS['claude-fable-5'] as unknown as AnyModel;
    const probeServer = await probe(() => ({
      id: 'msg_1',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: 'ok' }],
      model: 'claude',
      stop_reason: 'end_turn',
      usage: { input_tokens: 1, output_tokens: 1 },
    }));
    const base = `${probeServer.origin}/v1/acc-1/gw-1/anthropic`;
    const model = {
      ...real,
      provider: 'cloudflare-ai-gateway',
      baseUrl: base,
    } as AnyModel;
    const providers = createProviderRegistry([
      wrap(anthropicFixture, { baseUrl: base }),
      ...fixtureProviderModules.filter(
        module => module.id !== 'anthropic-messages',
      ),
    ]);
    const store = await createJournalHarness({ providers });
    try {
      const op = trustedOperation(model, providers, 'streamSimple');
      Object.assign(op, { fence: store.fence });
      const guard = createModelOperationGuard({
        providers,
        journal: store.journal,
        recheck: async () => true,
        transport: fetch,
      });
      const guarded = guard.bind(op);
      const response = await guarded.fetch(op.destination, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: model.id,
          max_tokens: 16,
          messages: [{ role: 'user', content: 'hello' }],
        }),
      });
      expect(response.status).toBe(200);
      await response.text();
      await guarded.finish('completed');

      // The gateway re-roots the route: the probe sees the prefixed path.
      expect(probeServer.requests[0].url).toBe(
        '/v1/acc-1/gw-1/anthropic/v1/messages',
      );
      // The durable journal's route-template check certifies the composite
      // destination: an allow row carries the canonical prefixed path.
      const journalRows = await rows(store.db);
      expect(journalRows[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        provider: 'cloudflare-ai-gateway',
      });
      expect(JSON.stringify(journalRows)).toContain(
        '/v1/acc-1/gw-1/anthropic/v1/messages',
      );
      expect(journalRows.some(row => row.kind === 'outcome')).toBe(true);
    } finally {
      await store.cleanup();
      await probeServer.close();
    }
  }, 30000);

  it('dispatches typesafe-system-one through the vercel-shaped prefixed base', async () => {
    const real = TYPESAFE_CLASSIFIER_MODELS[
      'jev-latest'
    ] as unknown as AnyModel;
    const probeServer = await probe(() => ({
      answers: { q1: { type: 'bool', value: true } },
      stopReason: 'stop',
    }));
    const base = `${probeServer.origin}/typesafe/v1`;
    const model = {
      ...real,
      provider: 'vercel-ai-gateway',
      baseUrl: base,
    } as AnyModel;
    const providers = createProviderRegistry([
      wrap(typesafeFixture, { baseUrl: base }),
      ...fixtureProviderModules.filter(
        module => module.id !== 'typesafe-system-one',
      ),
    ]);
    const store = await createJournalHarness({ providers });
    try {
      const op = trustedOperation(model, providers, 'classify');
      Object.assign(op, { fence: store.fence });
      const guard = createModelOperationGuard({
        providers,
        journal: store.journal,
        recheck: async () => true,
        transport: fetch,
      });
      const response = await guard.bind(op).fetch(op.destination, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: model.id,
          state: { text: 'hello' },
          questions: {},
        }),
      });
      expect(response.status).toBe(200);
      await response.text();

      // The vercel catalog shape: the prefix re-roots '/v1/systemone'.
      expect(probeServer.requests[0].url).toBe('/typesafe/v1/systemone');
      const journalRows = await rows(store.db);
      expect(journalRows[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        provider: 'vercel-ai-gateway',
      });
      expect(JSON.stringify(journalRows)).toContain('/typesafe/v1/systemone');
    } finally {
      await store.cleanup();
      await probeServer.close();
    }
  }, 30000);
});
