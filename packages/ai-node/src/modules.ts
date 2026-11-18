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
 * Module-authoring surface for provider and auth modules.
 *
 * @remarks
 * This entry point is what provider packages build on: it exports the
 * `AiProviderModule` and `AiAuthModule` contracts, the request-envelope
 * validator and the OAuth token-request helpers used to assemble a module.
 * It is alpha-grade: the shapes are stable enough to author against, but they
 * may change in a minor release as the extraction of provider packages
 * completes, and they are not yet covered by the stable `@public` surface.
 *
 * @packageDocumentation
 */

import type { AiProviderModule } from './providers/types';

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
export { validateHttpEnvelope } from './providers/httpEnvelope';
export type { HttpEnvelopeRules } from './providers/httpEnvelope';
export {
  assertTokenRequest,
  createTokenRequest,
  parseOAuthTokenResponse,
} from './providers/auth/modules';
export type {
  AiAuthModule,
  AuthOperationKind,
  AuthTokenRequestBase,
  OAuthLoginExchangeInput,
  OAuthRefreshInput,
} from './providers/auth/types';
export type { CredentialScope } from './credentials/types';

/**
 * The provider modules that remain in this package: none — every family now
 * lives in its own provider package. The collection stays as the empty
 * remainder consumers compose with the family collections.
 *
 * @alpha
 */
export const builtinProviderModules: readonly AiProviderModule[] =
  Object.freeze([]);
