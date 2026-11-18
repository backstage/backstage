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

/**
 * TypeSafe's System One classification protocol (`POST {base}/systemone`).
 * OpenRouter serves the same protocol with a different base URL; a proxy
 * that hides both the provider ID and the OpenRouter host must set
 * `compat.imageInput`. Only the `/v1/systemone` route shape is certified;
 * custom base URLs that do not produce it are rejected fail-closed by the
 * destination templates. The native TypeSafe base and OpenRouter's `/api/v1`
 * base both serve the protocol, so both route shapes are approved below.
 *
 * @public
 */
export const typesafeSystemOne: AiProviderModule = {
  id: 'typesafe-system-one',
  adapter: nonChatAdapter(systemOne.classify),
  certifiedOperations: ['classify'],
  destinationTemplates: [
    [{ literal: '/v1/systemone' }],
    [{ literal: '/api/v1/systemone' }],
  ],
  destination: model => `${base(model.baseUrl)}/systemone`,
  validateEnvelope: (operation, request) =>
    validateHttpEnvelope({ endpoint: '/systemone' }, operation, request),
};
