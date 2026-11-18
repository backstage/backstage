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
 * Alpha entrypoint for the Pi-facing surface of the managed AI service.
 *
 * @remarks
 *
 * The managed AI service is built on the experimental
 * `@earendil-works/pi-durable` execution engine (pinned to `1.5.2`), so every
 * type that exposes Pi types is alpha until the compatibility policy is
 * explicit. Consuming plugins should import from
 * `@backstage/ai-node/alpha`.
 *
 * @packageDocumentation
 * @alpha
 */

export type {
  AiService,
  ConfigAtPath,
  Fence,
  ManagedHarness,
  ManagedNativeHarness,
  Namespace,
  OpenHarnessOptions,
} from './contracts';

export {
  AI_INSTALLATION_CONFIG_PATH,
  configureAiInstallation,
  parseAiInstallationConfig,
} from './config-extension/index';
export type {
  AiConfigCredentialScopes,
  AiCredentialsPrecedence,
  AiInstallationConfig,
  AiInstallationCredentials,
  ConfigureAiInstallationOptions,
  ConfiguredAiInstallation,
} from './config-extension/index';

export {
  aiServiceRef,
  createAiServiceFactory,
  createPrivateAiService,
  bindAiModuleRegistry,
} from './service';
export { createAiModuleRegistry } from './moduleRegistry';
export type { AiModuleRegistry, AiModules } from './moduleRegistry';
export type { AiServiceFactoryOptions } from './service';
export type { AiCodemodeOptions } from './integration';
export type { DefaultAiServiceDeps } from './DefaultAiService';
export type {
  ToolCallResult,
  ToolDeclaration,
  ToolDispatchInput,
  ToolModule,
} from './tools/types';
export type { ToolIdentity } from './tools/registry';
export { createGuardedToolOperations } from './tools/mediation';
export type {
  GuardedToolDispatch,
  GuardedToolOperations,
} from './tools/mediation';
export type { ToolRegistry } from './tools/registry';
export type { ToolCallEnvelope } from './tools/types';
export type {
  DestinationTemplate,
  DestinationTemplatePart,
} from './providers/templates';
export { aiSessionUsePermission, createAiHttpSupport } from './http';
export type { AiHttpSupport, AiHttpSupportOptions } from './http';
export type {
  AttemptId,
  AttemptOutcomeStatus,
  AuditEventView,
  AuditPage,
  AuditQuery,
} from './journal/types';
export type { ModelDescriptor, ModelPair } from './permissions/modelAccess';
export {
  aiModelConditions,
  aiModelPermissionRules,
  aiModelResourceRef,
  aiToolConditions,
  aiToolPermissionRules,
  aiToolResourceRef,
  allowsConditional,
  authorizeConditionalDecision,
  createAiModelConditionalDecision,
  createAiToolConditionalDecision,
  evaluatePermissionCriteria,
  isModel,
  isModelType,
  isProvider,
  isServer,
  isTool,
} from './permissions/rules';
export type {
  AiParamsSchema,
  AiPermissionRule,
  AiPolicyAuthorizer,
} from './permissions/rules';
export type { AiCredentialStores, CredentialScope } from './credentials/types';
export type { RecoveryEvent } from './journal/types';
export type { PageOfNamespaces } from './ownership/types';
export { createUsageAccounting } from './accounting/aggregate';
export type {
  UsageAccounting,
  UsageAccountingOptions,
  UsageAggregateRow,
  UsageDimension,
  UsageJournalReader,
  UsageOutcomes,
  UsageQuery,
  UsageReport,
} from './accounting/types';
export type { AiProviderRegistry } from './providers/registry';
export type {
  AiProviderModule,
  ModuleAuthority,
  ProviderAdapter,
  ProviderEnvelope,
} from './providers/types';
export type { JournalPruneResult } from './journal/retention';
export { scheduleAiJournalPrune } from './journal/pruneRunner';
export type {
  AiJournalPruneScheduleOptions,
  AiPruneRunnerLogger,
} from './journal/pruneRunner';
export { evaluateAiHealth } from './observability/health';
export type {
  AiHealthReport,
  AiHealthSignal,
  AiHealthThresholds,
} from './observability/health';
export { createMetricsSubscriber } from './observability/metrics';
export type {
  AiHealthSnapshot,
  AiMetricsSubscriber,
  MetricSeries,
} from './observability/metrics';
export type {
  AiEventEmitter,
  AiObservabilityEvent,
} from './observability/types';
