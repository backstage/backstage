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

import type { OAuthCredential } from '@earendil-works/pi-ai';
import type { AiAuthModule } from '@backstage/ai-node/modules';
import { anthropicAuthModule } from './anthropicAuth';

const ENDPOINT = 'https://token.example/v1/oauth/token';

const CREDENTIAL: OAuthCredential = {
  type: 'oauth',
  refresh: 'refresh-secret-value',
  access: 'access-secret-value',
  expires: Date.now() - 1_000,
};

function refreshInput() {
  return {
    endpoint: ENDPOINT,
    providerId: 'anthropic',
    clientId: 'client-id-value',
    credential: CREDENTIAL,
  };
}

function exchangeInput() {
  return {
    endpoint: ENDPOINT,
    providerId: 'anthropic',
    clientId: 'client-id-value',
    code: 'authorization-code-value',
    codeVerifier: 'pkce-verifier-value',
    redirectUri: 'https://example.test/callback',
  };
}

async function validate(request: Request, endpoint = ENDPOINT) {
  return anthropicAuthModule.validateTokenRequest({
    operation: 'auth.token',
    endpoint,
    request,
  });
}

function formBody(fields: Record<string, string>): Request {
  return new Request(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
}

function tokenResponseBody(overrides: Record<string, unknown> = {}) {
  return {
    access_token: 'new-access-value',
    refresh_token: 'new-refresh-value',
    expires_in: 3600,
    account: 'acct-1',
    account_id: 'acct-id-1',
    id_token: 'id-token-never-copied',
    ...overrides,
  };
}

describe('anthropicAuthModule', () => {
  it('builds the refresh request as a JSON POST on the token route', async () => {
    const request = anthropicAuthModule.refreshRequest(refreshInput());
    expect(request.method).toBe('POST');
    expect(request.url).toBe(ENDPOINT);
    expect(request.headers.get('content-type')).toBe('application/json');
    expect(JSON.parse(await request.clone().text())).toEqual({
      grant_type: 'refresh_token',
      refresh_token: 'refresh-secret-value',
      client_id: 'client-id-value',
    });
  });

  it('builds the login exchange request with the code grant fields', async () => {
    const request = anthropicAuthModule.exchangeRequest(exchangeInput());
    expect(JSON.parse(await request.clone().text())).toEqual({
      grant_type: 'authorization_code',
      code: 'authorization-code-value',
      redirect_uri: 'https://example.test/callback',
      client_id: 'client-id-value',
      code_verifier: 'pkce-verifier-value',
    });
    await anthropicAuthModule.validateTokenRequest({
      operation: 'auth.token-exchange',
      endpoint: ENDPOINT,
      request,
    });
  });

  it('accepts its own refresh request on the exact destination', async () => {
    await validate(anthropicAuthModule.refreshRequest(refreshInput()));
  });

  it('rejects requests off the reserved token route', async () => {
    const request = anthropicAuthModule.refreshRequest(refreshInput());
    await expect(
      validate(request, 'https://token.example/oauth/token'),
    ).rejects.toThrow(/endpoint/);
    await expect(
      validate(
        new Request(`${ENDPOINT}?tenant=1`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: 'r',
            client_id: 'c',
          }),
        }),
      ),
    ).rejects.toThrow(/endpoint/);
  });

  it('rejects a form-encoded body', async () => {
    await expect(
      validate(
        formBody({
          grant_type: 'refresh_token',
          refresh_token: 'refresh-secret-value',
          client_id: 'client-id-value',
        }),
      ),
    ).rejects.toThrow(/encoding/);
  });

  it('rejects an unsupported grant field or wrong grant type', async () => {
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: 'refresh-secret-value',
            client_id: 'client-id-value',
            client_secret: 'never-allowed',
          }),
        }),
      ),
    ).rejects.toThrow(/unsupported field/);
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            refresh_token: 'refresh-secret-value',
            client_id: 'client-id-value',
          }),
        }),
      ),
    ).rejects.toThrow(/grant type/);
  });

  it('rejects a body over the 8 KiB cap', async () => {
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: 'x'.repeat(9 * 1024),
            client_id: 'c',
          }),
        }),
      ),
    ).rejects.toThrow(/limit/);
  });

  it('rotates the credential through the token response and copies only declared fields', () => {
    const rotated = anthropicAuthModule.parseTokenResponse({
      body: tokenResponseBody(),
      previous: CREDENTIAL,
      now: 1_000_000,
      operation: 'auth.token',
    });
    expect(rotated).toMatchObject({
      type: 'oauth',
      access: 'new-access-value',
      refresh: 'new-refresh-value',
      account: 'acct-1',
      account_id: 'acct-id-1',
      expires: 1_000_000 + 3_600_000,
    });
    expect(rotated).not.toHaveProperty('id_token');
  });

  it('keeps the previous refresh token when the response omits it', () => {
    const rotated = anthropicAuthModule.parseTokenResponse({
      body: tokenResponseBody({ refresh_token: undefined }),
      previous: CREDENTIAL,
      now: 1_000_000,
      operation: 'auth.token',
    });
    expect(rotated.refresh).toBe('refresh-secret-value');
    expect(rotated.access).toBe('new-access-value');
  });

  it('fails closed on unusable token responses', () => {
    const cases: unknown[] = [
      null,
      'string',
      tokenResponseBody({ access_token: '' }),
      tokenResponseBody({ access_token: undefined }),
      tokenResponseBody({ expires_in: 0 }),
      tokenResponseBody({ expires_in: '3600' }),
      tokenResponseBody({ refresh_token: '' }),
    ];
    for (const body of cases) {
      expect(() =>
        anthropicAuthModule.parseTokenResponse({
          body,
          previous: CREDENTIAL,
          now: 1_000_000,
          operation: 'auth.token',
        }),
      ).toThrow();
    }
  });
});

describe('anthropicAuthModule registration shape', () => {
  it('declares the id, route and encoding the guard validates against', () => {
    const module: AiAuthModule = { ...anthropicAuthModule };
    expect(module.id).toBe('anthropic');
    expect(anthropicAuthModule).toMatchObject({
      id: 'anthropic',
      tokenPath: '/v1/oauth/token',
      body: 'json',
    });
  });
});
