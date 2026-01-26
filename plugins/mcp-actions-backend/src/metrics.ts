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

import { MetricsService } from '@backstage/backend-plugin-api/alpha';

type McpActionsBaseAttributes = {
  action_name: string;
};

type McpActionsExecutionAttributes = McpActionsBaseAttributes & {
  status: 'success' | 'error';
};

type McpActionsMessagesAttributes = McpActionsBaseAttributes & {
  direction: 'request' | 'response';
};

type McpActionsLookupAttributes = McpActionsBaseAttributes & {
  result: 'found' | 'not_found';
};

export function createMcpMetrics(metrics: MetricsService) {
  const actionsExecutionDuration =
    metrics.createHistogram<McpActionsExecutionAttributes>(
      'backstage.mcp-actions.actions.execution.duration',
      {
        description: 'Duration of MCP action execution',
        unit: 's',
      },
    );

  const messagesSize = metrics.createHistogram<McpActionsMessagesAttributes>(
    'backstage.mcp-actions.messages.size',
    {
      description: 'Size of MCP request and response messages',
      unit: 'By',
    },
  );

  const actionsLookup = metrics.createCounter<McpActionsLookupAttributes>(
    'backstage.mcp-actions.actions.lookup.total',
    {
      description: 'Total number of action lookup attempts',
      unit: '{lookup}',
    },
  );

  return {
    actionsExecutionDuration,
    messagesSize,
    actionsLookup,
  };
}

export type McpMetrics = ReturnType<typeof createMcpMetrics>;
