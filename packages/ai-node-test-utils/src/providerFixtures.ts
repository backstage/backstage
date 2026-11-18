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

import * as anthropic from '@earendil-works/pi-ai/api/anthropic-messages';
import * as azure from '@earendil-works/pi-ai/api/azure-openai-responses';
import * as responses from '@earendil-works/pi-ai/api/openai-responses';
import * as completions from '@earendil-works/pi-ai/api/openai-completions';
import * as codex from '@earendil-works/pi-ai/api/openai-codex-responses';
import * as images from '@earendil-works/pi-ai/api/openrouter-images';
import * as systemOne from '@earendil-works/pi-ai/api/typesafe-system-one';
import { resolveAzureConfig } from '@earendil-works/pi-ai/api/azure-openai-config';
import { validateHttpEnvelope } from '@backstage/ai-node/modules';
import { createProviderRegistry } from '@backstage/ai-node/modules';
import type {
  AiProviderModule,
  ProviderAdapter,
} from '@backstage/ai-node/modules';

const CHAT = ['stream', 'complete', 'streamSimple', 'completeSimple'] as const;
const base = (url: string | undefined) => (url ?? '').replace(/\/+$/, '');

const streamAdapter = (adapter: unknown): ProviderAdapter => {
  const pinned = adapter as Extract<ProviderAdapter, { kind: 'stream' }>;
  return {
    kind: 'stream',
    stream: pinned.stream,
    streamSimple: pinned.streamSimple,
  };
};

function outcomeForStopReason(
  stopReason: 'stop' | 'error' | 'aborted',
): 'completed' | 'failed' | 'cancelled' {
  if (stopReason === 'stop') return 'completed';
  if (stopReason === 'aborted') return 'cancelled';
  return 'failed';
}

const nonChatAdapter = (
  dispatch: (
    model: never,
    context: never,
    options: never,
  ) => Promise<{ stopReason: 'stop' | 'error' | 'aborted' }>,
): ProviderAdapter => ({
  kind: 'custom',
  invoke: async ({ model, context, options }) => {
    const result = await dispatch(
      model as never,
      context as never,
      options as never,
    );
    return { value: result, outcome: outcomeForStopReason(result.stopReason) };
  },
});

/**
 * Synthetic provider module copies of the extracted families, for tests that
 * dispatch through a realistic registry without depending on a family package.
 *
 * @remarks
 * The extracted packages have their own certification suites; these copies
 * serve tests that need a realistic registry without a family dependency.
 *
 * @alpha
 */
export const fixtureProviderModules: readonly AiProviderModule[] = [
  {
    id: 'anthropic-messages',
    adapter: streamAdapter(anthropic),
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: CHAT,
    destinationTemplates: [[{ literal: '/v1/messages' }]],
    destination: model => `${base(model.baseUrl)}/v1/messages`,
    classifyRequest: url =>
      new URL(url).pathname === '/v1/oauth/token'
        ? 'auth.token-exchange'
        : 'model',
    validateEnvelope: (op, request) =>
      validateHttpEnvelope(
        {
          endpoint: '/messages',
          federation: true,
          sdkQueryParams: { beta: 'true' },
        },
        op,
        request,
      ),
  },
  {
    id: 'azure-openai-responses',
    adapter: streamAdapter(azure),
    credentialKinds: ['api_key'],
    certifiedOperations: CHAT,
    destinationTemplates: [
      [{ literal: '/openai/v1/responses' }],
      [
        { literal: '/openai/deployments/' },
        { digest: 'deployment' },
        { literal: '/responses' },
      ],
    ],
    destination: (model, env) => {
      const config = resolveAzureConfig(model as never, { env });
      return `${config.baseUrl}/responses?api-version=${config.apiVersion}`;
    },
    validateEnvelope: (op, request) =>
      validateHttpEnvelope({ endpoint: '/responses' }, op, request),
  },
  {
    id: 'typesafe-system-one',
    adapter: nonChatAdapter(systemOne.classify),
    credentialKinds: ['api_key'],
    certifiedOperations: ['classify'],
    destinationTemplates: [
      [{ literal: '/v1/systemone' }],
      [{ literal: '/api/v1/systemone' }],
    ],
    destination: model => `${base(model.baseUrl)}/systemone`,
    validateEnvelope: (operation, request) =>
      validateHttpEnvelope({ endpoint: '/systemone' }, operation, request),
  },
  {
    id: 'openrouter-images',
    adapter: nonChatAdapter(images.generateImages),
    credentialKinds: ['api_key'],
    certifiedOperations: ['generateImages'],
    destinationTemplates: [
      [{ literal: '/v1/chat/completions' }],
      [{ literal: '/api/v1/chat/completions' }],
    ],
    destination: model => `${base(model.baseUrl)}/chat/completions`,
    validateEnvelope: (operation, request) =>
      validateHttpEnvelope(
        { endpoint: '/chat/completions' },
        operation,
        request,
      ),
  },
  {
    id: 'openai-responses',
    adapter: streamAdapter(responses),
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: CHAT,
    destinationTemplates: [[{ literal: '/v1/responses' }]],
    destination: model => `${base(model.baseUrl)}/responses`,
    validateEnvelope: (op, request) =>
      validateHttpEnvelope({ endpoint: '/responses' }, op, request),
  },
  {
    id: 'openai-completions',
    adapter: streamAdapter(completions),
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: CHAT,
    destinationTemplates: [[{ literal: '/v1/chat/completions' }]],
    destination: model => `${base(model.baseUrl)}/chat/completions`,
    validateEnvelope: (op, request) =>
      validateHttpEnvelope({ endpoint: '/chat/completions' }, op, request),
  },
  {
    id: 'openai-codex-responses',
    adapter: streamAdapter(codex),
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: CHAT,
    destinationTemplates: [[{ literal: '/backend-api/codex/responses' }]],
    destination: model => `${base(model.baseUrl)}/codex/responses`,
    validateEnvelope: (op, request) =>
      validateHttpEnvelope({ endpoint: '/responses', zstd: true }, op, request),
    transport: 'sse',
  },
];

/** The extracted families' test fixtures, for core tests. */
/** The fixture modules joined into one registry. @alpha */
export const builtinProviderRegistry = createProviderRegistry([
  ...fixtureProviderModules,
]);
