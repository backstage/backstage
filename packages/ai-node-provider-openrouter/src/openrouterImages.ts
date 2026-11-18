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

import * as images from '@earendil-works/pi-ai/api/openrouter-images';
import type {
  AiProviderModule,
  ProviderAdapter,
} from '@backstage/ai-node/modules';
import { validateHttpEnvelope } from '@backstage/ai-node/modules';

const base = (url: string | undefined) => (url ?? '').replace(/\/+$/, '');

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

/** Strict base64: non-empty, correct length and padding, valid alphabet. */
const BASE64 =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function isWellFormedImageReference(url: string): boolean {
  const match = /^data:[^;,]+;base64,([A-Za-z0-9+/=]*)$/.exec(url);
  if (!match) return false;
  return match[1].length > 0 && BASE64.test(match[1]);
}

/**
 * Structural inspection for image-bearing chat-completions requests: the
 * messages array with text and `image_url` content blocks, where image
 * references must be well-formed base64 data URLs. Blocks are shape-checked
 * only; image data is never stored or journaled.
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
        if (typeof url !== 'string' || !isWellFormedImageReference(url)) {
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
 * Image generation over OpenRouter's chat-completions endpoint: a POST of
 * `{base}/chat/completions`.
 *
 * Resource limits — two distinct costs; only the first is bounded here:
 *
 * - Request cost: each dispatch sends the input it is given, image blocks
 *   included, to the provider. A single request is bounded at the shared
 *   16 MiB envelope cap. The input context is whatever the caller passes;
 *   this module does not assume it represents the session history.
 *
 * - Stored-history cost: if higher layers persist image-bearing records,
 *   the durable store's snapshot reconstruction loads and rebuilds the
 *   entire persisted commit history in memory on every read and write
 *   (O(history) per access), so the request cap does NOT bound total
 *   stored image bytes or replay memory — those grow with the history.
 *
 * Hosts must therefore bound total persisted image bytes and history
 * length before enabling image attachments in higher layers (coordinate
 * with the codemode resource-limits caveat). The attempt journal records
 * outcomes only — image data is never journaled.
 *
 * The default OpenRouter base uses /api/v1; /v1 covers custom gateways, so
 * both route shapes are approved below.
 *
 * @alpha
 */
export const openrouterImages: AiProviderModule = {
  id: 'openrouter-images',
  adapter: nonChatAdapter(images.generateImages),
  certifiedOperations: ['generateImages'],
  destinationTemplates: [
    [{ literal: '/v1/chat/completions' }],
    [{ literal: '/api/v1/chat/completions' }],
  ],
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
