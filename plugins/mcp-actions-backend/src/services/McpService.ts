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
import {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { JsonObject } from '@backstage/types';
import { ActionsService } from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

import { handleErrors } from './handleErrors';
import { McpPromptOptions, McpResourceOptions } from '../extensions';

export class McpService {
  private readonly actions: ActionsService;
  private readonly prompts: McpPromptOptions[];
  private readonly resources: McpResourceOptions[];
  private readonly logger: LoggerService;

  constructor(
    actions: ActionsService,
    prompts: McpPromptOptions[],
    resources: McpResourceOptions[],
    logger: LoggerService,
  ) {
    this.actions = actions;
    this.prompts = prompts;
    this.resources = resources;
    this.logger = logger;
  }

  static async create({
    actions,
    prompts,
    resources,
    logger,
  }: {
    actions: ActionsService;
    prompts: McpPromptOptions[];
    resources: McpResourceOptions[];
    logger: LoggerService;
  }) {
    return new McpService(actions, prompts, resources, logger);
  }

  getServer({ credentials }: { credentials: BackstageCredentials }) {
    const server = new McpServer(
      {
        name: 'backstage',
        // TODO: this version will most likely change in the future.
        version,
      },
      { capabilities: { tools: {}, prompts: {}, resources: {} } },
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

        return {
          // todo(blam): unfortunately structuredContent is not supported by most clients yet.
          // so the validation for the output happens in the default actions registry
          // and we return it as json text instead for now.
          content: [
            {
              type: 'text',
              text: ['```json', JSON.stringify(output, null, 2), '```'].join(
                '\n',
              ),
            },
          ],
        };
      });
    });

    server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.prompts.map(prompt => {
          const argsSchema = prompt.argsSchema
            ? zodToJsonSchema(prompt.argsSchema(z))
            : undefined;

          return {
            name: prompt.name,
            description: prompt.description,
            arguments: argsSchema
              ? Object.entries((argsSchema as any).properties || {}).map(
                  ([name, schema]) => ({
                    name,
                    description: (schema as any).description || '',
                    required: ((argsSchema as any).required || []).includes(
                      name,
                    ),
                  }),
                )
              : [],
          };
        }),
      };
    });

    server.setRequestHandler(GetPromptRequestSchema, async ({ params }) => {
      const prompt = this.prompts.find(p => p.name === params.name);

      if (!prompt) {
        throw new NotFoundError(`Prompt "${params.name}" not found`);
      }

      return {
        description: prompt.description,
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: prompt.template,
            },
          },
        ],
      };
    });

    server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.resources.map(resource => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    server.setRequestHandler(ReadResourceRequestSchema, async ({ params }) => {
      return handleErrors(async () => {
        const uri = new URL(params.uri);

        // Find the matching resource handler by comparing URI patterns
        const resource = this.resources.find(r => {
          const resourceUri = new URL(r.uri);
          return (
            resourceUri.protocol === uri.protocol &&
            resourceUri.hostname === uri.hostname
          );
        });

        if (!resource) {
          throw new NotFoundError(`No resource found for URI: ${params.uri}`);
        }

        // Extract path parameters from the URI
        // Simple implementation - could be enhanced with a proper URI template matcher
        const pathParams: Record<string, string> = {};
        const resourcePathParts = new URL(resource.uri).pathname.split('/');
        const uriPathParts = uri.pathname.split('/');

        resourcePathParts.forEach((part, index) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            const paramName = part.slice(1, -1);
            pathParams[paramName] = uriPathParts[index] || '';
          }
        });

        const result = await resource.handler(uri, pathParams, {
          credentials,
          logger: this.logger,
        });

        return result;
      });
    });

    return server;
  }
}
