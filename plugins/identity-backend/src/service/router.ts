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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { IdentityProvider } from '../types';
import { DefaultIdentityProvider } from '../providers';
import { omit } from 'lodash';

/**
 * Options for creating the identity router
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  config: Config;
  identityProvider?: IdentityProvider;
}

/**
 * Creates a route for returning details about the logged in identity.
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  const identityProvider =
    options.identityProvider || new DefaultIdentityProvider();

  router.get('/me', (request, response) => {
    response.send({
      user: omit(identityProvider.userFromRequest(request), 'token'),
    });
  });

  return router;
}
