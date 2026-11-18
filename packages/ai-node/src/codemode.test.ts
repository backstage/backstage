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
 * W3-4 gating checks for the opt-in code mode wiring:
 *
 * 1. Isolation: sandboxed scripts cannot reach network or filesystem (nor
 *    timers, `process`, or modules).
 * 2. Resource limits: the wired `timeoutMs` ends a script that never
 *    settles, and `memoryLimitBytes` ends runaway allocation.
 * 3. Audit posture: codemode's durable journal is conversation storage, not
 *    the AI audit journal — model calls from scripts leave AI audit rows,
 *    script bookkeeping does not.
 * 4. Nested-call routing: `models.classify()` from inside a script routes
 *    through the guarded facade and denies fail-closed when the model is
 *    not one a certified module dispatches (classification is certified
 *    through the TypeSafe and OpenAI Decisions modules; this catalog entry
 *    uses the chat openai-responses transport, which certifies no classify
 *    operation), with a journaled AI audit denial and no network dispatch.
 *
 * The default-off behavior (no `codemode` option) is pinned here too: the
 * codemode tool is not offered to the model, and the rest is covered by the
 * unchanged suite.
 */
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import {
  AuthService,
  BackstageCredentials,
  DatabaseService,
  LifecycleService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { createRegistry } from '@earendil-works/pi-durable';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import type { AnyModel } from '@earendil-works/pi-ai';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import knexFactory, { type Knex } from 'knex';

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import type { AiCredentialStores } from './credentials/types';
import {
  DefaultAiService,
  type DefaultAiServiceDeps,
} from './DefaultAiService';
import {
  createAiServiceIntegration as createAiServiceIntegrationBase,
  type ProductionAiServiceIntegration,
} from './integration';
import { runAiMigrations } from './migrations';
import { builtinProviderRegistry } from './providers/testFixtures';

const createAiServiceIntegration = (
  options: Parameters<typeof createAiServiceIntegrationBase>[0],
) =>
  createAiServiceIntegrationBase({
    providers: builtinProviderRegistry,
    ...options,
  });

// Jest runs this suite in a VM context, but Node's global `structuredClone`
// (used by pi-ai's tool-argument validation) deserializes into the host
// realm, whose plain objects chord's strict-JSON storage validation then
// rejects as cross-realm — every tool call through the managed service
// would fault. Tool arguments are wire JSON, so a JSON round trip is
// equivalent and keeps the objects in this realm. Production runs in a
// single realm and is unaffected.
(globalThis as Record<string, unknown>).structuredClone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const STAND_IN_KEY = `stand-in-sensitive.${Buffer.from(
  JSON.stringify({
    'https://api.openai.com/auth': { chatgpt_account_id: 'stand-in-account' },
  }),
).toString('base64')}.provider-key`;

/** NONPRODUCTION TEST STAND-IN credential stores: a fixed key per provider. */
const STAND_IN_STORES: AiCredentialStores = {
  forScope: () => ({
    read: async () => ({ type: 'api_key' as const, key: STAND_IN_KEY }),
    list: async () => [],
    modify: async () => undefined,
    delete: async () => {},
  }),
};

type Fixture = {
  db: Knex;
  deps: DefaultAiServiceDeps;
  close(): Promise<void>;
};

async function fixture(): Promise<Fixture> {
  const directory = await mkdtemp(join(tmpdir(), 'ai-node-codemode-'));
  const db = knexFactory({
    client: 'better-sqlite3',
    connection: { filename: join(directory, 'db') },
    useNullAsDefault: true,
  });
  await runAiMigrations({
    database: { getClient: async () => db },
    logger: mockServices.logger.mock(),
  });
  const deps: DefaultAiServiceDeps = {
    database: { getClient: async () => db } as DatabaseService,
    auth: {
      isPrincipal: (
        credentials: BackstageCredentials,
        type: 'user' | 'service',
      ) => (credentials.principal as { type: string }).type === type,
    } as unknown as AuthService,
    permissions: {
      authorize: async () => [{ result: 'ALLOW' }],
    } as unknown as PermissionsService,
    logger: mockServices.logger.mock(),
    auditor: mockServices.auditor.mock(),
    lifecycle: { addShutdownHook: jest.fn() } as unknown as LifecycleService,
    pluginMetadata: { getId: () => 'test-plugin' } as PluginMetadataService,
  };
  return {
    db,
    deps,
    close: async () => {
      await db.destroy();
      await rm(directory, { recursive: true, force: true });
    },
  };
}

function openOptions(sessionId: string) {
  return {
    sessionId,
    config: {
      root: new ConfigReader({
        assistant: {
          mode: 'service',
          model: { provider: 'openai', modelId: 'gpt-review' },
        },
      }),
      path: 'assistant',
    },
    credentials: mockCredentials.user('user:default/alice'),
    registry: createRegistry(),
    registryVersion: 'v1',
  };
}

async function managed(
  f: Fixture,
  options: {
    models: readonly AnyModel[];
    codemode?: { timeoutMs?: number; memoryLimitBytes?: number };
    credentialStores?: AiCredentialStores;
  },
): Promise<{
  integration: ProductionAiServiceIntegration;
  service: DefaultAiService;
}> {
  const integration = await createAiServiceIntegration({
    deps: f.deps,
    credentialStores: options.credentialStores ?? STAND_IN_STORES,
    models: options.models,
    ...(options.codemode === undefined ? {} : { codemode: options.codemode }),
  });
  const service = DefaultAiService.create({ deps: f.deps, integration });
  integration.onNamespaceInvalidated(namespace =>
    service.invalidateNamespace(namespace),
  );
  return { integration, service };
}

/**
 * A local model server speaking the openai-responses SSE protocol. The
 * first request answers with a `codemode` tool call carrying the given
 * script; the second (the tool result round trip) answers with a final
 * assistant message. Every request body is recorded.
 */
async function modelServer(script: string | undefined): Promise<{
  server: Server;
  bodies: string[];
  close(): Promise<void>;
}> {
  const bodies: string[] = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      bodies.push(Buffer.concat(chunks).toString('utf8'));
      const first = script !== undefined && bodies.length === 1;
      const id = `resp_${bodies.length}`;
      const sse = (event: unknown) =>
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      sse({ type: 'response.created', response: { id } });
      if (first && script !== undefined) {
        const item = {
          type: 'function_call',
          id: 'fc_1',
          call_id: 'fc_1',
          name: 'codemode',
          arguments: JSON.stringify({ code: script }),
        };
        sse({ type: 'response.output_item.added', output_index: 0, item });
        sse({ type: 'response.output_item.done', output_index: 0, item });
      } else {
        const item = {
          type: 'message',
          id: 'msg_1',
          role: 'assistant',
          status: 'completed',
          phase: 'final_answer',
          content: [{ type: 'output_text', text: 'done' }],
        };
        sse({ type: 'response.output_item.added', output_index: 0, item });
        sse({
          type: 'response.output_text.delta',
          output_index: 0,
          content_index: 0,
          delta: 'done',
        });
        sse({ type: 'response.output_item.done', output_index: 0, item });
      }
      sse({
        type: 'response.completed',
        response: {
          id,
          status: 'completed',
          usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
        },
      });
      res.end();
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    server,
    bodies,
    close: async () => {
      server.closeAllConnections();
      server.close();
    },
  };
}

