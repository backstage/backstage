/*
 * Copyright 2020 Spotify AB
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

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

/**
 * Express middleware to handle errors during request processing.
 *
 * This is commonly the second to last middleware in the chain (before the
 * notFoundHandler).
 *
 * Its primary purpose is not to do translation of business logic exceptions,
 * but rather to be a gobal catch-all for uncaught "fatal" errors that are
 * expected to result in a 500 error. However, it also does handle some common
 * error types (such as http-error exceptions) and returns the enclosed status
 * code accordingly.
 *
 * @returns An Express error request handler
 */
export function errorHandler(): ErrorRequestHandler {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  return (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    const status = getStatusCode(error);
    const message = error.message;
    response.status(status).send(message);
  };
}

function getStatusCode(error: Error): number {
  const knownStatusCodeFields = ['statusCode', 'status'];

  for (const field of knownStatusCodeFields) {
    const statusCode = (error as any)[field];
    if (
      typeof statusCode === 'number' &&
      (statusCode | 0) === statusCode && // is whole integer
      statusCode >= 100 &&
      statusCode <= 599
    ) {
      return statusCode;
    }
  }

  return 500;
}
