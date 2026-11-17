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
import {
  Harness,
  type Extension,
  type RegistryReader,
  type RegistrySnapshot,
  type Storage,
} from '@earendil-works/pi-durable';
import { createCodemodeExtension } from '@earendil-works/pi-durable/codemode';
import { CodemodeSandbox } from '@earendil-works/pi-codemode';
import type {
  CodemodeRun,
  CodemodeRunOptions,
} from '@earendil-works/pi-codemode/portable';
import type { AnyModel, Credential, Models } from '@earendil-works/pi-ai';
import { builtinProviderRegistry } from './providers/builtins';
import type { AiProviderRegistry } from './providers/registry';
import type { Knex } from 'knex';
import { createHash, randomUUID } from 'node:crypto';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { JsonObject } from '@backstage/types';
import type { AiCredentialStores, CredentialScope } from './credentials/types';
import type { AiCredentialsPrecedence } from './config-extension/types';
import { DEFAULT_REFRESH_WINDOW_MS } from './providers/auth/operations';
import { type AttemptJournal, type AuditEventView } from './journal/index';
import { createWiredAttemptJournal } from './journal/wired';
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
import type { Fence, Namespace } from './contracts';

/** Deeply freezes the host-supplied canonical catalog at integration time. */
function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const key of Object.getOwnPropertyNames(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
    Object.freeze(value);
  }
  return value;
}

/** The recovery session table written by the ownership module. */
const NAMESPACE_LEASES_TABLE = 'ai_namespace_leases';

/** Drain-join poll interval for an open waiting on a draining admission. */
const DRAIN_POLL_MS = 20;
/**
 * Grace given to a drain whose fence is already dead: its conditional lease
 * release is its last step, so it is normally settling right now.
 */
const DRAIN_GRACE_MS = 150;
/**
 * Hard overall bound on joining a drain, backing the fence-liveness signal:
 * no open of this integration waits longer than this for a release.
 */
const DRAIN_WAIT_LIMIT_MS = 30_000;

/** Lease keepalive cadence; the lease lifetime defaults to one minute. */
const LEASE_KEEPALIVE_INTERVAL_MS = 15_000;

/**
 * Input for a host-injected credential refresh.
 *
 * @remarks
 *
 * Structures exactly the trusted context an auth operation needs, so a host can
 * bind it to `createAuthOperations().refresh` without reconstructing authority
 * from caller data.
 *
 * @internal
 */
export interface CredentialRefreshInput {
  readonly provider: string;
  readonly scope: CredentialScope;
  readonly credentials: BackstageCredentials;
  readonly fence: Fence;
  readonly actor: string;
  readonly provenance: Readonly<{
    conversationId: string;
    taskId: string;
    callId: string;
  }>;
  readonly definitionVersion: string;
  readonly configVersion: string;
}

/**
 * Guarded credential refresh invoked before a model dispatch whose OAuth
 * credential is at or inside the refresh window.
 *
 * @remarks
 *
 * The hook is expected to perform a journaled `auth.token` operation and
 * persist the rotated credential. Its rejection denies the dispatch. When it is
 * absent, an expired OAuth credential is denied exactly as before: with a
 * journaled `credential expired; re-authentication required` reason.
 *
 * @internal
 */
export type CredentialRefreshHook = (
  input: CredentialRefreshInput,
) => Promise<void>;

/**
 * Options for {@link createAiServiceIntegration}.
 *
 * @internal
 */
export interface AiServiceIntegrationOptions {
  readonly deps: DefaultAiServiceDeps;
  /** Trusted provider registrations shared by the guard and journal. */
  readonly providers?: AiProviderRegistry;
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
  /**
   * Whether a caller's personal provider credential wins over the
   * installation's. Defaults to `user-first`: absence always falls through to
   * the next scope, a failed read never does.
   */
  readonly credentialPrecedence?: AiCredentialsPrecedence;
  /**
   * Guarded refresh for expiring OAuth credentials, invoked before dispatch.
   * Absent means no automatic refresh: an expired credential denies.
   */
  readonly refreshExpiredCredential?: CredentialRefreshHook;
  /**
   * Opt-in code mode: Pi's `codemode` extension, which runs model-written
   * JavaScript in a QuickJS sandbox whose script survives restarts by
   * deterministic replay. Presence enables it for every harness this
   * integration opens, appended to the caller's registry selection; it
   * replaces any caller extension also named `codemode`.
   *
   * Resource limits: `timeoutMs` is the host wall-clock ceiling per script
   * execution including time spent in tools — a script's own
   * `// @options {"timeout_ms": ...}` may lower it, never exceed it — and
   * defaults to 300000. `memoryLimitBytes` bounds the QuickJS heap; it
   * defaults to no explicit limit (the wasm32 address space bounds it at
   * 4 GiB) — set one to bound a runaway script's allocations. Script output
   * is capped at 16 MiB / 100000 items and script store writes at 1 MiB
   * total. Replay storage is O(nested results): one journal commit plus
   * one count commit per delivered result, on top of each nested call's
   * own commits, in the conversation's durable storage (separate from the
   * AI audit journal).
   *
   * Isolation and audit: scripts see only their tools and Pi's script
   * globals — no network, filesystem, timers, `process`, or modules — and
   * model calls from inside scripts (the `models.*` globals) route through
   * the guarded facade like any other dispatch, with the per-attempt
   * permission, fence, and credential recheck and audit journaling. Until a
   * provider module certifies them, those calls deny fail-closed.
   */
  readonly codemode?: {
    /** Host wall-clock ceiling per script execution. Default 300000. */
    readonly timeoutMs?: number;
    /** QuickJS heap limit. Default: no explicit limit. */
    readonly memoryLimitBytes?: number;
  };
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
  /**
   * The model operation guard of this integration, already wired to the
   * journal and recheck. Exposed so composed tests can drive unverified
   * provenance through the real wiring.
   */
  readonly guard: ModelOperationGuard;
}

