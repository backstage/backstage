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
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';
import { mcpPlugin } from './plugin';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
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

  const getContext = async () => {
    const { server } = await startTestBackend({
      features: [
        mcpPlugin,
        mockPluginWithActions,
        metricsServiceMock.mock().factory,
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
      serverAddress: `http://localhost:${address.port}`,
    };
  };

  it('should support streamable spec', async () => {
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
  });

  it('should support sse spec', async () => {
    const { client, serverAddress } = await getContext();
    const transport = new SSEClientTransport(
      new URL(`${serverAddress}/api/mcp-actions/v1/sse`),
    );

    await client.connect(transport);

    const result = await client.request(
      {
        method: 'tools/list',
      },
      ListToolsResultSchema,
    );

    await client.close();

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
                  scaffolder: {
                    name: 'Scaffolder Server',
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
      const scaffolderResult = await scaffolderClient.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );
      expect(scaffolderResult.tools).toHaveLength(1);
      expect(scaffolderResult.tools[0].name).toBe(
        'scaffolder-actions.create-app',
      );
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
    });

    const pathTestCases = [
      { name: 'auth', suffix: '/v1/auth' },
      { name: 'catalog', suffix: '/v1/catalog' },
      { name: 'scaffolder', suffix: '/v1/scaffolder' },
    ];

    it.each(pathTestCases)(
      'should expose dynamic oauth-protected-resource for $name',
      async ({ suffix }) => {
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
        expect(response.status).toBe(200);
        const expectedResourceRegex = new RegExp(`/api/mcp-actions${suffix}$`);
        expect(response.body.resource).toMatch(expectedResourceRegex);
        expect(response.body.authorization_servers).toHaveLength(1);
        expect(response.body.authorization_servers[0]).toMatch(/\/api\/auth$/);
        expect(response.body.resource).toContain(`${mockExternalBaseUrl}`);
        expect(response.body.authorization_servers[0]).toContain(
          `${mockExternalBaseUrl}/`,
        );
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
                experimentalClientIdMetadataDocuments: {
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
    });
  });
});
