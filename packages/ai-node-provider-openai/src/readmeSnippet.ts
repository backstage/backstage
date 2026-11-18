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

/**
 * A compile fixture for the README's registration snippet: the snippet is
 * kept verbatim here so root `yarn tsc` proves it against the current
 * surface. Not exported from any entrypoint.
 */
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { openaiProviderModules } from '@backstage/ai-node-provider-openai/alpha';

// Build the AI service factory override that registers the provider
// modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...openaiProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);

export const readmeSnippet = serviceFactory;