/** The shared fence of a namespace, set once the first reservation acquires it. */
type AdmissionFence = NonNullable<
  Awaited<ReturnType<NamespaceLease['acquire']>>
>;

/** Per-open state the integration keeps for release. */
type HandleState = {
  readonly harness: Harness;
  /** The admission this handle was published on. */
  readonly admission: NativeAdmission;
  /** The code mode sandbox of this open, closed with the harness. */
  readonly codemodeSandbox?: { close(): Promise<void> };
};

/**
 * The native admission lifecycle of one namespace.
 *
 * @remarks
 *
 * A single serialized object owns everything a namespace's native handles
 * share: the authority (the acquiring call's verified credentials and the
 * provider authorities resolved for them), the fence, the keepalive, the
 * published holders, the pending open reservations and the drain state.
 * Every lifecycle transition has exactly one code path through this object:
 *
 * - Reservations are taken synchronously, before any await, so overlapping
 *   opens resolve before any state is mutated: same-credentials opens join
 *   the admission, distinct-credentials opens fail closed, and a pending
 *   open can never overwrite an admission that went live (or died) while it
 *   was resolving provider authorities — the reservation's identity is
 *   pinned by the admission object it reserved on.
 * - Cleanup is reservation-owned: a failed open undoes exactly its own
 *   reservation, and the shared fence is released only when no pending or
 *   live owner remains.
 * - Drain joining is bounded: an open that meets a draining admission waits
 *   for the drain, but never unboundedly — a close that never settles
 *   surfaces as a bounded, retryable unavailability once the draining
 *   admission's fence is no longer live. A successor is never admitted
 *   merely because time elapsed: while the fence is live, the wait holds.
 */
type NativeAdmission = {
  readonly namespace: Namespace;
  /** The single live authority: immutable for the admission's lifetime. */
  readonly credentials: BackstageCredentials;
  /** Provider authorities resolved for the acquiring credentials. */
  authorities: ReadonlyMap<string, ResolvedAuthority>;
  /** The shared fence, set once the first reservation acquires the lease. */
  fence: AdmissionFence | undefined;
  /** Renewal for the shared fence, started when the fence is acquired. */
  keepalive: LeaseKeepalive | undefined;
  /** Published native handles of this admission. */
  readonly holders: Set<NativeHarnessHandle>;
  /** In-flight open reservations. */
  pending: number;
  /**
   * Native closes registered on this admission and still in flight. A
   * closing harness — and the admitted work its close settles — stays
   * owned by the admission until the close settles; the last-owner drain
   * joins every registered close before the conditional lease release.
   */
  readonly closing: Set<Promise<void>>;
  /** Serializes native opens of this admission. */
  openChain: Promise<unknown>;
  /** True once the last owner left and the admission is closing. */
  draining: boolean;
  /** The drain tail, never rejecting; undefined until draining starts. */
  drain: Promise<void> | undefined;
  /** True once the drain settled. */
  drainSettled: boolean;
  /**
   * True when the drain terminated WITHOUT completing the conditional
   * release and removing the map entry: a terminal failure that retains
   * ownership. A later open performs one bounded release retry; it must
   * never report successful completion and rejoin the failed admission.
   */
  drainFailed: boolean;
};

/** The authority context a dispatch binds to: the admission's view. */
type AdmissionAuthority = {
  readonly credentials: BackstageCredentials;
  readonly authorities: ReadonlyMap<string, ResolvedAuthority>;
};

/** A resolved provider authority and its identity for recheck. */
type ResolvedAuthority = {
  readonly scope: CredentialScope;
  readonly generation: string;
  readonly authority: GuardedModelBinding['authority'];
  /** Provider-scoped environment from the credential, e.g. Azure overrides. */
  readonly env: Record<string, string> | undefined;
};

/**
 * The credential scopes to try for a principal, in the configured order.
 *
 * @remarks
 *
 * Service principals have exactly one scope: their own installation. For user
 * principals the caller's personal scope and the installation's are tried in
 * the configured order, so absence falls through and a failed read rejects.
 */
