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

/** Temporary provider implementations pending extraction into separate packages. @packageDocumentation */

import {
  openaiResponses,
  openaiCompletions,
  azureResponses,
  openaiCodexResponses,
  anthropicMessages,
} from './providers/builtins';
import {
  typesafeSystemOne,
  openaiDecisions,
  openrouterImages,
} from './providers/nonchat';

export type {
  AiProviderModule,
  ModuleAuthority,
  ProviderAdapter,
  ProviderEnvelope,
} from './providers/types';
export type {
  DestinationTemplate,
  DestinationTemplatePart,
} from './providers/templates';
export type { CredentialScope } from './credentials/types';

/** Provider modules available until provider packages are extracted. @alpha */
export const builtinProviderModules = Object.freeze([
  openaiResponses,
  openaiCompletions,
  azureResponses,
  openaiCodexResponses,
  anthropicMessages,
  typesafeSystemOne,
  openaiDecisions,
  openrouterImages,
]);
