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
import { McpService } from '../services/McpService';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError, NotFoundError } from '@backstage/errors';

/**
 * Legacy SSE endpoint for older clients, hopefully will not be needed for much longer.
 */
export const createSseRouter = ({
  mcpService,
  httpAuth,
}: {
  mcpService: McpService;
  httpAuth: HttpAuthService;
}): Router => {
  const router = PromiseRouter();
  const transportsToSessionId = new Map<string, SSEServerTransport>();

  router.get('/', async (req, res) => {
    const server = mcpService.getServer({
      credentials: await httpAuth.credentials(req),
    });

    const transport = new SSEServerTransport(
      `${req.originalUrl}/messages`,
      res,
    );

    transportsToSessionId.set(transport.sessionId, transport);

    res.on('close', () => {
      transportsToSessionId.delete(transport.sessionId);
    });

    await server.connect(transport);
  });

  router.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      throw new InputError('sessionId is required');
    }

    const transport = transportsToSessionId.get(sessionId);
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      throw new NotFoundError(
        `No transport found for sessionId "${sessionId}"`,
      );
    }
  });
  return router;
};
