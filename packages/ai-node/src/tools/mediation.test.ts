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
import { createServer, type Server } from 'node:http';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import { createGuardedModelOperations } from '../guard/modelOperations';
import type { TrustedOperation } from '../guard/types';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { Fence } from '../contracts';
import { validateToolCallEnvelope } from './envelope';
import { createGuardedToolOperations } from './mediation';
import {
  composeWithToolRegistry,
  createToolRegistry,
  toolPermissionName,
} from './registry';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';
import type { ToolModule } from './types';

type ServerFixture = {
  server: Server;
  origin: string;
  requests: Array<{
    pathname: string;
    body: Record<string, unknown>;
    authorization?: string;
  }>;
};

async function startToolServer(
  payload: Record<string, unknown> = { result: 'tool-output' },
): Promise<ServerFixture> {
  const requests: ServerFixture['requests'] = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      requests.push({
        pathname: req.url ?? '',
        body: JSON.parse(Buffer.concat(chunks).toString('utf-8')),
        authorization: req.headers.authorization,
      });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(payload));
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, origin: `http://127.0.0.1:${address.port}`, requests };
}

type AdapterMode =
  | 'honest'
  | 'skip-guard'
  | 'fabricate-on-denial'
  | 'fabricate-detached'
  | 'honest-error'
  | 'fabricate-after-response';

type Authority = Readonly<{
  kind: 'apiKey' | 'oauth';
  apiKey?: string;
  headers?: Record<string, string>;
  expiresAt?: number;
}>;

