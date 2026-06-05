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
import { TemplateGenerationService } from '../services/TemplateGenerationService';
import { TemplateValidator } from '../services/TemplateValidator';

/**
 * Builds the express router exposing `POST /v1/generate`.
 * @internal
 */
export function createRouter(options: {
  generationService: TemplateGenerationService;
  validator: TemplateValidator;
  httpAuth: HttpAuthService;
  logger: LoggerService;
}): Router {
  const { generationService, validator, httpAuth, logger } = options;
  const router = Router();
  router.use(express.json({ limit: '512kb' }));

  router.post(
    '/v1/generate',
    asyncHandler(async (req, res) => {
      const body = req.body as
        | { description?: unknown; referenceTemplates?: unknown }
        | undefined;
      if (!body || typeof body.description !== 'string') {
        throw new InputError(
          'Request body must include a string `description`',
        );
      }
      const referenceRefs = parseRefs(body.referenceTemplates);

      const credentials = await httpAuth.credentials(req, {
        allow: ['user', 'service'],
      });

      const start = Date.now();
      const generation = await generationService.generate({
        description: body.description,
        referenceRefs,
        credentials: {
          token: (credentials as { token?: string }).token,
        },
      });
      const validation = validator.check(generation.template);
      logger.info(
        `template-authoring: generated template '${
          generation.template.metadata.name
        }' in ${Date.now() - start}ms (${
          validation.warnings.length
        } validation warnings)`,
      );

      res.json({
        yaml: generation.yaml,
        template: generation.template,
        citations: generation.citations,
        warnings: [...generation.warnings, ...validation.warnings],
      });
    }),
  );

  return router;
}

function parseRefs(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new InputError('`referenceTemplates` must be an array of strings');
  }
  for (const v of value) {
    if (typeof v !== 'string') {
      throw new InputError(
        '`referenceTemplates` must be an array of entity-ref strings',
      );
    }
  }
  return value as string[];
}

// Express 4 does not surface async handler rejections to error middleware on
// its own; this wrapper bridges that gap.
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
