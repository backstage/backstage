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

import { ErrorRequestHandler } from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { getRootLogger } from '../logging';
import { ConfigReader } from '@backstage/config';
import { MiddlewareFactory } from '@backstage/backend-app-api';

/**
 * Options passed to the {@link errorHandler} middleware.
 *
 * @public
 */
export type ErrorHandlerOptions = {
  /**
   * Whether error response bodies should show error stack traces or not.
   *
   * If not specified, by default shows stack traces only in development mode.
   */
  showStackTraces?: boolean;

  /**
   * Logger instance to log errors.
   *
   * If not specified, the root logger will be used.
   */
  logger?: LoggerService;

  /**
   * Whether any 4xx errors should be logged or not.
   *
   * If not specified, default to only logging 5xx errors.
   */
  logClientErrors?: boolean;
};

/**
 * Express middleware to handle errors during request processing.
 *
 * This is commonly the very last middleware in the chain.
 *
 * Its primary purpose is not to do translation of business logic exceptions,
 * but rather to be a global catch-all for uncaught "fatal" errors that are
 * expected to result in a 500 error. However, it also does handle some common
 * error types (such as http-error exceptions) and returns the enclosed status
 * code accordingly.
 *
 * @public
 * @returns An Express error request handler
 */
export function errorHandler(
  options: ErrorHandlerOptions = {},
): ErrorRequestHandler {
  return MiddlewareFactory.create({
    config: new ConfigReader({}),
    logger: options.logger ?? getRootLogger(),
  }).error({
    logAllErrors: options.logClientErrors,
    showStackTraces: options.showStackTraces,
  });
}
