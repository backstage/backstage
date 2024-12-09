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

import {
  HttpAuthService,
  HttpRouterServiceAuthPolicy,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { RequestHandler } from 'express';
import { pathToRegexp } from 'path-to-regexp';

export function createPathPolicyPredicate(policyPath: string) {
  if (policyPath === '/' || policyPath === '*') {
    return () => true;
  }

  const { regexp: pathRegex } = pathToRegexp(policyPath, {
    end: false,
  });

  return (path: string): boolean => {
    return pathRegex.test(path);
  };
}

/**
 * @public
 */
export function createCredentialsBarrier(options: {
  httpAuth: HttpAuthService;
  config: RootConfigService;
}): {
  middleware: RequestHandler;
  addAuthPolicy: (policy: HttpRouterServiceAuthPolicy) => void;
} {
  const { httpAuth, config } = options;

  const disableDefaultAuthPolicy = config.getOptionalBoolean(
    'backend.auth.dangerouslyDisableDefaultAuthPolicy',
  );

  if (disableDefaultAuthPolicy) {
    return {
      middleware: (_req, _res, next) => next(),
      addAuthPolicy: () => {},
    };
  }

  const unauthenticatedPredicates = new Array<(path: string) => boolean>();
  const cookiePredicates = new Array<(path: string) => boolean>();

  const middleware: RequestHandler = (req, _, next) => {
    const allowsUnauthenticated = unauthenticatedPredicates.some(predicate =>
      predicate(req.path),
    );

    if (allowsUnauthenticated) {
      next();
      return;
    }

    const allowsCookie = cookiePredicates.some(predicate =>
      predicate(req.path),
    );

    httpAuth
      .credentials(req, {
        allow: ['user', 'service'],
        allowLimitedAccess: allowsCookie,
      })
      .then(
        () => next(),
        err => next(err),
      );
  };

  const addAuthPolicy = (policy: HttpRouterServiceAuthPolicy) => {
    if (policy.allow === 'unauthenticated') {
      unauthenticatedPredicates.push(createPathPolicyPredicate(policy.path));
    } else if (policy.allow === 'user-cookie') {
      cookiePredicates.push(createPathPolicyPredicate(policy.path));
    } else {
      throw new Error('Invalid auth policy');
    }
  };

  return { middleware, addAuthPolicy };
}
