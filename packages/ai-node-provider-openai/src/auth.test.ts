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
import { openaiAuthModule } from './auth';
import type { AiAuthModule } from '@backstage/ai-node/modules';

const ENDPOINT = 'https://token.example/oauth/token';

const CREDENTIAL: OAuthCredential = {
  type: 'oauth',
  refresh: 'refresh-secret-value',
  access: 'access-secret-value',
  expires: Date.now() - 1_000,
};

function refreshInput() {
  return {
    endpoint: ENDPOINT,
    providerId: 'openai',
    clientId: 'client-id-value',
    credential: CREDENTIAL,
  };
}

function exchangeInput() {
  return {
    endpoint: ENDPOINT,
    providerId: 'openai',
    clientId: 'client-id-value',
    code: 'authorization-code-value',
    codeVerifier: 'pkce-verifier-value',
    redirectUri: 'https://example.test/callback',
  };
}

async function validate(request: Request, endpoint = ENDPOINT) {
  return openaiAuthModule.validateTokenRequest({
    operation: 'auth.token',
    endpoint,
    request,
  });
}

function tokenResponseBody(overrides: Record<string, unknown> = {}) {
  return {
    access_token: 'new-access-value',
    refresh_token: 'new-refresh-value',
    expires_in: 3600,
    account_id: 'acct-1',
    chatgpt_account_id: 'chatgpt-acct-1',
    id_token: 'id-token-never-copied',
    ...overrides,
  };
}

describe('openaiAuthModule', () => {
  it('builds the refresh request as a form-encoded POST on the token route', async () => {
    const request = openaiAuthModule.refreshRequest(refreshInput());
    expect(request.method).toBe('POST');
    expect(request.url).toBe(ENDPOINT);
    expect(request.headers.get('content-type')).toBe(
      'application/x-www-form-urlencoded',
    );
    expect(new URLSearchParams(await request.clone().text())).toEqual(
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: 'refresh-secret-value',
        client_id: 'client-id-value',
      }),
    );
  });

  it('builds the login exchange request with the code grant fields', async () => {
    const request = openaiAuthModule.exchangeRequest(exchangeInput());
    expect(new URLSearchParams(await request.clone().text())).toEqual(
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: 'authorization-code-value',
        redirect_uri: 'https://example.test/callback',
        client_id: 'client-id-value',
        code_verifier: 'pkce-verifier-value',
      }),
    );
    await openaiAuthModule.validateTokenRequest({
      operation: 'auth.token-exchange',
      endpoint: ENDPOINT,
      request,
    });
  });

  it('accepts its own refresh request on the exact destination', async () => {
    await validate(openaiAuthModule.refreshRequest(refreshInput()));
  });

  it('rejects requests off the reserved token route', async () => {
    const request = openaiAuthModule.refreshRequest(refreshInput());
    await expect(
      validate(request, 'https://token.example/v1/oauth/token'),
    ).rejects.toThrow(/endpoint/);
    await expect(
      validate(
        new Request(`${ENDPOINT}?tenant=1`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: 'r',
            client_id: 'c',
          }).toString(),
        }),
      ),
    ).rejects.toThrow(/endpoint/);
  });

  it('rejects a JSON-encoded body', async () => {
    const request = new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: 'refresh-secret-value',
        client_id: 'client-id-value',
      }),
    });
    await expect(validate(request)).rejects.toThrow(/encoding/);
  });

  it('rejects an unsupported grant field or wrong grant type', async () => {
    const base = {
      grant_type: 'refresh_token',
      refresh_token: 'refresh-secret-value',
      client_id: 'client-id-value',
    };
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            ...base,
            client_secret: 'never-allowed',
          }).toString(),
        }),
      ),
    ).rejects.toThrow(/unsupported field/);
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            ...base,
            grant_type: 'authorization_code',
          }).toString(),
        }),
      ),
    ).rejects.toThrow(/grant type/);
  });

  it('rejects a body over the 8 KiB cap', async () => {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: 'x'.repeat(9 * 1024),
      client_id: 'c',
    }).toString();
    await expect(
      validate(
        new Request(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body,
        }),
      ),
    ).rejects.toThrow(/limit/);
  });

  it('rotates the credential through the token response and copies only declared fields', () => {
    const rotated = openaiAuthModule.parseTokenResponse({
      body: tokenResponseBody(),
      previous: CREDENTIAL,
      now: 1_000_000,
      operation: 'auth.token',
    });
    expect(rotated).toMatchObject({
      type: 'oauth',
      access: 'new-access-value',
      refresh: 'new-refresh-value',
      account_id: 'acct-1',
      chatgpt_account_id: 'chatgpt-acct-1',
      expires: 1_000_000 + 3_600_000,
    });
    expect(rotated).not.toHaveProperty('id_token');
  });

  it('keeps the previous refresh token when the response omits it', () => {
    const rotated = openaiAuthModule.parseTokenResponse({
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
        openaiAuthModule.parseTokenResponse({
          body,
          previous: CREDENTIAL,
          now: 1_000_000,
          operation: 'auth.token',
        }),
      ).toThrow();
    }
  });
});

describe('openaiAuthModule registration shape', () => {
  it('declares the id, route and encoding the guard validates against', () => {
    const { refreshRequest, ...rest } = openaiAuthModule;
    expect(rest).toMatchObject({
      id: 'openai',
      tokenPath: '/oauth/token',
      body: 'form',
    });
    expect(typeof refreshRequest).toBe('function');
    // The module must be frozen-safe for host registries: a shallow copy
    // registered under the same id is still a duplicate.
    const module: AiAuthModule = { ...openaiAuthModule };
    expect(module.id).toBe(openaiAuthModule.id);
  });
});
