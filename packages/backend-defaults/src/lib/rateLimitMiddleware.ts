/*
 * Copyright 2025 The Backstage Authors
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
import { RequestHandler } from 'express';
import { rateLimit, Store } from 'express-rate-limit';
import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

export const rateLimitMiddleware = (options: {
  store?: Store;
  config?: Config;
}): RequestHandler => {
  const { store, config } = options;
  let windowMs: number = 60000;
  if (config && config.has('window')) {
    const windowDuration = readDurationFromConfig(config, {
      key: 'window',
    });
    windowMs = durationToMilliseconds(windowDuration);
  }
  const limit = config?.getOptionalNumber('incomingRequestLimit');
  const ipAllowList = config?.getOptionalStringArray('ipAllowList') ?? [
    '127.0.0.1',
    '0:0:0:0:0:0:0:1',
    '::1',
  ];
  const skipSuccessfulRequests = config?.getOptionalBoolean(
    'skipSuccessfulRequests',
  );
  const skipFailedRequests = config?.getOptionalBoolean('skipFailedRequests');
  const passOnStoreError = config?.getOptionalBoolean('passOnStoreError');

  return rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    message: {
      error: {
        name: 'Error',
        message: `Too many requests, please try again later`,
      },
      response: {
        statusCode: 429,
      },
    },
    statusCode: 429,
    skipFailedRequests,
    passOnStoreError: passOnStoreError,
    keyGenerator(req, _res): string {
      if (!req.ip) {
        return req.socket.remoteAddress!;
      }
      return req.ip;
    },
    skip: (req, _res) => {
      return (
        Boolean(req.ip && ipAllowList.includes(req.ip)) ||
        Boolean(
          req.socket.remoteAddress &&
            ipAllowList.includes(req.socket.remoteAddress),
        )
      );
    },
    validate: {
      trustProxy: false,
    },
    store,
  });
};
