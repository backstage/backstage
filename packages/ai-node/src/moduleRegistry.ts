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

import { createProviderRegistry } from './providers/registry';
import type { AiProviderModule } from './providers/types';
import { composeWithToolRegistry, createToolRegistry } from './tools/registry';
import type { ToolModule } from './tools/types';

/** Provider and tool module registrations for a new admission. @alpha */
export type AiModules = Readonly<{
  providerModules: readonly AiProviderModule[];
  toolModules: readonly ToolModule[];
}>;

/** Mutable registrations that produce snapshots for new admissions. @alpha */
export type AiModuleRegistry = Readonly<{
  registerProviderModules(modules: readonly AiProviderModule[]): void;
  registerToolModules(modules: readonly ToolModule[]): void;
  snapshot(): AiModules;
}>;

/** Creates an AI module registry with collision checks. @alpha */
export function createAiModuleRegistry(initial: AiModules): AiModuleRegistry {
  let providers = [...initial.providerModules];
  let tools = [...initial.toolModules];
  function validate(
    nextProviders: AiProviderModule[],
    nextTools: ToolModule[],
  ) {
    composeWithToolRegistry(
      createProviderRegistry(nextProviders),
      createToolRegistry(nextTools),
    );
  }
  validate(providers, tools);
  return Object.freeze({
    registerProviderModules(modules) {
      const next = [...providers, ...modules];
      validate(next, tools);
      providers = next;
    },
    registerToolModules(modules) {
      const next = [...tools, ...modules];
      validate(providers, next);
      tools = next;
    },
    snapshot: () => ({
      providerModules: [...providers],
      toolModules: [...tools],
    }),
  });
}
