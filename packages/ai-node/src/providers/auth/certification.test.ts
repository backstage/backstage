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

import type { Credential } from '@earendil-works/pi-ai';
import { registerAuthCertification } from './certification';
import { createAuthOperationGuard } from './guard';
import {
  anthropicAuthModule,
  builtinAuthModuleRegistry,
  createAuthModuleRegistry,
} from './modules';
import type { AiAuthModule } from './types';

const tokenEndpoints = [
  'https://token.example/oauth/token',
  'https://token.example/v1/oauth/token',
];

function operation(
  provider: string,
  kind: 'auth.token' | 'auth.token-exchange',
) {
  return {
    actor: 'user:default/alice',
    credentials: { $$type: '@backstage/BackstageCredentials' } as never,
    provenance: {
      origin: 'verified' as const,
      conversationId: 'plugin/session',
      taskId: 'plugin/session',
      callId: `plugin/session#${kind}`,
    },
    fence: {
      namespace: { pluginId: 'plugin', sessionId: 'session' },
      owner: 'owner',
      token: '1',
    },
    definitionVersion: 'registry-v1',
    configVersion: 'config-v1',
    provider,
    operation: kind,
    destination: tokenEndpoints[provider === 'anthropic' ? 1 : 0],
    authTokenDestinations: tokenEndpoints,
    controller: new AbortController(),
  };
}

function refreshBody(provider: string): string {
  return provider === 'anthropic'
    ? JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: 'refresh-value',
        client_id: 'client-id',
      })
    : new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: 'refresh-value',
        client_id: 'client-id',
      }).toString();
}

function exchangeBody(provider: string): string {
  return provider === 'anthropic'
    ? JSON.stringify({
        grant_type: 'authorization_code',
        code: 'code-value',
        redirect_uri: 'https://example/callback',
        client_id: 'client-id',
        code_verifier: 'verifier-value',
      })
    : new URLSearchParams({
        grant_type: 'authorization_code',
        code: 'code-value',
        redirect_uri: 'https://example/callback',
        client_id: 'client-id',
        code_verifier: 'verifier-value',
      }).toString();
}

function requestFor(
  provider: string,
  kind: 'auth.token' | 'auth.token-exchange',
  options: { substituteEndpoint?: boolean; substituteQuery?: boolean } = {},
): Request {
  const op = operation(provider, kind);
  const endpoint = options.substituteEndpoint
    ? 'https://elsewhere.example/oauth/token'
    : op.destination;
  const body =
    kind === 'auth.token' ? refreshBody(provider) : exchangeBody(provider);
  const contentType =
    provider === 'anthropic'
      ? 'application/json'
      : 'application/x-www-form-urlencoded';
  return new Request(
    options.substituteQuery ? `${endpoint}?extra=1` : endpoint,
    { method: 'POST', headers: { 'content-type': contentType }, body },
  );
}

for (const [name, provider] of [
  ['anthropic', 'anthropic'],
  ['openai', 'openai'],
] as const) {
  registerAuthCertification({
    name,
    operation: 'auth.token',
    modules: builtinAuthModuleRegistry,
    createOperation: () => operation(provider, 'auth.token'),
    request: (_op, options) => requestFor(provider, 'auth.token', options),
  });
  registerAuthCertification({
    name: `${name} login exchange`,
    operation: 'auth.token-exchange',
    modules: builtinAuthModuleRegistry,
    createOperation: () => operation(provider, 'auth.token-exchange'),
    request: (_op, options) =>
      requestFor(provider, 'auth.token-exchange', options),
  });
}

