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

import { mockCredentials } from '@backstage/backend-test-utils';
import { McpService } from './McpService';
import {
  actionsRegistryServiceMock,
  metricsServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
  CallToolResultSchema,
  ListToolsResultSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { InputError, NotFoundError } from '@backstage/errors';
import { McpServerConfig, ToolOverrides, parseFilterRules } from '../config';
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
        name: 'mock-action',
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
        params: { name: 'mock-action', arguments: { input: 'test' } },
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
        text: [
          '```json',
          JSON.stringify({ output: 'test' }, null, 2),
          '```',
        ].join('\n'),
      },
    ]);

    const histogram = mockMetrics.createHistogram.mock.results[0]?.value;
    expect(histogram.record).toHaveBeenCalledTimes(1);
    expect(histogram.record).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        'mcp.method.name': 'tools/call',
        'gen_ai.tool.name': 'mock-action',
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
        params: { name: 'mock-action', arguments: { input: 'test' } },
      },
      CallToolResultSchema,
    );
    await expect(result).toEqual({
      content: [
        {
          text: expect.stringMatching('Action "mock-action" not found'),
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
        'gen_ai.tool.name': 'mock-action',
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
          params: { name: 'failing-action', arguments: {} },
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
        'gen_ai.tool.name': 'failing-action',
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
        params: { name: 'failing-action', arguments: { value: 'test' } },
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
        params: { name: 'not-found-action', arguments: { id: 'abc' } },
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

    it('should filter actions by pluginSources prefix', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog',
        pluginSources: ['catalog'],
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

      expect(result.tools).toHaveLength(2);
      expect(result.tools.map(t => t.name)).toEqual([
        'get-entity',
        'delete-entity',
      ]);
    });

    it('should apply exclude filter rules to remove destructive actions', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog',
        pluginSources: ['catalog'],
        includeRules: [],
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
      expect(result.tools[0].name).toBe('get-entity');
    });

    it('should apply include filter rules with glob patterns', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Catalog',
        pluginSources: ['catalog'],
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
      expect(result.tools[0].name).toBe('get-entity');
    });

    it('should reject tool calls for actions outside the filtered set', async () => {
      const mcpService = await McpService.create({
        actions: fakeActionsService,
        metrics: metricsServiceMock.mock(),
      });

      const serverConfig: McpServerConfig = {
        name: 'Scaffolder',
        pluginSources: ['scaffolder'],
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
        {
          method: 'tools/call',
          params: { name: 'get-entity', arguments: {} },
        },
        CallToolResultSchema,
      );

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Action "get-entity" not found'),
          },
        ],
        isError: true,
      });
    });
  });

  describe('tool description overrides', () => {
    it('should apply description overrides from toolOverrides', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Original description',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      const toolOverrides: ToolOverrides = new Map([
        ['test:mock-action', { description: 'Overridden description' }],
      ]);

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        toolOverrides,
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

      expect(result.tools[0].description).toBe('Overridden description');
    });

    it('should keep the original description when no override exists', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      mockActionsRegistry.register({
        name: 'mock-action',
        title: 'Test',
        description: 'Original description',
        schema: {
          input: z => z.object({}),
          output: z => z.object({}),
        },
        action: async () => ({ output: {} }),
      });

      const toolOverrides: ToolOverrides = new Map([
        ['some-other:action', { description: 'Not for this action' }],
      ]);

      const mcpService = await McpService.create({
        actions: mockActionsRegistry,
        metrics: metricsServiceMock.mock(),
        toolOverrides,
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

      expect(result.tools[0].description).toBe('Original description');
    });
  });
});
