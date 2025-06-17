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
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { JsonObject } from '@backstage/types';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';

export class McpService {
  constructor(private readonly actions: ActionsService) {}

  static async create({ actions }: { actions: ActionsService }) {
    return new McpService(actions);
  }

  getServer({ credentials }: { credentials: BackstageCredentials }) {
    const server = new McpServer(
      {
        name: 'backstage',
        // TODO: this version will most likely change in the future.
        version,
      },
      { capabilities: { tools: {} } },
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      // TODO: switch this to be configuration based later
      const { actions } = await this.actions.list({ credentials });

      return {
        tools: actions.map(action => ({
          inputSchema: action.schema.input,
          outputSchema: action.schema.output,
          name: action.name,
          description: action.description,
          annotations: {
            title: action.title,
            destructiveHint: action.attributes.destructive,
            idempotentHint: action.attributes.idempotent,
            readOnlyHint: action.attributes.readOnly,
            openWorldHint: false,
          },
        })),
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
      const { actions } = await this.actions.list({ credentials });
      const action = actions.find(a => a.name === params.name);

      if (!action) {
        throw new NotFoundError(`Action "${params.name}" not found`);
      }

      const { output } = await this.actions.invoke({
        id: action.id,
        input: params.arguments as JsonObject,
        credentials,
      });

      return {
        // all actions need to be defined with an structured output,
        // so we can return the output using this format rather than
        // just text.
        structuredContent: output,
      };
    });

    return server;
  }
}
