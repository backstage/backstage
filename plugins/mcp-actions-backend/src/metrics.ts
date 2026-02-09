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

import { Attributes } from '@backstage/backend-plugin-api/alpha';

/**
 * Attributes for mcp.server.operation.duration
 * Following OTel requirement levels from the spec
 *
 * @see https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/#metric-mcpserveroperationduration
 */
export interface McpServerOperationAttributes extends Attributes {
  // Required
  'mcp.method.name': string;

  // Conditionally Required
  'error.type'?: string;
  'gen_ai.tool.name'?: string;
  'gen_ai.prompt.name'?: string;
  'mcp.resource.uri'?: string;
  'rpc.response.status_code'?: string;

  // Recommended
  'gen_ai.operation.name'?: 'execute_tool';
  'mcp.protocol.version'?: string;
  'mcp.session.id'?: string;
  'network.transport'?: 'tcp' | 'quic' | 'pipe' | 'unix';
  'network.protocol.name'?: string;
  'network.protocol.version'?: string;
}

/**
 * Attributes for mcp.server.session.duration
 * Following OTel requirement levels from the spec
 *
 * @see https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/#metric-mcpserversessionduration
 */
export interface McpServerSessionAttributes extends Attributes {
  // Conditionally Required
  'error.type'?: string;

  // Recommended
  'mcp.protocol.version'?: string;
  'network.transport'?: 'tcp' | 'quic' | 'pipe' | 'unix';
  'network.protocol.name'?: string;
  'network.protocol.version'?: string;
}

/**
 * OTel recommended bucket boundaries for MCP metrics
 *
 * @remarks
 *
 * Based on the MCP metrics defined in the OTel semantic conventions v1.39.0
 * @see https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/
 *
 */
export const bucketBoundaries = [
  0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 30, 60, 120, 300,
];
