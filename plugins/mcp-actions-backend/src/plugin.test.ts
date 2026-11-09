/*
 * Copyright 2025 The Backstage Authors
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
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import {
  actionsServiceMock,
  metricsServiceMock,
  tracingServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { mcpPlugin } from './plugin';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
  Client as V2Client,
  StreamableHTTPClientTransport as V2Transport,
} from '@modelcontextprotocol/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ListToolsResultSchema } from '@modelcontextprotocol/sdk/types.js';
import request from 'supertest';

describe('Mcp Backend', () => {
  const mockPluginWithActions = createBackendPlugin({
    pluginId: 'local',
    register({ registerInit }) {
      registerInit({
        deps: { actionsRegistry: actionsRegistryServiceRef },
        async init({ actionsRegistry }) {
          actionsRegistry.register({
            name: 'make-greeting',
            title: 'Make Greeting',
            description: 'Make a greeting',
            schema: {
              input: z => z.object({ name: z.string() }),
              output: z => z.object({ greeting: z.string() }),
            },
            action: async ({ input }) => ({
              output: { greeting: `Hello ${input.name}!` },
            }),
          });
        },
      });
    },
  });

  const getContext = async (instructions?: string) => {
    const metrics = metricsServiceMock.mock();
    const { server } = await startTestBackend({
      features: [
        mcpPlugin,
        mockPluginWithActions,
        metrics.factory,
        tracingServiceMock.mock().factory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              actions: {
                pluginSources: ['local'],
              },
            },
            ...(instructions && { mcpActions: { instructions } }),
          },
        }),
      ],
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const address = server.address();
    if (typeof address !== 'object' || !('port' in address!)) {
      throw new Error('server broke');
    }

    return {
      client,
      metrics,
      serverAddress: `http://localhost:${address.port}`,
    };
  };

  it('should only support the streamable HTTP transport', async () => {
    const { client, serverAddress } = await getContext();
    const transport = new StreamableHTTPClientTransport(
      new URL(`${serverAddress}/api/mcp-actions/v1`),
    );

    await client.connect(transport);

    const result = await client.request(
      {
        method: 'tools/list',
      },
      ListToolsResultSchema,
    );

    expect(result.tools).toEqual([
      {
        annotations: {
          destructiveHint: true,
          idempotentHint: false,
          openWorldHint: false,
          readOnlyHint: false,
          title: 'Make Greeting',
        },
        description: 'Make a greeting',
        inputSchema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          additionalProperties: false,
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
          type: 'object',
        },
        name: 'local.make-greeting',
      },
    ]);

    const callResult = await client.callTool({
      name: 'local.make-greeting',
      arguments: { name: 'Ada' },
    });
    expect(callResult).toEqual({
      content: [{ type: 'text', text: '{"greeting":"Hello Ada!"}' }],
      structuredContent: { greeting: 'Hello Ada!' },
    });
    await client.close();

    const legacyResponse = await request(serverAddress).get(
      '/api/mcp-actions/v1/sse',
    );
    expect(legacyResponse.status).toBe(404);
  });

  it('should serve a v2 client using the existing handshake', async () => {
    const { serverAddress } = await getContext('Use greeting tools.');
    const client = new V2Client({ name: 'v2 test client', version: '1.0' });
    try {
      await client.connect(
        new V2Transport(new URL(`${serverAddress}/api/mcp-actions/v1`)),
      );
      expect(client.getInstructions()).toBe('Use greeting tools.');
      const { tools } = await client.listTools();
      expect(tools.map(tool => tool.name)).toEqual(['local.make-greeting']);
      expect(
        await client.callTool({
          name: 'local.make-greeting',
          arguments: { name: 'Ada' },
        }),
      ).toEqual({
        content: [{ type: 'text', text: '{"greeting":"Hello Ada!"}' }],
        structuredContent: { greeting: 'Hello Ada!' },
      });
      expect(
        await client.callTool({ name: 'missing', arguments: {} }),
      ).toMatchObject({ isError: true });
    } finally {
      await client.close();
    }
  });

  it('should serve the 2026 protocol without falling back to the handshake', async () => {
    const { serverAddress, metrics } = await getContext('Use greeting tools.');
    const client = new V2Client(
      { name: 'modern test client', version: '1.0' },
      { versionNegotiation: { mode: { pin: '2026-07-28' } } },
    );
    const listResponses: unknown[] = [];
    try {
      await client.connect(
        new V2Transport(new URL(`${serverAddress}/api/mcp-actions/v1`), {
          fetch: async (url, init) => {
            const response = await fetch(url, init);
            if (
              response.headers.get('content-type')?.includes('application/json')
            ) {
              const body = await response.clone().json();
              if (body.result?.tools) listResponses.push(body.result);
            }
            return response;
          },
        }),
      );
      expect(client.getProtocolEra()).toBe('modern');
      expect(client.getInstructions()).toBe('Use greeting tools.');
      expect((await client.listTools()).tools.map(tool => tool.name)).toEqual([
        'local.make-greeting',
      ]);
      expect(
        await client.callTool({
          name: 'local.make-greeting',
          arguments: { name: 'Ada' },
        }),
      ).toEqual({
        content: [{ type: 'text', text: '{"greeting":"Hello Ada!"}' }],
        structuredContent: { greeting: 'Hello Ada!' },
        _meta: {
          'io.modelcontextprotocol/serverInfo': {
            name: 'backstage',
            version: expect.any(String),
          },
        },
      });
      expect(
        await client.callTool({ name: 'missing', arguments: {} }),
      ).toMatchObject({ isError: true });
      expect(listResponses).toEqual([
        expect.objectContaining({ ttlMs: 0, cacheScope: 'private' }),
      ]);
      const sessionHistogramIndex =
        metrics.createHistogram.mock.calls.findIndex(
          ([name]) => name === 'mcp.server.session.duration',
        );
      expect(
        metrics.createHistogram.mock.results[sessionHistogramIndex].value
          .record,
      ).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({ 'mcp.protocol.version': '2026-07-28' }),
      );
    } finally {
      await client.close();
    }
  });

  it('should keep concurrent callers isolated on the modern endpoint', async () => {
    const auth = mockServices.auth();
    const actions = actionsServiceMock.mock({
      list: async ({ credentials }) => {
        const name = auth.isPrincipal(credentials, 'user')
          ? credentials.principal.userEntityRef.split('/')[1]
          : 'other';
        return {
          actions: [
            {
              id: `local:${name}`,
              pluginId: 'local',
              name,
              title: name,
              description: name,
              schema: { input: { type: 'object' }, output: { type: 'object' } },
              attributes: {
                readOnly: true,
                destructive: false,
                idempotent: true,
              },
            },
          ],
        };
      },
      invoke: async ({ credentials }) => ({
        output: {
          userEntityRef: auth.isPrincipal(credentials, 'user')
            ? credentials.principal.userEntityRef
            : 'other',
        },
      }),
    });
    const { server } = await startTestBackend({
      features: [
        mcpPlugin,
        actions.factory,
        mockServices.httpAuth.factory(),
        metricsServiceMock.mock().factory,
        tracingServiceMock.mock().factory,
      ],
    });
    const address = server.address();
    if (typeof address !== 'object' || !address)
      throw new Error('Missing server address');
    await Promise.all(
      ['alice', 'bob'].map(async name => {
        const client = new V2Client(
          { name, version: '1.0' },
          {
            versionNegotiation: { mode: { pin: '2026-07-28' } },
          },
        );
        try {
          await client.connect(
            new V2Transport(
              new URL(`http://localhost:${address.port}/api/mcp-actions/v1`),
              {
                requestInit: {
                  headers: {
                    Authorization: mockCredentials.user.header(
                      `user:default/${name}`,
                    ),
                  },
                },
              },
            ),
          );
          expect(
            (await client.listTools()).tools.map(tool => tool.name),
          ).toEqual([`local.${name}`]);
          expect(
            await client.callTool({ name: `local.${name}`, arguments: {} }),
          ).toMatchObject({
            structuredContent: {
              userEntityRef: `user:default/${name}`,
            },
          });
          const other = name === 'alice' ? 'bob' : 'alice';
          expect(
            await client.callTool({ name: `local.${other}`, arguments: {} }),
          ).toMatchObject({ isError: true });
        } finally {
          await client.close();
        }
      }),
    );
    expect(actions.invoke).toHaveBeenCalledTimes(2);
  });

  it.each(['2024-11-05', '2025-03-26', '2025-06-18', '2025-11-25'])(
    'should retain the %s handshake',
    async protocolVersion => {
      const { serverAddress } = await getContext();
      const response = await request(serverAddress)
        .post('/api/mcp-actions/v1')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion,
            capabilities: {},
            clientInfo: { name: 'legacy', version: '1.0' },
          },
        });
      expect(response.status).toBe(200);
      expect(response.text).toContain(`"protocolVersion":"${protocolVersion}"`);
      expect(response.header['mcp-session-id']).toBeUndefined();
    },
  );

  it('should reject modern header mismatches and retain stateless HTTP methods', async () => {
    const { serverAddress } = await getContext();
    const response = await request(serverAddress)
      .post('/api/mcp-actions/v1')
      .set('Accept', 'application/json, text/event-stream')
      .set('MCP-Protocol-Version', '2026-07-28')
      .set('Mcp-Method', 'tools/call')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {
          _meta: {
            'io.modelcontextprotocol/protocolVersion': '2026-07-28',
            'io.modelcontextprotocol/clientCapabilities': {},
          },
        },
      });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32020);
    for (const method of ['get', 'delete'] as const) {
      const result = await request(serverAddress)[method](
        '/api/mcp-actions/v1',
      );
      expect(result.status).toBe(405);
    }
  });

  it('should return configured instructions for the default server', async () => {
    const instructions = 'Use catalog tools before scaffolder tools.';
    const { client, serverAddress } = await getContext(instructions);
    const transport = new StreamableHTTPClientTransport(
      new URL(`${serverAddress}/api/mcp-actions/v1`),
    );

    await client.connect(transport);

    expect(client.getInstructions()).toBe(instructions);
  });

  describe('multi-server routing', () => {
    const mockCatalogPlugin = createBackendPlugin({
      pluginId: 'catalog-actions',
      register({ registerInit }) {
        registerInit({
          deps: { actionsRegistry: actionsRegistryServiceRef },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'get-entity',
              title: 'Get Entity',
              description: 'Fetch an entity',
              schema: {
                input: z => z.object({ name: z.string() }),
                output: z => z.object({ entity: z.string() }),
              },
              action: async ({ input }) => ({
                output: { entity: input.name },
              }),
            });
          },
        });
      },
    });

    const mockScaffolderPlugin = createBackendPlugin({
      pluginId: 'scaffolder-actions',
      register({ registerInit }) {
        registerInit({
          deps: { actionsRegistry: actionsRegistryServiceRef },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'create-app',
              title: 'Create App',
              description: 'Create an app from template',
              schema: {
                input: z => z.object({ template: z.string() }),
                output: z => z.object({ name: z.string() }),
              },
              action: async ({ input }) => ({
                output: { name: input.template },
              }),
            });
          },
        });
      },
    });

    it('should route to per-server endpoints when mcpActions.servers is configured', async () => {
      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockCatalogPlugin,
          mockScaffolderPlugin,
          metricsServiceMock.mock().factory,
          tracingServiceMock.mock().factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['catalog-actions', 'scaffolder-actions'],
                },
              },
              mcpActions: {
                servers: {
                  catalog: {
                    name: 'Catalog Server',
                    instructions: 'Use this server to inspect the catalog.',
                    filter: {
                      include: [{ id: 'catalog-actions:*' }],
                    },
                  },
                  scaffolder: {
                    name: 'Scaffolder Server',
                    instructions: 'Use this server to create components.',
                    filter: {
                      include: [{ id: 'scaffolder-actions:*' }],
                    },
                  },
                },
              },
            },
          }),
        ],
      });

      const address = server.address();
      if (typeof address !== 'object' || !('port' in address!)) {
        throw new Error('server broke');
      }
      const serverAddress = `http://localhost:${address.port}`;

      const catalogClient = new Client({ name: 'test', version: '1.0' });
      const catalogTransport = new StreamableHTTPClientTransport(
        new URL(`${serverAddress}/api/mcp-actions/v1/catalog`),
      );
      await catalogClient.connect(catalogTransport);
      expect(catalogClient.getInstructions()).toBe(
        'Use this server to inspect the catalog.',
      );
      const catalogResult = await catalogClient.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );
      expect(catalogResult.tools).toHaveLength(1);
      expect(catalogResult.tools[0].name).toBe('catalog-actions.get-entity');

      const scaffolderClient = new Client({ name: 'test', version: '1.0' });
      const scaffolderTransport = new StreamableHTTPClientTransport(
        new URL(`${serverAddress}/api/mcp-actions/v1/scaffolder`),
      );
      await scaffolderClient.connect(scaffolderTransport);
      expect(scaffolderClient.getInstructions()).toBe(
        'Use this server to create components.',
      );
      const scaffolderResult = await scaffolderClient.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );
      expect(scaffolderResult.tools).toHaveLength(1);
      expect(scaffolderResult.tools[0].name).toBe(
        'scaffolder-actions.create-app',
      );
      const modernClient = new V2Client(
        { name: 'modern named client', version: '1.0' },
        { versionNegotiation: { mode: { pin: '2026-07-28' } } },
      );
      try {
        await modernClient.connect(
          new V2Transport(
            new URL(`${serverAddress}/api/mcp-actions/v1/catalog`),
          ),
        );
        expect(modernClient.getProtocolEra()).toBe('modern');
        expect(modernClient.getInstructions()).toBe(
          'Use this server to inspect the catalog.',
        );
        expect(
          (await modernClient.listTools()).tools.map(tool => tool.name),
        ).toEqual(['catalog-actions.get-entity']);
        expect(
          await modernClient.callTool({
            name: 'scaffolder-actions.create-app',
            arguments: { template: 'test' },
          }),
        ).toMatchObject({ isError: true });
      } finally {
        await modernClient.close();
      }
    });

    it('should keep serving every action on /v1 when named servers are configured', async () => {
      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockCatalogPlugin,
          mockScaffolderPlugin,
          metricsServiceMock.mock().factory,
          tracingServiceMock.mock().factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['catalog-actions', 'scaffolder-actions'],
                },
              },
              mcpActions: {
                servers: {
                  catalog: {
                    name: 'Catalog Server',
                    filter: {
                      include: [{ id: 'catalog-actions:*' }],
                    },
                  },
                },
              },
            },
          }),
        ],
      });

      const address = server.address();
      if (typeof address !== 'object' || !('port' in address!)) {
        throw new Error('server broke');
      }
      const serverAddress = `http://localhost:${address.port}`;

      const listTools = async (path: string) => {
        const client = new Client({ name: 'test', version: '1.0' });
        await client.connect(
          new StreamableHTTPClientTransport(new URL(serverAddress + path)),
        );
        const result = await client.request(
          { method: 'tools/list' },
          ListToolsResultSchema,
        );
        return result.tools.map(tool => tool.name);
      };

      await expect(listTools('/api/mcp-actions/v1')).resolves.toEqual([
        'catalog-actions.get-entity',
        'scaffolder-actions.create-app',
      ]);

      // The named server is a subset of the default one, and since the default
      // is mounted last and Express matches `use` prefixes, this also guards
      // against /v1 swallowing /v1/catalog.
      await expect(listTools('/api/mcp-actions/v1/catalog')).resolves.toEqual([
        'catalog-actions.get-entity',
      ]);
    });
  });

  describe('OAuth well-known endpoints', () => {
    it('should not expose oauth endpoints when neither DCR nor CIMD is enabled', async () => {
      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockPluginWithActions,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['local'],
                },
              },
            },
          }),
        ],
      });

      const response = await request(server).get(
        '/.well-known/oauth-protected-resource',
      );
      expect(response.status).toBe(404);
    });

    it('should expose default oauth-protected-resource when DCR is enabled', async () => {
      const mockExternalBaseUrl = 'http://external.local:0/api';
      const mockDiscovery = mockServices.discovery.mock({
        getExternalBaseUrl: async pluginId =>
          `${mockExternalBaseUrl}/${pluginId}`,
      });

      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockPluginWithActions,
          mockDiscovery.factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['local'],
                },
              },
              auth: {
                experimentalDynamicClientRegistration: {
                  enabled: true,
                },
              },
            },
          }),
        ],
      });

      const response = await request(server).get(
        '/.well-known/oauth-protected-resource/api/mcp-actions/v1',
      );
      expect(response.status).toBe(200);
      expect(response.body.resource).toMatch(/\/api\/mcp-actions\/v1$/);
      expect(response.body.authorization_servers).toHaveLength(1);
      expect(response.body.authorization_servers[0]).toMatch(/\/api\/auth$/);
      expect(response.body.resource).toContain(`${mockExternalBaseUrl}`);
      expect(response.body.authorization_servers[0]).toContain(
        `${mockExternalBaseUrl}/`,
      );
      expect(response.body.scopes_supported).toEqual(['openid']);
    });

    it('should include offline_access in scopes_supported when refresh tokens are enabled', async () => {
      const mockExternalBaseUrl = 'http://external.local:0/api';
      const mockDiscovery = mockServices.discovery.mock({
        getExternalBaseUrl: async pluginId =>
          `${mockExternalBaseUrl}/${pluginId}`,
      });

      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockPluginWithActions,
          mockDiscovery.factory,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['local'],
                },
              },
              auth: {
                experimentalDynamicClientRegistration: {
                  enabled: true,
                },
                experimentalRefreshToken: {
                  enabled: true,
                },
              },
            },
          }),
        ],
      });

      const response = await request(server).get(
        '/.well-known/oauth-protected-resource/api/mcp-actions/v1',
      );
      expect(response.status).toBe(200);
      expect(response.body.scopes_supported).toEqual([
        'openid',
        'offline_access',
      ]);
    });

    const pathTestCases = [
      { name: 'the default server', suffix: '/v1', status: 200 },
      { name: 'auth', suffix: '/v1/auth', status: 200 },
      { name: 'catalog', suffix: '/v1/catalog', status: 200 },
      { name: 'scaffolder', suffix: '/v1/scaffolder', status: 200 },
      { name: 'an unknown server', suffix: '/v1/unknown', status: 404 },
    ];

    it.each(pathTestCases)(
      'should respond to oauth-protected-resource for $name',
      async ({ suffix, status }) => {
        const mockExternalBaseUrl = 'http://external.local:0/api';
        const mockDiscovery = mockServices.discovery.mock({
          getExternalBaseUrl: async pluginId =>
            `${mockExternalBaseUrl}/${pluginId}`,
        });

        const { server } = await startTestBackend({
          features: [
            mcpPlugin,
            mockPluginWithActions,
            mockDiscovery.factory,
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['local'],
                  },
                },
                auth: {
                  experimentalDynamicClientRegistration: {
                    enabled: true,
                  },
                },
                mcpActions: {
                  servers: {
                    auth: { name: 'Auth', filter: { include: [] } },
                    catalog: { name: 'Catalog', filter: { include: [] } },
                    scaffolder: { name: 'Scaffolder', filter: { include: [] } },
                  },
                },
              },
            }),
          ],
        });

        const response = await request(server).get(
          `/.well-known/oauth-protected-resource/api/mcp-actions${suffix}`,
        );
        expect(response.status).toBe(status);
        if (status !== 200) {
          return;
        }

        const expectedResourceRegex = new RegExp(`/api/mcp-actions${suffix}$`);
        expect(response.body.resource).toMatch(expectedResourceRegex);
        expect(response.body.authorization_servers).toHaveLength(1);
        expect(response.body.authorization_servers[0]).toMatch(/\/api\/auth$/);
        expect(response.body.resource).toContain(`${mockExternalBaseUrl}`);
        expect(response.body.authorization_servers[0]).toContain(
          `${mockExternalBaseUrl}/`,
        );
        expect(response.body.scopes_supported).toEqual(['openid']);
      },
    );

    it('should expose oauth-protected-resource when CIMD is enabled', async () => {
      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockPluginWithActions,
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['local'],
                },
              },
              auth: {
                clientIdMetadataDocuments: {
                  enabled: true,
                },
              },
            },
          }),
        ],
      });

      const response = await request(server).get(
        '/.well-known/oauth-protected-resource/api/mcp-actions/v1',
      );
      expect(response.status).toBe(200);
      expect(response.body.resource).toMatch(/\/api\/mcp-actions\/v1$/);
      expect(response.body.authorization_servers).toHaveLength(1);
      expect(response.body.authorization_servers[0]).toMatch(/\/api\/auth$/);
      expect(response.body.scopes_supported).toEqual(['openid']);
    });

    it('should support the deprecated experimental CIMD configuration', async () => {
      const { server } = await startTestBackend({
        features: [
          mcpPlugin,
          mockPluginWithActions,
          mockServices.rootConfig.factory({
            data: {
              backend: { actions: { pluginSources: ['local'] } },
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          }),
        ],
      });

      await request(server)
        .get('/.well-known/oauth-protected-resource/api/mcp-actions/v1')
        .expect(200);
    });
  });
});
