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
} from '@backstage/backend-plugin-api';
import { RequestHandler } from 'express';
import { pathToRegexp } from 'path-to-regexp';

export function createPathPolicyPredicate(policyPath: string) {
  if (policyPath === '/' || policyPath === '*') {
    return () => true;
  }

  const pathRegex = pathToRegexp(policyPath, undefined, {
    end: false,
  });

  return (path: string): boolean => {
    return pathRegex.test(path);
  };
}

export function createCredentialsBarrier(options: {
  httpAuth: HttpAuthService;
}): {
  middleware: RequestHandler;
  addAuthPolicy: (policy: HttpRouterServiceAuthPolicy) => void;
} {
  const { httpAuth } = options;

  const unauthenticatedPredicates = new Array<(path: string) => boolean>();
  const cookiePredicates = new Array<(path: string) => boolean>();

  const middleware: RequestHandler = async (req, _, next) => {
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

    await httpAuth.credentials(req, {
      allow: ['user', 'service'],
      allowedAuthMethods: allowsCookie ? ['token', 'cookie'] : ['token'],
    });

    next();
  };

  const addAuthPolicy = (policy: HttpRouterServiceAuthPolicy) => {
    if (policy.allow === 'unauthenticated') {
      unauthenticatedPredicates.push(createPathPolicyPredicate(policy.path));
    } else if (policy.allow === 'user-cookie') {
      cookiePredicates.push(createPathPolicyPredicate(policy.path));
    }

    throw new Error('Invalid auth policy');
  };

  return { middleware, addAuthPolicy };
}
