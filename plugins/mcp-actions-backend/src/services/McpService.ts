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
import {
  ActionsService,
  MetricsService,
} from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';
import { performance } from 'perf_hooks';

import { handleErrors } from './handleErrors';
import { createMcpMetrics, McpMetrics } from '../metrics';

export class McpService {
  private readonly actions: ActionsService;
  private readonly metrics: McpMetrics;

  constructor(actions: ActionsService, metrics: MetricsService) {
    this.actions = actions;
    this.metrics = createMcpMetrics(metrics);
  }

  static async create({
    actions,
    metrics,
  }: {
    actions: ActionsService;
    metrics: MetricsService;
  }) {
    return new McpService(actions, metrics);
  }

  getServer({
    credentials,
    client,
  }: {
    credentials: BackstageCredentials;
    client: 'sse' | 'streamable';
  }) {
    const server = new McpServer(
      {
        name: 'backstage',
        version,
      },
      { capabilities: { tools: {} } },
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      const { actions } = await this.actions.list({ credentials });
      return {
        tools: actions.map(action => ({
          inputSchema: action.schema.input,
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
        const actionName = params.name;

        // Measure request message size
        const requestSize = JSON.stringify(params).length;
        this.metrics.messagesSize.record(requestSize, {
          client,
          direction: 'request',
        });

        const { actions } = await this.actions.list({ credentials });
        const action = actions.find(a => a.name === actionName);

        if (!action) {
          this.metrics.actionsLookup.add(1, {
            client,
            result: 'not_found',
          });
          throw new NotFoundError(`Action "${actionName}" not found`);
        }

        this.metrics.actionsLookup.add(1, {
          client,
          result: 'found',
        });

        // Measure execution time
        const startTime = performance.now();
        let status: 'success' | 'error' = 'success';

        try {
          const { output } = await this.actions.invoke({
            id: action.id,
            input: params.arguments as JsonObject,
            credentials,
          });

          const response = {
            content: [
              {
                type: 'text',
                text: ['```json', JSON.stringify(output, null, 2), '```'].join(
                  '\n',
                ),
              },
            ],
          };

          // Measure response message size
          const responseSize = JSON.stringify(response).length;
          this.metrics.messagesSize.record(responseSize, {
            client,
            direction: 'response',
          });

          return response;
        } catch (err) {
          status = 'error';
          throw err;
        } finally {
          const durationSeconds = (performance.now() - startTime) / 1000;
          this.metrics.actionsExecutionDuration.record(durationSeconds, {
            action_name: actionName,
            client,
            status,
          });
        }
      });
    });

    return server;
  }
}
