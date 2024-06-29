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

import { NextFunction, Request, Response, RequestHandler } from 'express';

/**
 * A custom status checking function, passed to {@link statusCheckHandler} and
 * {@link createStatusCheckRouter}.
 *
 * @public
 * @deprecated Migrate to the {@link https://backstage.io/docs/backend-system/ | new backend system} and use the {@link https://backstage.io/docs/backend-system/core-services/root-health | Root Health Service} instead.
 */
export type StatusCheck = () => Promise<any>;

/**
 * Options passed to {@link statusCheckHandler}.
 *
 * @public
 * @deprecated Migrate to the {@link https://backstage.io/docs/backend-system/ | new backend system} and use the {@link https://backstage.io/docs/backend-system/core-services/root-health | Root Health Service} instead.
 */
export interface StatusCheckHandlerOptions {
  /**
   * Optional status function which returns a message.
   */
  statusCheck?: StatusCheck;
}

/**
 * Express middleware for status checks.
 *
 * This is commonly used to implement healthcheck and readiness routes.
 *
 * @public
 * @param options - An optional configuration object.
 * @returns An Express error request handler
 * @deprecated Migrate to the {@link https://backstage.io/docs/backend-system/ | new backend system} and use the {@link https://backstage.io/docs/backend-system/core-services/root-health | Root Health Service} instead.
 */
export async function statusCheckHandler(
  options: StatusCheckHandlerOptions = {},
): Promise<RequestHandler> {
  const statusCheck: StatusCheck = options.statusCheck
    ? options.statusCheck
    : () => Promise.resolve({ status: 'ok' });

  return async (_request: Request, response: Response, next: NextFunction) => {
    try {
      const status = await statusCheck();
      response.status(200).json(status);
    } catch (err) {
      next(err);
    }
  };
}