function exampleToolServer(
  origin: string,
  hooks: {
    mode: () => AdapterMode;
    transport: typeof fetch;
    recheck: () => Promise<boolean>;
    authority?: () => Authority;
  },
) {
  const module: ToolModule = {
    id: 'example-tools',
    tools: [
      { name: 'search', description: 'Search the index' },
      { name: 'fetch_page', description: 'Fetch one page' },
    ],
    destination: toolName => `${origin}/mcp/example-tools/tools/${toolName}`,
    destinationTemplates: [
      [
        { literal: '/mcp/' },
        { digest: 'server' },
        { literal: '/tools/' },
        { digest: 'tool' },
      ],
    ],
    validateToolCall: validateToolCallEnvelope,
    adapter: {
      kind: 'tool',
      invoke: async ({ tool, arguments: args, options }) => {
        const fetch = options.fetch as typeof globalThis.fetch;
        const headers = (options.headers ?? {}) as Record<string, string>;
        const send = (bodyTool: string) =>
          fetch(`${origin}/mcp/example-tools/tools/${tool.name}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ tool: bodyTool, arguments: args }),
          });
        const mode = hooks.mode();
        if (mode === 'skip-guard') {
          return { value: { fake: true }, outcome: 'completed' };
        }
        if (mode === 'fabricate-detached') {
          void send(tool.name).catch(() => {
            /* provider detaches its fetch */
          });
          return { value: { fake: true }, outcome: 'completed' };
        }
        try {
          const response = await send(
            mode === 'fabricate-on-denial' ? 'other-tool' : tool.name,
          );
          if (mode === 'fabricate-after-response') {
            // A second, denied request after a real response.
            try {
              await send('other-tool');
            } catch {
              /* provider incorrectly swallows the denial */
            }
            return { value: { fake: true }, outcome: 'completed' };
          }
          const body = (await response.json()) as unknown;
          return { value: body, outcome: 'completed' };
        } catch (error) {
          if (
            mode === 'fabricate-on-denial' ||
            mode === 'fabricate-after-response'
          ) {
            return { value: { fake: true }, outcome: 'completed' };
          }
          return {
            value: { errorMessage: String(error) },
            outcome: 'failed',
          };
        }
      },
    },
  };
  const tools = createToolRegistry([module]);
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
  const guard = createModelOperationGuard({
    providers: tools.providerRegistry,
    journal: journal as never,
    recheck: hooks.recheck,
    transport: hooks.transport,
  });
  const credentials = mockCredentials.user('user:default/alice');
  const operationFor = (toolName: string): TrustedOperation => ({
    actor: 'user:default/alice',
    credentials,
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
    provider: 'example-tools',
    modelId: toolName,
    resolvedModel: toolName,
    operation: 'toolCall',
    api: 'example-tools',
    destination: module.destination(toolName),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  });
  // The stock pattern: the model operations' resolve binds tool models —
  // the tool name rides the model identity, the caller's credentials travel
  // on the model, and the authority carries the interpreted MCP credential.
  const models = createGuardedModelOperations({
    providers: tools.providerRegistry,
    guard,
    journal: journal as never,
    resolve: model => {
      const view = model as unknown as {
        id: string;
        credentials: BackstageCredentials;
      };
      const authority: Authority = hooks.authority
        ? hooks.authority()
        : {
            kind: 'apiKey',
            apiKey: 'tool-token',
            headers: { authorization: 'Bearer tool-token' },
          };
      return {
        model,
        operation: { ...operationFor(view.id), credentials: view.credentials },
        authority,
      };
    },
  });
  const mediation = createGuardedToolOperations({ tools, models });
  const callTool = (
    toolName = 'search',
    args: unknown = { query: 'x' },
    caller?: Record<string, unknown>,
  ) =>
    mediation.callTool({
      serverId: 'example-tools',
      toolName,
      arguments: args,
      credentials,
      ...(caller ? { caller } : {}),
    });
  return { tools, events, journal, module, callTool, operationFor };
}

describe('guarded tool operations', () => {
  it('mediates a tool call through the shared dispatch path', async () => {
    const fixture = await startToolServer();
    try {
      let mode: AdapterMode = 'honest';
      let revoked = false;
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => !revoked,
      });
      await expect(f.callTool()).resolves.toEqual({ result: 'tool-output' });
      expect(f.events).toEqual(['allow:1', 'outcome:completed']);
      expect(fixture.requests).toHaveLength(1);
      expect(fixture.requests[0].pathname).toBe(
        '/mcp/example-tools/tools/search',
      );
      expect(fixture.requests[0].authorization).toBe('Bearer tool-token');
      expect(fixture.requests[0].body).toEqual({
        tool: 'search',
        arguments: { query: 'x' },
      });

      // Permission revocation: the next call is denied before sending and
      // an honest failure settles in-band without a second send.
      revoked = true;
      mode = 'honest-error';
      await expect(f.callTool()).resolves.toMatchObject({
        errorMessage: expect.stringContaining('revoked'),
      });
      expect(f.events).toEqual(['allow:1', 'outcome:completed', 'deny:1']);
      expect(fixture.requests).toHaveLength(1);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  // Reviewer round 3: a successful tool result is application data. A payload
  // that happens to carry an `errorMessage` field must pass through untouched;
  // only a non-completed settlement gets the boundary text.
  it('returns a successful payload byte-identical, even with errorMessage data', async () => {
    const payload = {
      errorMessage: 'application value: the tool reports a validation warning',
      result: 'tool-output',
      nested: { errorMessage: 'still data' },
    };
    const fixture = await startToolServer(payload);
    try {
      const f = exampleToolServer(fixture.origin, {
        mode: () => 'honest',
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      const result = await f.callTool();
      expect(result).toEqual(payload);
      expect(JSON.stringify(result)).toBe(JSON.stringify(payload));
      expect(f.events).toEqual(['allow:1', 'outcome:completed']);
      expect(fixture.requests).toHaveLength(1);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('rejects a tool call that never uses the guarded transport', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'skip-guard';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      await expect(f.callTool()).rejects.toThrow(
        'provider did not use guarded transport',
      );
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('settles an honest transport failure in-band without a denial', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'honest-error';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: (async () => {
          throw new Error('network disconnected');
        }) as unknown as typeof fetch,
        recheck: async () => true,
      });
      await expect(f.callTool()).resolves.toMatchObject({
        errorMessage: expect.stringContaining('network disconnected'),
      });
      expect(f.events).toEqual(['allow:1', 'outcome:unknown']);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('denies an expiring credential during a held recheck', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'honest';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        // The token expires while the permission recheck is held; the
        // guard's post-recheck expiry check denies before any send.
        recheck: async () => {
          await new Promise(resolve => setTimeout(resolve, 150));
          return true;
        },
        authority: () => ({
          kind: 'oauth',
          headers: { authorization: 'Bearer expiring-token' },
          expiresAt: Date.now() + 80,
        }),
      });
      await expect(f.callTool()).resolves.toMatchObject({
        errorMessage: expect.stringContaining('credential expired'),
      });
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('fails closed on unknown tools and caller-supplied options', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'honest';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      await expect(f.callTool('not-declared', {})).rejects.toThrow(
        'unknown tool or unverified operation',
      );
      expect(f.events).toEqual([]);
      await expect(
        f.callTool('search', {}, { fetch: async () => new Response('') }),
      ).rejects.toThrow('unsupported model options');
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('denies malformed tool arguments and queried destinations', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'honest';
      // The adapter misbehaves per probe: array or absent arguments, and a
      // destination carrying a pre-configured query.
      let shape: 'array' | 'missing' | 'query' | 'none' = 'none';
      const module = {
        adapter: {
          kind: 'tool' as const,
          invoke: async (
            input: Readonly<{
              tool: Readonly<{ name: string }>;
              options: Readonly<Record<string, unknown>>;
            }>,
          ): Promise<{ value: unknown; outcome: 'completed' }> => {
            const tool = input.tool;
            const opts = input.options as unknown as {
              fetch: typeof fetch;
              headers: Record<string, string>;
            };
            const body: Record<string, unknown> =
              shape === 'array'
                ? { tool: tool.name, arguments: [] }
                : { tool: tool.name, arguments: {} };
            if (shape === 'missing') delete body.arguments;
            const url =
              shape === 'query'
                ? `${fixture.origin}/mcp/example-tools/tools/${tool.name}?token=visible`
                : `${fixture.origin}/mcp/example-tools/tools/${tool.name}`;
            const response = await opts.fetch(url, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                ...opts.headers,
              },
              body: JSON.stringify(body),
            });
            return {
              value: await response.json(),
              outcome: 'completed' as const,
            };
          },
        },
      };
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
      const base = createToolRegistry([
        {
          id: 'example-tools',
          tools: [{ name: 'search' }],
          destination: (toolName: string) =>
            `${fixture.origin}/mcp/example-tools/tools/${toolName}`,
          destinationTemplates: [
            [
              { literal: '/mcp/' },
              { digest: 'server' },
              { literal: '/tools/' },
              { digest: 'tool' },
            ],
          ],
          validateToolCall: validateToolCallEnvelope,
          adapter: module.adapter,
        },
      ]);
      const credentials = mockCredentials.user('user:default/alice');
      const guard = createModelOperationGuard({
        providers: base.providerRegistry,
        journal: journal as never,
        recheck: async () => true,
        transport: globalThis.fetch,
      });
      const destination = base
        .resolve({ serverId: 'example-tools', toolName: 'search' })!
        .module.destination('search');
      const models = createGuardedModelOperations({
        providers: base.providerRegistry,
        guard,
        journal: journal as never,
        resolve: model => ({
          model,
          operation: {
            actor: 'user:default/alice',
            credentials,
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
            provider: 'example-tools',
            modelId: 'search',
            resolvedModel: 'search',
            operation: 'toolCall',
            api: 'example-tools',
            destination,
            credentialScope: { kind: 'user', id: 'user:default/alice' },
            credentialGeneration: '1',
            controller: new AbortController(),
          } as TrustedOperation,
          authority: {
            kind: 'apiKey',
            apiKey: 'tool-token',
            headers: { authorization: 'Bearer tool-token' },
          },
        }),
      });
      const mediation = createGuardedToolOperations({ tools: base, models });
      const call = () =>
        mediation.callTool({
          serverId: 'example-tools',
          toolName: 'search',
          arguments: { query: 'x' },
          credentials,
        });
      for (const probe of ['array', 'missing', 'query'] as const) {
        shape = probe;
        events.length = 0;
        await expect(call()).rejects.toThrow();
        expect(events.filter(event => event.startsWith('deny'))).toEqual([
          'deny:1',
        ]);
      }
      expect(fixture.requests).toHaveLength(0);
      expect(mode).toBe('honest');
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('rejects static or malformed route templates at registration', () => {
    const base = {
      id: 'bad-tools',
      tools: [{ name: 'search' }],
      destination: () => 'https://server.example/mcp/server/tools/search',
      validateToolCall: validateToolCallEnvelope,
      adapter: {
        kind: 'tool' as const,
        invoke: async () => ({ value: null, outcome: 'completed' as const }),
      },
    };
    expect(() =>
      createToolRegistry([
        {
          ...base,
          destinationTemplates: [
            [{ literal: '/mcp/server/tools/search' }],
          ] as never,
        },
      ]),
    ).toThrow('Invalid tool module route template');
    expect(() =>
      createToolRegistry([
        {
          ...base,
          destinationTemplates: [
            [{ literal: '/tools/' }, { digest: 'tool' }],
          ] as never,
        },
      ]),
    ).toThrow('Invalid tool module route template');
    expect(() =>
      createToolRegistry([
        {
          ...base,
          destinationTemplates: [
            [
              { literal: '/mcp/' },
              { digest: 'server' },
              { literal: '/tools/' },
              { digest: 'tool' },
            ],
          ],
        },
      ]),
    ).not.toThrow();
  });

  it('rejects tool module ids that collide with provider modules', () => {
    const collidingModule = {
      id: 'openai-responses',
      tools: [{ name: 'search' }],
      destination: (toolName: string) =>
        `https://server.example/mcp/openai-responses/tools/${toolName}`,
      destinationTemplates: [
        [
          { literal: '/mcp/' },
          { digest: 'server' },
          { literal: '/tools/' },
          { digest: 'tool' },
        ],
      ],
      validateToolCall: validateToolCallEnvelope,
      adapter: {
        kind: 'tool' as const,
        invoke: async () => ({ value: null, outcome: 'completed' as const }),
      },
    };
    expect(() =>
      composeWithToolRegistry(
        builtinProviderRegistry,
        createToolRegistry([collidingModule]),
      ),
    ).toThrow(/Module id collision.*openai-responses/s);
  });

  it('composes distinct tool and provider ids without shadowing', () => {
    const tools = createToolRegistry([
      {
        id: 'distinct-tools',
        tools: [{ name: 'search' }],
        destination: (toolName: string) =>
          `https://server.example/mcp/distinct-tools/tools/${toolName}`,
        destinationTemplates: [
          [
            { literal: '/mcp/' },
            { digest: 'server' },
            { literal: '/tools/' },
            { digest: 'tool' },
          ],
        ],
        validateToolCall: validateToolCallEnvelope,
        adapter: {
          kind: 'tool' as const,
          invoke: async () => ({ value: null, outcome: 'completed' as const }),
        },
      },
    ]);
    const composed = composeWithToolRegistry(builtinProviderRegistry, tools);
    expect(composed.get('distinct-tools')?.certifiedOperations).toEqual([
      'toolCall',
    ]);
    // The provider module keeps its own dispatch semantics.
    expect(composed.get('openai-responses')?.certifiedOperations).toContain(
      'stream',
    );
  });

  it('binds tool dispatch to the module identity, rejecting cross-server facts', async () => {
    const makeModule = (id: string): ToolModule => ({
      id,
      tools: [{ name: 'search' }],
      destination: toolName =>
        `https://server.example/mcp/${id}/tools/${toolName}`,
      destinationTemplates: [
        [
          { literal: '/mcp/' },
          { digest: 'server' },
          { literal: '/tools/' },
          { digest: 'tool' },
        ],
      ],
      validateToolCall: validateToolCallEnvelope,
      adapter: {
        kind: 'tool',
        invoke: async () => ({ value: null, outcome: 'completed' as const }),
      },
    });
    const tools = createToolRegistry([
      makeModule('a-tools'),
      makeModule('b-tools'),
    ]);
    const facade = tools.providerRegistry.get('a-tools')!;
    expect(facade.resolveDispatch).toBeDefined();
    const resolveCredential = async () => ({
      scope: { kind: 'user' as const, id: 'user:default/alice' },
      authority: { kind: 'apiKey' as const, headers: {} },
      generation: '1',
    });
    // Dispatch facts naming a different server than the resolved module
    // fail closed before any credential is consulted or any send happens.
    const crossed = await facade.resolveDispatch!(
      { id: 'search', provider: 'b-tools', api: 'a-tools' } as never,
      resolveCredential,
    );
    expect(crossed).toEqual({
      resolved: false,
      reason: expect.stringContaining("'b-tools' is not 'a-tools'"),
    });
    // Matching facts resolve through the module's own identity.
    const matched = await facade.resolveDispatch!(
      { id: 'search', provider: 'a-tools', api: 'a-tools' } as never,
      resolveCredential,
    );
    expect(matched).toMatchObject({
      resolved: true,
      api: 'a-tools',
      destination: 'https://server.example/mcp/a-tools/tools/search',
    });
  });
});
