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

import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import express, { NextFunction, Request, Response, Router } from 'express';
import { QueryService } from '../services/QueryService';

/**
 * Builds the express router exposing `POST /v1/query`.
 * @internal
 */
export function createRouter(options: {
  queryService: QueryService;
  httpAuth: HttpAuthService;
  logger: LoggerService;
}): Router {
  const { queryService, httpAuth, logger } = options;
  const router = Router();
  router.use(express.json({ limit: '256kb' }));

  router.post(
    '/v1/query',
    asyncHandler(async (req, res) => {
      const body = req.body as { question?: unknown } | undefined;
      if (!body || typeof body.question !== 'string') {
        throw new InputError('Request body must include a string `question`');
      }

      // Credential is read so a future retriever can use it to filter entities
      // the caller can actually see. Today's retriever ignores it.
      const credentials = await httpAuth.credentials(req, {
        allow: ['user', 'service'],
      });

      const start = Date.now();
      const result = await queryService.query(body.question, {
        credentials: {
          token: (credentials as { token?: string }).token,
        },
      });
      logger.info(
        `catalog-assistant: answered question in ${Date.now() - start}ms`,
      );

      res.json(result);
    }),
  );

  return router;
}

// Express 4 does not surface async handler rejections to error middleware on
// its own; this wrapper bridges that gap. Once Backstage's httpRouter applies
// its own async middleware everywhere, this can be removed.
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
