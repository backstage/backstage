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
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Validates that the request received is the expected Gitea request
 * using the signature received with the `x-gitea-signature` header
 * which is based on a secret token configured at Gitea and here.
 *
 * See https://docs.gitea.com/usage/webhooks
 * for more details.
 *
 * @param config - root config
 * @public
 */
export function createGiteaSignatureValidator(
  config: Config,
): RequestValidator | undefined {
  const secret = config.getOptionalString('events.modules.gitea.webhookSecret');

  if (!secret) {
    return undefined;
  }

  return async (
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> => {
    const signature = request.headers['x-gitea-signature'] as
      | string
      | undefined;

    if (signature) {
      const expected = createHmac('sha256', secret)
        .update(request.raw.body)
        .digest();
      const received = Buffer.from(signature, 'hex');

      if (
        received.length === expected.length &&
        timingSafeEqual(received, expected)
      ) {
        return;
      }
    }

    context.reject({
      status: 403,
      payload: { message: 'invalid signature' },
    });
  };
}
