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

import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Fence } from '../contracts';
import type { CredentialScope } from '../credentials/types';

export type ModelOperation =
  | 'stream'
  | 'complete'
  | 'streamSimple'
  | 'completeSimple'
  | 'streamDeferred'
  | 'fetchDeferred'
  | 'cancelDeferred'
  | 'classify'
  | 'generateImages';

/** Constructed only by the host from verified durable origin and live credentials. */
export type TrustedOperation = Readonly<{
  actor: string;
  credentials: BackstageCredentials;
  provenance: Readonly<{
    origin: 'verified' | 'unverified';
    conversationId: string;
    taskId: string;
    callId: string;
  }>;
  fence: Fence;
  definitionVersion: string;
  configVersion: string;
  provider: string;
  modelId: string;
  /** Final remote selector; Azure deployment mapping must be trusted by the host. */
  resolvedModel: string;
  operation: ModelOperation;
  /** Registered provider module identifier. */
  api: string;
  /** Exact host-constructed URL, including any provider query string. */
  destination: string;
  /** Host-configured Anthropic federation token endpoints, not caller options. */
  authTokenDestinations?: readonly string[];
  credentialScope: CredentialScope;
  credentialGeneration: string;
  /** Host-bound expiry of an OAuth access credential; no native auto-refresh. */
  providerCredentialExpiresAt?: number;
  controller: AbortController;
}>;

/** Shared validation before dispatch or a typed resolution-denial append. */
export function hasTrustedOperationContext(
  value: unknown,
): value is TrustedOperation {
  if (!value || typeof value !== 'object') return false;
  const op = value as TrustedOperation;
  const nonempty = (s: unknown) => typeof s === 'string' && s.length > 0;
  return !!(
    op.provenance?.origin === 'verified' &&
    nonempty(op.provenance.conversationId) &&
    nonempty(op.provenance.taskId) &&
    nonempty(op.provenance.callId) &&
    op.credentials &&
    typeof op.credentials === 'object' &&
    nonempty(op.actor) &&
    nonempty(op.definitionVersion) &&
    nonempty(op.configVersion) &&
    nonempty(op.provider) &&
    nonempty(op.modelId) &&
    nonempty(op.resolvedModel) &&
    op.credentialScope &&
    typeof op.credentialScope === 'object' &&
    nonempty(op.credentialGeneration) &&
    nonempty(op.fence?.owner) &&
    nonempty(op.fence?.token) &&
    nonempty(op.fence?.namespace?.pluginId) &&
    nonempty(op.fence?.namespace?.sessionId) &&
    op.controller instanceof AbortController &&
    !op.controller.signal.aborted
  );
}

export interface GuardedOperation {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  finish(outcome: 'completed' | 'failed' | 'cancelled'): Promise<void>;
}

export interface ModelOperationGuard {
  bind(operation: TrustedOperation): GuardedOperation;
}
