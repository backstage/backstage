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
import PromiseRouter from 'express-promise-router';
import { Router } from 'express';
import { performance } from 'node:perf_hooks';
import { McpService } from '../services/McpService';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { LATEST_PROTOCOL_VERSION } from '@modelcontextprotocol/sdk/types.js';
import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { isError } from '@backstage/errors';
import { MetricsService } from '@backstage/backend-plugin-api/alpha';
import { bucketBoundaries, McpServerSessionAttributes } from '../metrics';

export const createStreamableRouter = ({
  mcpService,
  httpAuth,
  logger,
  metrics,
}: {
  mcpService: McpService;
  logger: LoggerService;
  httpAuth: HttpAuthService;
  metrics: MetricsService;
}): Router => {
  const router = PromiseRouter();

  const sessionDuration = metrics.createHistogram<McpServerSessionAttributes>(
    'mcp.server.session.duration',
    {
      description:
        'The duration of the MCP session as observed on the MCP server',
      unit: 's',
      advice: { explicitBucketBoundaries: bucketBoundaries },
    },
  );

  router.post('/', async (req, res) => {
    const sessionStart = performance.now();
    let sessionErrorType: string | undefined;

    try {
      const server = mcpService.getServer({
        credentials: await httpAuth.credentials(req),
      });

      const transport = new StreamableHTTPServerTransport({
        // stateless implementation for now, so that we can support multiple
        // instances of the server backend, and avoid sticky sessions.
        sessionIdGenerator: undefined,
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);

      res.on('close', () => {
        transport.close();
        server.close();

        const durationSeconds = (performance.now() - sessionStart) / 1000;

        sessionDuration.record(durationSeconds, {
          'mcp.protocol.version': LATEST_PROTOCOL_VERSION,
          'network.transport': 'tcp',
          'network.protocol.name': 'http',
        });
      });
    } catch (error) {
      sessionErrorType = isError(error) ? error.name : 'Error';

      if (isError(error)) {
        logger.error(error.message);
      }

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }

      const durationSeconds = (performance.now() - sessionStart) / 1000;

      sessionDuration.record(durationSeconds, {
        'mcp.protocol.version': LATEST_PROTOCOL_VERSION,
        'network.transport': 'tcp',
        'network.protocol.name': 'http',
        'error.type': sessionErrorType,
      });
    }
  });

  router.get('/', async (_, res) => {
    // We only support POST requests, so we return a 405 error for all other methods.
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.',
        },
        id: null,
      }),
    );
  });

  router.delete('/', async (_, res) => {
    // We only support POST requests, so we return a 405 error for all other methods.
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Method not allowed.',
        },
        id: null,
      }),
    );
  });

  return router;
};
