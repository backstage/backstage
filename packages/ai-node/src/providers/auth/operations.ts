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
import type { Fence } from '../../contracts';
import type {
  AiCredentialStores,
  CredentialScope,
} from '../../credentials/types';
import type { AttemptJournal } from '../../journal/types';
import type { AiEventEmitter } from '../../observability/types';
import { AuthTokenRejection, recordAuthDenial } from './guard';
import type { AuthModuleLookup } from './guard';
import type { AuthOperationGuard } from './types';
import type {
  AiAuthModule,
  AuthOperationKind,
  TrustedAuthOperation,
} from './types';

/**
 * Default window before expiry in which a credential is refreshed. The model
 * integration uses the same constant to decide when to invoke a host refresh.
 *
 * @internal
 */
export const DEFAULT_REFRESH_WINDOW_MS = 60_000;

/** Upper bound for a token response body. */
const MAX_RESPONSE_BYTES = 64 * 1024;

/**
 * A safe, secret-free failure from an auth operation.
 *
 * @internal
 */
export class AuthOperationError extends Error {
  constructor(
    readonly code:
      | 'reauth-required'
      | 'not-oauth'
      | 'missing-credential'
      | 'invalid-response'
      | 'misconfigured'
      | 'unsupported-scope',
    message: string,
  ) {
    super(message);
    this.name = 'AuthOperationError';
  }
}

/**
 * Host-constructed context for one auth operation.
 *
 * @remarks
 *
 * Mirrors the model dispatch context: verified provenance, the caller's live
 * credentials, the fence of the owning namespace, and the definition and
 * configuration versions. Destinations, providers and client identifiers are
 * never taken from it.
 *
 * @internal
 */
export type AuthOperationContext = Readonly<{
  actor: string;
  credentials: BackstageCredentials;
  provenance: TrustedAuthOperation['provenance'];
  fence: Fence;
  definitionVersion: string;
  configVersion: string;
}>;

/** @internal */
export type RefreshCredentialInput = Readonly<{
  context: AuthOperationContext;
  /** Must be a personal scope: installation credentials are read-only. */
  scope: CredentialScope;
  providerId: string;
  /** Overrides the configured public client ID for this request. */
  clientId?: string;
  /**
   * Cancels only while waiting for the credential lock. A started refresh is
   * never interrupted, so a rotated token is never lost.
   */
  signal?: AbortSignal;
}>;

/** @internal */
export type ExchangeLoginCodeInput = Readonly<{
  context: AuthOperationContext;
  scope: CredentialScope;
  providerId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
  clientId?: string;
  signal?: AbortSignal;
}>;

/** @internal */
export type AuthRefreshResult = Readonly<{
  status: 'refreshed' | 'fresh';
  /** Expiry of the credential now stored, in epoch milliseconds. */
  expires: number;
}>;

/** @internal */
export type AuthExchangeResult = Readonly<{
  status: 'stored';
  /** Expiry of the freshly stored credential, in epoch milliseconds. */
  expires: number;
}>;

/**
 * Guards, journals and persists provider authentication operations.
 *
 * @remarks
 *
 * Both operations run the full per-attempt discipline through
 * {@link AuthOperationGuard}: ordinal, envelope validation, authority recheck,
 * a durable allow intent, then the send. The refresh runs inside the encrypted
 * store's `modify` callback, so the existing `(scope, provider)` lock
 * serializes concurrent refreshes across processes and the rotated credential
 * is committed before the lock is released. A refresh that fails leaves the
 * stored credential untouched, and no token or grant value ever reaches the
 * journal: intents carry the endpoint, operation, attempt and decision only.
 *
 * @internal
 */
export interface AiAuthOperations {
  refresh(input: RefreshCredentialInput): Promise<AuthRefreshResult>;
  exchangeLoginCode(input: ExchangeLoginCodeInput): Promise<AuthExchangeResult>;
}

/** @internal */
export interface AuthOperationsOptions {
  guard: AuthOperationGuard;
  journal: AttemptJournal;
  stores: AiCredentialStores;
  modules: AuthModuleLookup;
  /**
   * Host-configured trusted token endpoints keyed by provider ID. Each must be
   * an absolute `https` (or local test `http`) URL on a reserved token route.
   * Keying by provider lets several providers share a token route.
   */
  tokenEndpoints: Readonly<Record<string, string>>;
  /** Public OAuth client IDs per provider ID. Never a client secret. */
  clientIds: Readonly<Record<string, string>>;
  /** Refresh credentials expiring within this window. Default one minute. */
  refreshWindowMs?: number;
  /** Observability sink for local denials; no-op when absent. */
  events?: AiEventEmitter;
  now?(): number;
}

