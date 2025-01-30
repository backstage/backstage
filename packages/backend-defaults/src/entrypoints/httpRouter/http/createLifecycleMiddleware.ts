/*
 * Copyright 2022 The Backstage Authors
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
  RootConfigService,
  LifecycleService,
} from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { ServiceUnavailableError } from '@backstage/errors';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { RequestHandler } from 'express';

export const DEFAULT_TIMEOUT = { seconds: 5 };

/**
 * Options for {@link createLifecycleMiddleware}.
 * @public
 */
export interface LifecycleMiddlewareOptions {
  config: RootConfigService;
  lifecycle: LifecycleService;
}

/**
 * Creates a middleware that pauses requests until the service has started.
 *
 * @remarks
 *
 * Requests that arrive before the service has started will be paused until startup is complete.
 * If the service does not start within the provided timeout, the request will be rejected with a
 * {@link @backstage/errors#ServiceUnavailableError}.
 *
 * If the service is shutting down, all requests will be rejected with a
 * {@link @backstage/errors#ServiceUnavailableError}.
 *
 * @public
 */
export function createLifecycleMiddleware(
  options: LifecycleMiddlewareOptions,
): RequestHandler {
  const { config, lifecycle } = options;

  let state: 'init' | 'up' | 'down' = 'init';
  const waiting = new Set<{
    next: (err?: Error) => void;
    timeout: NodeJS.Timeout;
  }>();

  lifecycle.addStartupHook(async () => {
    if (state === 'init') {
      state = 'up';
      for (const item of waiting) {
        clearTimeout(item.timeout);
        item.next();
      }
      waiting.clear();
    }
  });

  lifecycle.addShutdownHook(async () => {
    state = 'down';

    for (const item of waiting) {
      clearTimeout(item.timeout);
      item.next(new ServiceUnavailableError('Service is shutting down'));
    }
    waiting.clear();
  });

  let startupRequestPauseTimeout: HumanDuration = DEFAULT_TIMEOUT;

  if (config.has('backend.lifecycle.startupRequestPauseTimeout')) {
    startupRequestPauseTimeout = readDurationFromConfig(config, {
      key: 'backend.lifecycle.startupRequestPauseTimeout',
    });
  }

  const timeoutMs = durationToMilliseconds(startupRequestPauseTimeout);

  return (_req, _res, next) => {
    if (state === 'up') {
      next();
      return;
    } else if (state === 'down') {
      next(new ServiceUnavailableError('Service is shutting down'));
      return;
    }

    const item = {
      next,
      timeout: setTimeout(() => {
        if (waiting.delete(item)) {
          next(new ServiceUnavailableError('Service has not started up yet'));
        }
      }, timeoutMs),
    };

    waiting.add(item);
  };
}
