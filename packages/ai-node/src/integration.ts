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

import {
  BACKGROUND_CONTEXT,
  type Context,
} from '@earendil-works/chord/context';
import { Harness, type Storage } from '@earendil-works/pi-durable';
import type { AnyModel, Credential, Models } from '@earendil-works/pi-ai';
import type { Knex } from 'knex';
import { createHash } from 'node:crypto';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { JsonObject } from '@backstage/types';
import type { AiCredentialStores, CredentialScope } from './credentials/types';
import {
  createAttemptJournal,
  AI_AUDIT_READ_PERMISSION_NAME,
  type AttemptJournal,
  type AuditEventView,
} from './journal/index';
import { createModelOperationGuard } from './guard/createModelOperationGuard';
import {
  createGuardedModelOperations,
  GuardedResolutionError,
  type GuardedModelBinding,
} from './guard/modelOperations';
import type {
  ModelOperation,
  ModelOperationGuard,
  TrustedOperation,
} from './guard/types';
import { modelPermissionName } from './permissions/modelPermissions';
import {
  createAiRecovery,
  createKnexNamespaceLease,
  startLeaseKeepalive,
  type AiRecovery,
  type LeaseKeepalive,
  type NamespaceLease,
} from './ownership/index';
import { createKnexStorage } from './storage/knex';
import type {
  AcquisitionBinding,
  AiServiceIntegration,
  DefaultAiServiceDeps,
  NativeHarnessHandle,
  OpenNativeHarnessInput,
} from './DefaultAiService';
import type { Namespace } from './contracts';

/**
 * The endpoint path each guarded provider API appends to the model's base
 * URL.
 *
 * @remarks
 *
 * Must stay in sync with the endpoint enforcement in the guard's request
 * validation, which rejects any request whose path does not end in the
 * expected endpoint for the operation's API.
 */
const API_ENDPOINT_PATHS = {
  'openai-responses': '/responses',
  'openai-completions': '/chat/completions',
  'azure-openai-responses': '/responses',
  'openai-codex-responses': '/responses',
  'anthropic-messages': '/messages',
} as const;

/** The recovery session table written by the ownership module. */
const RECOVERY_SESSIONS_TABLE = 'ai_recovery_sessions';

/** Lease keepalive cadence; the lease lifetime defaults to one minute. */
const LEASE_KEEPALIVE_INTERVAL_MS = 15_000;

/**
 * Options for {@link createAiServiceIntegration}.
 *
 * @internal
 */
export interface AiServiceIntegrationOptions {
  readonly deps: DefaultAiServiceDeps;
  /**
   * Credential stores feeding provider authority resolution. When absent,
   * every model dispatch is denied with an actionable reason: installation
   * credential configuration is not wired to a config source yet.
   */
  readonly credentialStores?: AiCredentialStores;
  /**
   * The canonical model catalog, never caller-supplied. When absent, model
   * lookups resolve no model and generation rejects with the native
   * no-model availability error.
   */
  readonly models?: readonly AnyModel[];
}

/**
 * The production Wave 1 integration of the managed AI service.
 *
 * @internal
 */
export interface ProductionAiServiceIntegration extends AiServiceIntegration {
  /** Subscribes to lease invalidation for namespaces this process holds. */
  onNamespaceInvalidated(callback: (namespace: Namespace) => void): void;
  /** The plugin-scoped startup recovery owned by this integration. */
  readonly recovery: AiRecovery;
}

/** Per-open state the integration keeps for release and invalidation. */
type OpenState = {
  readonly harness: Harness;
  readonly fence: NonNullable<Awaited<ReturnType<NamespaceLease['acquire']>>>;
  readonly keepalive: LeaseKeepalive;
};

/** A resolved provider authority and its identity for recheck. */
type ResolvedAuthority = {
  readonly scope: CredentialScope;
  readonly generation: string;
  readonly authority: GuardedModelBinding['authority'];
};

function principalOf(
  deps: DefaultAiServiceDeps,
  credentials: BackstageCredentials,
): { kind: 'user'; userId: string } | { kind: 'service'; pluginId: string } {
  const pluginId = deps.pluginMetadata.getId();
  if (deps.auth.isPrincipal(credentials, 'user')) {
    return { kind: 'user', userId: credentials.principal.userEntityRef };
  }
  if (deps.auth.isPrincipal(credentials, 'service')) {
    if (credentials.principal.subject === `plugin:${pluginId}`) {
      return { kind: 'service', pluginId };
    }
    throw new Error(
      `The AI service of the '${pluginId}' plugin cannot open a session for the service principal '${credentials.principal.subject}': only the plugin's own service identity or a user principal can own an AI session`,
    );
  }
  throw new Error(
    'openHarness requires authenticated Backstage credentials carrying a user or service principal',
  );
}

