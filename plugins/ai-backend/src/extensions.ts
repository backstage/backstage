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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import type { AiProviderModule, ToolModule } from '@backstage/ai-node/alpha';

/**
 * Registers trusted modules for the AI plugin's default service.
 *
 * @remarks
 * New admissions see registrations made before they open. A live admission
 * keeps its existing module snapshot until its last handle is released.
 * Custom AI service factories control their own modules and do not consume
 * these registrations.
 *
 * @alpha
 */
export interface AiModulesExtensionPoint {
  registerProviderModules(modules: readonly AiProviderModule[]): void;
  registerToolModules(modules: readonly ToolModule[]): void;
}

/** @alpha */
export const aiModulesExtensionPoint =
  createExtensionPoint<AiModulesExtensionPoint>({
    id: 'ai.modules',
  });
