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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { mockServices } from '@backstage/backend-test-utils';
import { createMcpCallAction } from './createMcpCallAction';
import { McpServerRegistry } from '../services/McpServerRegistry';

describe('createMcpCallAction', () => {
  const logger = mockServices.logger.mock();

  const buildAction = (callTool: jest.Mock) => {
    const factory = jest.fn().mockResolvedValue({
      callTool,
      close: jest.fn(),
    });
    const registry = new McpServerRegistry(
      [
        {
          id: 'fs',
          command: 'node',
          args: [],
          timeoutMs: 60_000,
        },
      ],
      logger,
      factory,
    );
    return createMcpCallAction({ registry });
  };

  it('forwards server, tool, and arguments to the registry and outputs the result', async () => {
    const callTool = jest.fn().mockResolvedValue({
      content: [{ type: 'text', text: 'hello' }],
    });
    const action = buildAction(callTool);

    const ctx = createMockActionContext({
      input: {
        server: 'fs',
        tool: 'read_file',
        arguments: { path: '/etc/hostname' },
      },
    });
    await action.handler(ctx);

    expect(callTool).toHaveBeenCalledWith({
      name: 'read_file',
      arguments: { path: '/etc/hostname' },
    });
    expect(ctx.output).toHaveBeenCalledWith('result', {
      content: [{ type: 'text', text: 'hello' }],
    });
  });

  it('defaults the arguments object to {} when omitted', async () => {
    const callTool = jest.fn().mockResolvedValue('ok');
    const action = buildAction(callTool);

    const ctx = createMockActionContext({
      input: { server: 'fs', tool: 'list' },
    });
    await action.handler(ctx);

    expect(callTool).toHaveBeenCalledWith({ name: 'list', arguments: {} });
  });

  it('propagates errors from the MCP tool', async () => {
    const callTool = jest
      .fn()
      .mockRejectedValue(new Error('tool returned non-zero exit'));
    const action = buildAction(callTool);

    const ctx = createMockActionContext({
      input: { server: 'fs', tool: 'broken' },
    });
    await expect(action.handler(ctx)).rejects.toThrow(
      /tool returned non-zero exit/,
    );
  });

  it('throws when the named server is not configured', async () => {
    const callTool = jest.fn();
    const action = buildAction(callTool);

    const ctx = createMockActionContext({
      input: { server: 'unknown', tool: 't' },
    });
    await expect(action.handler(ctx)).rejects.toThrow(
      /MCP server 'unknown' is not configured/,
    );
    expect(callTool).not.toHaveBeenCalled();
  });
});
