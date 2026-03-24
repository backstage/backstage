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
  ActionsServiceAction,
  MetricsServiceHistogram,
  MetricsService,
} from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';
import { performance } from 'node:perf_hooks';

import { handleErrors } from './handleErrors';
import { bucketBoundaries, McpServerOperationAttributes } from '../metrics';
import { FilterRule, McpServerConfig } from '../config';

export class McpService {
  private readonly actions: ActionsService;
  private readonly namespacedToolNames: boolean;
  private readonly operationDuration: MetricsServiceHistogram<McpServerOperationAttributes>;

  constructor(
    actions: ActionsService,
    metrics: MetricsService,
    namespacedToolNames?: boolean,
  ) {
    this.actions = actions;
    this.namespacedToolNames = namespacedToolNames ?? true;
    this.operationDuration =
      metrics.createHistogram<McpServerOperationAttributes>(
        'mcp.server.operation.duration',
        {
          description: 'MCP request duration as observed on the receiver',
          unit: 's',
          advice: { explicitBucketBoundaries: bucketBoundaries },
        },
      );
  }

  static async create({
    actions,
    metrics,
    namespacedToolNames,
  }: {
    actions: ActionsService;
    metrics: MetricsService;
    namespacedToolNames?: boolean;
  }) {
    return new McpService(actions, metrics, namespacedToolNames);
  }

  getServer({
    credentials,
    serverConfig,
  }: {
    credentials: BackstageCredentials;
    serverConfig?: McpServerConfig;
  }) {
    const server = new McpServer(
      {
        name: serverConfig?.name ?? 'backstage',
        // TODO: this version will most likely change in the future.
        version,
        ...(serverConfig?.description && {
          description: serverConfig.description,
        }),
      },
      { capabilities: { tools: {} } },
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      const startTime = performance.now();
      let errorType: string | undefined;

      try {
        const { actions: allActions } = await this.actions.list({
          credentials,
        });
        const actions = serverConfig
          ? this.filterActions(allActions, serverConfig)
          : allActions;

        return {
          tools: actions.map(action => ({
            inputSchema: action.schema.input,
            // todo(blam): this is unfortunately not supported by most clients yet.
            // When this is provided you need to provide structuredContent instead.
            // outputSchema: action.schema.output,
            name: this.getToolName(action),
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
      } catch (err) {
        errorType = err instanceof Error ? err.name : 'Error';
        throw err;
      } finally {
        const durationSeconds = (performance.now() - startTime) / 1000;

        this.operationDuration.record(durationSeconds, {
          'mcp.method.name': 'tools/list',
          ...(errorType && { 'error.type': errorType }),
        });
      }
    });

    server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
      const startTime = performance.now();
      let errorType: string | undefined;
      let isError = false;

      try {
        const result = await handleErrors(async () => {
          const { actions: allActions } = await this.actions.list({
            credentials,
          });
          const actions = serverConfig
            ? this.filterActions(allActions, serverConfig)
            : allActions;

          const action = actions.find(a => this.getToolName(a) === params.name);

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

        isError = !!(result as { isError?: boolean })?.isError;
        return result;
      } catch (err) {
        errorType = err instanceof Error ? err.name : 'Error';
        throw err;
      } finally {
        const durationSeconds = (performance.now() - startTime) / 1000;

        // Determine error.type per OTel MCP spec:
        // - Thrown exceptions use the error name
        // - CallToolResult with isError=true uses 'tool_error'
        let errorAttribute: string | undefined = errorType;
        if (!errorAttribute && isError) {
          errorAttribute = 'tool_error';
        }

        this.operationDuration.record(durationSeconds, {
          'mcp.method.name': 'tools/call',
          'gen_ai.tool.name': params.name,
          'gen_ai.operation.name': 'execute_tool',
          ...(errorAttribute && { 'error.type': errorAttribute }),
        });
      }
    });

    return server;
  }

  private filterActions(
    actions: ActionsServiceAction[],
    serverConfig: McpServerConfig,
  ): ActionsServiceAction[] {
    const { includeRules, excludeRules } = serverConfig;
    if (includeRules.length === 0 && excludeRules.length === 0) {
      return actions;
    }

    return actions.filter(action => {
      if (excludeRules.some(rule => this.matchesRule(action, rule))) {
        return false;
      }

      if (includeRules.length === 0) {
        return true;
      }

      return includeRules.some(rule => this.matchesRule(action, rule));
    });
  }

  private getToolName(action: ActionsServiceAction): string {
    if (this.namespacedToolNames) {
      return `${action.pluginId}.${action.name}`;
    }
    return action.name;
  }

  private matchesRule(action: ActionsServiceAction, rule: FilterRule): boolean {
    if (rule.idMatcher && !rule.idMatcher.match(action.id)) {
      return false;
    }

    if (rule.attributes) {
      for (const [key, value] of Object.entries(rule.attributes)) {
        if (
          action.attributes[
            key as 'destructive' | 'readOnly' | 'idempotent'
          ] !== value
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
