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
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { RequestHandler } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { rateLimit } from 'express-rate-limit';
import { RateLimitStore } from './rateLimitStore';

function getUnauthorizedRateLimitConfig(config: RootConfigService): {
  max?: number | undefined;
  window?: HumanDuration | undefined;
  enabled?: true | undefined;
} {
  const value = config.getOptional<
    | true
    | {
        max?: number;
        window?: HumanDuration;
      }
  >('backend.rateLimit.unauthorized');
  if (value === undefined) {
    return {};
  }
  if (value === true) {
    return { enabled: true };
  }
  return { ...value, enabled: true };
}

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

  const isTrustedProxy =
    config.getOptional('backend.enableTrustProxy') !== undefined;
  const unauthorizedRateLimitConfig = getUnauthorizedRateLimitConfig(config);

  // Default rate limit is 150 requests per 1 minute
  const unauthorizedLimiter = rateLimit({
    windowMs: durationToMilliseconds(
      unauthorizedRateLimitConfig?.window ?? { minutes: 1 },
    ),
    limit: unauthorizedRateLimitConfig?.max ?? 150,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
    store: RateLimitStore.fromOptions({ cache }),
    validate: {},
    skip() {
      return unauthorizedRateLimitConfig?.enabled !== true;
    },
    // Preventing ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting.
    // See https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/ for more information.
    ...(isTrustedProxy ? { trustProxy: true } : {}),
  });

  const middleware: RequestHandler = (req, res, next) => {
    const allowsUnauthenticated = unauthenticatedPredicates.some(predicate =>
      predicate(req.path),
    );

    if (allowsUnauthenticated) {
      unauthorizedLimiter(req, res, next);
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
