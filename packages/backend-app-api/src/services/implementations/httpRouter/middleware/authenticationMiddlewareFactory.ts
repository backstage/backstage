/*
 * Copyright 2023 The Backstage Authors
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
import * as express from 'express';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { TokenManagerService } from '@backstage/backend-plugin-api';
import { error } from './error';
import { AuthenticationError } from '@backstage/errors';
import { userAuthenticationMiddlewareFactory } from './userAuthenticationMiddlewareFactory';
import { serviceAuthenticationMiddlewareFactory } from './serviceAuthenticationMiddlewareFactory';

export function authenticationMiddlewareFactory(
  identityApi: IdentityApi,
  tokenManager: TokenManagerService,
): express.Handler {
  const middleware = async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    const authenticateUser = userAuthenticationMiddlewareFactory(identityApi);
    const authenticateService =
      serviceAuthenticationMiddlewareFactory(tokenManager);

    try {
      await Promise.any([authenticateUser(req), authenticateService(req)]);
    } catch (err: any) {
      if (
        err instanceof AggregateError &&
        err.errors.some(e => e instanceof AuthenticationError)
      ) {
        return error(
          next,
          err.errors.filter(e => e instanceof AuthenticationError)[0],
        );
      }
      return error(next, err);
    }

    return setImmediate(next);
  };
  return middleware;
}
