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

import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { InputError, NotFoundError } from '@backstage/errors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const DEFAULT_TIMEOUT_MS = 60_000;

/**
 * Configuration for a single MCP server reachable from the scaffolder.
 *
 * @public
 */
export interface McpServerConfig {
  id: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  cwd?: string;
  timeoutMs: number;
}

/**
 * Minimal MCP-client surface the registry uses. Concrete factory is
 * `defaultClientFactory` (which wires up `@modelcontextprotocol/sdk`);
 * tests inject a stub.
 *
 * @public
 */
export interface McpClient {
  callTool(params: {
    name: string;
    arguments?: Record<string, unknown>;
  }): Promise<unknown>;
  close(): Promise<void>;
}

/**
 * Factory injected during tests so jest can stub the MCP client.
 *
 * @public
 */
export type ClientFactory = (server: McpServerConfig) => Promise<McpClient>;

/**
 * Read MCP server configs from `scaffolder.mcpServers`.
 */
export function readMcpServerConfigs(rootConfig: Config): McpServerConfig[] {
  const servers = rootConfig.getOptionalConfig('scaffolder.mcpServers');
  if (!servers) {
    return [];
  }
  const out: McpServerConfig[] = [];
  for (const id of servers.keys()) {
    const c = servers.getConfig(id);
    const transport = c.getOptionalString('transport') ?? 'stdio';
    if (transport !== 'stdio') {
      throw new InputError(
        `MCP server '${id}' uses unsupported transport '${transport}'. Only 'stdio' is supported.`,
      );
    }
    out.push({
      id,
      command: c.getString('command'),
      args: c.getOptionalStringArray('args') ?? [],
      env: c.getOptional('env') as Record<string, string> | undefined,
      cwd: c.getOptionalString('cwd'),
      timeoutMs: c.getOptionalNumber('timeoutMs') ?? DEFAULT_TIMEOUT_MS,
    });
  }
  return out;
}

const defaultClientFactory: ClientFactory = async server => {
  const transport = new StdioClientTransport({
    command: server.command,
    args: server.args,
    env: { ...(process.env as Record<string, string>), ...(server.env ?? {}) },
    cwd: server.cwd,
  });
  const client = new Client(
    { name: 'backstage-scaffolder-mcp-client', version: '0.1.0' },
    { capabilities: {} },
  );
  await client.connect(transport);
  return {
    async callTool(params) {
      return await client.callTool(params);
    },
    async close() {
      await client.close();
    },
  };
};

/**
 * Holds MCP server configurations and lazily establishes a client connection
 * for each server the first time it is used. Connections are reused across
 * subsequent tool invocations.
 */
export class McpServerRegistry {
  static fromConfig(
    rootConfig: Config,
    options: { logger: LoggerService; clientFactory?: ClientFactory },
  ): McpServerRegistry {
    return new McpServerRegistry(
      readMcpServerConfigs(rootConfig),
      options.logger,
      options.clientFactory ?? defaultClientFactory,
    );
  }

  private readonly servers: Map<string, McpServerConfig>;
  private readonly clients = new Map<
    string,
    Promise<Awaited<ReturnType<ClientFactory>>>
  >();

  constructor(
    servers: McpServerConfig[],
    private readonly logger: LoggerService,
    private readonly clientFactory: ClientFactory,
  ) {
    this.servers = new Map(servers.map(s => [s.id, s]));
  }

  has(serverId: string): boolean {
    return this.servers.has(serverId);
  }

  list(): string[] {
    return [...this.servers.keys()];
  }

  /**
   * Invoke `toolName` on the configured server `serverId`, enforcing the
   * server's configured timeout. The first call to a server spawns the
   * MCP process; subsequent calls reuse the same connection.
   */
  async callTool(
    serverId: string,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new NotFoundError(
        `MCP server '${serverId}' is not configured. Configured servers: ${
          this.list().join(', ') || '(none)'
        }`,
      );
    }
    const client = await this.connect(server);

    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new Error(
              `MCP tool '${toolName}' on server '${serverId}' timed out after ${server.timeoutMs}ms`,
            ),
          ),
        server.timeoutMs,
      );
    });

    try {
      return await Promise.race([
        client.callTool({ name: toolName, arguments: args }),
        timeout,
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /**
   * Close all open MCP clients. Intended for graceful shutdown / test teardown.
   */
  async close(): Promise<void> {
    const closes: Promise<unknown>[] = [];
    for (const [id, pending] of this.clients) {
      closes.push(
        pending
          .then(c => c.close())
          .catch(e =>
            this.logger.warn(
              `Failed to close MCP client '${id}': ${(e as Error).message}`,
            ),
          ),
      );
    }
    this.clients.clear();
    await Promise.all(closes);
  }

  private connect(
    server: McpServerConfig,
  ): Promise<Awaited<ReturnType<ClientFactory>>> {
    let pending = this.clients.get(server.id);
    if (!pending) {
      this.logger.info(
        `Connecting to MCP server '${server.id}' (command: ${server.command})`,
      );
      pending = this.clientFactory(server).catch(e => {
        // Failed connections must not be cached, so retries can recover.
        this.clients.delete(server.id);
        throw e;
      });
      this.clients.set(server.id, pending);
    }
    return pending;
  }
}
