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

import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import { McpServerRegistry, readMcpServerConfigs } from './McpServerRegistry';

describe('readMcpServerConfigs', () => {
  it('returns an empty list when no servers are configured', () => {
    const config = new ConfigReader({});
    expect(readMcpServerConfigs(config)).toEqual([]);
  });

  it('parses a stdio server with defaults', () => {
    const config = new ConfigReader({
      scaffolder: {
        mcpServers: {
          fs: { command: 'npx', args: ['-y', 'server-filesystem', '/tmp'] },
        },
      },
    });
    expect(readMcpServerConfigs(config)).toEqual([
      {
        id: 'fs',
        command: 'npx',
        args: ['-y', 'server-filesystem', '/tmp'],
        env: undefined,
        cwd: undefined,
        timeoutMs: 60_000,
      },
    ]);
  });

  it('rejects unsupported transports', () => {
    const config = new ConfigReader({
      scaffolder: {
        mcpServers: {
          bad: { transport: 'sse', command: 'x' },
        },
      },
    });
    expect(() => readMcpServerConfigs(config)).toThrow(
      /unsupported transport 'sse'/,
    );
  });
});

describe('McpServerRegistry', () => {
  const logger = mockServices.logger.mock();

  const buildRegistry = (
    servers: Array<{ id: string; timeoutMs?: number }> = [{ id: 'fs' }],
    clientFactory: jest.Mock = jest.fn(),
  ) =>
    new McpServerRegistry(
      servers.map(s => ({
        id: s.id,
        command: 'node',
        args: [],
        timeoutMs: s.timeoutMs ?? 60_000,
      })),
      logger,
      clientFactory,
    );

  it('routes callTool to the configured server and forwards args', async () => {
    const callTool = jest.fn().mockResolvedValue({ content: 'ok' });
    const close = jest.fn();
    const factory = jest.fn().mockResolvedValue({ callTool, close });
    const registry = buildRegistry([{ id: 'fs' }], factory);

    const result = await registry.callTool('fs', 'read_file', { path: '/x' });

    expect(result).toEqual({ content: 'ok' });
    expect(callTool).toHaveBeenCalledWith({
      name: 'read_file',
      arguments: { path: '/x' },
    });
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('reuses the same client across multiple calls to the same server', async () => {
    const callTool = jest.fn().mockResolvedValue('x');
    const factory = jest.fn().mockResolvedValue({ callTool, close: jest.fn() });
    const registry = buildRegistry([{ id: 'fs' }], factory);

    await registry.callTool('fs', 't1', {});
    await registry.callTool('fs', 't2', {});

    expect(factory).toHaveBeenCalledTimes(1);
    expect(callTool).toHaveBeenCalledTimes(2);
  });

  it('throws NotFoundError when the server id is unknown', async () => {
    const registry = buildRegistry([{ id: 'fs' }]);
    await expect(registry.callTool('missing', 'foo', {})).rejects.toThrow(
      /MCP server 'missing' is not configured/,
    );
  });

  it('does not cache a failed connection so retries can recover', async () => {
    const factory = jest
      .fn()
      .mockRejectedValueOnce(new Error('spawn failed'))
      .mockResolvedValueOnce({
        callTool: jest.fn().mockResolvedValue('ok'),
        close: jest.fn(),
      });
    const registry = buildRegistry([{ id: 'fs' }], factory);

    await expect(registry.callTool('fs', 't', {})).rejects.toThrow(
      /spawn failed/,
    );
    await expect(registry.callTool('fs', 't', {})).resolves.toEqual('ok');
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('times out a slow tool call', async () => {
    // Real timers: a 5ms server timeoutMs against a never-resolving callTool
    // lets us observe the timeout path without fighting jest fake-timer/
    // microtask interleaving.
    const callTool = jest.fn().mockImplementation(() => new Promise(() => {}));
    const factory = jest.fn().mockResolvedValue({ callTool, close: jest.fn() });
    const registry = buildRegistry([{ id: 'fs', timeoutMs: 5 }], factory);

    await expect(registry.callTool('fs', 't', {})).rejects.toThrow(
      /timed out after 5ms/,
    );
  });

  it('close() closes all open clients and clears the cache', async () => {
    const close1 = jest.fn().mockResolvedValue(undefined);
    const close2 = jest.fn().mockResolvedValue(undefined);
    let n = 0;
    const factory = jest.fn().mockImplementation(() => {
      n += 1;
      return Promise.resolve({
        callTool: jest.fn().mockResolvedValue('ok'),
        close: n === 1 ? close1 : close2,
      });
    });
    const registry = buildRegistry([{ id: 'a' }, { id: 'b' }], factory);

    await registry.callTool('a', 't', {});
    await registry.callTool('b', 't', {});
    await registry.close();

    expect(close1).toHaveBeenCalled();
    expect(close2).toHaveBeenCalled();

    // After close, a follow-up call should establish a fresh connection.
    await registry.callTool('a', 't', {});
    expect(factory).toHaveBeenCalledTimes(3);
  });
});