describe('auth module registration', () => {
  it('rejects unsupported routes, bodies and duplicates', () => {
    const base = anthropicAuthModule as unknown as AiAuthModule;
    expect(() =>
      createAuthModuleRegistry([{ ...base, tokenPath: '/token' as never }]),
    ).toThrow(/Invalid auth module registration/);
    expect(() =>
      createAuthModuleRegistry([{ ...base, body: 'xml' as never }]),
    ).toThrow(/Invalid auth module registration/);
    expect(() => createAuthModuleRegistry([{ ...base, id: 'Bad_ID' }])).toThrow(
      /Invalid auth module registration/,
    );
    expect(() => createAuthModuleRegistry([base, { ...base }])).toThrow(
      /Invalid auth module registration/,
    );
    expect(() =>
      createAuthModuleRegistry([
        { ...base, parseTokenResponse: undefined as never },
      ]),
    ).toThrow(/Invalid auth module registration/);
  });

  it('requires the token route to match the module and the body to match its encoding', async () => {
    const registry = builtinAuthModuleRegistry;
    const module = registry.get('anthropic')!;
    // A form-encoded body on a JSON module is rejected.
    await expect(
      module.validateTokenRequest({
        operation: 'auth.token',
        endpoint: tokenEndpoints[1],
        request: new Request(tokenEndpoints[1], {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: refreshBody('openai'),
        }),
      }),
    ).rejects.toThrow(/encoding/);
    // An unsupported grant field is rejected even with the right encoding.
    await expect(
      module.validateTokenRequest({
        operation: 'auth.token',
        endpoint: tokenEndpoints[1],
        request: new Request(tokenEndpoints[1], {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: 'r',
            client_id: 'c',
            client_secret: 'leaked',
          }),
        }),
      }),
    ).rejects.toThrow(/unsupported field/);
    // Token responses must carry a usable access token, refresh token and expiry.
    for (const body of [
      {},
      { access_token: 'a', refresh_token: 'r' },
      { access_token: 'a', refresh_token: 'r', expires_in: -1 },
      { access_token: 'a', refresh_token: 'r', expires_in: Number.NaN },
    ]) {
      expect(() =>
        module.parseTokenResponse({ operation: 'auth.token', body, now: 0 }),
      ).toThrow();
    }
    const credential: Credential = module.parseTokenResponse({
      operation: 'auth.token',
      body: {
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 60,
        account: 'acct',
        id_token: 'never-copied',
      },
      now: 1_000,
    });
    expect(credential).toEqual({
      type: 'oauth',
      access: 'access',
      refresh: 'refresh',
      expires: 61_000,
      account: 'acct',
    });
  });

  it('refuses to certify a module whose envelope validator is weakened', async () => {
    // A module that accepts any token request must fail the substitution case
    // the certification suite runs; this is the red half of the harness.
    const lax: AiAuthModule = {
      ...anthropicAuthModule,
      validateTokenRequest: async () => {},
    };
    const spikeEvents: string[] = [];
    const transport = jest.fn(async () => {
      spikeEvents.push('send');
      return new Response('{}');
    });
    const guard = createAuthOperationGuard({
      modules: createAuthModuleRegistry([lax]),
      journal: {
        recordDecisionAndIntent: async () => String(spikeEvents.length),
        recordOutcome: async () => {},
        recordRecovery: async () => {},
        read: async () => ({ items: [] }),
      } as never,
      recheck: async () => true,
      transport: transport as unknown as typeof fetch,
    });
    const op = operation('anthropic', 'auth.token');
    const guarded = guard.bind(op);
    // With the endpoint itself substituted the guard still refuses, because the
    // destination binding is provider-agnostic.
    await expect(
      guarded.fetch(
        requestFor('anthropic', 'auth.token', {
          substituteEndpoint: true,
        }),
      ),
    ).rejects.toThrow();
    expect(transport).not.toHaveBeenCalled();
    // But a payload substitution is stopped only by the module validator; with
    // the validator weakened it reaches the transport, which is exactly why
    // certification requires the module's own check.
    await guard.bind(operation('anthropic', 'auth.token')).fetch(
      new Request(tokenEndpoints[1], {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: 'r',
        }),
      }),
    );
    expect(transport).toHaveBeenCalledTimes(1);
  });
});
