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
import type {
  AiProviderModule,
  ProviderAdapter,
} from '@backstage/ai-node/temporary';
import { validateHttpEnvelope } from '@backstage/ai-node/temporary';

const CHAT = ['stream', 'complete', 'streamSimple', 'completeSimple'] as const;

const streamAdapter = (adapter: unknown): ProviderAdapter => {
  const pinned = adapter as Extract<ProviderAdapter, { kind: 'stream' }>;
  return {
    kind: 'stream',
    stream: pinned.stream,
    streamSimple: pinned.streamSimple,
  };
};
const base = (url: string | undefined) => (url ?? '').replace(/\/+$/, '');

/**
 * Anthropic's Messages API: chat dispatch on `POST {base}/v1/messages`, plus
 * the reserved `/v1/oauth/token` route classified as a token exchange.
 *
 * @public
 */
export const anthropicMessages: AiProviderModule = {
  id: 'anthropic-messages',
  adapter: streamAdapter(anthropic),
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
};
