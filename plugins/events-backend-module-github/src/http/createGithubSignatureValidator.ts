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

import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';
import { verify } from '@octokit/webhooks-methods';
import { createAppIdResolver } from '../util/createAppIdResolver';
import { OctokitProviderService } from '../util/octokitProviderService';

/**
 * Validates that the request received is the expected GitHub request
 * using the signature received with the `x-hub-signature-256` header
 * which is based on a secret token configured at GitHub and here.
 *
 * See https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks
 * for more details.
 *
 * @param config - root config
 * @public
 */
export function createGithubSignatureValidator(
  config: Config,
  octokitProvider: OctokitProviderService,
): RequestValidator | undefined {
  const integrations = ScmIntegrations.fromConfig(config);

  // GitHub App installation ID to secret
  const githubAppSecrets = new Map<number, string>();
  for (const integration of integrations.github.list()) {
    for (const { appId, webhookSecret } of integration.config.apps ?? []) {
      if (appId && webhookSecret) {
        githubAppSecrets.set(appId, webhookSecret);
      }
    }
  }

  // A single optional secret for all GitHub events
  const genericSecret = config.getOptionalString(
    'events.modules.github.webhookSecret',
  );

  if (!genericSecret && githubAppSecrets.size === 0) {
    return undefined;
  }

  const appIdResolver = createAppIdResolver(octokitProvider);

  return async (
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> => {
    const signature = request.headers['x-hub-signature-256'] as
      | string
      | undefined;

    if (signature) {
      const body = request.raw.body.toString(request.raw.encoding);

      if (githubAppSecrets.size) {
        const appId = await appIdResolver(request);
        if (appId && githubAppSecrets.has(appId)) {
          if (await verify(githubAppSecrets.get(appId)!, body, signature)) {
            return;
          }
        }
      }

      if (genericSecret) {
        if (await verify(genericSecret, body, signature)) {
          return;
        }
      }
    }

    context.reject({
      status: 403,
      payload: { message: 'invalid signature' },
    });
  };
}
