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

export { registerProviderCertification } from './providers/certification';
export { createProviderRegistry } from './providers/registry';
export type { AiProviderRegistry } from './providers/registry';
export { createModelOperationGuard } from './guard/createModelOperationGuard';
export { createGuardedModelOperations } from './guard/modelOperations';
export type { ModelOperation, TrustedOperation } from './guard/types';
export type {
  AttemptDecision,
  AttemptId,
  AttemptOutcome,
} from './journal/types';
export type {
  GuardedModelBinding,
  ModelRequests,
  ProviderAuthority,
} from './guard/modelOperations';
export type { GuardedOperation, ModelOperationGuard } from './guard/types';
export type {
  AttemptJournal,
  AttemptOutcomeStatus,
  AuditEventView,
  AuditPage,
  AuditQuery,
  RecoveryEvent,
} from './journal/types';
export type {
  AiEventEmitter,
  AiObservabilityEvent,
} from './observability/types';
export type { Fence, Namespace } from './contracts';
export type { CredentialScope } from './credentials/types';
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
} from './providers/types';
export { validateHttpEnvelope } from './providers/httpEnvelope';
export type { HttpEnvelopeRules } from './providers/httpEnvelope';
export type {
  DestinationTemplate,
  DestinationTemplatePart,
} from './providers/templates';
export {
  createJournalHarness,
  type JournalHarness,
  type JournalHarnessOptions,
} from './testUtilsJournalHarness';
export {
  CRASH_TEST_CHILD_ENV,
  CRASH_TEST_DB_ENV,
  CRASH_TEST_FENCE_ENV,
  CRASH_TEST_NAMESPACE_ENV,
  CRASH_TEST_ORIGIN_ENV,
  createCrashTestFixture,
  runCrashChild,
} from './testUtilsCrashFixture';
export type {
  CrashChildBindInput,
  CrashChildBinding,
  CrashChildContext,
  CrashTestFixture,
  CrashTestFixtureOptions,
  CrashTestOptions,
} from './testUtilsCrashFixture';
