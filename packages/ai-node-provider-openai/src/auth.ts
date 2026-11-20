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
 * OpenAI (ChatGPT subscription) OAuth: form-encoded token requests on the
 * reserved `/oauth/token` route.
 *
 * @public
 */
export const openaiAuthModule: AiAuthModule = {
  id: 'openai',
  tokenPath: '/oauth/token',
  body: 'form',
  refreshRequest: ({ endpoint, clientId, credential }) =>
    createTokenRequest(endpoint, 'form', {
      grant_type: 'refresh_token',
      refresh_token: credential.refresh,
      client_id: clientId,
    }),
  exchangeRequest: ({ endpoint, clientId, code, codeVerifier, redirectUri }) =>
    createTokenRequest(endpoint, 'form', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  validateTokenRequest: input =>
    assertTokenRequest(input, 'form', '/oauth/token'),
  parseTokenResponse: input =>
    parseOAuthTokenResponse(input, ['account_id', 'chatgpt_account_id']),
  extraFields: ['account_id', 'chatgpt_account_id'],
};