function models(port: number): readonly AnyModel[] {
  const chat = openaiProvider().getModels()[0];
  return [
    {
      ...chat,
      provider: 'openai',
      id: 'gpt-review',
      api: 'openai-responses',
      baseUrl: `http://127.0.0.1:${port}/v1`,
    } as AnyModel,
    {
      ...chat,
      provider: 'openai',
      id: 'clsf-review',
      type: 'classifier',
      api: 'openai-responses',
      baseUrl: `http://127.0.0.1:${port}/v1`,
    } as AnyModel,
    {
      ...chat,
      provider: 'nokey',
      id: 'clsf-missing',
      type: 'classifier',
      api: 'openai-responses',
      baseUrl: `http://127.0.0.1:${port}/v1`,
    } as AnyModel,
  ];
}

/** A store with a key for exactly one provider: 'nokey' resolves nothing. */
const SELECTIVE_STORES: AiCredentialStores = {
  forScope: () => ({
    read: async (providerId: string) =>
      providerId === 'openai'
        ? { type: 'api_key' as const, key: STAND_IN_KEY }
        : undefined,
    list: async () => [],
    modify: async () => undefined,
    delete: async () => {},
  }),
};

/** The codemode tool call's result text in a request body, if any. */
function codemodeResult(body: string): string | undefined {
  const parsed = JSON.parse(body) as {
    input?: Array<{
      type?: string;
      output?: string | Array<{ text?: string }>;
    }>;
  };
  const output = parsed.input?.find(
    item => item.type === 'function_call_output',
  )?.output;
  if (typeof output === 'string') return output;
  if (Array.isArray(output)) {
    return output.map(block => block.text ?? '').join('');
  }
  return undefined;
}

