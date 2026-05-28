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
  TracingService,
} from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError } from '@backstage/errors';
import { performance } from 'node:perf_hooks';

import { handleErrors } from './handleErrors';
import { bucketBoundaries, McpServerOperationAttributes } from '../metrics';
import { FilterRule, McpServerConfig } from '../config';

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

// Baggage is propagated from untrusted callers, so we forward only an
// explicit allowlist of low-cardinality identifier keys from the OTel
// `gen_ai.*` registry.
const PROPAGATED_BAGGAGE_ATTRIBUTES: ReadonlySet<string> = new Set([
  'gen_ai.agent.id',
  'gen_ai.agent.name',
  'gen_ai.conversation.id',
  'gen_ai.provider.name',
  'gen_ai.request.model',
]);

// Cap each forwarded baggage value before it lands on a span attribute.
// Baggage values are caller-controlled strings of unbounded length;
// allowlisting keys protects against arbitrary attribute names but not
// against pathologically large values inflating exported span sizes.
const BAGGAGE_ATTRIBUTE_VALUE_MAX_LENGTH = 256;

function baggageAttributes(
  tracingService: TracingService,
): Record<string, string> {
  const baggage = tracingService.propagation.getActiveBaggage();
  if (!baggage) return {};
  const attrs: Record<string, string> = {};
  for (const [key, entry] of baggage.getAllEntries()) {
    if (PROPAGATED_BAGGAGE_ATTRIBUTES.has(key)) {
      attrs[key] = entry.value.slice(0, BAGGAGE_ATTRIBUTE_VALUE_MAX_LENGTH);
    }
  }
  return attrs;
}

export class McpService {
  private readonly actions: ActionsService;
  private readonly namespacedToolNames: boolean;
  private readonly tracingService: TracingService;
  private readonly captureToolPayloads: boolean;
  private readonly operationDuration: MetricsServiceHistogram<McpServerOperationAttributes>;

  constructor(
    actions: ActionsService,
    metrics: MetricsService,
    tracingService: TracingService,
    namespacedToolNames?: boolean,
    captureToolPayloads?: boolean,
  ) {
    this.actions = actions;
    this.namespacedToolNames = namespacedToolNames ?? true;
    this.tracingService = tracingService;
    this.captureToolPayloads = captureToolPayloads ?? false;
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
    tracingService,
    namespacedToolNames,
    captureToolPayloads,
  }: {
    actions: ActionsService;
    metrics: MetricsService;
    tracingService: TracingService;
    namespacedToolNames?: boolean;
    captureToolPayloads?: boolean;
  }) {
    return new McpService(
      actions,
      metrics,
      tracingService,
      namespacedToolNames,
      captureToolPayloads,
    );
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
        return await this.tracingService.startActiveSpan(
          `tools/call ${params.name}`,
          {
            kind: 'server',
            credentials,
            attributes: {
              ...baggageAttributes(this.tracingService),
              'mcp.method.name': 'tools/call',
              'gen_ai.tool.name': params.name,
              'gen_ai.operation.name': 'execute_tool',
              ...(this.captureToolPayloads && {
                'gen_ai.tool.call.arguments': safeStringify(params.arguments),
              }),
            },
          },
          async span => {
            const result = await handleErrors(async () => {
              const { actions: allActions } = await this.actions.list({
                credentials,
              });
              const actions = serverConfig
                ? this.filterActions(allActions, serverConfig)
                : allActions;

              const action = actions.find(
                a => this.getToolName(a) === params.name,
              );

              if (!action) {
                throw new NotFoundError(`Action "${params.name}" not found`);
              }

              // Re-attribute the span to the plugin that owns the action.
              // This runs after the span has started, so head-based samplers
              // still see the default `mcp-actions` value when deciding
              // whether to record the span. The pluginId is only known after
              // resolving the action via `actions.list`, so the reattribution
              // is unavoidable.
              span.setAttribute('backstage.plugin.id', action.pluginId);

              const { output } = await this.actions.invoke({
                id: action.id,
                input: params.arguments as JsonObject,
                credentials,
              });

              if (this.captureToolPayloads) {
                span.setAttribute(
                  'gen_ai.tool.call.result',
                  safeStringify(output),
                );
              }

              return {
                content: [
                  {
                    type: 'text',
                    text: safeStringify(output),
                  },
                ],
                structuredContent: output,
              };
            });

            isError = !!(result as { isError?: boolean })?.isError;
            if (isError) {
              span.setAttribute('error.type', 'tool_error');
              span.setStatus({ code: 'error', message: 'tool_error' });
            }
            return result;
          },
        );
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
