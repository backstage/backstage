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
  CacheService,
  HttpAuthService,
  HttpRouterServiceAuthPolicy,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { durationToMilliseconds } from '@backstage/types';
import { RequestHandler } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { rateLimit } from 'express-rate-limit';
import { readDurationFromConfig } from '@backstage/config';
import { RateLimitStore } from './rateLimitStore';

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
  config: RootConfigService;
  cache: CacheService;
}): {
  middleware: RequestHandler;
  addAuthPolicy: (policy: HttpRouterServiceAuthPolicy) => void;
} {
  const { httpAuth, config, cache } = options;

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

  const rateLimitConfig = config.getOptional('backend.rateLimit.unauthorized');

  const disabled =
    rateLimitConfig === false ||
    (typeof rateLimitConfig === 'object' &&
      config?.getOptionalBoolean('backend.rateLimit.unauthorized.disabled') ===
        true);

  const duration =
    typeof rateLimitConfig === 'object' &&
    config?.has('backend.rateLimit.unauthorized.window')
      ? readDurationFromConfig(
          config.getConfig('backend.rateLimit.unauthorized.window'),
        )
      : undefined;

  const windowMs = duration ? durationToMilliseconds(duration) : 1 * 60 * 1000;

  const max =
    typeof rateLimitConfig === 'object' &&
    config?.has('backend.rateLimit.unauthorized.max')
      ? config.getNumber('backend.rateLimit.unauthorized.max')
      : 60;

  // Default rate limit is 60 requests per 1 minute
  const limiter = rateLimit({
    windowMs,
    limit: max,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    store: RateLimitStore.fromOptions({ cache }),
    skip() {
      return disabled;
    },
  });

  const middleware: RequestHandler = (req, res, next) => {
    const allowsUnauthenticated = unauthenticatedPredicates.some(predicate =>
      predicate(req.path),
    );

    if (allowsUnauthenticated) {
      limiter(req, res, next);
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
