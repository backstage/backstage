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
import { NextFunction, Request, Response } from 'express';
import { RateLimitStoreFactory } from '../../../lib/RateLimitStoreFactory.ts';
import { Config } from '@backstage/config';
import { rateLimitMiddleware } from '../../../lib/rateLimitMiddleware.ts';

export const createRateLimitMiddleware = (options: {
  pluginId: string;
  config: Config;
}) => {
  const { pluginId, config } = options;
  const configKey = `backend.rateLimit.plugin.${pluginId}`;
  const enabled = config.has(configKey);
  if (!enabled) {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }

  const rateLimitOptions = config.getConfig(configKey);

  return rateLimitMiddleware({
    store: RateLimitStoreFactory.create({ config, prefix: pluginId }),
    config: rateLimitOptions,
  });
};
