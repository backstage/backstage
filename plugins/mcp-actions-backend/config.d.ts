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

export interface Config {
  mcpActions?: {
    /**
     * Display name for the MCP server. Defaults to "backstage".
     * Used when running a single bundled server without mcpActions.servers.
     */
    name?: string;

    /**
     * Description of the MCP server.
     * Used when running a single bundled server without mcpActions.servers.
     */
    description?: string;

    /**
     * Instructions describing how clients should use the MCP server.
     * Used when running a single bundled server without mcpActions.servers.
     */
    instructions?: string;

    /**
     * When true, MCP tool names include the plugin ID prefix to avoid
     * collisions across plugins. For example an action registered as
     * "get-entity" by the catalog plugin becomes "catalog.get-entity".
     * Defaults to true.
     */
    namespacedToolNames?: boolean;

    tracing?: {
      capture?: {
        /**
         * When true, the MCP tool call's input arguments and output result
         * are included on the MCP `tools/call` server span as
         * `gen_ai.tool.call.arguments` and `gen_ai.tool.call.result`.
         * These attributes are marked Opt-In by the OpenTelemetry GenAI
         * semantic conventions because they may contain sensitive
         * information (entity payloads, scaffolder inputs, free-form
         * text). Defaults to false.
         */
        toolPayload?: boolean;
      };
    };

    /**
     * Named MCP servers, each exposed at /api/mcp-actions/v1/{key}.
     * When not configured, the plugin serves a single server at /api/mcp-actions/v1.
     */
    servers?: {
      [serverKey: string]: {
        /** Display name for the MCP server. */
        name: string;
        /** Description of the MCP server. */
        description?: string;
        /** Instructions describing how clients should use the MCP server. */
        instructions?: string;
        /** Filter rules to include or exclude specific actions. */
        filter?: {
          include?: Array<{
            /** Glob pattern matched against action ID. */
            id?: string;
            /** Match actions by their attribute flags. */
            attributes?: {
              destructive?: boolean;
              readOnly?: boolean;
              idempotent?: boolean;
            };
          }>;
          exclude?: Array<{
            /** Glob pattern matched against action ID. */
            id?: string;
            /** Match actions by their attribute flags. */
            attributes?: {
              destructive?: boolean;
              readOnly?: boolean;
              idempotent?: boolean;
            };
          }>;
        };
      };
    };
  };
}
