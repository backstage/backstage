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
import { JsonObject, JsonValue } from '@backstage/types';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';

import { handleErrors } from './handleErrors';

// Type guard to check if a JsonValue is a JsonObject
function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard to check if a JsonObject has a type field equal to 'image'
function isImageOutput(
  obj: JsonObject,
): obj is JsonObject & { type: 'image'; data: JsonValue } {
  return obj.type === 'image';
}

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
          // todo(blam): this is unfortunately not supported by most clients yet.
          // When this is provided you need to provide structuredContent instead.
          // outputSchema: action.schema.output,
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
      return handleErrors(async () => {
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

        // Check if output is a JsonObject with type 'image'
        const isImageType = isJsonObject(output) && isImageOutput(output);

        return {
          // for the moment adding support to image type since clients are now able to render the images
          content: [
            {
              type: isImageType ? 'image' : 'text',
              ...(isImageType
                ? {
                    data: output.data,
                    mimeType: 'image/png',
                  }
                : {
                    text: [
                      '```json',
                      JSON.stringify(output, null, 2),
                      '```',
                    ].join('\n'),
                  }),
            },
          ],
        };
      });
    });

    return server;
  }
}
