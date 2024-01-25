/*
 * Copyright 2024 The Backstage Authors
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

import { createServiceFactory } from '@backstage/backend-plugin-api';
import {
  httpAuthServiceRef,
  HttpAuthService,
  HttpAuthServiceMiddlewareOptions,
  BackstageCredentials,
  AuthService,
  authServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { Handler, Request } from 'express';

/*

# IDEAS

- Ship some form of authenticating router for plugins to use `BackstageRouter`?
- Hardcode paths for different type of access
- Use a middleware that authenticates requests
- Could we use permissions to restrict access to service identities? e.g. issuing a service token with only the "catalog register" permission
- Rather than middleware + request accessor, create a "guard" for a particular type of auth that then is used both as middleware and to access the identity

# CONSTRAINTS

- User cookie auth and unauthenticated access


# TODO

- Implement the authentication middleware that we install in the plugin router

# CANDIDATES

- app-backend
- badges
- techdocs
- signals

*/

const credentialsSymbol = Symbol('request-credentials');

type RequestWithIdentity = Request & {
  [credentialsSymbol]?: BackstageCredentials;
};

class DefaultHttpAuthService implements HttpAuthService {
  #auth: AuthService;

  constructor(options: { auth: AuthService }) {
    this.#auth = options.auth;
  }

  createHttpPluginRouterMiddleware(): Handler {
    return (req: RequestWithIdentity, _res, next) => {
      this.#getRequestCredentials(req).then(
        credentials => {
          req[credentialsSymbol] = credentials;
          next();
        },
        error => {
          next(error);
        },
      );
    };
  }

  middleware(options?: HttpAuthServiceMiddlewareOptions | undefined): Handler {
    return (req: RequestWithIdentity, _res, next) => {
      const credentials = req[credentialsSymbol];
      if (!credentials) {
        if (options?.allow.includes('unauthorized')) {
          next();
        } else {
          next(
            new AuthenticationError(
              'This endpoint does not permit anonymous access',
            ),
          );
        }
      } else if (credentials.user && options?.allow.includes('user')) {
        next();
      } else if (credentials.plugin && options?.allow.includes('service')) {
        next();
      } else {
        next(
          new NotAllowedError(
            'The provided credentials do not provide access to this endpoint',
          ),
        );
      }
    };
  }

  credentials(req: RequestWithIdentity): BackstageCredentials {
    const credentials = req[credentialsSymbol];
    if (!credentials) {
      throw new AuthenticationError('No credentials found');
    }
    return credentials;
  }

  async #getRequestCredentials(
    req: Request,
  ): Promise<BackstageCredentials | undefined> {
    const token = getBearerTokenFromAuthorizationHeader(
      req.headers.authorization,
    );
    if (!token) {
      return undefined;
    }

    return this.#auth.authenticate(token);
  }
}

/** @alpha */
export const httpAuthServiceFactory = createServiceFactory({
  service: httpAuthServiceRef,
  deps: {
    auth: authServiceRef,
  },
  factory({ auth }) {
    return new DefaultHttpAuthService({ auth });
  },
});
