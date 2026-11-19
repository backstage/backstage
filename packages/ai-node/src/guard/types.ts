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

/** An operation mediated by the AI model guard. @alpha */
export type ModelOperation =
  | 'stream'
  | 'complete'
  | 'streamSimple'
  | 'completeSimple'
  | 'streamDeferred'
  | 'fetchDeferred'
  | 'cancelDeferred'
  | 'classify'
  | 'generateImages'
  | 'toolCall';

/** Constructed only by the host from verified durable origin and live credentials. @alpha */
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
  /**
   * Exact host-constructed URL, including any provider query string. Absent
   * for a local module's operation, which never leaves the process.
   */
  destination?: string;
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

/**
 * One bound guarded operation: the guarded transport and its settlement.
 *
 * @alpha
 */
export interface GuardedOperation {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  /**
   * Opens the attempt for a dispatch that sends nothing — a local module's
   * host function — performing the trusted-context check, the per-attempt
   * permission recheck, the fence check and the allow decision with its
   * intent row. Never called by an HTTP dispatch, whose guarded fetch does
   * the same work when it is invoked.
   */
  begin?(): Promise<void>;
  finish(outcome: 'completed' | 'failed' | 'cancelled'): Promise<void>;
}

/**
 * The guard that mediates provider dispatches.
 *
 * @remarks
 * For every dispatch the guard writes the decision and its intent before the
 * send, rechecks the caller's permission and the credential generation with
 * the caller's own credentials, enforces fence currency, validates the final
 * envelope against the module's approved routes, and records the outcome.
 *
 * A module whose adapter is `local` narrows that guarantee deliberately: the
 * decision, the fence check and the per-attempt permission recheck still
 * happen BEFORE the host function runs, and the outcome is journaled, but
 * there is no send to account for and no envelope to validate — the host
 * function executes with the backend process's own privileges and the guard
 * cannot see or constrain what it does. That is the same class of documented
 * narrowing as a host-supplied code-mode extension factory, and it is why a
 * local module has to be registered on purpose.
 *
 * @alpha
 */
export interface ModelOperationGuard {
  bind(operation: TrustedOperation): GuardedOperation;
}
