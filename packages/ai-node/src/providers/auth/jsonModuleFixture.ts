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

import type { AiAuthModule } from './types';
import {
  assertTokenRequest,
  createTokenRequest,
  parseOAuthTokenResponse,
} from './modules';

/**
 * A JSON-bodied token module for core tests.
 *
 * @remarks
 * The Anthropic auth module moved to its own package, so the core suites keep
 * a local module built from the same authoring helpers. It is not part of the
 * service and is never exported.
 *
 * @internal
 */
export const jsonAuthModule: AiAuthModule = {
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
