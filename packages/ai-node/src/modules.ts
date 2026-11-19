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
 * validator and the OAuth token-request helpers used to assemble a module,
 * and the certification and guard-construction machinery module authors use
 * to certify their modules against the real guard — the provider
 * certification registrar, the provider registry, the guard constructors and
 * the journal constructor they drive, and the event sink that publishes
 * the service's observability events.
 * It is alpha-grade: the shapes are stable enough to author against, but they
 * may change in a minor release as the extraction of provider packages
 * completes, and they are not yet covered by the stable `@public` surface.
 *
 * @packageDocumentation
 */

export type {
  AiCredentialKind,
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
export { wrapProviderModule } from './providers/wrapProviderModule';
export type { WrapProviderModuleOptions } from './providers/wrapProviderModule';
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
export type { Fence, Namespace } from './contracts';
export { registerProviderCertification } from './providers/certification';
export { createProviderRegistry } from './providers/registry';
export type { AiProviderRegistry } from './providers/registry';
export { createModelOperationGuard } from './guard/createModelOperationGuard';
export { createGuardedModelOperations } from './guard/modelOperations';
export type {
  GuardedModelBinding,
  ModelRequests,
  ProviderAuthority,
} from './guard/modelOperations';
export type {
  GuardedOperation,
  ModelOperation,
  ModelOperationGuard,
  TrustedOperation,
} from './guard/types';
export { createAttemptJournal } from './journal/knex';
export type { AttemptJournalOptions } from './journal/knex';
export type {
  AttemptDecision,
  AttemptId,
  AttemptOutcome,
  AttemptJournal,
  AttemptOutcomeStatus,
  AuditEventView,
  AuditPage,
  AuditQuery,
  AuditReadAuthorizer,
  JournalAuditorMirror,
  RecoveryEvent,
} from './journal/types';
export type {
  AiEventEmitter,
  AiObservabilityEvent,
} from './observability/types';
