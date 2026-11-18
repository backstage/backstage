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
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { ModelOperationGuard, TrustedOperation } from '../guard/types';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { Fence } from '../contracts';
import { validateToolCallEnvelope } from './envelope';
import { createGuardedToolOperations } from './mediation';
import { createToolRegistry, toolPermissionName } from './registry';
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

async function startToolServer(): Promise<ServerFixture> {
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
      res.end(JSON.stringify({ result: 'tool-output' }));
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

function exampleToolServer(
  origin: string,
  hooks: {
    mode: () => AdapterMode;
    transport: typeof fetch;
    recheck: () => Promise<boolean>;
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
        const headers = options.headers as Record<string, string>;
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
  const guard: ModelOperationGuard = createModelOperationGuard({
    providers: tools.providerRegistry,
    journal: journal as never,
    recheck: hooks.recheck,
    transport: hooks.transport as unknown as typeof fetch,
  });
  const operationFor = (toolName: string): TrustedOperation => ({
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
  const mediation = createGuardedToolOperations({
    tools,
    guard,
    journal: journal as never,
    resolve: identity => ({
      operation: operationFor(identity.toolName),
      authority: { headers: { authorization: 'Bearer tool-token' } },
    }),
  });
  const callTool = (
    toolName = 'search',
    args: unknown = { query: 'x' },
    caller?: Record<string, unknown>,
  ) =>
    mediation.callTool({
      serverId: 'example-tools',
      toolName,
      arguments: args,
      credentials: mockCredentials.user('user:default/alice'),
      ...(caller ? { caller } : {}),
    });
  return { tools, events, journal, guard, module, callTool, operationFor };
}

describe('guarded tool operations', () => {
  it('mediates a tool call through the guard like a model dispatch', async () => {
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

      // Permission revocation mid-call: the next attempt is denied and
      // latched; an honest failure settles in-band without a second send.
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
        'tool did not use guarded transport',
      );
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('rejects a fabricated tool result over a guard denial, once', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'fabricate-on-denial';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      await expect(f.callTool()).rejects.toThrow('fabricated tool result');
      // Exactly the guard's own denial — no duplicate deny record.
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('rejects a fabricated tool result over a detached fetch', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'fabricate-detached';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      await expect(f.callTool()).rejects.toThrow('fabricated tool result');
      expect(f.events.filter(event => event.startsWith('deny'))).toEqual([
        'deny:1',
      ]);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('rejects a fabricated tool result after an earlier response', async () => {
    const fixture = await startToolServer();
    try {
      const mode: AdapterMode = 'fabricate-after-response';
      const f = exampleToolServer(fixture.origin, {
        mode: () => mode,
        transport: globalThis.fetch,
        recheck: async () => true,
      });
      await expect(f.callTool()).rejects.toThrow('fabricated tool result');
      expect(f.events).toEqual(['allow:1', 'deny:2', 'outcome:unknown']);
      expect(fixture.requests).toHaveLength(1);
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
      ).rejects.toThrow('unsupported tool options');
      expect(f.events).toEqual(['deny:1']);
      expect(fixture.requests).toHaveLength(0);
    } finally {
      fixture.server.close();
      await once(fixture.server, 'close');
    }
  });

  it('encodes tool permission names like model permissions', () => {
    expect(toolPermissionName({ serverId: 'a.b', toolName: 'search/x' })).toBe(
      'ai.tool.a%2Eb.search%2Fx.use',
    );
    expect(toolPermissionName({ serverId: 'a', toolName: 'b.c' })).not.toBe(
      toolPermissionName({ serverId: 'a.b', toolName: 'c' }),
    );
    expect(() => toolPermissionName({ serverId: '', toolName: 'x' })).toThrow();
  });
});
