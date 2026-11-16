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

    /**
     * Protection against DNS rebinding attacks on the MCP endpoints.
     *
     * Requests that carry an `Origin` header are rejected unless the origin
     * is the origin of `app.baseUrl` or `backend.baseUrl`, or is listed in
     * `allowedOrigins`. Requests without an `Origin` header, which
     * non-browser MCP clients send, are not affected.
     */
    dnsRebindingProtection?: {
      /**
       * Additional origins that may call the MCP endpoints, for example a
       * browser-based MCP client, such as "https://mcp-client.example.com".
       */
      allowedOrigins?: string[];

      /**
       * When set, requests are rejected unless the hostname in their `Host`
       * header is in this list. Ports are ignored. Only set this if you know
       * every host name that the backend is reached through, including
       * internal ones behind a proxy or load balancer.
       */
      allowedHosts?: string[];
    };

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
     * These are subsets of the default server at /api/mcp-actions/v1, which is
     * always exposed and always serves every registered action.
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
