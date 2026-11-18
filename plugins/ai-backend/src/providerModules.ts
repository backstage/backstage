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

import { builtinProviderModules } from '@backstage/ai-node/modules';
import { googleProviderModules } from '@backstage/ai-node-provider-google/alpha';
import { openaiProviderModules } from '@backstage/ai-node-provider-openai/alpha';
import { anthropicProviderModules } from '@backstage/ai-node-provider-anthropic';
import { azureProviderModules } from '@backstage/ai-node-provider-azure';
import { typesafeProviderModules } from '@backstage/ai-node-provider-typesafe';
import { openrouterProviderModules } from '@backstage/ai-node-provider-openrouter';

/**
 * The provider module collection this plugin registers: every extracted
 * family plus the core remainder. Production registration and the test
 * fixtures compose this one array, so their parity holds by construction.
 */
export const aiBackendProviderModules = Object.freeze([
  ...googleProviderModules,
  ...openaiProviderModules,
  ...anthropicProviderModules,
  ...azureProviderModules,
  ...typesafeProviderModules,
  ...openrouterProviderModules,
  ...builtinProviderModules,
]);
