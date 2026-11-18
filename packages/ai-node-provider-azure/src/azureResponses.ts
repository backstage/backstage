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

import * as azure from '@earendil-works/pi-ai/api/azure-openai-responses';
import { resolveAzureConfig } from '@earendil-works/pi-ai/api/azure-openai-config';
import type {
  AiProviderModule,
  ProviderAdapter,
} from '@backstage/ai-node/modules';
import { validateHttpEnvelope } from '@backstage/ai-node/modules';

const CHAT = ['stream', 'complete', 'streamSimple', 'completeSimple'] as const;

const streamAdapter = (adapter: unknown): ProviderAdapter => {
  const pinned = adapter as Extract<ProviderAdapter, { kind: 'stream' }>;
  return {
    kind: 'stream',
    stream: pinned.stream,
    streamSimple: pinned.streamSimple,
  };
};

/**
 * Azure OpenAI Responses: the plain `/openai/v1/responses` route and the
 * deployment-scoped `/openai/deployments/{deployment}/responses` route, with
 * the destination resolved from the Azure configuration.
 *
 * @public
 */
export const azureResponses: AiProviderModule = {
  id: 'azure-openai-responses',
  adapter: streamAdapter(azure),
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
};
