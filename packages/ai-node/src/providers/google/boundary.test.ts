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
import { createServer } from 'node:http';
import { mkdtemp, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mockCredentials } from '@backstage/backend-test-utils';
import { googleProvider } from '@earendil-works/pi-ai/providers/google';
import { googleVertexProvider } from '@earendil-works/pi-ai/providers/google-vertex';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import type { Model } from '@earendil-works/pi-ai';
import { createModelOperationGuard } from '../../guard/createModelOperationGuard';
import { createGuardedModelOperations } from '../../guard/modelOperations';
import type { TrustedOperation } from '../../guard/types';
import { createProviderRegistry } from '../registry';
import { googleGenerativeAi, googleVertex } from './module';
import {
  closeGoogleWorker,
  runGoogleStream,
  terminateGoogleWorker,
} from './runtime';

/**
 * The worker-boundary failure matrix. The invariant across every cell: the
 * boundary fails exactly like the guard does — closed, journaled, bounded.
 * Outcomes are always denied / cancelled / unknown, never pending; no
 * request is sent after a failure or after shutdown; no success is ever
 * claimed for an uncertain remote outcome.
 *
 * Interaction points (rows) × failure modes (columns), with the test that
 * covers each meaningful cell:
 *
 * | Point \ Mode             | worker death          | callback throw / non-serializable | transport / caller abort     | shutdown concurrent        |
 * |--------------------------|-----------------------|-----------------------------------|------------------------------|---------------------------|
 * | fetch RPC, pre-header    | 'settles in-flight guard on worker death' | —                | 'settles a pre-header caller abort without sending' | 'does not dispatch a stream once immediate shutdown completes' |
 * | fetch RPC, post-header   | 'settles a streaming job on worker death' | —                | 'propagates a post-header caller abort to the host stream' | 'does not dispatch…' (drain window aborts) |
 * | onPayload RPC            | (worker death fails the pending job like any other) | 'does not send if the payload callback rejects' / 'rejects a non-transferable payload callback without hanging' | — | — |
 * | onProviderStreamEvent    | —                     | 'tolerates a throwing stream-event callback' | — | — |
 * | worker startup           | —                     | —                                 | —                            | 'does not dispatch a stream once immediate shutdown completes' |
 * | graceful close           | —                     | —                                 | 'aborts in-flight streams on clean shutdown' (googleWorker.test) | — |
 * | emergency terminate      | 'records an unknown outcome when the worker is lost mid-stream' (googleWorker.test) | — | — | — |
 *
 * Configuration-boundary cells: 'denies the SDK ADC sentinel…',
 * 'blocks ADC credential traffic…', 'matches the SDK URL for an unversioned
 * custom Gemini base', 'preserves subarray response chunk bytes exactly',
 * and 'strips transport overrides returned from the payload callback'.
 */
jest.setTimeout(15000);

const providers = createProviderRegistry([googleGenerativeAi, googleVertex]);

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

