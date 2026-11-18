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
import type { OAuthCredential } from '@earendil-works/pi-ai';
import type { Fence } from '../../contracts';

/**
 * The two authenticated operation families this module certifies.
 *
 * @remarks
 *
 * `auth.token` is a refresh of an existing OAuth credential, and
 * `auth.token-exchange` is an authorization-code exchange performed by the
 * login flow. Both are classified separately from model generation and both
 * are journal-owned operations: their token endpoints are the reserved
 * `/oauth/token` and `/v1/oauth/token` routes.
 *
 * @alpha
 */
export type AuthOperationKind = 'auth.token' | 'auth.token-exchange';

/**
 * A host-constructed auth attempt. Constructed only from a verified durable
 * origin and the caller's live credentials, never from browser input.
 *
 * @internal
 */
export type TrustedAuthOperation = Readonly<{
  /** Redacted actor: the authenticated principal entity ref, never a token. */
  actor: string;
  credentials: BackstageCredentials;
  provenance: Readonly<{
    origin: 'verified';
    conversationId: string;
    taskId: string;
    callId: string;
  }>;
  fence: Fence;
  definitionVersion: string;
  configVersion: string;
  /** Provider whose token endpoint is called, e.g. `anthropic`. */
  provider: string;
  operation: AuthOperationKind;
  /**
   * Exact allowlisted token endpoint: origin plus `/oauth/token` or
   * `/v1/oauth/token`, no query string, fragment or userinfo.
   */
  destination: string;
  /** Host-configured trusted token endpoints. Never caller options. */
  authTokenDestinations: readonly string[];
  controller: AbortController;
}>;

/**
 * Shared validation before any auth send. An untrusted or incomplete auth
 * attempt denies and can never reach a provider token endpoint.
 *
 * @internal
 */
export function hasTrustedAuthOperationContext(
  value: unknown,
): value is TrustedAuthOperation {
  if (!value || typeof value !== 'object') return false;
  const op = value as TrustedAuthOperation;
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
    (op.operation === 'auth.token' || op.operation === 'auth.token-exchange') &&
    nonempty(op.destination) &&
    Array.isArray(op.authTokenDestinations) &&
    nonempty(op.fence?.owner) &&
    nonempty(op.fence?.token) &&
    nonempty(op.fence?.namespace?.pluginId) &&
    nonempty(op.fence?.namespace?.sessionId) &&
    op.controller instanceof AbortController &&
    !op.controller.signal.aborted
  );
}

/**
 * Input shared by both auth request builders.
 *
 * @alpha
 */
export type AuthTokenRequestBase = Readonly<{
  /** Exact allowlisted token endpoint. */
  endpoint: string;
  providerId: string;
  /** Public OAuth client identifier; never a client secret. */
  clientId: string;
}>;

/**
 * Input for a refresh request.
 *
 * @alpha
 */
export type OAuthRefreshInput = AuthTokenRequestBase &
  Readonly<{ credential: OAuthCredential }>;

/**
 * Input for an authorization-code exchange request.
 *
 * @alpha
 */
export type OAuthLoginExchangeInput = AuthTokenRequestBase &
  Readonly<{
    code: string;
    codeVerifier: string;
    redirectUri: string;
  }>;

/**
 * A host-trusted registration for one provider's OAuth token endpoint.
 *
 * @remarks
 *
 * Modules are not sandboxed. Register only code trusted as your own plugin.
 * A module owns provider semantics — request encoding, grant parameters,
 * response shape and the non-secret fields copied onto the credential — while
 * the guard owns every provider-agnostic invariant (ordinal, destination
 * binding, recheck, durable intent before send, latching, settlement).
 *
 * The token endpoint is one of the two journal-owned routes; the host supplies
 * the allowlisted absolute endpoints, never the module.
 *
 * @alpha
 */
export type AiAuthModule = Readonly<{
  /** Provider ID this module authenticates. */
  id: string;
  /** Journal-owned token route; the endpoint's path must match exactly. */
  tokenPath: '/oauth/token' | '/v1/oauth/token';
  /** Whether token requests carry a JSON or form-encoded body. */
  body: 'json' | 'form';
  /** Builds the refresh request; the body carries the refresh token. */
  refreshRequest(input: OAuthRefreshInput): Request;
  /** Builds the authorization-code exchange request. */
  exchangeRequest(input: OAuthLoginExchangeInput): Request;
  /**
   * Pre-send envelope validation: same endpoint, method, body encoding and
   * grant parameters the module would build, and nothing else.
   */
  validateTokenRequest(input: {
    operation: AuthOperationKind;
    endpoint: string;
    request: Request;
  }): Promise<void>;
  /**
   * Parses a successful token response into a credential. Rejects anything
   * outside the contract; never returns response values to the journal.
   */
  parseTokenResponse(input: {
    operation: AuthOperationKind;
    body: unknown;
    previous?: OAuthCredential;
    now: number;
  }): OAuthCredential;
  /** Non-secret response fields copied onto the credential. */
  extraFields?: readonly string[];
}>;

/**
 * The transported auth attempt. Mirrors the model guard's discipline so both
 * families settle the same way.
 *
 * @internal
 */
export type GuardedAuthOperation = Readonly<{
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  finish(outcome: 'completed' | 'failed' | 'cancelled'): Promise<void>;
}>;

/** @internal */
export interface AuthOperationGuard {
  bind(operation: TrustedAuthOperation): GuardedAuthOperation;
}