function credentialScopesFor(
  principal: ReturnType<typeof principalOf>,
  precedence: AiCredentialsPrecedence,
): CredentialScope[] {
  if (principal.kind !== 'user') {
    return [{ kind: 'org' }];
  }
  const personal: CredentialScope = { kind: 'user', id: principal.userId };
  const org: CredentialScope = { kind: 'org' };
  return precedence === 'org-first' ? [org, personal] : [personal, org];
}

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
/**
 * A code mode sandbox whose `start()` enforces a host wall-clock ceiling.
 *
 * The extension derives a script's deadline from the script's own
 * `// @options {"timeout_ms": ...}` line and passes no timeout otherwise,
 * and `CodemodeSandboxBase.start()` then runs with no deadline at all — a
 * model-written script that keeps pending microtasks alive would run
 * until it is aborted or the sandbox closes. This ceiling bounds every
 * start regardless of what the script declares: a script may lower the
 * deadline, never raise it above the host's. It is wall-clock only, so it
 * does not enter the durable start data and cannot affect replay.
 */
class BoundedCodemodeSandbox extends CodemodeSandbox {
  readonly #hostTimeoutMs: number;

  constructor(
    hostTimeoutMs: number,
    options?: { readonly memoryLimitBytes?: number },
  ) {
    // The ceiling is also the sandbox-level default, so any future path
    // through CodemodeSandboxBase.execute() (whose timeout falls back to
    // the sandbox default) inherits the same host bound; start() keeps
    // its explicit Math.min override for script-declared timeouts.
    super(
      options?.memoryLimitBytes === undefined
        ? { timeoutMs: hostTimeoutMs }
        : {
            timeoutMs: hostTimeoutMs,
            memoryLimitBytes: options.memoryLimitBytes,
          },
    );
    this.#hostTimeoutMs = hostTimeoutMs;
  }

  start(code: string, options: CodemodeRunOptions): CodemodeRun {
    return super.start(code, {
      ...options,
      timeoutMs: Math.min(
        options.timeoutMs ?? Number.POSITIVE_INFINITY,
        this.#hostTimeoutMs,
      ),
    });
  }
}

