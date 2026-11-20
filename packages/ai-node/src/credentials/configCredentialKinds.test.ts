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

import type { AnyModel } from '@earendil-works/pi-ai';
import { createProviderRegistry } from '../providers/registry';
import type { AiCredentialKind, AiProviderModule } from '../providers/types';
import { assertConfigCredentialKinds } from './configCredentialKinds';

function module(
  id: string,
  credentialKinds: readonly AiCredentialKind[],
): AiProviderModule {
  return {
    id,
    certifiedOperations: ['stream'],
    credentialKinds,
    destinationTemplates: [[{ literal: '/v1/messages' }]],
    destination: () => 'https://provider.example/v1/messages',
    validateEnvelope: async () => 'model',
    adapter: { kind: 'stream', stream: jest.fn(), streamSimple: jest.fn() },
  } as unknown as AiProviderModule;
}

function model(provider: string, api: string): AnyModel {
  return {
    id: 'm',
    name: 'm',
    provider,
    api,
    baseUrl: 'https://provider.example',
    contextWindow: 1000,
    maxTokens: 100,
    input: ['text'],
    reasoning: false,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    type: 'chat',
  } as unknown as AnyModel;
}

const registry = createProviderRegistry([
  module('anthropic-messages', ['api_key', 'oauth']),
  module('typesafe-system-one', ['api_key']),
]);

const models: AnyModel[] = [
  model('anthropic', 'anthropic-messages'),
  model('my-gateway', 'typesafe-system-one'),
];

describe('configured credential kinds', () => {
  it('accepts a kind the provider family consumes', () => {
    for (const [providerId, kind] of [
      ['anthropic', 'oauth'],
      ['anthropic', 'api_key'],
      ['my-gateway', 'api_key'],
    ] as const) {
      expect(() =>
        assertConfigCredentialKinds({
          models,
          providers: registry,
          configured: [{ scope: 'org', providerId, kind }],
        }),
      ).not.toThrow();
    }
  });

  it('rejects an oauth entry for an api-key-only provider', () => {
    expect(() =>
      assertConfigCredentialKinds({
        models,
        providers: registry,
        configured: [{ scope: 'org', providerId: 'my-gateway', kind: 'oauth' }],
      }),
    ).toThrow(
      "Credential configuration for provider 'my-gateway' at scope 'org' uses a 'oauth' credential, which no registered module for that provider accepts. Supported credential kinds: api_key",
    );
  });

  it('rejects an api_key entry for an oauth-only provider', () => {
    const oauthOnly = createProviderRegistry([
      module('anthropic-messages', ['oauth']),
    ]);
    expect(() =>
      assertConfigCredentialKinds({
        models,
        providers: oauthOnly,
        configured: [
          { scope: 'org', providerId: 'anthropic', kind: 'api_key' },
        ],
      }),
    ).toThrow(/uses a 'api_key' credential.*Supported credential kinds: oauth/);
  });

  it('leaves a provider with no registered module to dispatch-time denial', () => {
    // The model entry points at an adapter that is not registered here, so
    // composition cannot decide what the provider would accept.
    expect(() =>
      assertConfigCredentialKinds({
        models: [model('unregistered-gateway', 'unknown-adapter'), ...models],
        providers: registry,
        configured: [
          { scope: 'org', providerId: 'unregistered-gateway', kind: 'oauth' },
        ],
      }),
    ).not.toThrow();
  });

  it('unions the kinds of every module serving one provider', () => {
    const twoFamilies = createProviderRegistry([
      module('anthropic-messages', ['api_key', 'oauth']),
      module('openai-responses', ['api_key']),
    ]);
    expect(() =>
      assertConfigCredentialKinds({
        models: [
          model('shared-gateway', 'anthropic-messages'),
          model('shared-gateway', 'openai-responses'),
        ],
        providers: twoFamilies,
        configured: [
          { scope: 'org', providerId: 'shared-gateway', kind: 'oauth' },
        ],
      }),
    ).not.toThrow();
  });
});
