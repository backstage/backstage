/*
 * Copyright 2026 The Backstage Authors
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
 * Validates incoming Azure DevOps webhook requests
 * using a shared secret sent via the `x-ado-webhook-secret` header.
 *
 * Configure the same secret in the Azure DevOps service hook
 * subscription (under HTTP Headers) and in the Backstage app-config
 * at `events.modules.azureDevOps.webhookSecret`.
 *
 * @param config - root config
 * @public
 */
export function createAzureDevOpsWebhookValidator(
  config: Config,
  logger?: LoggerService,
): RequestValidator {
  const secret = config.getOptionalString(
    'events.modules.azureDevOps.webhookSecret',
  );

  const dangerouslyAllowUnauthenticatedEvents =
    config.getOptionalBoolean(
      'events.modules.azureDevOps.dangerouslyAllowUnauthenticatedEvents',
    ) ?? false;

  if (!secret) {
    if (dangerouslyAllowUnauthenticatedEvents) {
      return async () => {};
    }

    return async (
      _request: RequestDetails,
      context: RequestValidationContext,
    ): Promise<void> => {
      const msg =
        "Rejecting incoming unsigned Azure DevOps event. Webhook secrets are required by default unless 'events.modules.azureDevOps.dangerouslyAllowUnauthenticatedEvents' is explicitly set to true.";
      if (logger) {
        logger.warn(msg);
      } else {
        // eslint-disable-next-line no-console
        console.warn(msg);
      }
      context.reject({
        status: 403,
        payload: { message: 'invalid webhook secret' },
      });
    };
  }

  const secretBuffer = Buffer.from(secret);

  return async (
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> => {
    const raw = request.headers['x-ado-webhook-secret'];
    const headerSecret = Array.isArray(raw) ? raw[0] : raw;

    const headerBuffer =
      typeof headerSecret === 'string' ? Buffer.from(headerSecret) : undefined;

    if (
      headerBuffer &&
      headerBuffer.length === secretBuffer.length &&
      timingSafeEqual(headerBuffer, secretBuffer)
    ) {
      return;
    }

    context.reject({
      status: 403,
      payload: { message: 'invalid webhook secret' },
    });
  };
}
