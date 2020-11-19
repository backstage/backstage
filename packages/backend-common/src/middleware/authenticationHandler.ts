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

import { NextFunction, Request, RequestHandler, Response } from 'express';

export interface Authenticator {
  authenticateRequest: (request: Request) => boolean;

  // log the failed request if needed
  logRequest?: (request: Request) => void;
}

/**
 * Express middleware to authenticate requests
 *
 * @returns An Express request handler
 */
export function authenticationHandler(
  authenticator: Authenticator,
): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const validRequest = authenticator.authenticateRequest(request);
      if (!validRequest) {
        if (authenticator.logRequest) {
          authenticator.logRequest(request);
        }
        response.sendStatus(403);
      } else {
        next();
      }
    } catch (e) {
      // Reject request when authentication fails
      response.sendStatus(403);
    }
  };
}