const wait = async (probe: () => Promise<boolean> | boolean) => {
  for (let i = 0; i < 900; i += 1) {
    if (await probe()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('probe timeout');
};

/** Runs one codemode script through a full managed conversation. */
async function runScript(
  f: Fixture,
  script: string,
  codemode: { timeoutMs?: number; memoryLimitBytes?: number },
  sessionId: string,
): Promise<{ bodies: string[] }> {
  const probe = await modelServer(script);
  try {
    const port = (probe.server.address() as { port: number }).port;
    const { service } = await managed(f, {
      models: models(port),
      codemode,
    });
    const handle = await service.openHarness(openOptions(sessionId));
    try {
      const conversation = await handle.harness.root(handle.context);
      const submission = await conversation.submit(
        { type: 'input', content: 'run the script' },
        handle.context,
      );
      const settled = await submission.wait(handle.context);
      expect((settled as { status?: string }).status).toBe('done');
      await wait(() => probe.bodies.length >= 2);
      return { bodies: probe.bodies };
    } finally {
      await handle.release();
    }
  } finally {
    await probe.close();
  }
}

describe('opt-in code mode wiring', () => {
  it('is off by default: the codemode tool is not offered to the model', async () => {
    const f = await fixture();
    const probe = await modelServer(undefined);
    try {
      const port = (probe.server.address() as { port: number }).port;
      const { service } = await managed(f, { models: models(port) });
      const handle = await service.openHarness(openOptions('off-by-default'));
      try {
        const conversation = await handle.harness.root(handle.context);
        const submission = await conversation.submit(
          { type: 'input', content: 'hello' },
          handle.context,
        );
        const settled = await submission.wait(handle.context);
        expect((settled as { status?: string }).status).toBe('done');
        // The offered tool list of the only request names no codemode tool.
        expect(probe.bodies.length).toBe(1);
        expect(probe.bodies[0]).not.toContain('codemode');
      } finally {
        await handle.release();
      }
    } finally {
      await probe.close();
      await f.close();
    }
  }, 30000);

  it('offers the codemode tool when enabled, and scripts run', async () => {
    const f = await fixture();
    try {
      const { bodies } = await runScript(
        f,
        'return "script-ran";',
        {},
        'on-basic',
      );
      // The first request offers the tool; the second carries the script's
      // tool result back to the model.
      expect(bodies[0]).toContain('"codemode"');
      expect(codemodeResult(bodies[1])).toContain('script-ran');
    } finally {
      await f.close();
    }
  }, 30000);

  it('check 1: scripts cannot reach network, filesystem, timers, or modules', async () => {
    const f = await fixture();
    try {
      const { bodies } = await runScript(
        f,
        [
          'let importError = "import-resolved";',
          'try { await import("node:fs"); } catch (error) { importError = "import-rejected"; }',
          'return JSON.stringify({',
          '  fetch: typeof fetch,',
          '  process: typeof process,',
          '  require: typeof require,',
          '  setTimeout: typeof setTimeout,',
          '  XMLHttpRequest: typeof XMLHttpRequest,',
          '  importError,',
          '  globals: Object.getOwnPropertyNames(globalThis).sort(),',
          '});',
        ].join('\n'),
        {},
        'isolation',
      );
      // Everything the script probed is undefined inside the QuickJS VM:
      // no network, filesystem, timers, or module loader exist there. The
      // script cannot even name them, let alone call them, and a dynamic
      // import() rejects instead of resolving a module.
      const output = codemodeResult(bodies[1]) ?? '';
      expect(output).toContain('"fetch":"undefined"');
      expect(output).toContain('"process":"undefined"');
      expect(output).toContain('"require":"undefined"');
      expect(output).toContain('"setTimeout":"undefined"');
      expect(output).toContain('"XMLHttpRequest":"undefined"');
      expect(output).toContain('"importError":"import-rejected"');
      // The VM's own enumeration shows only the sanctioned script globals
      // and JavaScript builtins — a host or Node global smuggled in under
      // any name would appear here.
      const globals = JSON.parse(
        output.slice(
          output.indexOf('"globals":[') + '"globals":'.length,
          output.lastIndexOf(']') + 1,
        ),
      ) as string[];
      const forbidden = [
        'fetch',
        'process',
        'require',
        'setTimeout',
        'setInterval',
        'XMLHttpRequest',
        'WebSocket',
        'global',
        'Buffer',
        'module',
        'exports',
      ];
      expect(globals.filter(name => forbidden.includes(name))).toEqual([]);
      expect(globals).toContain('tools');
      expect(globals).toContain('console');
      expect(globals).toContain('models');
    } finally {
      await f.close();
    }
  }, 30000);

  it('check 2a: the wired deadline ends a script that never settles', async () => {
    const f = await fixture();
    try {
      const { bodies } = await runScript(
        f,
        'for (;;) { await null; }',
        { timeoutMs: 400 },
        'deadline',
      );
      // The script declared no timeout of its own and keeps pending
      // microtasks alive, so only the wired host ceiling can end it.
      expect(codemodeResult(bodies[1])).toMatch(/timed out after 400 ms/i);
    } finally {
      await f.close();
    }
  }, 30000);

  it('check 2b: the wired memory limit ends runaway allocation', async () => {
    const f = await fixture();
    try {
      const { bodies } = await runScript(
        f,
        "const a = []; for (;;) { a.push('0123456789abcdef'); }",
        { memoryLimitBytes: 8 * 1024 * 1024 },
        'memory',
      );
      expect(codemodeResult(bodies[1])).toMatch(/out of memory|memory/i);
    } finally {
      await f.close();
    }
  }, 30000);

  it('check 4: models.classify from a script routes through the guarded facade and denies fail-closed', async () => {
    const f = await fixture();
    try {
      const script = [
        "let available = 'listing threw';",
        'try {',
        "  available = (await models.getAvailableOfType('classifier'))",
        "    .map(m => m.provider + '/' + m.id)",
        '    .sort()',
        "    .join(',');",
        '} catch (error) {',
        "  available = 'listing threw: ' + String((error && error.message) || error);",
        '}',
        'try {',
        '  const r = await models.classify(',
        "    { provider: 'openai', id: 'clsf-review' },",
        "    { state: {}, questions: { q: { type: 'bool', instructions: 'ok?', criteria: { true: 'yes', false: 'no' } } } },",
        '  );',
        "  return 'available=' + available + ' | classify returned ' + JSON.stringify(r);",
        '} catch (error) {',
        "  return 'available=' + available + ' | classify threw: ' + String((error && error.message) || error);",
        '}',
      ].join('\n');
      const probe = await modelServer(script);
      const port = (probe.server.address() as { port: number }).port;
      const { service } = await managed(f, {
        models: models(port),
        codemode: {},
        credentialStores: SELECTIVE_STORES,
      });
      const handle = await service.openHarness(openOptions('classify-routing'));
      let bodies: string[];
      try {
        const conversation = await handle.harness.root(handle.context);
        const submission = await conversation.submit(
          { type: 'input', content: 'run the script' },
          handle.context,
        );
        const settled = await submission.wait(handle.context);
        expect((settled as { status?: string }).status).toBe('done');
        await wait(() => probe.bodies.length >= 2);
        bodies = probe.bodies;
      } finally {
        await handle.release();
        await probe.close();
      }

      // The script surfaced the facade's denial, not a provider answer.
      const output = codemodeResult(bodies[1]);
      expect(output).toContain('classify threw:');
      expect(output).not.toContain('classify returned');
      // Availability is honest: the classifier whose provider has
      // credentials is listed, the one whose provider resolves none is
      // not — the catalog lookup still knows it, dispatch would still
      // deny it.
      expect(output).toContain('available=openai/clsf-review');
      expect(output).not.toContain('nokey/');

      // The denial is journaled in the AI audit trail as a classify
      // attempt this model's transport does not certify.
      await wait(async () => {
        const rows = await f
          .db('ai_journal_events')
          .where({
            session_id: 'classify-routing',
            operation: 'models.classify',
          })
          .select();
        return rows.length > 0;
      });
      const rows = await f
        .db('ai_journal_events')
        .where({ session_id: 'classify-routing', operation: 'models.classify' })
        .select();
      expect(
        rows.every(
          (row: { decision: string; reason: string }) =>
            row.decision === 'deny' && row.reason.includes('unsupported'),
        ),
      ).toBe(true);

      // Exactly the two generation round trips hit the model origin: the
      // classify call never dispatched.
      expect(bodies.length).toBe(2);
    } finally {
      await f.close();
    }
  }, 30000);
});
