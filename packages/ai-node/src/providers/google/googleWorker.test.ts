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
import { googleProvider } from '@earendil-works/pi-ai/providers/google';
import { googleVertexProvider } from '@earendil-works/pi-ai/providers/google-vertex';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import type { AssistantMessage } from '@earendil-works/pi-ai';
import { createModelOperationGuard } from '../../guard/createModelOperationGuard';
import type { TrustedOperation } from '../../guard/types';
import type { AttemptDecision, AttemptOutcome } from '../../journal/types';
import type { Fence } from '../../contracts';
import { createProviderRegistry } from '../registry';
import { googleGenerativeAi, googleVertex } from './module';
import {
  closeGoogleWorker,
  pingGoogleWorker,
  rehearseUnattributedGoogleFetch,
  runGoogleStream,
  terminateGoogleWorker,
} from './runtime';

jest.setTimeout(20000);

const providers = createProviderRegistry([googleGenerativeAi, googleVertex]);
const fence: Fence = {
  namespace: { pluginId: 'test', sessionId: 's' },
  owner: 'owner',
  token: '1',
};

type Recording = {
  decisions: string[];
  outcomes: AttemptOutcome[];
  journal: {
    recordDecisionAndIntent(
      fence: Fence,
      event: AttemptDecision,
    ): Promise<string>;
    recordOutcome(
      fence: Fence,
      id: string,
      outcome: AttemptOutcome,
    ): Promise<void>;
    recordRecovery(): Promise<void>;
    read(): Promise<{ items: [] }>;
  };
};

function recording(): Recording {
  const decisions: string[] = [];
  const outcomes: AttemptOutcome[] = [];
  return {
    decisions,
    outcomes,
    journal: {
      recordDecisionAndIntent: async (_fence, event) => {
        decisions.push(`${event.decision}:${event.attempt}`);
        return String(event.attempt);
      },
      recordOutcome: async (_fence, _id, outcome) => {
        outcomes.push(outcome);
      },
      recordRecovery: async () => {},
      read: async () => ({ items: [] }),
    },
  } as Recording;
}

function operation(
  model: { id: string; provider: string; api: string },
  destination: string,
  actor: string,
): TrustedOperation {
  return {
    actor,
    credentials: mockCredentials.user(actor),
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
    operation: 'streamSimple',
    api: model.api as TrustedOperation['api'],
    destination,
    credentialScope: { kind: 'user', id: actor },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function sseBody(text = 'hello'): string {
  return `data: ${JSON.stringify({
    candidates: [
      {
        content: { parts: [{ text }], role: 'model' },
        finishReason: 'STOP',
      },
    ],
    usageMetadata: {
      promptTokenCount: 1,
      candidatesTokenCount: 1,
      totalTokenCount: 2,
    },
  })}\n\n`;
}

async function startServer(
  handler: (
    req: import('node:http').IncomingMessage,
    res: import('node:http').ServerResponse,
    state: {
      requests: Array<{
        url: string;
        apiKey: string | undefined;
        body: string;
      }>;
    },
  ) => void,
): Promise<{
  server: Server;
  origin: string;
  state: {
    requests: Array<{ url: string; apiKey: string | undefined; body: string }>;
  };
}> {
  const server = createServer();
  const state = {
    requests: [] as Array<{
      url: string;
      apiKey: string | undefined;
      body: string;
    }>,
  };
  server.on('request', (req, res) => handler(req, res, state));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, origin: `http://127.0.0.1:${address.port}`, state };
}

async function readBody(
  req: import('node:http').IncomingMessage,
): Promise<string> {
  let body = '';
  for await (const chunk of req) body += chunk as string;
  return body;
}

function geminiModel(origin: string) {
  return { ...googleProvider().getModels()[0], baseUrl: `${origin}/v1beta` };
}

function vertexModel(origin: string) {
  return { ...googleVertexProvider().getModels()[0], baseUrl: `${origin}/v1` };
}

const context = () =>
  normalizeContext({
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: 'hi' }],
        timestamp: Date.now(),
      },
    ],
  });

afterAll(async () => {
  await closeGoogleWorker();
});