/**
 * Creates the production Wave 1 integration: the exclusive namespace lease
 * with startup recovery (admission and revocation), the fenced Knex Pi
 * storage, the guarded model operations with per-attempt permission checks,
 * and the durable attempt journal.
 *
 * @remarks
 *
 * Provenance note: `TrustedOperation`s are constructed only on the managed
 * admission path, where the caller's credentials, namespace, and registry
 * version were verified at acquisition, so their provenance origin is
 * `verified`. Durable conversation/task/call correlation is a deferred item:
 * until it exists, attempts are correlated to the managed session identity,
 * and each logical model call gets a fresh call ID. Anything that cannot
 * present verified provenance is denied by the guard.
 *
 * @internal
 */
export async function createAiServiceIntegration(
  options: AiServiceIntegrationOptions,
): Promise<ProductionAiServiceIntegration> {
  const { deps } = options;
  const credentialStores = options.credentialStores;
  const catalog = options.models ?? [];
  const db: Knex = await deps.database.getClient();
  const pluginId = deps.pluginMetadata.getId();

  const lease = await createKnexNamespaceLease({ db });
  const recovery = await createAiRecovery({
    db,
    pluginId,
    leases: lease,
    getOwnServiceCredentials: () => deps.auth.getOwnServiceCredentials(),
  });

  const journal: AttemptJournal = createAttemptJournal({
    db,
    authorizer: {
      authorizeAuditRead: async credentials => {
        const decisions = await deps.permissions.authorize(
          [
            {
              permission: {
                type: 'basic',
                name: AI_AUDIT_READ_PERMISSION_NAME,
                attributes: {},
              },
            },
          ],
          { credentials },
        );
        return decisions[0]?.result === 'ALLOW';
      },
    },
    // Session ownership for audit reads resolves through the ownership
    // module's recovery sessions, not the journal's own records.
    ownershipResolver: async namespace => {
      const row = await db(RECOVERY_SESSIONS_TABLE)
        .where({
          plugin_id: namespace.pluginId,
          session_id: namespace.sessionId,
        })
        .first('origin_kind', 'origin_user_id', 'origin_service_plugin_id');
      if (row === undefined) {
        return undefined;
      }
      if (row.origin_kind === 'user') {
        return row.origin_user_id ?? undefined;
      }
      return row.origin_service_plugin_id
        ? `plugin:${row.origin_service_plugin_id}`
        : undefined;
    },
    mirror: {
      mirror: (event: AuditEventView) => {
        // Best-effort write-through to the Backstage auditor; the durable
        // journal is the authority and mirror failures are swallowed.
        void deps.auditor
          .createEvent({
            eventId: 'ai.attempt',
            severityLevel: 'low',
            meta: event as unknown as JsonObject,
          })
          .then(auditEvent => auditEvent.success())
          .catch(() => {});
      },
    },
  });

  /** Resolves the provider authority for a dispatch, or undefined. */
  const resolveAuthority = async (
    providerId: string,
    credentials: BackstageCredentials,
  ): Promise<ResolvedAuthority | undefined> => {
    if (credentialStores === undefined) {
      return undefined;
    }
    const principal = principalOf(deps, credentials);
    // Personal credentials first for user principals, then installation
    // credentials; absence falls through, a read failure does not.
    const scopes: CredentialScope[] =
      principal.kind === 'user'
        ? [{ kind: 'user', id: principal.userId }, { kind: 'org' }]
        : [{ kind: 'org' }];
    for (const scope of scopes) {
      const credential = await credentialStores
        .forScope(scope)
        .read(providerId);
      if (credential === undefined) {
        continue;
      }
      return authorityOf(scope, credential);
    }
    return undefined;
  };

  const guard: ModelOperationGuard = createModelOperationGuard({
    transport: fetch,
    recheck: async operation => {
      // Fresh permission check with the original caller credentials.
      const decisions = await deps.permissions.authorize(
        [
          {
            permission: {
              type: 'basic',
              name: modelPermissionName({
                provider: operation.provider,
                modelId: operation.modelId,
              }),
              attributes: {},
            },
          },
        ],
        { credentials: operation.credentials },
      );
      if (decisions[0]?.result !== 'ALLOW') {
        return false;
      }
      // Fence currency: a rejected renewal means this generation is stale.
      if (!(await lease.renew(operation.fence))) {
        return false;
      }
      // Credential generation: the resolved credential must be unchanged.
      const resolved = await resolveAuthority(
        operation.provider,
        operation.credentials,
      );
      return resolved?.generation === operation.credentialGeneration;
    },
    journal,
  });

  const openStates = new Map<NativeHarnessHandle, OpenState>();
  const invalidationCallbacks: Array<(namespace: Namespace) => void> = [];

  /**
   * Builds the synchronous resolve contract the guarded model operations
   * require: provider authorities are pre-resolved per acquisition, so
   * dispatch either presents a complete trusted operation or a journaled
   * denial.
   */
  function makeResolve(
    input: OpenNativeHarnessInput,
    fence: OpenState['fence'],
    authorities: ReadonlyMap<string, ResolvedAuthority>,
  ): (model: AnyModel, operation: ModelOperation) => GuardedModelBinding {
    // The guarded binding carries chat models; the resolve contract is
    // typed through the guard's own binding shape.
    const sessionRef = `${input.namespace.pluginId}/${input.namespace.sessionId}`;
    let callOrdinal = 0;
    return (model, operation) => {
      const api = model.api as TrustedOperation['api'];
      const trusted: TrustedOperation = {
        actor: input.owner,
        credentials: input.credentials,
        provenance: {
          origin: 'verified' as const,
          conversationId: sessionRef,
          taskId: sessionRef,
          callId: `${sessionRef}#${(callOrdinal += 1)}`,
        },
        fence,
        definitionVersion: input.registryVersion,
        configVersion: input.configVersion,
        provider: model.provider,
        modelId: model.id,
        resolvedModel: model.id,
        operation,
        api,
        destination: `${model.baseUrl}${API_ENDPOINT_PATHS[api]}`,
        credentialScope: { kind: 'org' },
        credentialGeneration: 'unresolved',
        controller: new AbortController(),
      };
      const bindingModel = model as GuardedModelBinding['model'];
      const resolved = authorities.get(model.provider);
      if (resolved === undefined) {
        throw new GuardedResolutionError(
          {
            operation: trusted,
            model: bindingModel,
            authority: { kind: 'apiKey' },
          },
          'provider credentials are not configured for this installation',
        );
      }
      return {
        operation: { ...trusted, ...resolvedAuthorityFields(resolved) },
        model: bindingModel,
        authority: resolved.authority,
      };
    };
  }

  const integration: ProductionAiServiceIntegration = {
    recovery,

    onNamespaceInvalidated(callback) {
      invalidationCallbacks.push(callback);
    },

    async ensureSessionOwnership(
      binding: AcquisitionBinding,
    ): Promise<{ owner: string }> {
      const origin = principalOf(deps, binding.credentials);
      try {
        await recovery.recordSession({
          namespace: binding.namespace,
          origin,
          definitionVersion: binding.registryVersion,
        });
      } catch (error) {
        throw new Error(
          `Access denied: the AI session '${
            binding.namespace.sessionId
          }' of the '${pluginId}' plugin cannot be opened by '${
            binding.owner
          }': ${(error as Error).message}`,
        );
      }
      return { owner: binding.owner };
    },

    async bindAcquisition(binding: AcquisitionBinding): Promise<void> {
      // Fail early when the configured model is already denied, so callers
      // get an actionable error at acquisition instead of at dispatch.
      if (binding.model !== undefined) {
        const decisions = await deps.permissions.authorize(
          [
            {
              permission: {
                type: 'basic',
                name: modelPermissionName(binding.model),
                attributes: {},
              },
            },
          ],
          { credentials: binding.credentials },
        );
        if (decisions[0]?.result !== 'ALLOW') {
          throw new Error(
            `Access denied: the '${pluginId}' plugin's caller is not allowed to use the model '${binding.model.provider}/${binding.model.modelId}' configured at its AI configuration path`,
          );
        }
      }
    },

    async openNativeHarness(
      input: OpenNativeHarnessInput,
    ): Promise<NativeHarnessHandle> {
      const fence = await lease.acquire(input.namespace, input.owner);
      if (fence === undefined) {
        throw new Error(
          `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin is held by another live lease; retry once the current owner releases it`,
        );
      }
      let storage: Storage | undefined;
      try {
        storage = await createKnexStorage({
          db,
          namespace: input.namespace,
          fence,
        });
        // Pre-resolve provider authorities for this acquisition: every
        // provider the catalog or the configured model can dispatch to.
        const providers = new Set<string>(catalog.map(m => m.provider));
        if (input.model !== undefined) {
          providers.add(input.model.provider);
        }
        const authorities = new Map<string, ResolvedAuthority>();
        for (const providerId of providers) {
          const resolved = await resolveAuthority(
            providerId,
            input.credentials,
          );
          if (resolved !== undefined) {
            authorities.set(providerId, resolved);
          }
        }
        const requests = createGuardedModelOperations({
          guard,
          journal,
          resolve: makeResolve(input, fence, authorities),
        });
        const models = {
          ...requests,
          // Canonical catalog lookups only; no provider, credential or
          // administrative access escapes to extensions. Provider auth access
          // is bound at open (required by the native harness) but fails
          // closed on every call.
          getModel: (provider: string, id: string) =>
            catalog.find(
              model => model.provider === provider && model.id === id,
            ),
          getAuth: () => {
            throw new Error(
              'Provider auth access is not exposed through the managed AI service',
            );
          },
        } as unknown as Models;
        const harness = await Harness.open(
          storage,
          {
            models,
            registry: input.registry,
            ...(input.conversationCreated === undefined
              ? {}
              : { conversationCreated: input.conversationCreated }),
          },
          BACKGROUND_CONTEXT,
        );
        const keepalive = startLeaseKeepalive(lease, fence, {
          intervalMs: LEASE_KEEPALIVE_INTERVAL_MS,
          onInvalidated: reason => {
            deps.logger.warn(
              `The lease of AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin was invalidated (${reason}); local handles are drained`,
            );
            for (const callback of invalidationCallbacks) {
              callback(input.namespace);
            }
          },
        });
        const handle: NativeHarnessHandle = {
          harness,
          context: BACKGROUND_CONTEXT as Context,
        };
        openStates.set(handle, { harness, fence, keepalive });
        return handle;
      } catch (error) {
        try {
          await storage?.close(BACKGROUND_CONTEXT);
        } catch {
          /* The open already failed; the lease release below is the arbiter. */
        }
        await lease.release(fence);
        throw error;
      }
    },

    async releaseNativeHarness(handle: NativeHarnessHandle): Promise<void> {
      const state = openStates.get(handle);
      if (state === undefined) {
        return;
      }
      openStates.delete(handle);
      await state.keepalive.stop();
      try {
        // Seals admission, settles accepted commits, and closes the fenced
        // storage without destroying the shared Knex pool. Admitted durable
        // work is never cancelled by release itself.
        await state.harness.close(BACKGROUND_CONTEXT);
      } finally {
        // Conditional on owner and token: a stale release never affects a
        // successor's lease.
        await lease.release(state.fence);
      }
    },
  };

  // Startup recovery: no consuming-plugin resolvers are registerable through
  // this wiring yet, so the resolver set is sealed empty and one pass runs to
  // surface persisted sessions as visibly blocked rather than silently
  // resumed or dropped.
  recovery.completeStartup();
  void recovery
    .recover()
    .then(report => {
      const unresolved = report.outcomes.filter(
        outcome => outcome.status !== 'recovered',
      ).length;
      if (unresolved > 0) {
        deps.logger.info(
          `AI recovery examined ${report.examined} session(s) of the '${pluginId}' plugin; ${unresolved} remain unresolved`,
        );
      }
    })
    .catch(error => {
      deps.logger.error(
        `AI recovery failed for the '${pluginId}' plugin: ${error}`,
      );
    });

  return integration;
}

