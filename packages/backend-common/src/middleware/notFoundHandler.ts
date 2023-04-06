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

import { MiddlewareFactory } from '@backstage/backend-app-api';
import { ConfigReader } from '@backstage/config';
import { RequestHandler } from 'express';
import { getRootLogger } from '../logging';

/**
 * Express middleware to handle requests for missing routes.
 *
 * Should be used as the very last handler in the chain, as it unconditionally
 * returns a 404 status.
 *
 * @public
 * @returns An Express request handler
 */
export function notFoundHandler(): RequestHandler {
  return MiddlewareFactory.create({
    config: new ConfigReader({}),
    logger: getRootLogger(),
  }).notFound();
}
