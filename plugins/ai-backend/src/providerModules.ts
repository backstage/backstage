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

import { googleProviderModules } from '@backstage/ai-node-provider-google/alpha';
import { openaiProviderModules } from '@backstage/ai-node-provider-openai/alpha';
import { anthropicProviderModules } from '@backstage/ai-node-provider-anthropic/alpha';
import { azureProviderModules } from '@backstage/ai-node-provider-azure/alpha';
import { typesafeProviderModules } from '@backstage/ai-node-provider-typesafe/alpha';
import { openrouterProviderModules } from '@backstage/ai-node-provider-openrouter/alpha';
import type { AiProviderModule } from '@backstage/ai-node/alpha';

/**
 * The provider module collection this plugin registers: every extracted
 * family. Production registration and the test fixtures compose this one
 * array, so their parity holds by construction.
 */
export const aiBackendProviderModules: readonly AiProviderModule[] =
  Object.freeze([
    ...googleProviderModules,
    ...openaiProviderModules,
    ...anthropicProviderModules,
    ...azureProviderModules,
    ...typesafeProviderModules,
    ...openrouterProviderModules,
  ]);