/**
 * Fixed, secret-free failure detail for the recovery record. Never derived
 * from a response body.
 */
function failureDetail(error: unknown): string {
  if (error instanceof AuthTokenRejection) {
    return 'provider rejected the token request';
  }
  if (error instanceof AuthOperationError) {
    return error.code;
  }
  return 'token exchange failed';
}

function endpointKey(value: string): string | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (
    value.includes('?') ||
    value.includes('#') ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    (url.protocol !== 'https:' &&
      !(
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      ))
  ) {
    return undefined;
  }
  return `${url.protocol}//${url.host}${url.pathname}`;
}

async function readJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length > MAX_RESPONSE_BYTES) {
    throw new AuthOperationError(
      'invalid-response',
      'The provider token response exceeds the accepted size',
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new AuthOperationError(
      'invalid-response',
      'The provider token response is not valid JSON',
    );
  }
}

/**
 * Creates the guarded auth operations.
 *
 * @internal
 */
export function createAuthOperations(
  options: AuthOperationsOptions,
): AiAuthOperations {
  const now = options.now ?? Date.now;
  const refreshWindowMs = options.refreshWindowMs ?? DEFAULT_REFRESH_WINDOW_MS;

  const entries = Object.entries(options.tokenEndpoints ?? {});
  if (entries.length === 0) {
    throw new AuthOperationError(
      'misconfigured',
      'Auth operations require at least one trusted token endpoint from configuration',
    );
  }
  const endpoints = new Map<string, string>();
  for (const [providerId, raw] of entries) {
    if (typeof providerId !== 'string' || providerId.length === 0) {
      throw new AuthOperationError(
        'misconfigured',
        'Trusted token endpoints must be keyed by provider ID',
      );
    }
    const canonical = endpointKey(raw);
    if (canonical === undefined) {
      throw new AuthOperationError(
        'misconfigured',
        'Trusted token endpoints must be absolute https URLs on /oauth/token or /v1/oauth/token without query, fragment or userinfo',
      );
    }
    const path = new URL(canonical).pathname;
    if (path !== '/oauth/token' && path !== '/v1/oauth/token') {
      throw new AuthOperationError(
        'misconfigured',
        'Trusted token endpoints must use the reserved /oauth/token or /v1/oauth/token route',
      );
    }
    endpoints.set(providerId, canonical);
  }
  const trusted = Object.freeze([...endpoints.values()]);

  const moduleFor = (providerId: string): AiAuthModule => {
    const module = options.modules.get(providerId);
    if (module === undefined) {
      throw new AuthOperationError(
        'misconfigured',
        `No auth module is registered for provider '${providerId}'`,
      );
    }
    return module;
  };
  const endpointFor = (module: AiAuthModule): string => {
    const endpoint = endpoints.get(module.id);
    if (endpoint === undefined) {
      throw new AuthOperationError(
        'misconfigured',
        `Configuration must declare a trusted token endpoint for provider '${module.id}'`,
      );
    }
    if (new URL(endpoint).pathname !== module.tokenPath) {
      throw new AuthOperationError(
        'misconfigured',
        `The configured token endpoint for provider '${module.id}' must use the module's reserved route '${module.tokenPath}'`,
      );
    }
    return endpoint;
  };
  const clientIdFor = (providerId: string, override?: string): string => {
    const clientId = override ?? options.clientIds[providerId];
    if (typeof clientId !== 'string' || clientId.length === 0) {
      throw new AuthOperationError(
        'misconfigured',
        `Auth operations for provider '${providerId}' require a public client ID; declare it in configuration`,
      );
    }
    return clientId;
  };
  if (Object.values(options.clientIds).some(id => typeof id !== 'string')) {
    throw new AuthOperationError(
      'misconfigured',
      'Configured client IDs must be strings',
    );
  }

  const operationFor = (
    context: AuthOperationContext,
    providerId: string,
    kind: AuthOperationKind,
    endpoint: string,
  ): TrustedAuthOperation => ({
    actor: context.actor,
    credentials: context.credentials,
    provenance: context.provenance,
    fence: context.fence,
    definitionVersion: context.definitionVersion,
    configVersion: context.configVersion,
    provider: providerId,
    operation: kind,
    destination: endpoint,
    authTokenDestinations: trusted,
    controller: new AbortController(),
  });

  const assertUserScope = (scope: CredentialScope): void => {
    if (scope.kind !== 'user') {
      throw new AuthOperationError(
        'unsupported-scope',
        'Auth operations write provider credentials; only a personal (user) scope is writable. Installation credentials are configured, not refreshed',
      );
    }
  };

  const settleFailure = async (
    journal: AttemptJournal,
    operation: TrustedAuthOperation,
    error: unknown,
  ): Promise<void> => {
    const detail = failureDetail(error);
    await journal
      .recordRecovery(operation.fence, {
        actor: operation.actor,
        kind: operation.operation === 'auth.token' ? 'needs-reauth' : 'other',
        conversationId: operation.provenance.conversationId,
        taskId: operation.provenance.taskId,
        callId: operation.provenance.callId,
        definitionVersion: operation.definitionVersion,
        configVersion: operation.configVersion,
        detail,
      })
      .catch(() => undefined);
  };

  return {
    async refresh(input) {
      assertUserScope(input.scope);
      const module = moduleFor(input.providerId);
      const endpoint = endpointFor(module);
      const clientId = clientIdFor(input.providerId, input.clientId);
      const operation = operationFor(
        input.context,
        input.providerId,
        'auth.token',
        endpoint,
      );
      const guarded = options.guard.bind(operation);
      const store = options.stores.forScope(input.scope);

      let result: AuthRefreshResult | undefined;
      let failure: unknown;
      try {
        // The store's (scope, provider) lock serializes this across processes:
        // a concurrent refresh observes the rotated credential and does not
        // call the token endpoint twice.
        await store.modify(
          input.providerId,
          async current => {
            if (current === undefined) {
              await recordAuthDenial(
                options.journal,
                operation,
                're-authentication required: no stored credential',
                1,
                options.events,
              );
              throw new AuthOperationError(
                'missing-credential',
                `No stored credential for provider '${input.providerId}'; re-authentication required`,
              );
            }
            if (current.type !== 'oauth') {
              await recordAuthDenial(
                options.journal,
                operation,
                're-authentication required: stored credential is not an OAuth credential',
                1,
                options.events,
              );
              throw new AuthOperationError(
                'not-oauth',
                `The stored credential for provider '${input.providerId}' is not an OAuth credential; re-authentication required`,
              );
            }
            const expiresAt = current.expires;
            if (
              Number.isFinite(expiresAt) &&
              expiresAt - now() > refreshWindowMs
            ) {
              result = { status: 'fresh', expires: expiresAt };
              return undefined;
            }
            try {
              const response = await guarded.fetch(
                module.refreshRequest({
                  endpoint,
                  providerId: input.providerId,
                  clientId,
                  credential: current,
                }),
              );
              const body = await readJsonBody(response);
              const refreshed = module.parseTokenResponse({
                operation: 'auth.token',
                body,
                previous: current,
                now: now(),
              });
              await guarded.finish('completed');
              result = { status: 'refreshed', expires: refreshed.expires };
              return refreshed;
            } catch (error) {
              await guarded.finish('failed').catch(() => undefined);
              failure = error;
              throw error;
            }
          },
          // Cancellation applies only until the refresh starts, so a rotated
          // token is never lost to a caller that gave up.
          { ...(input.signal ? { signal: input.signal } : {}) },
        );
      } catch (error) {
        await settleFailure(options.journal, operation, failure ?? error);
        throw failure ?? error;
      }
      if (result === undefined) {
        throw new AuthOperationError(
          'invalid-response',
          'The refresh produced no result',
        );
      }
      return result;
    },

    async exchangeLoginCode(input) {
      assertUserScope(input.scope);
      const module = moduleFor(input.providerId);
      const endpoint = endpointFor(module);
      const clientId = clientIdFor(input.providerId, input.clientId);
      const operation = operationFor(
        input.context,
        input.providerId,
        'auth.token-exchange',
        endpoint,
      );
      const guarded = options.guard.bind(operation);
      const store = options.stores.forScope(input.scope);

      let result: AuthExchangeResult | undefined;
      let failure: unknown;
      try {
        await store.modify(
          input.providerId,
          async () => {
            try {
              const response = await guarded.fetch(
                module.exchangeRequest({
                  endpoint,
                  providerId: input.providerId,
                  clientId,
                  code: input.code,
                  codeVerifier: input.codeVerifier,
                  redirectUri: input.redirectUri,
                }),
              );
              const body = await readJsonBody(response);
              const credential = module.parseTokenResponse({
                operation: 'auth.token-exchange',
                body,
                now: now(),
              });
              await guarded.finish('completed');
              result = { status: 'stored', expires: credential.expires };
              return credential;
            } catch (error) {
              await guarded.finish('failed').catch(() => undefined);
              failure = error;
              throw error;
            }
          },
          { ...(input.signal ? { signal: input.signal } : {}) },
        );
      } catch (error) {
        await settleFailure(options.journal, operation, failure ?? error);
        throw failure ?? error;
      }
      if (result === undefined) {
        throw new AuthOperationError(
          'invalid-response',
          'The login exchange produced no result',
        );
      }
      return result;
    },
  };
}
