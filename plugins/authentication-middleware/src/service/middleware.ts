/*
 * Copyright 2020 The Backstage Authors
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

import { RequestHandler } from 'express';
import { nullMiddlewareProvider } from '../providers';
import { MiddlewareOptions, AuthenticatedBackstageRequest } from './types';

export async function createMiddleware(
  options: MiddlewareOptions,
): Promise<RequestHandler> {
  const { logger } = options;

  const authenticationMiddlewareProvider =
    options.authenticationMiddlewareProvider || nullMiddlewareProvider;

  logger.info('Setting up auth middleware');
  return async (req: AuthenticatedBackstageRequest, _res, next) => {
    req.backstage = req.backstage || {};
    req.backstage.identity = await authenticationMiddlewareProvider(req);
    next();
  };
}
