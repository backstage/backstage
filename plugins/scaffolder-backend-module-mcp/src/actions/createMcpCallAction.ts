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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { McpServerRegistry } from '../services/McpServerRegistry';

/**
 * Create the `mcp:call` scaffolder action.
 *
 * Invokes a tool on an MCP server configured under `scaffolder.mcpServers.*`
 * and returns the tool's result.
 *
 * @public
 */
export const createMcpCallAction = (options: {
  registry: McpServerRegistry;
}) => {
  const { registry } = options;

  return createTemplateAction({
    id: 'mcp:call',
    description:
      'Call a tool on a configured MCP (Model Context Protocol) server.',
    schema: {
      input: {
        server: z =>
          z.string({
            description:
              'The id of an MCP server configured under `scaffolder.mcpServers.*`',
          }),
        tool: z =>
          z.string({
            description: 'The name of the tool to invoke on the MCP server.',
          }),
        arguments: z =>
          z
            .record(z.unknown())
            .describe(
              'JSON object of arguments forwarded to the MCP tool. Must match the tool input schema declared by the MCP server.',
            )
            .optional(),
      },
      output: {
        result: z =>
          z
            .unknown()
            .describe(
              'Raw response returned by the MCP tool (typically an object with `content` array).',
            ),
      },
    },
    async handler(ctx) {
      const { server, tool, arguments: args } = ctx.input;

      ctx.logger.info(
        `Calling MCP tool '${tool}' on server '${server}'${
          args ? ` with ${Object.keys(args).length} argument(s)` : ''
        }`,
      );

      const result = await registry.callTool(
        server,
        tool,
        (args ?? {}) as Record<string, unknown>,
      );

      ctx.output('result', result as any);
    },
  });
};
