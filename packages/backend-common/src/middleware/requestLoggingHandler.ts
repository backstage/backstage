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
import { RequestHandler } from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { getRootLogger } from '../logging';
import { ConfigReader } from '@backstage/config';

/**
 * Logs incoming requests.
 *
 * @public
 * @param logger - An optional logger to use. If not specified, the root logger will be used.
 * @returns An Express request handler
 */
export function requestLoggingHandler(logger?: LoggerService): RequestHandler {
  return MiddlewareFactory.create({
    config: new ConfigReader({}),
    logger: logger ?? getRootLogger(),
  }).logging();
}
