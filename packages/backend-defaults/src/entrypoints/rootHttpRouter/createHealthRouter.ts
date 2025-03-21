/*
 * Copyright 2024 The Backstage Authors
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

import {
  RootConfigService,
  RootHealthService,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import { Request, Response } from 'express';

const HEADER_CONFIG_KEY = 'backend.health.headers';

/**
 * @public
 */
export function createHealthRouter(options: {
  health: RootHealthService;
  config: RootConfigService;
}) {
  const headersConfig = options.config
    .getOptionalConfig(HEADER_CONFIG_KEY)
    ?.get();
  if (headersConfig) {
    for (const [key, value] of Object.entries(headersConfig)) {
      if (!key || typeof key !== 'string') {
        throw new Error(
          `Invalid header name in at ${HEADER_CONFIG_KEY}, must be a non-empty string`,
        );
      }
      if (!value || typeof value !== 'string') {
        throw new Error(
          `Invalid header value in at ${HEADER_CONFIG_KEY}, must be a non-empty string`,
        );
      }
    }
  }
  const headers = headersConfig && new Headers(headersConfig as HeadersInit);

  const router = Router();

  router.get(
    '/.backstage/health/v1/readiness',
    async (_request: Request, response: Response) => {
      const { status, payload } = await options.health.getReadiness();
      if (headers) {
        response.setHeaders(headers);
      }
      response.status(status).json(payload);
    },
  );

  router.get(
    '/.backstage/health/v1/liveness',
    async (_request: Request, response: Response) => {
      const { status, payload } = await options.health.getLiveness();
      if (headers) {
        response.setHeaders(headers);
      }
      response.status(status).json(payload);
    },
  );

  return router;
}