export async function createAiServiceIntegration(
  options: AiServiceIntegrationOptions,
): Promise<ProductionAiServiceIntegration> {
  const { deps } = options;
  const providerRegistry = options.providers ?? builtinProviderRegistry;
  const credentialStores = options.credentialStores;
  const credentialPrecedence = options.credentialPrecedence ?? 'user-first';
  const refreshExpiredCredential = options.refreshExpiredCredential;
  const catalog = (options.models ?? []).map(deepFreeze);
  const db: Knex = await deps.database.getClient();
  const pluginId = deps.pluginMetadata.getId();

  const lease = await createKnexNamespaceLease({ db });
  const recovery = await createAiRecovery({
    db,
    pluginId,
    leases: lease,
    getOwnServiceCredentials: () => deps.auth.getOwnServiceCredentials(),
  });

  const journal: AttemptJournal = createWiredAttemptJournal({
    db,
    permissions: deps.permissions,
    providers: providerRegistry,
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
    // Personal and installation credentials in the configured order; absence
    // falls through, a read failure does not.
    const scopes = credentialScopesFor(principal, credentialPrecedence);
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
    providers: providerRegistry,
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

  const handleStates = new Map<NativeHarnessHandle, HandleState>();
  const invalidationCallbacks: Array<(namespace: Namespace) => void> = [];

  // Instance-unique lease owner component: two service instances of the same
  // plugin principal must hold competing leases, not one shared generation.
  const instanceId = randomUUID();
  // The native admission lifecycle per namespace: one object owns the
  // authority, fence, holders, reservations and drain state.
  const admissions = new Map<string, NativeAdmission>();

  function namespaceKeyOf(namespace: Namespace): string {
    return JSON.stringify([namespace.pluginId, namespace.sessionId]);
  }

  /**
   * Resolves the provider authorities of an acquisition: every catalog
   * provider plus the configured model's provider.
   */
  async function resolveAuthorities(
    binding: AcquisitionBinding,
  ): Promise<Map<string, ResolvedAuthority>> {
    const providers = new Set<string>(catalog.map(model => model.provider));
    if (binding.model !== undefined) {
      providers.add(binding.model.provider);
    }
    const authorities = new Map<string, ResolvedAuthority>();
    for (const providerId of providers) {
      const resolved = await resolveAuthority(providerId, binding.credentials);
      if (resolved !== undefined) {
        authorities.set(providerId, resolved);
      }
    }
    return authorities;
  }

  /**
   * Starts the admission drain: the single closing transition. Registered
   * synchronously — before its first await — so overlapping opens observe
   * the draining admission and wait instead of joining a dying fence. The
   * drain joins every registered in-flight native close — admitted work
   * settles under its own fence — and only then runs the conditional lease
   * release, which only ever matches this admission's own fence. The map
   * entry is removed only after that release completed, so a successor
   * reservation can never race ahead of it. A drain that terminates without
   * completing the release is a terminal failure: the entry is retained
   * (ownership is preserved) and flagged, and a later open performs one
   * bounded release retry instead of rejoining the failed admission.
   */
  function startDrain(admission: NativeAdmission): Promise<void> {
    if (admission.drain !== undefined) {
      return admission.drain;
    }
    admission.draining = true;
    const key = namespaceKeyOf(admission.namespace);
    const drained = (async () => {
      let removed = false;
      try {
        if (admission.keepalive !== undefined) {
          await admission.keepalive.stop();
        }
        // Seals admission, settles accepted commits, and closes the fenced
        // storage without destroying the shared Knex pool. Admitted durable
        // work is never cancelled by release itself: each close settles
        // the work it admitted before the shared fence goes away.
        await Promise.all([...admission.closing]);
        // Only the current admission may release its fence after waiting.
        if (admissions.get(key) !== admission) {
          removed = true;
          return;
        }
        if (admission.fence !== undefined) {
          await lease.release(admission.fence);
        }
        if (admissions.get(key) === admission) {
          admissions.delete(key);
        }
        removed = true;
      } finally {
        admission.drainSettled = true;
        if (!removed) {
          admission.drainFailed = true;
        }
      }
    })();
    // The drain's own tail is never unhandled: callers await `drained` for
    // error propagation, the admission keeps the sanitized form.
    drained.catch(() => undefined);
    admission.drain = drained.then(
      () => undefined,
      () => undefined,
    );
    return drained;
  }

  /**
   * Whether the draining admission's fence is still the live lease row.
   * Read directly from the lease table: a renewal would mutate the fence,
   * and a polling read is the drain waiter's liveness signal.
   */
  async function fenceIsLive(admission: NativeAdmission): Promise<boolean> {
    const fence = admission.fence;
    if (fence === undefined) {
      return false;
    }
    const row = await db(NAMESPACE_LEASES_TABLE)
      .where({
        plugin_id: admission.namespace.pluginId,
        session_id: admission.namespace.sessionId,
      })
      .first();
    return (
      row !== undefined &&
      row.owner_id === fence.owner &&
      String(row.token) === fence.token &&
      new Date(row.expires_at).getTime() > Date.now()
    );
  }

  /**
   * The outcome of racing a promise against a deadline. `timedOut` is a
   * distinct signal: it is true on deadline exhaustion AND on rejection
   * (both map to the bounded unavailability), and never conflated with a
   * successful void resolution of the raced promise.
   */
  type DeadlineOutcome<T> =
    | { readonly timedOut: false; readonly value: T }
    | { readonly timedOut: true };

  /**
   * Races a promise against a deadline. The overall drain bound must
   * enclose every awaited step of the join — pool acquisition and each
   * lease-table liveness read — not only the intervals between them. A read
   * that lands after the deadline is harmless: it is a pure read whose
   * result is already discarded.
   */
  function withDeadline<T>(
    promise: Promise<T>,
    ms: number,
  ): Promise<DeadlineOutcome<T>> {
    return new Promise(resolve => {
      const timer = setTimeout(() => resolve({ timedOut: true }), ms);
      promise.then(
        value => {
          clearTimeout(timer);
          resolve({ timedOut: false, value });
        },
        () => {
          clearTimeout(timer);
          resolve({ timedOut: true });
        },
      );
    });
  }

  /**
   * Bounded drain join for an open that meets a draining admission. The
   * wait holds while the draining fence is live — a successor is never
   * admitted merely because time elapsed. It ends when the drain settles,
   * or, once the fence is no longer live (expired or taken over through the
   * lease protocol by another instance), with a short grace for the drain
   * to finish and otherwise a bounded, retryable unavailability: control
   * returns to the caller instead of pending forever on a close that never
   * settles. The hard overall bound encloses the ENTIRE join — every
   * liveness read, including its pool acquisition — through a racing
   * timer.
   */
  async function waitForDrainComplete(
    admission: NativeAdmission,
  ): Promise<boolean> {
    const deadline = Date.now() + DRAIN_WAIT_LIMIT_MS;
    const remaining = () => deadline - Date.now();
    const key = namespaceKeyOf(admission.namespace);
    for (;;) {
      if (admissions.get(key) !== admission) return true;
      if (admission.drainFailed) {
        // Terminal failure: the drain terminated without completing the
        // conditional release, and the admission retains ownership. One
        // bounded retry of the conditional release — success replaces the
        // admission; failure or timeout returns the bounded unavailability.
        // The failed admission is never reported as successfully drained.
        if (admission.fence === undefined) {
          if (admissions.get(key) === admission) admissions.delete(key);
          return true;
        }
        const retried = await withDeadline(
          lease.release(admission.fence),
          Math.max(remaining(), 0),
        );
        if (retried.timedOut) {
          return false;
        }
        // Another waiter may already have replaced this admission while the
        // conditional release was in flight. Never remove its successor.
        if (admissions.get(key) === admission) admissions.delete(key);
        return true;
      }
      if (admission.drainSettled) {
        return true;
      }
      const live = await withDeadline(fenceIsLive(admission), remaining());
      if (live.timedOut) {
        // Deadline exhausted, or the liveness read itself failed or never
        // acquired a connection: bounded and retryable, never unbounded.
        return false;
      }
      if (!live.value) {
        // The drain's lease release is its last step: it may be settling
        // right now. Give it a short grace — itself enclosed by the
        // deadline — before reporting the previous release as stuck.
        const settled = await Promise.race([
          admission.drain!.then(() => true),
          new Promise<boolean>(resolve =>
            setTimeout(
              () => resolve(false),
              Math.min(DRAIN_GRACE_MS, Math.max(remaining(), 0)),
            ),
          ),
        ]);
        return settled || (admission.drainSettled && !admission.drainFailed);
      }
      if (remaining() <= 0) {
        return false;
      }
      await new Promise(resolve =>
        setTimeout(resolve, Math.min(DRAIN_POLL_MS, remaining())),
      );
    }
  }

  /**
   * Undoes exactly one open reservation. The shared fence and authority
   * binding survive while any pending or live owner remains; the last owner
   * out drains the admission.
   */
  async function undoReservation(admission: NativeAdmission): Promise<void> {
    admission.pending -= 1;
    if (admission.pending <= 0 && admission.holders.size === 0) {
      await startDrain(admission);
    }
  }

  /**
   * Runs an open serialized on the admission: reservations may overlap, but
   * native opens (lease acquisition, storage, harness construction and
   * publication) run one at a time per admission.
   */
  function serializeOpen(
    admission: NativeAdmission,
    run: () => Promise<NativeHarnessHandle>,
  ): Promise<NativeHarnessHandle> {
    const result = admission.openChain.then(run, run);
    admission.openChain = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  /**
   * The serialized body of one admitted open: acquires the shared fence if
   * this admission does not hold one yet, resolves the provider
   * authorities, constructs the native harness and publishes the handle on
   * the admission. Publication re-checks the reservation identity — an
   * admission that drained while this open was running can never be
   * published on.
   */
  async function openAdmittedHarness(
    admission: NativeAdmission,
    input: OpenNativeHarnessInput,
  ): Promise<NativeHarnessHandle> {
    const key = namespaceKeyOf(input.namespace);
    if (admission.draining || admissions.get(key) !== admission) {
      throw new Error(
        `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin closed while its acquisition was still opening; retry the open`,
      );
    }
    // The lease owner is the principal key plus an instance-unique
    // component: within one instance the same-owner re-acquire semantics
    // apply, while two instances of the same principal compete through the
    // lease protocol instead of sharing one generation. Only the admission's
    // first serialized open acquires; joins reuse the shared fence.
    let fence = admission.fence;
    if (fence === undefined) {
      const acquired = await lease.acquire(
        input.namespace,
        `${input.owner}:${instanceId}`,
      );
      if (acquired === undefined) {
        throw new Error(
          `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin is held by another live lease; retry once the current owner releases it`,
        );
      }
      // A reservation normally pins this admission while acquisition waits.
      // Never publish a late lease onto an admission that lost ownership.
      if (admission.draining || admissions.get(key) !== admission) {
        throw new Error(
          `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin closed while its acquisition was still opening; retry the open`,
        );
      }
      fence = acquired;
      admission.fence = fence;
      admission.keepalive = startLeaseKeepalive(lease, fence, {
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
    }
    const authorities = await resolveAuthorities(input);
    const authority = (): AdmissionAuthority => {
      if (admission.draining || admission.fence !== fence) {
        throw new Error(
          'Model operation denied: no acquisition is bound for this session',
        );
      }
      return {
        credentials: admission.credentials,
        authorities: admission.authorities,
      };
    };
    // The native harness reads the models source at each use, so every
    // dispatch binds the CURRENT acquisition's credentials and provider
    // authorities rather than the first acquisition's.
    const modelsSource = (): Models => {
      const requests = createGuardedModelOperations({
        providers: providerRegistry,
        guard,
        journal,
        resolve: makeResolve(input, fence, authority),
      });
      return {
        ...requests,
        // Canonical catalog lookups only; no provider, credential or
        // administrative access escapes to extensions. Provider auth
        // access is bound at open (required by the native harness) but
        // fails closed on every call.
        getModel: (provider: string, id: string) => {
          const canonical = catalog.find(
            entry => entry.provider === provider && entry.id === id,
          );
          if (canonical !== undefined) {
            return canonical;
          }
          // A dispatch that fails model resolution journals a local
          // denial — a local rejection never resolved a destination —
          // and the native harness settles the run with its own
          // no-model availability error.
          journalUnresolvedModel(input, fence, provider, id);
          return undefined;
        },
        // Catalog-type lookups for extension code (code mode's `models.*`
        // catalog globals) — canonical entries only, no credentials.
        // getAvailableOfType additionally filters by the current
        // acquisition's credential presence (see below). Dispatching one
        // of these still goes through the guarded operations above.
        getModelsOfType: (type: string, provider?: string) =>
          catalog.filter(
            entry =>
              entry.type === type &&
              (provider === undefined || entry.provider === provider),
          ),
        getModelOfType: (type: string, provider: string, id: string) =>
          catalog.find(
            entry =>
              entry.type === type &&
              entry.provider === provider &&
              entry.id === id,
          ),
        // Availability is the catalog intersected with the CURRENT
        // acquisition's resolved provider authorities, matching pi-ai's
        // contract ("providers with complete auth configuration") from
        // this acquisition's perspective; a drained admission lists
        // nothing rather than throwing mid-listing.
        getAvailableOfType: async (type: string, provider?: string) => {
          let resolved: ReadonlyMap<string, unknown>;
          try {
            resolved = authority().authorities;
          } catch {
            return [];
          }
          return catalog.filter(
            entry =>
              entry.type === type &&
              (provider === undefined || entry.provider === provider) &&
              resolved.has(entry.provider),
          );
        },
        getAuth: () => {
          throw new Error(
            'Provider auth access is not exposed through the managed AI service',
          );
        },
      } as unknown as Models;
    };
    let storage: Storage | undefined;
    // Opt-in code mode. The extension is appended to the caller's registry
    // selection, and the registry reader re-reads the caller's snapshot on
    // every read so later caller publications still apply; the sandbox is
    // closed with this open's harness.
    let codemodeSandbox: CodemodeSandbox | undefined;
    let harnessRegistry: RegistryReader = input.registry;
    if (options.codemode !== undefined) {
      codemodeSandbox = new BoundedCodemodeSandbox(
        options.codemode.timeoutMs ?? 300_000,
        options.codemode,
      );
      const codemode = createCodemodeExtension({ sandbox: codemodeSandbox });
      const callerRegistry = input.registry;
      harnessRegistry = {
        snapshot: () => appendExtension(callerRegistry.snapshot(), codemode),
        subscribe: listener => callerRegistry.subscribe(listener),
      };
    }
    try {
      storage = await createKnexStorage({
        db,
        namespace: input.namespace,
        fence,
      });
      const harness = await Harness.open(
        storage,
        {
          models: modelsSource,
          registry: harnessRegistry,
          ...(input.conversationCreated === undefined
            ? {}
            : { conversationCreated: input.conversationCreated }),
        },
        BACKGROUND_CONTEXT,
      );
      // Publication: reservation identity re-checked. A reservation pins
      // its admission against drains, so this holds unless the admission
      // was closed by an explicit invalidation path; it can never publish
      // onto another caller's admission.
      if (admission.draining || admissions.get(key) !== admission) {
        throw new Error(
          `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin closed while its acquisition was still opening; retry the open`,
        );
      }
      admission.authorities = authorities;
      const handle: NativeHarnessHandle = {
        harness,
        context: BACKGROUND_CONTEXT as Context,
      };
      // The reservation converts into the published holder, synchronously
      // with publication: a concurrent release of this handle can never
      // observe the half-converted state.
      admission.pending -= 1;
      admission.holders.add(handle);
      handleStates.set(handle, {
        harness,
        admission,
        ...(codemodeSandbox === undefined ? {} : { codemodeSandbox }),
      });
      return handle;
    } catch (error) {
      try {
        await codemodeSandbox?.close();
        await storage?.close(BACKGROUND_CONTEXT);
      } catch {
        /* The open already failed; the reservation undo is the arbiter. */
      }
      throw error;
    }
  }

  /**
   * Builds the synchronous resolve contract the guarded model operations
   * require. The binding derives ONLY from the host's canonical catalog and
   * the current acquisition's authority: the caller's model object
   * contributes identity fields (provider, model ID) for the catalog lookup
   * and nothing else — its transport-derived fields (baseUrl, headers, and
   * anything else a hook may have mutated) are never consulted, so a forged
   * model copy cannot redirect dispatch or credentials.
   */
  function makeResolve(
    input: OpenNativeHarnessInput,
    fence: AdmissionFence,
    authority: () => AdmissionAuthority,
  ): (
    model: AnyModel,
    operation: ModelOperation,
  ) => Promise<GuardedModelBinding> {
    const sessionRef = `${input.namespace.pluginId}/${input.namespace.sessionId}`;
    let callOrdinal = 0;
    return async (model, operation) => {
      const canonical = catalog.find(
        entry => entry.provider === model.provider && entry.id === model.id,
      );
      const bindingModel = model as GuardedModelBinding['model'];
      const current = authority();
      const trusted: TrustedOperation = {
        actor: input.owner,
        credentials: current.credentials,
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
        api: (canonical ?? model).api as TrustedOperation['api'],
        destination: 'unresolved://model',
        credentialScope: { kind: 'org' },
        credentialGeneration: 'unresolved',
        controller: new AbortController(),
      };
      if (canonical === undefined) {
        throw new GuardedResolutionError(
          {
            operation: trusted,
            model: bindingModel,
            authority: { kind: 'apiKey' },
          },
          `model not resolved: '${model.provider}/${model.id}' is not in the canonical catalog of this installation`,
        );
      }
      let resolved = current.authorities.get(canonical.provider);
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
      // A guarded refresh is the only awaited step of resolution. It is bound
      // to this dispatch's verified authority and fence, and the authority is
      // re-read afterwards: a refresh that rotated the store must be visible to
      // dispatch, and an admission that drained meanwhile must still fail
      // closed (authority() throws). Everything the guard enforces — permission,
      // credential generation, fence currency — is checked again in recheck
      // before the intent and the send, so nothing between here and dispatch
      // depends on the pre-await snapshot.
      if (
        refreshExpiredCredential !== undefined &&
        credentialStores !== undefined &&
        resolved.authority.kind === 'oauth' &&
        !Number.isFinite(resolved.authority.expiresAt ?? Number.NaN)
      ) {
        throw new GuardedResolutionError(
          {
            operation: trusted,
            model: bindingModel,
            authority: { kind: 'apiKey' },
          },
          'credential expired; re-authentication required',
        );
      }
      if (
        refreshExpiredCredential !== undefined &&
        credentialStores !== undefined &&
        resolved.authority.kind === 'oauth' &&
        (resolved.authority.expiresAt ?? 0) - Date.now() <=
          DEFAULT_REFRESH_WINDOW_MS
      ) {
        const scope = resolved.scope;
        const provenance = trusted.provenance;
        try {
          await refreshExpiredCredential({
            provider: canonical.provider,
            scope,
            credentials: trusted.credentials,
            fence: trusted.fence,
            actor: trusted.actor,
            provenance: {
              conversationId: provenance.conversationId,
              taskId: provenance.taskId,
              callId: provenance.callId,
            },
            definitionVersion: trusted.definitionVersion,
            configVersion: trusted.configVersion,
          });
        } catch {
          // Auth denies and its own outcome are already journaled by the hook;
          // this records the dispatch denial that follows, actionably and
          // without a send.
          throw new GuardedResolutionError(
            {
              operation: trusted,
              model: bindingModel,
              authority: { kind: 'apiKey' },
            },
            'credential expired; re-authentication required',
          );
        }
        // Re-read the authority view after the await, and the credential from
        // the scope that won. The pre-await binding is never trusted here.
        // Throws when the admission drained or its fence moved during the
        // refresh; the fresh credential is read from the store, never reused
        // from the pre-await binding.
        authority();
        const refreshed = await credentialStores
          .forScope(scope)
          .read(canonical.provider);
        resolved =
          refreshed === undefined ? undefined : authorityOf(scope, refreshed);
      }
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
      const api = canonical.api as TrustedOperation['api'];
      const module = providerRegistry.get(api);
      if (!module) {
        throw new GuardedResolutionError(
          {
            operation: trusted,
            model: bindingModel,
            authority: { kind: 'apiKey' },
          },
          'unsupported model transport for the canonical model',
        );
      }
      return {
        operation: {
          ...trusted,
          api,
          resolvedModel: canonical.id,
          destination: module!.destination(canonical, resolved.env),
          ...resolvedAuthorityFields(resolved),
        },
        model: canonical as GuardedModelBinding['model'],
        authority: resolved.authority,
      };
    };
  }

  /**
   * Journals the local denial of a dispatch whose model never resolved, so a
   * missing catalog is auditable like a missing credential. The destination
   * is absent: a local rejection never resolved one.
   */
  function journalUnresolvedModel(
    input: OpenNativeHarnessInput,
    fence: AdmissionFence,
    provider: string,
    modelId: string,
  ): void {
    const sessionRef = `${input.namespace.pluginId}/${input.namespace.sessionId}`;
    void journal
      .recordDecisionAndIntent(fence, {
        actor: input.owner,
        conversationId: sessionRef,
        taskId: sessionRef,
        callId: `${sessionRef}#unresolved-${randomUUID().slice(0, 8)}`,
        definitionVersion: input.registryVersion,
        configVersion: input.configVersion,
        provider,
        model: modelId,
        // The closed operation vocabulary classifies dispatch operations;
        // the generation entry is the dispatch this resolution preempted.
        operation: 'models.streamSimple',
        attempt: 1,
        decision: 'deny',
        reason: `model not resolved: '${provider}/${modelId}' is not in the canonical catalog of this installation`,
      })
      .catch(error => {
        deps.logger.warn(
          `Failed to journal a model-resolution denial: ${error}`,
        );
      });
  }

  const integration: ProductionAiServiceIntegration = {
    recovery,
    guard,

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
      // Every admitted operation is associated with its acquiring call's
      // verified original credentials. A live namespace admits exactly one
      // authority: reuse under a different credentials object fails closed
      // rather than transferring authority in either direction. This seam is
      // an early check only — the admission reservation in openNativeHarness
      // is the enforcement point — and a draining admission no longer
      // represents a live authority, so it is not compared against.
      const key = namespaceKeyOf(binding.namespace);
      const existing = admissions.get(key);
      if (
        existing !== undefined &&
        !existing.draining &&
        existing.credentials !== binding.credentials
      ) {
        throw new Error(
          existing.holders.size > 0
            ? `The AI session '${binding.namespace.sessionId}' of the '${pluginId}' plugin is live under a different verified authority; release the existing handles before acquiring it with different credentials`
            : `The AI session '${binding.namespace.sessionId}' of the '${pluginId}' plugin is being opened under a different verified authority; retry once that acquisition settles or release it first`,
        );
      }
      if (
        existing !== undefined &&
        !existing.draining &&
        existing.holders.size > 0
      ) {
        // Same verified authority on a live admission: refresh the resolved
        // provider authorities for the reused handles, so credential
        // rotation is visible to the recheck without transferring
        // authority. The refresh is published only if the reservation
        // identity still holds.
        const authorities = await resolveAuthorities(binding);
        if (
          admissions.get(key) === existing &&
          !existing.draining &&
          existing.credentials === binding.credentials
        ) {
          existing.authorities = authorities;
        }
      }
    },

    async openNativeHarness(
      input: OpenNativeHarnessInput,
    ): Promise<NativeHarnessHandle> {
      const key = namespaceKeyOf(input.namespace);
      for (;;) {
        // ---- Reservation: synchronous, before any await ----------------
        // Overlapping opens resolve before any state is mutated. A draining
        // admission is joined bounded, never bypassed: within one instance
        // the same-owner re-acquire keeps the lease token, so a successor
        // admitted alongside the drain could hold the draining admission's
        // fence, and its conditional release would then expire it.
        const existing = admissions.get(key);
        if (existing !== undefined && existing.draining) {
          const completed = await waitForDrainComplete(existing);
          if (!completed) {
            throw new Error(
              `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin is still closing its previous native harness and no longer holds a live lease; the previous release appears stuck. Retry the open once the previous release completes, and investigate the stalled close if this persists`,
            );
          }
          continue;
        }
        if (
          existing !== undefined &&
          existing.credentials !== input.credentials
        ) {
          throw new Error(
            existing.holders.size > 0
              ? `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin is live under a different verified authority; release the existing handles before acquiring it with different credentials`
              : `The AI session '${input.namespace.sessionId}' of the '${pluginId}' plugin is being opened under a different verified authority; retry once that acquisition settles or release it first`,
          );
        }
        const admission: NativeAdmission = existing ?? {
          namespace: input.namespace,
          credentials: input.credentials,
          authorities: new Map<string, ResolvedAuthority>(),
          fence: undefined,
          keepalive: undefined,
          holders: new Set<NativeHarnessHandle>(),
          pending: 0,
          closing: new Set<Promise<void>>(),
          openChain: Promise.resolve(),
          draining: false,
          drain: undefined,
          drainSettled: false,
          drainFailed: false,
        };
        admissions.set(key, admission);
        admission.pending += 1;

        try {
          const handle = await serializeOpen(admission, () =>
            openAdmittedHarness(admission, input),
          );
          return handle;
        } catch (error) {
          // Reservation-owned cleanup: undo exactly this reservation. The
          // shared fence and authority survive while any pending or live
          // owner remains; the last owner out drains the admission.
          if (admissions.get(key) === admission) {
            await undoReservation(admission);
          }
          throw error;
        }
      }
    },

    async releaseNativeHarness(handle: NativeHarnessHandle): Promise<void> {
      const state = handleStates.get(handle);
      if (state === undefined) {
        return;
      }
      handleStates.delete(handle);
      const admission = state.admission;
      // Start the native close and register it on the admission BEFORE
      // dropping the holder claim: a closing harness — and the admitted
      // work its close settles — stays owned by the admission until the
      // close settles. The last-owner drain joins every registered close
      // before the conditional lease release, so admitted work never runs
      // against a fence a successor already took over.
      const closePromise = state.harness.close(BACKGROUND_CONTEXT);
      const closingRegistered = closePromise.then(
        () => undefined,
        () => undefined,
      );
      admission.closing.add(closingRegistered);
      admission.holders.delete(handle);
      try {
        if (admission.holders.size > 0 || admission.pending > 0) {
          // Other owners remain: await only this handle's close. The
          // shared fence and authority binding stay theirs.
          await closePromise;
          return;
        }
        // Last owner: drain the admission. The drain is registered before
        // its first await (inside startDrain), so overlapping opens
        // observe it, and it joins every registered in-flight close —
        // including this one — before releasing the fence.
        const drained = startDrain(admission);
        await closePromise;
        await drained;
      } finally {
        admission.closing.delete(closingRegistered);
        // The open's code mode sandbox, if any, closes with its harness;
        // close() aborts any in-flight script execution.
        await state.codemodeSandbox?.close();
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

/**
 * A registry snapshot view with one extension appended. Every read
 * delegates to the caller's current snapshot, so caller publications after
 * the open still apply; the appended extension shadows a caller extension
 * of the same name.
 */
function appendExtension(
  snapshot: RegistrySnapshot,
  extension: Extension,
): RegistrySnapshot {
  const installed = [...snapshot.installed(), extension];
  return {
    installed: () => installed,
    extension: name =>
      name === extension.name ? extension : snapshot.extension(name),
    tools: () => [
      ...snapshot.tools(),
      ...(extension.tools ?? []).map(tool => ({ extension, tool })),
    ],
    sections: () => [
      ...snapshot.sections(),
      ...(extension.sections ?? []).map(section => ({ extension, section })),
    ],
    tasks: () => snapshot.tasks(),
    task: name => snapshot.task(name),
  };
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
      authority: {
        kind: 'apiKey',
        apiKey: credential.key,
        env: credential.env,
      },
      env: credential.env as Record<string, string> | undefined,
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
    env: undefined,
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
