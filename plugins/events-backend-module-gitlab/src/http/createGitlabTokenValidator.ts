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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';
import { timingSafeEqual } from 'node:crypto';

/**
 * Validates a configured secret token against the token received with the `x-gitlab-token` header.
 *
 * See https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#validate-payloads-by-using-a-secret-token
 * for more details.
 *
 * @param config - root config
 * @param logger - logger used to report the module's authentication setup at startup
 * @public
 */
export function createGitlabTokenValidator(
  config: Config,
  logger: LoggerService,
): RequestValidator {
  const secret = config.getOptionalString(
    'events.modules.gitlab.webhookSecret',
  );

  const dangerouslyAllowUnauthenticatedEvents =
    config.getOptionalBoolean(
      'events.modules.gitlab.dangerouslyAllowUnauthenticatedEvents',
    ) ?? false;

  if (!secret) {
    if (dangerouslyAllowUnauthenticatedEvents) {
      logger.warn(
        'dangerouslyAllowUnauthenticatedEvents is enabled for the GitLab events module; incoming webhook events will be accepted without authentication',
      );
      return async () => {};
    }

    logger.warn(
      "No webhook secret is configured for the GitLab events module; incoming webhook events will be rejected with 403. Set 'events.modules.gitlab.webhookSecret' to enable authentication, or set 'events.modules.gitlab.dangerouslyAllowUnauthenticatedEvents' to true to accept unauthenticated events",
    );
    return async (
      _request: RequestDetails,
      context: RequestValidationContext,
    ): Promise<void> => {
      context.reject({
        status: 403,
        payload: { message: 'webhook secret not configured' },
      });
    };
  }

  const secretBuffer = Buffer.from(secret);

  return async (
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> => {
    const raw = request.headers['x-gitlab-token'];
    const token = Array.isArray(raw) ? raw[0] : raw;

    const tokenBuffer =
      typeof token === 'string' ? Buffer.from(token) : undefined;

    if (
      tokenBuffer &&
      tokenBuffer.length === secretBuffer.length &&
      timingSafeEqual(tokenBuffer, secretBuffer)
    ) {
      return;
    }

    context.reject({
      status: 403,
      payload: { message: 'invalid token' },
    });
  };
}
