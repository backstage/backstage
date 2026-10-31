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

import { Config } from '@backstage/config';
import {
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';
import { timingSafeEqual } from 'crypto';

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
): RequestValidator | undefined {
  const secret = config.getOptionalString(
    'events.modules.azureDevOps.webhookSecret',
  );

  if (!secret) {
    return undefined;
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
