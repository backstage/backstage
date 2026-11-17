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

import * as systemOne from '@earendil-works/pi-ai/api/typesafe-system-one';
import * as decisions from '@earendil-works/pi-ai/api/openai-decisions';
import * as images from '@earendil-works/pi-ai/api/openrouter-images';
import { validateHttpEnvelope } from './httpEnvelope';
import type { AiProviderModule, ProviderAdapter } from './types';

const base = (url: string | undefined) => (url ?? '').replace(/\/+$/, '');

/**
 * Non-chat dispatch through the pinned pi-ai adapter modules. Every adapter
 * receives the host's guarded transport via `options.fetch` and must use it
 * for its HTTP calls; the guard's `invokeCustom` path fails the operation
 * closed when a dispatch completes without a guarded send.
 *
 * Classify is a dispatched model operation — authorized per attempt by the
 * deterministic guard (envelope validation, permission recheck, journal
 * before send) — and is never consulted BY the guard when it makes
 * authorization decisions.
 */
function outcomeForResult(
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
    return { value: result, outcome: outcomeForResult(result.stopReason) };
  },
});

/**
 * TypeSafe's System One classification protocol (`POST {base}/systemone`).
 * OpenRouter serves the same protocol with a different base URL; a proxy
 * that hides both the provider ID and the OpenRouter host must set
 * `compat.imageInput`. Only the `/v1/systemone` route shape is certified;
 * custom base URLs that do not produce it are rejected fail-closed by the
 * destination templates.
 */
export const typesafeSystemOne: AiProviderModule = {
  id: 'typesafe-system-one',
  adapter: nonChatAdapter(systemOne.classify),
  certifiedOperations: ['classify'],
  destinationTemplates: [[{ literal: '/v1/systemone' }]],
  destination: model => `${base(model.baseUrl)}/systemone`,
  validateEnvelope: (operation, request) =>
    validateHttpEnvelope({ endpoint: '/systemone' }, operation, request),
};

/**
 * OpenAI's Decisions API (`POST {base}/decisions`). Only the
 * `/v1/decisions` route shape is certified.
 */
export const openaiDecisions: AiProviderModule = {
  id: 'openai-decisions',
  adapter: nonChatAdapter(decisions.classify),
  certifiedOperations: ['classify'],
  destinationTemplates: [[{ literal: '/v1/decisions' }]],
  destination: model => `${base(model.baseUrl)}/decisions`,
  validateEnvelope: (operation, request) =>
    validateHttpEnvelope({ endpoint: '/decisions' }, operation, request),
};

const DATA_URL = /^data:[^;,]+;base64,[A-Za-z0-9+/]*={0,2}$/;

/**
 * Structural inspection for image-bearing chat-completions requests: the
 * messages array with text and `image_url` content blocks, where image
 * references must be well-formed base64 data URLs. Blocks are shape-checked
 * only — image data is never stored or journaled; the attempt journal
 * records decisions and outcomes, never blobs.
 */
function inspectImageRequestPayload(payload: unknown): void {
  if (!payload || typeof payload !== 'object') return;
  const { messages, modalities, stream } = payload as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Uninspectable image request');
  }
  for (const message of messages) {
    if (
      !message ||
      typeof message !== 'object' ||
      typeof (message as { role?: unknown }).role !== 'string'
    ) {
      throw new Error('Uninspectable image request');
    }
    const content = (message as { content?: unknown }).content;
    if (typeof content === 'string') continue;
    if (!Array.isArray(content)) {
      throw new Error('Uninspectable image request content');
    }
    for (const block of content) {
      if (!block || typeof block !== 'object') {
        throw new Error('Uninspectable image request content');
      }
      const typed = block as {
        type?: unknown;
        text?: unknown;
        image_url?: unknown;
      };
      if (typed.type === 'text') {
        if (typeof typed.text !== 'string') {
          throw new Error('Uninspectable image request content');
        }
      } else if (typed.type === 'image_url') {
        const reference = typed.image_url;
        const url =
          typeof reference === 'string'
            ? reference
            : (reference as { url?: unknown } | undefined)?.url;
        if (typeof url !== 'string' || !DATA_URL.test(url)) {
          throw new Error('Uninspectable image reference');
        }
      } else {
        throw new Error('Unexpected image request content block');
      }
    }
  }
  if (stream !== false) {
    throw new Error('Image requests must not stream');
  }
  if (
    modalities !== undefined &&
    (!Array.isArray(modalities) ||
      !modalities.every(value => value === 'image' || value === 'text'))
  ) {
    throw new Error('Uninspectable image request modalities');
  }
}

/**
 * Image generation over OpenRouter's chat-completions endpoint. Every
 * `generateImages` dispatch replays the full input history to the provider,
 * image blocks included: a session holding N image attachments pays O(N)
 * upload bytes per dispatch and O(history) cumulative replay cost. Hosts
 * must bound image-bearing histories (attachment count and bytes) before
 * enabling image attachments in higher layers — this module bounds a single
 * request at the shared 16 MiB envelope cap and journals outcomes only,
 * never image data.
 */
export const openrouterImages: AiProviderModule = {
  id: 'openrouter-images',
  adapter: nonChatAdapter(images.generateImages),
  certifiedOperations: ['generateImages'],
  destinationTemplates: [[{ literal: '/v1/chat/completions' }]],
  destination: model => `${base(model.baseUrl)}/chat/completions`,
  validateEnvelope: (operation, request) =>
    validateHttpEnvelope(
      {
        endpoint: '/chat/completions',
        inspectPayload: inspectImageRequestPayload,
      },
      operation,
      request,
    ),
};

/** Host registration: non-chat built-ins on the T-PM seam. */
export const nonchatProviderModules = Object.freeze([
  typesafeSystemOne,
  openaiDecisions,
  openrouterImages,
]);