function resolvedAuthorityFields(resolved: ResolvedAuthority): {
  credentialScope: CredentialScope;
  credentialGeneration: string;
} {
  return {
    credentialScope: resolved.scope,
    credentialGeneration: resolved.generation,
  };
}

function authorityOf(
  scope: CredentialScope,
  credential: Credential,
): ResolvedAuthority {
  if (credential.type === 'api_key') {
    if (typeof credential.key !== 'string' || credential.key.length === 0) {
      throw new Error(
        'The stored provider credential has no API key; re-authenticate the provider',
      );
    }
    return {
      scope,
      generation: generationOf(scope, credential.key),
      authority: { kind: 'apiKey', apiKey: credential.key },
    };
  }
  return {
    scope,
    generation: generationOf(scope, credential.access),
    authority: {
      kind: 'oauth',
      headers: { authorization: `Bearer ${credential.access}` },
      expiresAt: credential.expires,
    },
  };
}

/** Stable, non-reversible identity of a credential instance. */
function generationOf(scope: CredentialScope, secret: string): string {
  return createHash('sha256')
    .update(`${scopeKeyOf(scope)}:${secret}`)
    .digest('hex')
    .slice(0, 16);
}

function scopeKeyOf(scope: CredentialScope): string {
  if (scope.kind === 'org') {
    return 'org';
  }
  if (scope.kind === 'user') {
    return `user:${scope.id}`;
  }
  return `service:${scope.id}`;
}