const sseBody = (text = 'hello') =>
  `data: ${JSON.stringify({
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

function setup(baseUrl: string, transport: typeof fetch) {
  const model = {
    ...googleProvider().getModels()[0],
    baseUrl,
  } as Model<'google-generative-ai'> & { baseUrl: string };
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
    operation: 'completeSimple',
    api: model.api as TrustedOperation['api'],
    destination: googleGenerativeAi.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
  const events: string[] = [];
  const journal = {
    recordDecisionAndIntent: async (
      _fence: unknown,
      event: { decision: string; attempt: number },
    ) => {
      events.push(`${event.decision}:${event.attempt}`);
      return '1';
    },
    recordOutcome: async (
      _fence: unknown,
      _id: string,
      outcome: { status: string },
    ) => {
      events.push(`outcome:${outcome.status}`);
    },
    recordRecovery: async () => {},
    read: async () => ({ items: [] }),
  };
  const guard = createModelOperationGuard({
    providers,
    journal: journal as never,
    transport,
    recheck: async () => true,
  });
  const facade = createGuardedModelOperations({
    providers,
    guard,
    journal: journal as never,
    resolve: () => ({
      model,
      operation: op,
      authority: { kind: 'apiKey', apiKey: 'key' },
    }),
  });
  return { model, op, events, guard, facade };
}

afterEach(async () => {
  await closeGoogleWorker();
});

it('settles in-flight guard work on worker death before headers', async () => {
  let entered!: () => void;
  let release!: (error: Error) => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  let aborted = false;
  const transport = (async (request: Request) =>
    new Promise<Response>((_resolve, reject) => {
      release = reject;
      entered();
      request.signal.addEventListener(
        'abort',
        () => {
          aborted = true;
          reject(new Error('transport aborted'));
        },
        { once: true },
      );
    })) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  await started;
  const t0 = Date.now();
  await terminateGoogleWorker();
  process.stderr.write(`BDBG2 terminate took ${Date.now() - t0}ms\n`);
  const t1 = Date.now();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  process.stderr.write(
    `BDBG2 settle took ${Date.now() - t1}ms outcome=${outcome}\n`,
  );
  release(new Error('probe cleanup'));
  await result;
  expect(outcome).toBe('settled');
  expect(aborted).toBe(true);
  expect(f.events).toContain('allow:1');
  // The attempt settles as an infrastructure cancel: bounded and journaled,
  // claiming no remote outcome.
  expect(['outcome:cancelled', 'outcome:unknown']).toContain(f.events.at(-1));
});

it('settles a streaming job on worker death after headers', async () => {
  let started!: () => void;
  const available = new Promise<void>(resolve => {
    started = resolve;
  });
  const transport = jest.fn(async () => {
    started();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(sseBody()));
          // The body never completes.
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    );
  });
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  await available;
  await new Promise(resolve => setTimeout(resolve, 100));
  await terminateGoogleWorker();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await result;
  expect(outcome).toBe('settled');
  expect(f.events).toContain('allow:1');
  expect(f.events).not.toContain('outcome:completed');
});

it('settles a pre-header caller abort without sending', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const caller = new AbortController();
  caller.abort();
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    signal: caller.signal,
  });
  expect(['error', 'aborted']).toContain(result.stopReason);
  expect(transport).not.toHaveBeenCalled();
});

it('propagates a post-header caller abort to the host stream', async () => {
  let started!: () => void;
  let cancelled = false;
  const available = new Promise<void>(resolve => {
    started = resolve;
  });
  const transport = (async () =>
    new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(sseBody()));
          started();
        },
        cancel() {
          cancelled = true;
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    )) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const caller = new AbortController();
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    signal: caller.signal,
  });
  await available;
  await new Promise(resolve => setTimeout(resolve, 150));
  caller.abort();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await result;
  expect(outcome).toBe('settled');
  expect(cancelled).toBe(true);
  expect(f.events).toContain('outcome:cancelled');
});

it('refuses new work while overlapping shutdowns are in flight', async () => {
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const first = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(first.stopReason).toBe('stop');
  // A graceful close begins; while it is still draining, an emergency
  // terminate runs. Shutdown state is shared: the terminate cannot clear
  // the graceful close's refusal, so a new stream started in the overlap
  // window never dispatches.
  const graceful = closeGoogleWorker();
  await terminateGoogleWorker();
  let closeDone = false;
  void graceful.then(() => {
    closeDone = true;
  });
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  const closeDoneAtResult = closeDone;
  await graceful;
  expect(closeDoneAtResult).toBe(false);
  expect(sends).toBe(1);
  expect(result.errorMessage).toContain('shutting down');
});

it('does not dispatch a stream once immediate shutdown completes', async () => {
  const transport = jest.fn(
    async () =>
      new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      }),
  );
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const guarded = f.guard.bind(f.op);
  const pending = runGoogleStream(
    'google-generative-ai',
    f.model,
    context(),
    { apiKey: 'key', fetch: guarded.fetch, maxRetries: 0 },
    true,
  ).result();
  await closeGoogleWorker();
  const result = await pending;
  expect(result.stopReason).toBe('error');
  expect(transport).not.toHaveBeenCalled();
  expect(f.events).not.toContain('allow:1');
});

it('does not send if the payload callback rejects', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: () => {
      throw new Error('callback forbids send');
    },
  });
  expect(result.stopReason).toBe('error');
  expect(result.errorMessage).toContain('callback forbids send');
  expect(transport).not.toHaveBeenCalled();
});

it('rejects a non-transferable payload callback without hanging', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const pending = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: (value: unknown) => ({
      ...(value as object),
      callbackInjectedFunction: () => {},
    }),
  });
  const outcome = await Promise.race([
    pending.then(result => result.stopReason),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await pending;
  expect(outcome).not.toBe('timeout');
  expect(outcome).toBe('error');
  expect(transport).not.toHaveBeenCalled();
});

it('strips transport overrides returned from the payload callback', async () => {
  let request!: Request;
  let visible: Record<string, unknown> | undefined;
  const transport = (async (req: Request) => {
    request = req;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: (value: unknown) => {
      const params = value as Record<string, unknown>;
      visible = params;
      return {
        ...params,
        config: {
          ...(params.config as object),
          httpOptions: { headers: { 'x-unsafe': 'unsafe' } },
          abortSignal: { aborted: false },
        },
      };
    },
  });
  expect(result.stopReason).toBe('stop');
  expect(
    (visible?.config as Record<string, unknown>).httpOptions,
  ).toBeUndefined();
  expect(
    (visible?.config as Record<string, unknown>).abortSignal,
  ).toBeUndefined();
  expect(request.headers.has('x-unsafe')).toBe(false);
});

it('tolerates a throwing stream-event callback', async () => {
  const transport = jest.fn(
    async () =>
      new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      }),
  );
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onProviderStreamEvent: () => {
      throw new Error('observer failed');
    },
  });
  expect(result.stopReason).toBe('stop');
  expect(transport).toHaveBeenCalledTimes(1);
});

it('preserves subarray response chunk bytes exactly', async () => {
  const sse = sseBody();
  const bytes = new TextEncoder().encode(sse);
  const backing = new Uint8Array(bytes.length + 16);
  backing.fill(88);
  backing.set(bytes, 8);
  const transport = (async () =>
    new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(backing.subarray(8, 8 + bytes.length));
          controller.close();
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    )) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(result.stopReason).toBe('stop');
  expect(result.content).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: 'text', text: 'hello' }),
    ]),
  );
});

it('matches the SDK URL for an unversioned custom Gemini base', async () => {
  const server = createServer((_req, res) => res.end('{}'));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    let observed = '';
    const transport = (async (req: Request) => fetch(req)) as typeof fetch;
    const f = setup(`http://127.0.0.1:${address.port}`, transport);
    const guarded = f.guard.bind(f.op);
    await runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      {
        apiKey: 'key',
        maxRetries: 0,
        fetch: (req: Request) => {
          observed = req.url;
          return guarded.fetch(req);
        },
      },
      true,
    ).result();
    expect(observed).toBe(f.op.destination);
    expect(f.events).toContain('allow:1');
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

