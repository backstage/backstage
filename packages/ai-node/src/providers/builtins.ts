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

import * as responses from '@earendil-works/pi-ai/api/openai-responses';
import * as completions from '@earendil-works/pi-ai/api/openai-completions';
import * as codex from '@earendil-works/pi-ai/api/openai-codex-responses';
import { validateHttpEnvelope } from './httpEnvelope';
import type { AiProviderModule, ProviderAdapter } from './types';

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

export const openaiResponses: AiProviderModule = {
  id: 'openai-responses',
  adapter: streamAdapter(responses),
  certifiedOperations: CHAT,
  destinationTemplates: [[{ literal: '/v1/responses' }]],
  destination: model => `${base(model.baseUrl)}/responses`,
  validateEnvelope: (op, request) =>
    validateHttpEnvelope({ endpoint: '/responses' }, op, request),
};

export const openaiCompletions: AiProviderModule = {
  id: 'openai-completions',
  adapter: streamAdapter(completions),
  certifiedOperations: CHAT,
  destinationTemplates: [[{ literal: '/v1/chat/completions' }]],
  destination: model => `${base(model.baseUrl)}/chat/completions`,
  validateEnvelope: (op, request) =>
    validateHttpEnvelope({ endpoint: '/chat/completions' }, op, request),
};

export const openaiCodexResponses: AiProviderModule = {
  id: 'openai-codex-responses',
  adapter: streamAdapter(codex),
  certifiedOperations: CHAT,
  destinationTemplates: [[{ literal: '/backend-api/codex/responses' }]],
  destination: model => `${base(model.baseUrl)}/codex/responses`,
  validateEnvelope: (op, request) =>
    validateHttpEnvelope({ endpoint: '/responses', zstd: true }, op, request),
  transport: 'sse',
};
