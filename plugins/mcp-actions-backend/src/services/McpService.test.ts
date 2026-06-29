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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { McpService } from './McpService';
import {
  actionsRegistryServiceMock,
  metricsServiceMock,
  tracingServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
  CallToolResultSchema,
  ListToolsResultSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { InputError, NotFoundError } from '@backstage/errors';
import { McpServerConfig, parseFilterRules } from '../config';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { ConfigReader } from '@backstage/config';

describe('McpService', () => {
  it('should list the available actions as tools in the mcp backend', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockActionsRegistry.register({
      name: 'mock-action',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ input: z.string() }),
        output: z => z.object({ output: z.string() }),
      },
      action: async () => ({ output: { output: 'test' } }),
    });

    const mockMetrics = metricsServiceMock.mock();
    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: mockMetrics,
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

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
          title: 'Test',
        },
        description: 'Test',
        inputSchema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          additionalProperties: false,
          properties: {
            input: {
              type: 'string',
            },
          },
          required: ['input'],
          type: 'object',
        },
        name: 'test_mock_action',
      },
    ]);

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/list',
      }),
    );
    expect(histogram.record.mock.calls[0][1]).not.toHaveProperty('error.type');
  });

  it('should record metrics with error.type when tools/list fails', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockActionsRegistry.list = jest
      .fn()
      .mockRejectedValue(new Error('List failed'));

    const mockMetrics = metricsServiceMock.mock();
    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: mockMetrics,
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    await expect(
      client.request({ method: 'tools/list' }, ListToolsResultSchema),
    ).rejects.toThrow();

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/list',
        'error.type': 'Error',
      }),
    );
  });

  it('should skip actions with invalid input schemas instead of failing the whole list', async () => {
    const validAction = {
      id: 'plugin:valid',
      pluginId: 'plugin',
      name: 'valid',
      title: 'Valid',
      description: 'Valid action',
      schema: {
        input: { type: 'object' as const },
        output: { type: 'object' as const },
      },
      attributes: { destructive: false, readOnly: true, idempotent: true },
    };
    const badTypeAction = {
      id: 'plugin:bad-type',
      pluginId: 'plugin',
      name: 'bad-type',
      title: 'Bad Type',
      description: 'inputSchema.type is not "object"',
      schema: {
        input: { type: 'string' as unknown as 'object' },
        output: { type: 'object' as const },
      },
      attributes: { destructive: false, readOnly: true, idempotent: true },
    };
    const badRequiredAction = {
      id: 'plugin:bad-required',
      pluginId: 'plugin',
      name: 'bad-required',
      title: 'Bad Required',
      description: 'inputSchema.required is not an array of strings',
      schema: {
        input: {
          type: 'object' as const,
          required: 'foo' as unknown as string[],
        },
        output: { type: 'object' as const },
      },
      attributes: { destructive: false, readOnly: true, idempotent: true },
    };

    const fakeActions: ActionsService = {
      list: jest.fn(async () => ({
        actions: [validAction, badTypeAction, badRequiredAction],
      })),
      invoke: jest.fn(async () => ({ output: {} })),
    };

    const logger = mockServices.logger.mock();
    const mcpService = await McpService.create({
      actions: fakeActions,
      metrics: metricsServiceMock.mock(),
      tracingService: tracingServiceMock.mock(),
      logger,
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({ name: 'test', version: '1.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const first = await client.request(
      { method: 'tools/list' },
      ListToolsResultSchema,
    );
    const second = await client.request(
      { method: 'tools/list' },
      ListToolsResultSchema,
    );

    expect(first.tools).toHaveLength(1);
    expect(first.tools[0].name).toBe('plugin_valid');
    expect(second.tools).toHaveLength(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('plugin:bad-type'),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('plugin:bad-required'),
    );
    // Each bad action should only log once across repeated listings.
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });

  it('should skip actions whose snake_case tool name collides with an earlier action', async () => {
    // Both of these normalize to the tool name `catalog_get_entity`.
    const firstAction = {
      id: 'catalog:get-entity',
      pluginId: 'catalog',
      name: 'get-entity',
      title: 'Get Entity',
      description: 'Fetch an entity',
      schema: {
        input: { type: 'object' as const },
        output: { type: 'object' as const },
      },
      attributes: { destructive: false, readOnly: true, idempotent: true },
    };
    const collidingAction = {
      id: 'catalog-get:entity',
      pluginId: 'catalog-get',
      name: 'entity',
      title: 'Entity',
      description: 'Also maps to catalog_get_entity',
      schema: {
        input: { type: 'object' as const },
        output: { type: 'object' as const },
      },
      attributes: { destructive: false, readOnly: true, idempotent: true },
    };

    const fakeActions: ActionsService = {
      list: jest.fn(async () => ({
        actions: [firstAction, collidingAction],
      })),
      invoke: jest.fn(async () => ({ output: {} })),
    };

    const logger = mockServices.logger.mock();
    const mcpService = await McpService.create({
      actions: fakeActions,
      metrics: metricsServiceMock.mock(),
      tracingService: tracingServiceMock.mock(),
      logger,
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({ name: 'test', version: '1.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const first = await client.request(
      { method: 'tools/list' },
      ListToolsResultSchema,
    );
    const second = await client.request(
      { method: 'tools/list' },
      ListToolsResultSchema,
    );

    // Only the first action keeps the shared tool name.
    expect(first.tools).toHaveLength(1);
    expect(first.tools[0].name).toBe('catalog_get_entity');
    expect(second.tools).toHaveLength(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('catalog-get:entity'),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('catalog:get-entity'),
    );
    // The collision should only be logged once across repeated listings.
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  it('should call the action when the tool is invoked', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockAction = jest.fn(async () => ({ output: { output: 'test' } }));

    mockActionsRegistry.register({
      name: 'mock-action',
      title: 'Test',
      description: 'Test',
      schema: {
        input: z => z.object({ input: z.string() }),
        output: z => z.object({ output: z.string() }),
      },
      action: mockAction,
    });

    const mockMetrics = metricsServiceMock.mock();
    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: mockMetrics,
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.request(
      {
        method: 'tools/call',
        params: { name: 'test_mock_action', arguments: { input: 'test' } },
      },
      CallToolResultSchema,
    );

    expect(mockAction).toHaveBeenCalledWith(
      expect.objectContaining({
        credentials: mockCredentials.user(),
        input: { input: 'test' },
        logger: expect.anything(),
      }),
    );

    expect(result.content).toEqual([
      {
        type: 'text',
        text: JSON.stringify({ output: 'test' }),
      },
    ]);
    expect(result).toHaveProperty('structuredContent', { output: 'test' });

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/call',
        'gen_ai.tool.name': 'test_mock_action',
        'gen_ai.operation.name': 'execute_tool',
      }),
    );
    expect(histogram.record.mock.calls[0][1]).not.toHaveProperty('error.type');
  });

  it('should return an error when the action is not found', async () => {
    const mockMetrics = metricsServiceMock.mock();
    const mcpService = await McpService.create({
      actions: actionsRegistryServiceMock(),
      metrics: mockMetrics,
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.request(
      {
        method: 'tools/call',
        params: { name: 'nonexistent-action', arguments: { input: 'test' } },
      },
      CallToolResultSchema,
    );
    await expect(result).toEqual({
      content: [
        {
          text: expect.stringMatching('Action "nonexistent-action" not found'),
          type: 'text',
        },
      ],
      isError: true,
    });

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/call',
        'gen_ai.tool.name': 'nonexistent-action',
        'gen_ai.operation.name': 'execute_tool',
        'error.type': 'tool_error',
      }),
    );
  });

  it('should record metrics with error.type when tool invocation throws', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const customError = new Error('Action failed');
    customError.name = 'CustomError';
    mockActionsRegistry.register({
      name: 'failing-action',
      title: 'Failing',
      description: 'Fails',
      schema: {
        input: z => z.object({}),
        output: z => z.object({}),
      },
      action: jest.fn().mockRejectedValue(customError),
    });

    const mockMetrics = metricsServiceMock.mock();
    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: mockMetrics,
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    await expect(
      client.request(
        {
          method: 'tools/call',
          params: { name: 'test_failing_action', arguments: {} },
        },
        CallToolResultSchema,
      ),
    ).rejects.toThrow('Action failed');

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/call',
        'gen_ai.tool.name': 'test_failing_action',
        'gen_ai.operation.name': 'execute_tool',
        'error.type': 'CustomError',
      }),
    );
  });

  it('should forward the original InputError when an action throws one', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockActionsRegistry.register({
      name: 'failing-action',
      title: 'Failing',
      description: 'An action that throws InputError',
      schema: {
        input: z => z.object({ value: z.string() }),
        output: z => z.object({}),
      },
      action: async () => {
        throw new InputError('the value was invalid');
      },
    });

    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: metricsServiceMock.mock(),
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.request(
      {
        method: 'tools/call',
        params: { name: 'test_failing_action', arguments: { value: 'test' } },
      },
      CallToolResultSchema,
    );

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'InputError: the value was invalid',
        },
      ],
      isError: true,
    });
  });

  it('should forward the original NotFoundError when an action throws one', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockActionsRegistry.register({
      name: 'not-found-action',
      title: 'Not Found',
      description: 'An action that throws NotFoundError',
      schema: {
        input: z => z.object({ id: z.string() }),
        output: z => z.object({}),
      },
      action: async () => {
        throw new NotFoundError('entity does not exist');
      },
    });

    const mcpService = await McpService.create({
      actions: mockActionsRegistry,
      metrics: metricsServiceMock.mock(),
      tracingService: tracingServiceMock.mock(),
    });

    const server = mcpService.getServer({
      credentials: mockCredentials.user(),
    });

    const client = new Client({
      name: 'test client',
      version: '1.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.request(
      {
        method: 'tools/call',
        params: { name: 'test_not_found_action', arguments: { id: 'abc' } },
      },
      CallToolResultSchema,
    );

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'NotFoundError: entity does not exist',
        },
      ],
      isError: true,
    });
  });

  describe('per-server filtering', () => {
    const fakeActions = [
      {
        id: 'catalog:get-entity',
        pluginId: 'catalog',
        name: 'get-entity',
        title: 'Get Entity',
        description: 'Fetch an entity',
        schema: {
          input: { type: 'object' as const },
          output: { type: 'object' as const },
        },
        attributes: { destructive: false, readOnly: true, idempotent: true },
      },
      {
        id: 'catalog:delete-entity',
        pluginId: 'catalog',
        name: 'delete-entity',
        title: 'Delete Entity',
        description: 'Delete an entity',
        schema: {
          input: { type: 'object' as const },
          output: { type: 'object' as const },
        },
        attributes: { destructive: true, readOnly: false, idempotent: false },
      },
      {
        id: 'scaffolder:create-app',
        pluginId: 'scaffolder',
        name: 'create-app',
        title: 'Create App',
        description: 'Create an app',
        schema: {
          input: { type: 'object' as const },
          output: { type: 'object' as const },
        },
        attributes: { destructive: false, readOnly: false, idempotent: false },
      },
    ];

    const fakeActionsService: ActionsService = {
      list: jest.fn(async () => ({ actions: fakeActions })),
      invoke: jest.fn(async () => ({ output: {} })),
    };

    it('should return all actions when no filter rules are set', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'All Actions',
        includeRules: [],
        excludeRules: [],
      };

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig,
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools).toHaveLength(3);
    });

    it('should scope actions using include filter rules', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog Only',
        includeRules: parseFilterRules(
          new ConfigReader({
            include: [{ id: 'catalog:*' }],
          }).getConfigArray('include'),
        ),
        excludeRules: [],
      };

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig,
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools).toHaveLength(2);
      expect(result.tools.map(t => t.name)).toEqual([
        'catalog_get_entity',
        'catalog_delete_entity',
      ]);
    });

    it('should apply exclude filter rules to remove destructive actions', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog',
        includeRules: parseFilterRules(
          new ConfigReader({
            include: [{ id: 'catalog:*' }],
          }).getConfigArray('include'),
        ),
        excludeRules: [{ attributes: { destructive: true } }],
      };

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig,
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools).toHaveLength(1);
      expect(result.tools[0].name).toBe('catalog_get_entity');
    });

    it('should apply include filter rules with glob patterns', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog',
        includeRules: parseFilterRules(
          new ConfigReader({
            include: [{ id: 'catalog:get-*' }],
          }).getConfigArray('include'),
        ),
        excludeRules: [],
      };

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig,
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools).toHaveLength(1);
      expect(result.tools[0].name).toBe('catalog_get_entity');
    });

    it('should reject tool calls for actions outside the filtered set', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Scaffolder',
        includeRules: parseFilterRules(
          new ConfigReader({
            include: [{ id: 'scaffolder:*' }],
          }).getConfigArray('include'),
        ),
        excludeRules: [],
      };

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig,
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        {
          method: 'tools/call',
          params: { name: 'catalog.get-entity', arguments: {} },
        },
        CallToolResultSchema,
      );

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining(
              'Action "catalog.get-entity" not found',
            ),
          },
        ],
        isError: true,
      });
    });
  });

  describe('server name and description', () => {
    it('should default server name to backstage when no config is provided', async () => {
      const mcpService = await McpService.create({
        actions: actionsRegistryServiceMock(),
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const serverInfo = client.getServerVersion();
      expect(serverInfo?.name).toBe('backstage');
      expect(serverInfo?.description).toBeUndefined();
    });

    it('should use name and description from server config', async () => {
      const mcpService = await McpService.create({
        actions: actionsRegistryServiceMock(),
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig: {
          name: 'My Custom Server',
          description: 'A custom MCP server for testing',
          includeRules: [],
          excludeRules: [],
        },
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const serverInfo = client.getServerVersion();
      expect(serverInfo?.name).toBe('My Custom Server');
      expect(serverInfo?.description).toBe('A custom MCP server for testing');
    });

    it('should omit description when not provided in config', async () => {
      const mcpService = await McpService.create({
        actions: actionsRegistryServiceMock(),
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
        serverConfig: {
          name: 'Named Server',
          includeRules: [],
          excludeRules: [],
        },
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const serverInfo = client.getServerVersion();
      expect(serverInfo?.name).toBe('Named Server');
      expect(serverInfo?.description).toBeUndefined();
    });
  });

  describe('namespaced tool names', () => {
    it('should expose the snake_case namespaced name as tool name by default', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools[0].name).toBe('test_mock_action');
    });

    it('should use short snake_case action name when namespacing is disabled', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
        namespacedToolNames: false,
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema,
      );

      expect(result.tools[0].name).toBe('mock_action');
    });

    it('should match tool calls using the snake_case namespaced name', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        {
          method: 'tools/call',
          params: { name: 'test_mock_action', arguments: {} },
        },
        CallToolResultSchema,
      );

      expect(result.isError).toBeUndefined();
    });

    it('should still match tool calls using the legacy dotted/hyphenated name for backward compatibility', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockAction = jest.fn(async () => ({ output: {} }));
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: mockAction,
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: tracingServiceMock.mock(),
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });

      const client = new Client({ name: 'test', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        {
          method: 'tools/call',
          // The legacy name format that earlier versions exposed and that
          // clients may still have cached.
          params: { name: 'test.mock-action', arguments: {} },
        },
        CallToolResultSchema,
      );

      expect(result.isError).toBeUndefined();
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('tracing', () => {
    async function invokeMockAction(opts: {
      tracing: ReturnType<typeof tracingServiceMock.mock>;
      captureToolPayloads?: boolean;
      credentials?:
        | ReturnType<typeof mockCredentials.user>
        | ReturnType<typeof mockCredentials.service>;
    }) {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Test',
        schema: {
          input: z => z.object({ input: z.string() }),
          output: z => z.object({ output: z.string() }),
        },
        action: async () => ({ output: { output: 'test' } }),
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: opts.tracing,
        captureToolPayloads: opts.captureToolPayloads,
      });

      const server = mcpService.getServer({
        credentials: opts.credentials ?? mockCredentials.user(),
      });

      const client = new Client({ name: 'test client', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      return client.request(
        {
          method: 'tools/call',
          params: { name: 'test_mock_action', arguments: { input: 'val' } },
        },
        CallToolResultSchema,
      );
    }

    it('starts a tools/call span with spec attributes, server kind, and the request credentials', async () => {
      const tracing = tracingServiceMock.mock();
      const credentials = mockCredentials.user();
      await invokeMockAction({ tracing, credentials });

      expect(tracing.startActiveSpan).toHaveBeenCalledTimes(1);
      const [name, options] = tracing.startActiveSpan.mock.calls[0];
      expect(name).toBe('tools/call test_mock_action');
      expect(options?.kind).toBe('server');
      expect(options?.attributes).toEqual(
        expect.objectContaining({
          'mcp.method.name': 'tools/call',
          'gen_ai.tool.name': 'test_mock_action',
          'gen_ai.operation.name': 'execute_tool',
        }),
      );
      expect(options?.attributes).not.toHaveProperty(
        'gen_ai.tool.call.arguments',
      );
      expect(options?.credentials).toBe(credentials);
      expect(tracing.spans[0].setStatus).not.toHaveBeenCalled();
    });

    it('overrides backstage.plugin.id on the span to match the action source plugin', async () => {
      const tracing = tracingServiceMock.mock();
      await invokeMockAction({ tracing });

      // The mock action is registered via actionsRegistryServiceMock(),
      // which assigns pluginId 'test'.
      expect(tracing.spans[0].setAttribute).toHaveBeenCalledWith(
        'backstage.plugin.id',
        'test',
      );
    });

    it('includes gen_ai baggage entries as span attributes when present', async () => {
      const tracing = tracingServiceMock.mock();
      tracing.propagation.getActiveBaggage.mockReturnValue({
        getAllEntries: () => [
          ['gen_ai.conversation.id', { value: 'conv-123' }],
          ['gen_ai.agent.id', { value: 'agent-456' }],
        ],
      });

      await invokeMockAction({ tracing });

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      expect(options?.attributes?.['gen_ai.conversation.id']).toBe('conv-123');
      expect(options?.attributes?.['gen_ai.agent.id']).toBe('agent-456');
    });

    it('only forwards allowlisted baggage keys onto the span', async () => {
      const tracing = tracingServiceMock.mock();
      tracing.propagation.getActiveBaggage.mockReturnValue({
        getAllEntries: () => [
          ['gen_ai.conversation.id', { value: 'conv-123' }],
          ['gen_ai.tool.call.result', { value: 'injected-result' }],
          ['gen_ai.prompt', { value: 'injected-prompt' }],
          ['gen_ai.user.message', { value: 'injected-user-message' }],
        ],
      });

      await invokeMockAction({ tracing });

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      expect(options?.attributes?.['gen_ai.conversation.id']).toBe('conv-123');
      expect(options?.attributes).not.toHaveProperty('gen_ai.tool.call.result');
      expect(options?.attributes).not.toHaveProperty('gen_ai.prompt');
      expect(options?.attributes).not.toHaveProperty('gen_ai.user.message');
    });

    it('omits gen_ai baggage attributes when no baggage is present', async () => {
      const tracing = tracingServiceMock.mock();
      await invokeMockAction({ tracing });

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      expect(options?.attributes).not.toHaveProperty('gen_ai.conversation.id');
      expect(options?.attributes).not.toHaveProperty('gen_ai.agent.id');
    });

    it('threads baggage end-to-end from a propagated baggage header through context.with into the tool span', async () => {
      const tracing = tracingServiceMock.mock();
      // Simulate what the routers do on incoming requests: extract context
      // from headers and run the handler with that context active.
      const ctx = tracing.propagation.extract(tracing.context.active(), {
        baggage: 'gen_ai.conversation.id=conv-end-to-end',
      });
      await tracing.context.with(ctx, () => invokeMockAction({ tracing }));

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      expect(options?.attributes?.['gen_ai.conversation.id']).toBe(
        'conv-end-to-end',
      );
    });

    it('truncates overlong baggage values before stamping them on the span', async () => {
      const tracing = tracingServiceMock.mock();
      const longValue = 'a'.repeat(1024);
      tracing.propagation.getActiveBaggage.mockReturnValue({
        getAllEntries: () => [['gen_ai.conversation.id', { value: longValue }]],
      });

      await invokeMockAction({ tracing });

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      const recorded = options?.attributes?.['gen_ai.conversation.id'];
      expect(typeof recorded).toBe('string');
      expect((recorded as string).length).toBe(256);
      expect(recorded).toBe('a'.repeat(256));
    });

    it('includes tool arguments in the span options and sets the structured action output as the result attribute when captureToolPayloads is true', async () => {
      const tracing = tracingServiceMock.mock();
      await invokeMockAction({ tracing, captureToolPayloads: true });

      const [, options] = tracing.startActiveSpan.mock.calls[0];
      expect(options?.attributes?.['gen_ai.tool.call.arguments']).toBe(
        JSON.stringify({ input: 'val' }),
      );

      const span = tracing.spans[0];
      const resultCall = span.setAttribute.mock.calls.find(
        ([key]) => key === 'gen_ai.tool.call.result',
      );
      expect(resultCall).toBeDefined();
      // The recorded result should be the structured action output, not the
      // CallToolResult envelope wrapping a fenced JSON block.
      expect(JSON.parse(resultCall![1] as string)).toEqual({ output: 'test' });
    });

    it('sets error.type=tool_error and ERROR status on the span when the tool returns isError', async () => {
      const tracing = tracingServiceMock.mock();
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'failing-action',
        title: 'Failing',
        description: 'Throws InputError',
        schema: {
          input: z => z.object({ value: z.string() }),
          output: z => z.object({}),
        },
        action: async () => {
          throw new InputError('the value was invalid');
        },
      });

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        tracingService: tracing,
        captureToolPayloads: true,
      });

      const server = mcpService.getServer({
        credentials: mockCredentials.user(),
      });
      const client = new Client({ name: 'test client', version: '1.0' });
      const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();
      await Promise.all([
        client.connect(clientTransport),
        server.connect(serverTransport),
      ]);

      const result = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'test_failing_action',
            arguments: { value: 'test' },
          },
        },
        CallToolResultSchema,
      );
      expect(result.isError).toBe(true);

      const span = tracing.spans[0];
      expect(span.setAttribute).toHaveBeenCalledWith(
        'error.type',
        'tool_error',
      );
      expect(span.setStatus).toHaveBeenCalledWith({
        code: 'error',
        message: 'tool_error',
      });
      // The error is signalled via error.type + status; the result attribute
      // should be omitted even when captureToolPayloads is enabled.
      const resultCall = span.setAttribute.mock.calls.find(
        ([key]) => key === 'gen_ai.tool.call.result',
      );
      expect(resultCall).toBeUndefined();
    });
  });
});