it('denies the SDK ADC sentinel before accessing credentials', async () => {
  const model = {
    ...googleVertexProvider().getModels()[0],
    baseUrl: 'https://provider.example/v1',
  } as never;
  const guardedFetch = jest.fn(async () => new Response('unexpected'));
  const result = await runGoogleStream(
    'google-vertex',
    model,
    context(),
    {
      apiKey: 'gcp-vertex-credentials',
      fetch: guardedFetch as unknown as typeof fetch,
      maxRetries: 0,
      env: {
        GOOGLE_CLOUD_PROJECT: 'test-project',
        GOOGLE_CLOUD_LOCATION: 'us-central1',
        GOOGLE_APPLICATION_CREDENTIALS: '/no-such-credentials.json',
      },
    },
    true,
  ).result();
  expect(result.stopReason).toBe('error');
  expect(result.errorMessage).toContain('ADC is not a certified transport');
  expect(guardedFetch).not.toHaveBeenCalled();
});

it('blocks ADC credential traffic outside the guarded transport', async () => {
  const hits: string[] = [];
  const server = createServer((req, res) => {
    hits.push(req.url ?? '');
    req.resume();
    if (req.url === '/subject') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('probe-subject');
    } else {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          access_token: 'fake',
          token_type: 'Bearer',
          expires_in: 3600,
        }),
      );
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const dir = await mkdtemp(join(tmpdir(), 'google-adc-'));
  const path = join(dir, 'adc-probe.json');
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    const origin = `http://127.0.0.1:${address.port}`;
    await writeFile(
      path,
      JSON.stringify({
        type: 'external_account',
        audience:
          '//iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/pool/providers/provider',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: `${origin}/token`,
        credential_source: {
          url: `${origin}/subject`,
          format: { type: 'text' },
        },
      }),
    );
    const model = {
      ...googleVertexProvider().getModels()[0],
      baseUrl: `${origin}/v1`,
    } as Model<'google-vertex'> & { baseUrl: string };
    const guardedFetch = jest.fn(async () => new Response('unexpected'));
    const env = {
      GOOGLE_CLOUD_PROJECT: 'test-project',
      GOOGLE_CLOUD_LOCATION: 'us-central1',
      GOOGLE_APPLICATION_CREDENTIALS: path,
    };
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
      operation: 'completeSimple',
      api: 'google-vertex',
      destination: googleVertex.destination(model, env),
      credentialScope: { kind: 'user', id: 'user:default/alice' },
      credentialGeneration: '1',
      controller: new AbortController(),
    };
    const events: string[] = [];
    const journal = {
      recordDecisionAndIntent: async (
        _fence: unknown,
        event: { decision: string; operation: string },
      ) => {
        events.push(`${event.decision}:${event.operation}`);
        return '1';
      },
      recordOutcome: async (
        _fence: unknown,
        _id: string,
        outcome: { status: string },
      ) => {
        events.push(`outcome:${outcome.status}`);
      },
      recordRecovery: async () => {},
      read: async () => ({ items: [] }),
    };
    const guard = createModelOperationGuard({
      providers,
      journal: journal as never,
      transport: guardedFetch as unknown as typeof fetch,
      recheck: async () => true,
    });
    const facade = createGuardedModelOperations({
      providers,
      guard,
      journal: journal as never,
      resolve: () => ({
        model,
        operation: op,
        authority: {
          kind: 'apiKey',
          apiKey: 'gcp-vertex-credentials',
          env,
        },
      }),
    });
    const result = await facade.completeSimple(model, context(), {
      maxRetries: 0,
    });
    expect(result.stopReason).toBe('error');
    expect(result.errorMessage).toContain('ADC is not a certified transport');
    // No credential exchange traffic of any kind left the process.
    expect(hits).toEqual([]);
    expect(guardedFetch).not.toHaveBeenCalled();
  } finally {
    await unlink(path).catch(() => undefined);
    await rm(dir, { recursive: true, force: true });
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
