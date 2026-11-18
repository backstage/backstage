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

import type { AiAuthModule } from '@backstage/ai-node/modules';
import {
  assertTokenRequest,
  createTokenRequest,
  parseOAuthTokenResponse,
} from '@backstage/ai-node/modules';

/**
 * Anthropic (Claude subscription) OAuth: JSON token requests on the reserved
 * `/v1/oauth/token` route. The host supplies the public client ID; no client
 * secret is ever part of a token request.
 *
 * @alpha
 */
export const anthropicAuthModule: AiAuthModule = {
  id: 'anthropic',
  tokenPath: '/v1/oauth/token',
  body: 'json',
  refreshRequest: ({ endpoint, clientId, credential }) =>
    createTokenRequest(endpoint, 'json', {
      grant_type: 'refresh_token',
      refresh_token: credential.refresh,
      client_id: clientId,
    }),
  exchangeRequest: ({ endpoint, clientId, code, codeVerifier, redirectUri }) =>
    createTokenRequest(endpoint, 'json', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  validateTokenRequest: input =>
    assertTokenRequest(input, 'json', '/v1/oauth/token'),
  parseTokenResponse: input =>
    parseOAuthTokenResponse(input, ['account', 'account_id']),
  extraFields: ['account', 'account_id'],
};
