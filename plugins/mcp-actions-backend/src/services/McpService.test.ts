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
});
