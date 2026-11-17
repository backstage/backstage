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
  api:
    | 'openai-responses'
    | 'openai-completions'
    | 'azure-openai-responses'
    | 'openai-codex-responses'
    | 'anthropic-messages';
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

export interface GuardedOperation {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  finish(outcome: 'completed' | 'failed' | 'cancelled'): Promise<void>;
}

export interface ModelOperationGuard {
  bind(operation: TrustedOperation): GuardedOperation;
}