describe('Google guarded worker transport', () => {
  it('streams Gemini through the worker, shim and guard', async () => {
    const { server, origin, state } = await startServer(async (req, res) => {
      const body = await readBody(req);
      state.requests.push({
        url: req.url ?? '',
        apiKey: req.headers['x-goog-api-key'] as string | undefined,
        body,
      });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const rec = recording();
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const result = await runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        { apiKey: 'key-a', fetch: guard.fetch, maxRetries: 0 },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      expect((result as AssistantMessage).content[0]).toMatchObject({
        type: 'text',
        text: 'hello',
      });
      await guard.finish('completed');
      expect(rec.decisions).toEqual(['allow:1']);
      expect(rec.outcomes).toEqual([{ status: 'completed', httpStatus: 200 }]);
      expect(state.requests).toHaveLength(1);
      expect(state.requests[0].url).toBe(
        `/v1beta/models/${model.id}:streamGenerateContent?alt=sse`,
      );
      expect(state.requests[0].apiKey).toBe('key-a');
      expect(JSON.parse(state.requests[0].body).contents).toBeDefined();
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('streams Vertex through the worker with an API key and custom base', async () => {
    const { server, origin, state } = await startServer(async (req, res) => {
      await readBody(req);
      state.requests.push({
        url: req.url ?? '',
        apiKey: req.headers['x-goog-api-key'] as string | undefined,
        body: '',
      });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody('vertex'));
    });
    try {
      const rec = recording();
      const model = vertexModel(origin);
      const op = operation(
        model,
        googleVertex.destination(model as never, undefined),
        'user:default/alice',
      );
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const result = await runGoogleStream(
        'google-vertex',
        model as never,
        context(),
        { apiKey: 'vertex-key', fetch: guard.fetch, maxRetries: 0 },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      expect(state.requests[0].url).toBe(
        `/v1/publishers/google/models/${model.id}:streamGenerateContent?alt=sse`,
      );
      expect(state.requests[0].apiKey).toBe('vertex-key');
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('denies a payload model substitution and a disallowed query before sending', async () => {
    const { server, origin, state } = await startServer(async (req, res) => {
      await readBody(req);
      state.requests.push({ url: req.url ?? '', apiKey: undefined, body: '' });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const model = geminiModel(origin);
      const destination = googleGenerativeAi.destination(
        model as never,
        undefined,
      );
      const substituted = destination.replace(
        `/models/${model.id}:`,
        '/models/other-model:',
      );
      const op = operation(model, destination, 'user:default/alice');
      // Denials latch the operation, so each probe uses a fresh binding.
      const request = (url: string) =>
        createModelOperationGuard({
          providers,
          journal: recording().journal as never,
          recheck: async () => true,
          transport: globalThis.fetch,
        })
          .bind({ ...op, controller: new AbortController() })
          .fetch(
            new Request(url, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: '{"contents":[]}',
            }),
          );
      await expect(request(substituted)).rejects.toThrow(
        'Request model does not match authorized model',
      );
      await expect(request(`${destination}&unexpected=true`)).rejects.toThrow(
        'Unexpected SDK query parameter',
      );
      await expect(
        request(destination.replace('?alt=sse', '')),
      ).rejects.toThrow('Unexpected SDK query parameter');
      await expect(
        createModelOperationGuard({
          providers,
          journal: recording().journal as never,
          recheck: async () => true,
          transport: globalThis.fetch,
        })
          .bind({ ...op, controller: new AbortController() })
          .fetch(
            new Request(destination, {
              method: 'GET',
              headers: { 'content-type': 'application/json' },
            }),
          ),
      ).rejects.toThrow('Unexpected model destination or method');
      expect(state.requests).toEqual([]);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('gates SDK retries through the shim with fresh ordinals', async () => {
    const { server, origin, state } = await startServer(async (req, res) => {
      await readBody(req);
      state.requests.push({ url: req.url ?? '', apiKey: undefined, body: '' });
      if (state.requests.length === 1) {
        res.writeHead(429, {
          'content-type': 'application/json',
          'retry-after': '0',
          'retry-after-ms': '0',
        });
        res.end(JSON.stringify({ error: { code: 429, message: 'rate' } }));
        return;
      }
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const rec = recording();
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const result = await runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        { apiKey: 'key-a', fetch: guard.fetch, maxRetries: 1 },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      await guard.finish('completed');
      expect(state.requests).toHaveLength(2);
      expect(rec.decisions).toEqual(['allow:1', 'allow:2']);
      expect(rec.outcomes.at(-1)).toMatchObject({ status: 'completed' });
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('binds authority per stream under two concurrent streams', async () => {
    // Both requests are held until both have arrived, so the two fetch
    // round-trips genuinely overlap inside the shared worker.
    const pending: Array<{
      res: import('node:http').ServerResponse;
      key: string | undefined;
      url: string;
    }> = [];
    const released = new Promise<void>(resolve => {
      const check = () => {
        if (pending.length >= 2) resolve();
        else setTimeout(check, 20);
      };
      check();
    });
    const { server, origin } = await startServer(async (req, res) => {
      await readBody(req);
      pending.push({
        res,
        key: req.headers['x-goog-api-key'] as string | undefined,
        url: req.url ?? '',
      });
      await released;
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const modelA = geminiModel(origin);
      const modelB = {
        ...geminiModel(origin),
        id: `${modelA.id.slice(0, 20)}-b`,
      } as typeof modelA & { id: string };
      const recA = recording();
      const recB = recording();
      const opA = operation(
        modelA,
        googleGenerativeAi.destination(modelA as never, undefined),
        'user:default/alice',
      );
      const opB = operation(
        modelB,
        googleGenerativeAi.destination(modelB as never, undefined),
        'user:default/bob',
      );
      const guardFor = (op: TrustedOperation, rec: Recording) =>
        createModelOperationGuard({
          providers,
          journal: rec.journal as never,
          recheck: async () => true,
          transport: globalThis.fetch,
        }).bind(op);
      const guardA = guardFor(opA, recA);
      const guardB = guardFor(opB, recB);
      const [resultA, resultB] = await Promise.all([
        runGoogleStream(
          'google-generative-ai',
          modelA as never,
          context(),
          { apiKey: 'key-a', fetch: guardA.fetch, maxRetries: 0 },
          true,
        ).result(),
        runGoogleStream(
          'google-generative-ai',
          modelB as never,
          context(),
          { apiKey: 'key-b', fetch: guardB.fetch, maxRetries: 0 },
          true,
        ).result(),
      ]);
      // Both streams completed: a crossed binding would have sent one
      // stream's request to the other's guard and been denied by
      // destination mismatch.
      expect(resultA.stopReason).toBe('stop');
      expect(resultB.stopReason).toBe('stop');
      expect(recA.decisions).toEqual(['allow:1']);
      expect(recB.decisions).toEqual(['allow:1']);
      const seen = pending.map(entry => ({ key: entry.key, url: entry.url }));
      expect(seen).toHaveLength(2);
      const keys = seen.map(entry => entry.key).sort();
      expect(keys).toEqual(['key-a', 'key-b']);
      for (const entry of seen) {
        // Each request's key pairs with its own stream's model route.
        expect(entry.url).toContain(
          entry.key === 'key-a'
            ? `/models/${modelA.id}:streamGenerateContent`
            : `/models/${modelB.id}:streamGenerateContent`,
        );
      }
    } finally {
      server.close();
      server.closeAllConnections();
      await once(server, 'close');
    }
  });

  it('intercepts every SDK attempt through the lifetime shim and denies unattributed fetches', async () => {
    let rpcFetches = 0;
    const { server, origin, state } = await startServer(async (req, res) => {
      await readBody(req);
      state.requests.push({ url: req.url ?? '', apiKey: undefined, body: '' });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const rec = recording();
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const countedFetch = async (input: RequestInfo, init?: RequestInit) => {
        rpcFetches += 1;
        return guard.fetch(input, init);
      };
      const result = await runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        { apiKey: 'key-a', fetch: countedFetch, maxRetries: 0 },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      await guard.finish('completed');
      // Every request the server saw arrived through a shim interception
      // handled on the host, and the shim is still the worker's global fetch.
      expect(state.requests).toHaveLength(1);
      expect(rpcFetches).toBe(1);
      const ping = await pingGoogleWorker();
      expect(ping.shimInstalled).toBe(true);
      expect(ping.shimCalls).toBeGreaterThanOrEqual(1);
      const rehearsal = await rehearseUnattributedGoogleFetch(
        `${origin}/unattributed`,
      );
      expect(rehearsal.denied).toBe(true);
      expect(rehearsal.message).toContain('Unattributed');
      expect(state.requests).toHaveLength(1);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('relays payload callbacks across the worker boundary', async () => {
    const { server, origin, state } = await startServer(async (req, res) => {
      const body = await readBody(req);
      state.requests.push({ url: req.url ?? '', apiKey: undefined, body });
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody());
    });
    try {
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const rec = recording();
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const providerEvents: unknown[] = [];
      const result = await runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        {
          apiKey: 'key-a',
          fetch: guard.fetch,
          maxRetries: 0,
          onPayload: (params: { config?: Record<string, unknown> }) => ({
            ...params,
            config: { ...params.config, temperature: 0.25 },
          }),
          onProviderStreamEvent: (event: unknown) => {
            providerEvents.push(event);
          },
        },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      await guard.finish('completed');
      expect(state.requests).toHaveLength(1);
      // The transformed payload reached the wire through the RPC relay.
      expect(
        (
          JSON.parse(state.requests[0].body) as {
            generationConfig?: { temperature?: number };
          }
        ).generationConfig?.temperature,
      ).toBe(0.25);
      expect(providerEvents.length).toBeGreaterThanOrEqual(1);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('records an unknown outcome when the worker is lost mid-stream', async () => {
    const { server, origin } = await startServer(async (req, res) => {
      void res;
      await readBody(req);
      // The response never arrives.
      await new Promise(() => {});
    });
    try {
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const rec = recording();
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const stream = runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        { apiKey: 'key-a', fetch: guard.fetch, maxRetries: 0 },
        true,
      );
      const settled = stream.result();
      for (let i = 0; i < 100 && rec.decisions.length === 0; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      expect(rec.decisions).toEqual(['allow:1']);
      await terminateGoogleWorker();
      const result = await settled;
      expect(result.stopReason).toBe('error');
      // Releasing the held transport settles the attempt as unknown; no
      // success is ever claimed for a stream whose worker was lost.
      server.closeAllConnections();
      await guard.finish('failed');
      expect(rec.outcomes).toEqual([{ status: 'unknown' }]);
    } finally {
      server.close();
      server.closeAllConnections();
      await once(server, 'close');
    }
  });

  it('aborts in-flight streams on clean shutdown without claiming outcomes', async () => {
    const { server, origin } = await startServer(async (req, res) => {
      void res;
      await readBody(req);
      await new Promise(() => {});
    });
    try {
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const rec = recording();
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const stream = runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        { apiKey: 'key-a', fetch: guard.fetch, maxRetries: 0 },
        true,
      );
      const settled = stream.result();
      for (let i = 0; i < 100 && rec.decisions.length === 0; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      expect(rec.decisions).toEqual(['allow:1']);
      await closeGoogleWorker();
      const result = await settled;
      expect(result.stopReason).toBe('aborted');
      // Aborted streams settle without claiming their remote outcomes.
      await guard.finish('failed');
      expect(['cancelled', 'unknown']).toContain(rec.outcomes[0]?.status);
    } finally {
      server.close();
      server.closeAllConnections();
      await once(server, 'close');
    }
  });

  it('starts a fresh worker after shutdown and honours caller aborts', async () => {
    const { server, origin } = await startServer(async (req, res) => {
      await readBody(req);
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end(sseBody('fresh'));
    });
    try {
      const model = geminiModel(origin);
      const op = operation(
        model,
        googleGenerativeAi.destination(model as never, undefined),
        'user:default/alice',
      );
      const rec = recording();
      const guard = createModelOperationGuard({
        providers,
        journal: rec.journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const result = await runGoogleStream(
        'google-generative-ai',
        model as never,
        context(),
        {
          apiKey: 'key-a',
          fetch: guard.fetch,
          maxRetries: 0,
          signal: op.controller.signal,
        },
        true,
      ).result();
      expect(result.stopReason).toBe('stop');
      await guard.finish('completed');

      // A caller abort of a held stream is recorded as cancelled.
      const holding = await startServer(async (req, res) => {
        void res;
        await readBody(req);
        await new Promise(() => {});
      });
      try {
        const rec2 = recording();
        const heldModel = geminiModel(holding.origin);
        const op2 = {
          ...operation(
            heldModel,
            googleGenerativeAi.destination(heldModel as never, undefined),
            'user:default/alice',
          ),
        };
        const guard2 = createModelOperationGuard({
          providers,
          journal: rec2.journal as never,
          recheck: async () => true,
          transport: globalThis.fetch,
        }).bind(op2);
        const aborted = runGoogleStream(
          'google-generative-ai',
          heldModel as never,
          context(),
          {
            apiKey: 'key-a',
            fetch: guard2.fetch,
            maxRetries: 0,
            signal: op2.controller.signal,
          },
          true,
        );
        const settled2 = aborted.result();
        for (let i = 0; i < 100 && rec2.decisions.length === 0; i++) {
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        op2.controller.abort();
        const result2 = await settled2;
        expect(result2.stopReason).toBe('aborted');
        await guard2.finish('failed');
        expect(['cancelled', 'unknown']).toContain(rec2.outcomes[0]?.status);
      } finally {
        holding.server.close();
        holding.server.closeAllConnections();
        await once(holding.server, 'close');
      }
    } finally {
      server.close();
      await once(server, 'close');
    }
  });
});
