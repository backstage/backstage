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

/** @packageDocumentation */

export { registerProviderCertification } from '@backstage/ai-node/modules';
export { createProviderRegistry } from '@backstage/ai-node/modules';
export type { AiProviderRegistry } from '@backstage/ai-node/modules';
export { createModelOperationGuard } from '@backstage/ai-node/modules';
export { createGuardedModelOperations } from '@backstage/ai-node/modules';
export type {
  ModelOperation,
  TrustedOperation,
} from '@backstage/ai-node/modules';
export type {
  AttemptDecision,
  AttemptId,
  AttemptOutcome,
} from '@backstage/ai-node/modules';
export type {
  GuardedModelBinding,
  ModelRequests,
  ProviderAuthority,
} from '@backstage/ai-node/modules';
export type {
  GuardedOperation,
  ModelOperationGuard,
} from '@backstage/ai-node/modules';
export type {
  AttemptJournal,
  AttemptOutcomeStatus,
  AuditEventView,
  AuditPage,
  AuditQuery,
  RecoveryEvent,
} from '@backstage/ai-node/modules';
export { createAiEventSink } from '@backstage/ai-node/modules';
export type {
  AiEventSink,
  AiObservabilityEvent,
} from '@backstage/ai-node/modules';
export type { Fence, Namespace } from '@backstage/ai-node/modules';
export type { CredentialScope } from '@backstage/ai-node/modules';
export type {
  AiAuthModule,
  AuthOperationKind,
  AuthTokenRequestBase,
  OAuthLoginExchangeInput,
  OAuthRefreshInput,
} from './providers/auth/types';
export type {
  AiCredentialKind,
  AiProviderModule,
  ModuleAuthority,
  ProviderAdapter,
  ProviderEnvelope,
} from '@backstage/ai-node/modules';
export { validateHttpEnvelope } from '@backstage/ai-node/modules';
export type { HttpEnvelopeRules } from '@backstage/ai-node/modules';
export type {
  DestinationTemplate,
  DestinationTemplatePart,
} from '@backstage/ai-node/modules';
export { createAttemptJournal } from '@backstage/ai-node/modules';
export {
  createJournalHarness,
  type JournalHarness,
  type JournalHarnessOptions,
} from './journalHarness';
export {
  CRASH_TEST_CHILD_ENV,
  CRASH_TEST_DB_ENV,
  CRASH_TEST_FENCE_ENV,
  CRASH_TEST_NAMESPACE_ENV,
  CRASH_TEST_ORIGIN_ENV,
  createCrashTestFixture,
  runCrashChild,
} from './crashFixture';
export type {
  CrashChildBindInput,
  CrashChildBinding,
  CrashChildContext,
  CrashTestFixture,
  CrashTestFixtureOptions,
  CrashTestOptions,
} from './crashFixture';
export {
  builtinProviderRegistry,
  fixtureProviderModules,
} from './providerFixtures';
