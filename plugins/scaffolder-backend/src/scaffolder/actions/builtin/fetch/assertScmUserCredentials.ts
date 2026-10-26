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

import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';

const USER_TOKEN_SUPPORTED_INTEGRATION_TYPES = new Set(['github', 'gitlab']);

export function assertScmUserCredentials(options: {
  integrations: ScmIntegrations;
  requireScmUserCredentials?: boolean;
  url: string;
  baseUrl?: string;
  token?: string;
}) {
  const { integrations, requireScmUserCredentials, url, baseUrl, token } =
    options;

  if (!requireScmUserCredentials || token) {
    return;
  }

  let sourceUrl: URL | undefined;
  try {
    sourceUrl = new URL(url);
  } catch {
    if (baseUrl) {
      try {
        sourceUrl = new URL(baseUrl);
      } catch {
        // Invalid URLs are reported by the fetch helpers.
      }
    }
  }

  if (!sourceUrl) {
    return;
  }

  const integration = integrations.byUrl(sourceUrl);
  if (
    integration &&
    USER_TOKEN_SUPPORTED_INTEGRATION_TYPES.has(integration.type)
  ) {
    throw new InputError(
      `No user credentials provided for host ${sourceUrl.host}, but scaffolder.requireScmUserCredentials is enabled`,
    );
  }
}
