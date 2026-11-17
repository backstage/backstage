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
import type { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import type { Fence, Namespace } from '../contracts';
import { startLeaseKeepalive } from './keepalive';
import type {
  LeaseInvalidationReason,
  LeaseKeepalive,
  NamespaceLease,
} from './types';

const TABLE = 'ai_recovery_sessions';
const DEFAULT_PAGE_SIZE = 100;

/** Read the persisted origin without creating a session. @internal */
export async function readSessionOrigin(
  db: Knex,
  namespace: Namespace,
): Promise<SessionOrigin | undefined> {
  const row = await db(TABLE)
    .where({ plugin_id: namespace.pluginId, session_id: namespace.sessionId })
    .first('origin_kind', 'origin_user_id', 'origin_service_plugin_id');
  if (!row) return undefined;
  if (row.origin_kind === 'user' && row.origin_user_id) {
    return { kind: 'user', userId: row.origin_user_id };
  }
  if (row.origin_kind === 'service' && row.origin_service_plugin_id) {
    return { kind: 'service', pluginId: row.origin_service_plugin_id };
  }
  throw new Error('Invalid persisted AI session origin');
}

/** List one user's session IDs in a plugin namespace. @internal */
export async function listUserSessions(
  db: Knex,
  options: { pluginId: string; userId: string; cursor?: string; limit: number },
): Promise<{ items: string[]; nextCursor?: string }> {
  if (
    !Number.isInteger(options.limit) ||
    options.limit < 1 ||
    options.limit > 500
  ) {
    throw new Error('Session page size must be between 1 and 500');
  }
  const query = db(TABLE)
    .where({
      plugin_id: options.pluginId,
      origin_kind: 'user',
      origin_user_id: options.userId,
    })
    .select('session_id')
    .orderBy('session_id', 'asc')
    .limit(options.limit + 1);
  if (options.cursor !== undefined)
    query.andWhere('session_id', '>', options.cursor);
  const rows: { session_id: string }[] = await query;
  const items = rows.slice(0, options.limit).map(row => row.session_id);
  return {
    items,
    ...(rows.length > options.limit
      ? { nextCursor: items[items.length - 1] }
      : {}),
  };
}

/**
 * Who originated the work in a managed session.
 *
 * @remarks
 *
 * Only metadata is persisted: a user identifier is not a credential, and no
 * Backstage token is ever stored. User-origin work stays paused across a
 * restart until the authenticated user reauthorizes it again.
 *
 * @internal
 */
export type SessionOrigin =
  | Readonly<{ kind: 'user'; userId: string }>
  | Readonly<{ kind: 'service'; pluginId: string }>;

/**
 * The distinct recovery outcomes of a persisted session.
 *
 * @remarks
 *
 * `needs-reauth`, `blocked-definition` and `unknown-dispatch-outcome` are
 * deliberately distinct: paused user work, an unresolvable definition and an
 * uncertain external effect must never be reported as one another, and none of
 * them is silently treated as recoverable. `blocked-credentials` reports that
 * fresh plugin service credentials are unavailable or are not service
 * credentials. `failed` reports that a resolver threw; the session stays
 * visibly unresolved.
 *
 * @internal
 */
export type RecoveryStatus =
  | 'pending'
  | 'recovered'
  | 'needs-reauth'
  | 'blocked-definition'
  | 'blocked-credentials'
  | 'unknown-dispatch-outcome'
  | 'failed';

/** What a registered resolver decided for one session. */
export type RecoveryResolution =
  | Readonly<{ kind: 'resumed' }>
  | Readonly<{ kind: 'blocked-definition'; reason: string }>
  | Readonly<{ kind: 'failed'; reason: string }>;

/**
 * Input passed to a resolver when resuming service-origin work.
 *
 * @internal
 */
export interface RecoveryResumeInput {
  readonly namespace: Namespace;
  readonly origin: Readonly<{ kind: 'service'; pluginId: string }>;
  readonly definitionVersion: string;
  /**
   * Fresh credentials of the plugin's own service identity, obtained during
   * this recovery pass. Never a stored token and never a user identity.
   */
  readonly credentials: BackstageCredentials;
  /**
   * The exclusive lease recovery acquired for this resume, plus the channel
   * that tells the resumed work to stop.
   *
   * @remarks
   *
   * The resumed work must open its harness and storage under
   * `admission.fence`, register an abort/close callback through
   * `admission.onInvalidated` or `admission.registerCleanup`, and take over
   * renewal of the fence on success. If the authority record was superseded
   * while this resume ran, recovery releases the fence conditionally and fires
   * that channel, so nothing keeps running under authority it no longer has.
   */
  readonly admission: RecoveryAdmission;
}

/**
 * What a resume opened, and the channel that revokes it.
 *
 * @internal
 */
export interface RecoveryAdmission {
  /** The lease held by this resume; already acquired when it is handed over. */
  readonly fence: Fence;
  /** Whether this admission has been revoked. */
  readonly invalidated: boolean;
  /** Registers an abort/close listener, fired at most once on revocation. */
  onInvalidated(listener: (reason: LeaseInvalidationReason) => void): void;
  /**
   * Registers cleanup that runs on revocation, in registration order, before
   * the fence is released. Use it for work that must be closed rather than
   * merely signalled.
   */
  registerCleanup(cleanup: () => void | Promise<void>): void;
}

/**
 * A consuming plugin's stable, versioned reconstruction of a session's
 * registry and configuration.
 *
 * @remarks
 *
 * Registrations happen during plugin startup, before any enumeration.
 * `versions` lists the definition versions this resolver can restore; it must
 * be non-empty and may not overlap another resolver's versions for the same
 * plugin. A missing or incompatible resolver leaves the session visibly
 * blocked; no other resolver is ever substituted for it.
 *
 * @internal
 */
export interface RecoveryResolver {
  readonly pluginId: string;
  readonly versions: readonly string[];
  resume(input: RecoveryResumeInput): Promise<RecoveryResolution>;
}

/** Per-session outcome of one recovery pass. */
export interface RecoveryOutcome {
  readonly namespace: Namespace;
  readonly status: RecoveryStatus;
  readonly detail?: string;
}

/** Result of one recovery pass. */
export interface RecoveryReport {
  /** Number of persisted sessions examined in this pass. */
  readonly examined: number;
  readonly outcomes: readonly RecoveryOutcome[];
  /** Cursor for the next pass; absent when the enumeration is exhausted. */
  readonly next?: string;
}

/** A persisted recovery status, as an operator or the integration sees it. */
export interface RecoveryStatusRecord {
  readonly status: RecoveryStatus;
  readonly detail?: string;
}

/** Options for {@link createAiRecovery}. */
export interface AiRecoveryOptions {
  readonly db: Knex;
  /** The consuming plugin; recovery is plugin-scoped. */
  readonly pluginId: string;
  /** Namespace enumeration and ownership for this plugin. */
  readonly leases: NamespaceLease;
  /**
   * Fresh credentials of this plugin's own service identity, typically
   * `() => auth.getOwnServiceCredentials()`. It is consulted only for
   * service-origin work and never for user-origin work.
   */
  readonly getOwnServiceCredentials: () => Promise<BackstageCredentials>;
  /** Enumeration page size. Default 100. */
  readonly pageSize?: number;
  /** Renewal cadence for the leases recovery acquires. Default 20 seconds. */
  readonly admissionKeepaliveMs?: number;
  /**
   * Internal test seam: awaited after the authoritative admission snapshot has
   * been read and before it is used to admit a resume.
   *
   * @remarks
   *
   * Production wiring must omit it. It exists so the delivery of an admission
   * snapshot can be paused deterministically, which reproduces the race where
   * the authority record changes between the snapshot and its use.
   */
  readonly admissionSnapshotGate?: (
    namespace: Namespace,
  ) => void | Promise<void>;
}

/** Startup recovery of persisted managed sessions. */
export interface AiRecovery {
  /**
   * Registers a resolver during startup. Throws when called after
   * {@link AiRecovery.completeStartup}, and on a conflicting version.
   */
  registerResolver(resolver: RecoveryResolver): void;
  /**
   * Seals the resolver set. Recovery refuses to run before this, so resolvers
   * are always registered before enumeration.
   */
  completeStartup(): void;
  /** Records a persisted session, or refreshes its origin and version. */
  recordSession(input: {
    readonly namespace: Namespace;
    readonly origin: SessionOrigin;
    readonly definitionVersion: string;
  }): Promise<void>;
  /**
   * Records that a dispatch was attempted but its outcome is unknown, for
   * example after a crash following send. Such a session is never resumed
   * automatically.
   */
  markDispatchUnknown(namespace: Namespace): Promise<void>;
  /** Runs one recovery pass over the next page(s) of namespaces. */
  recover(options?: {
    readonly cursor?: string;
    readonly limit?: number;
  }): Promise<RecoveryReport>;
  /** The persisted recovery status of a session, if it has one. */
  statusOf(namespace: Namespace): Promise<RecoveryStatusRecord | undefined>;
}

type RecoveryRow = {
  session_id: string;
  origin_kind: 'user' | 'service';
  origin_user_id: string | null;
  origin_service_plugin_id: string | null;
  definition_version: string;
  dispatch_unknown: boolean | number;
  status: RecoveryStatus;
  detail: string | null;
  revision: string | number;
};

const ROW_COLUMNS = [
  'session_id',
  'origin_kind',
  'origin_user_id',
  'origin_service_plugin_id',
  'definition_version',
  'dispatch_unknown',
  'status',
  'detail',
  'revision',
] as const;

/** How often one session is re-evaluated when its authority record changes. */
const REVALIDATION_ATTEMPTS = 3;

/** The decision made inside one admission bracket. */
type SessionStep =
  | Readonly<{
      kind: 'decided';
      outcome: RecoveryOutcome;
      /** The revision this decision wrote. */
      revision: string;
    }>
  | Readonly<{ kind: 'superseded-before-admission' }>
  | Readonly<{ kind: 'superseded-at-write' }>
  | Readonly<{ kind: 'failed'; error: unknown }>;

/**
 * What an admission ended as. Exactly one disposition is recorded.
 *
 * @internal
 */
export type AdmissionDisposition =
  /** The resume succeeded and keeps the still-live fence. */
  | Readonly<{ kind: 'handed-off' }>
  /**
   * The admission was revoked: its listeners were notified, its cleanup ran and
   * its fence was released conditionally on owner and token.
   */
  | Readonly<{ kind: 'revoked'; reason: LeaseInvalidationReason }>
  /**
   * The resume asked to keep the fence, but the fence was no longer held when
   * the admission was finalized, so it was revoked instead.
   */
  | Readonly<{ kind: 'fence-lost' }>;

/** The single place recovery asks an admission to end. */
type Finalization =
  | Readonly<{ kind: 'hand-off' }>
  | Readonly<{ kind: 'revoke'; reason: LeaseInvalidationReason }>;

/**
 * The one lifetime and finalization boundary of a recovery admission.
 *
 * @remarks
 *
 * One object owns the whole bracket from lease acquisition to final
 * disposition. Scattering invalidation across code paths is what previously
 * produced both missed exits and finalization ordering gaps, so the boundary
 * holds every responsibility in one place:
 *
 * - **Unique identity.** Each admission acquires the namespace with its own
 *   owner (`recovery:<plugin>:<uuid>`), so no admission can ever renew or
 *   release a fence it does not uniquely own. Competing passes — including two
 *   concurrent `recover()` calls on one instance — arbitrate through the row
 *   lease exactly like competing replicas: one acquires, the other skips.
 * - **Exception safety.** The owner of this object calls {@link dispose} on
 *   every exit path, including a thrown resolver, a failed outcome write and
 *   cancellation, so no path can leave work running or a fence held.
 * - **Fence-aware ordering.** A hand-off re-validates the fence *after* the
 *   outcome write, and a fence that was lost or invalidated while a write was
 *   waiting is revoked instead of handed off, so nothing is finalized as
 *   recovered on stale authority.
 * - **One transition.** {@link dispose} records exactly one disposition and is
 *   idempotent; later calls return the recorded one.
 * - **Keepalive stop.** The renewal timer is stopped by the same transition.
 *
 * Revocation itself is one-way: the keepalive stops, listeners are notified,
 * registrations are cleaned up in order, and the fence is released
 * conditionally on owner and token, so it can never affect a successor's lease.
 * Cleanup failures never resurrect the admission or mask the persisted status;
 * the lease expires on its own if the release itself fails.
 */
export class AdmissionLifetime implements RecoveryAdmission {
  readonly fence: Fence;
  readonly #leases: NamespaceLease;
  readonly #listeners: ((reason: LeaseInvalidationReason) => void)[] = [];
  readonly #cleanups: (() => void | Promise<void>)[] = [];
  #keepalive?: LeaseKeepalive;
  #invalidated = false;
  #revokeReason?: LeaseInvalidationReason;
  #revoking?: Promise<void>;
  #disposed?: Promise<AdmissionDisposition>;

  private constructor(leases: NamespaceLease, fence: Fence) {
    this.#leases = leases;
    this.fence = fence;
  }

  /**
   * Acquires the namespace lease and starts the admission bracket, or returns
   * `undefined` when a live lease is already held.
   */
  static async open(options: {
    readonly leases: NamespaceLease;
    readonly namespace: Namespace;
    readonly ownerPrefix: string;
    readonly keepaliveMs: number;
  }): Promise<AdmissionLifetime | undefined> {
    const { leases, namespace, ownerPrefix, keepaliveMs } = options;
    const owner = `${ownerPrefix}:${randomUUID()}`;
    const fence = await leases.acquire(namespace, owner);
    if (fence === undefined) return undefined;

    const lifetime = new AdmissionLifetime(leases, fence);
    // The keepalive runs through the same boundary, so a lost fence and a
    // superseded admission both end in the single disposition transition.
    lifetime.#keepalive = startLeaseKeepalive(leases, fence, {
      intervalMs: keepaliveMs,
      onInvalidated: reason => void lifetime.#revoke(reason),
    });
    return lifetime;
  }

  get invalidated(): boolean {
    return this.#invalidated;
  }

  onInvalidated(listener: (reason: LeaseInvalidationReason) => void): void {
    if (this.#invalidated) {
      queueMicrotask(() => listener('authority-superseded'));
      return;
    }
    this.#listeners.push(listener);
  }

  registerCleanup(cleanup: () => void | Promise<void>): void {
    if (this.#invalidated) {
      void runCleanup(cleanup);
      return;
    }
    this.#cleanups.push(cleanup);
  }

  /**
   * Ends the admission exactly once.
   *
   * @remarks
   *
   * `hand-off` is only honoured while the fence is still held: it renews the
   * lease as the final authority check, and revokes instead if that fails or the
   * admission was already invalidated. Every other request revokes.
   */
  async dispose(finalization: Finalization): Promise<AdmissionDisposition> {
    if (this.#disposed !== undefined) return this.#disposed;
    this.#disposed = (async () => {
      if (finalization.kind === 'revoke') {
        await this.#revoke(finalization.reason);
        return { kind: 'revoked', reason: finalization.reason } as const;
      }
      await this.#keepalive?.stop();
      this.#keepalive = undefined;
      if (this.#invalidated) {
        // A revocation may still be running (for example blocked inside a
        // registered cleanup). Join it: a reported disposition means teardown
        // finished, never that it started.
        await this.#joining();
        return {
          kind: 'revoked',
          reason: this.#revokeReason ?? 'authority-superseded',
        } as const;
      }
      let held = false;
      try {
        held = await this.#leases.renew(this.fence);
      } catch {
        held = false;
      }
      if (!held) {
        await this.#revoke('authority-superseded');
        return { kind: 'fence-lost' } as const;
      }
      // A revocation may have started while the fence check ran; never hand off
      // a fence whose admission was already revoked, and never return before
      // that revocation finished.
      if (this.#invalidated) {
        await this.#joining();
        return {
          kind: 'revoked',
          reason: this.#revokeReason ?? 'authority-superseded',
        } as const;
      }
      return { kind: 'handed-off' } as const;
    })();
    return this.#disposed;
  }

  /** Resolves once any in-flight revocation has completed. */
  async #joining(): Promise<void> {
    await this.#revoking;
  }

  async #revoke(reason: LeaseInvalidationReason): Promise<void> {
    if (this.#revoking !== undefined) return this.#revoking;
    this.#invalidated = true;
    this.#revokeReason = reason;
    this.#revoking = (async () => {
      await this.#keepalive?.stop();
      this.#keepalive = undefined;
      for (const listener of this.#listeners.splice(0)) {
        try {
          listener(reason);
        } catch {
          /* A failing listener must not keep the admission alive. */
        }
      }
      for (const cleanup of this.#cleanups.splice(0)) {
        await runCleanup(cleanup);
      }
      try {
        await this.#leases.release(this.fence);
      } catch {
        /* The lease expires on its own; never mask the persisted status. */
      }
    })();
    return this.#revoking;
  }
}

async function runCleanup(cleanup: () => void | Promise<void>): Promise<void> {
  try {
    await cleanup();
  } catch {
    /* Cleanup failures never restore an invalidated admission. */
  }
}

class StartupRecovery implements AiRecovery {
  readonly #options: AiRecoveryOptions;
  readonly #pageSize: number;
  readonly #resolvers = new Map<string, Map<string, RecoveryResolver>>();
  readonly #admissionKeepaliveMs: number;
  #sealed = false;

  constructor(options: AiRecoveryOptions) {
    this.#options = options;
    this.#pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
    this.#admissionKeepaliveMs = options.admissionKeepaliveMs ?? 20_000;
  }

  registerResolver(resolver: RecoveryResolver): void {
    if (this.#sealed) {
      throw new Error(
        `Recovery resolvers for the '${
          this.#options.pluginId
        }' plugin must be registered during startup, before enumeration: the resolver set is already sealed`,
      );
    }
    if (resolver.pluginId !== this.#options.pluginId) {
      throw new Error(
        `Recovery resolver for the '${
          resolver.pluginId
        }' plugin cannot be registered with the '${
          this.#options.pluginId
        }' plugin, whose sessions are the only ones it can recover`,
      );
    }
    if (!Array.isArray(resolver.versions) || resolver.versions.length === 0) {
      throw new Error(
        `Recovery resolver for the '${resolver.pluginId}' plugin must declare at least one definition version`,
      );
    }
    const versions = new Set(resolver.versions);
    if (versions.size !== resolver.versions.length) {
      throw new Error(
        `Recovery resolver for the '${resolver.pluginId}' plugin declares a duplicate definition version`,
      );
    }

    const registered = this.#resolvers.get(resolver.pluginId) ?? new Map();
    for (const version of resolver.versions) {
      if (typeof version !== 'string' || version.length === 0) {
        throw new Error(
          `Recovery resolver for the '${resolver.pluginId}' plugin declares an empty definition version`,
        );
      }
      if (registered.has(version)) {
        throw new Error(
          `Conflicting recovery resolver for the '${resolver.pluginId}' plugin definition version '${version}': a resolver for that version is already registered`,
        );
      }
    }
    // Validate every version before registering any of them, so a conflicting
    // resolver cannot leave a partial registration behind.
    for (const version of resolver.versions) registered.set(version, resolver);
    this.#resolvers.set(resolver.pluginId, registered);
  }

  completeStartup(): void {
    this.#sealed = true;
  }

  async recordSession(input: {
    readonly namespace: Namespace;
    readonly origin: SessionOrigin;
    readonly definitionVersion: string;
  }): Promise<void> {
    const { namespace, origin, definitionVersion } = input;
    this.#assertNamespace(namespace);
    if (typeof definitionVersion !== 'string' || !definitionVersion) {
      throw new Error('A recovery session requires a definition version');
    }
    const originColumns =
      origin.kind === 'user'
        ? {
            origin_kind: 'user' as const,
            origin_user_id: this.#requireId(origin.userId, 'user ID'),
            origin_service_plugin_id: null,
          }
        : {
            origin_kind: 'service' as const,
            origin_user_id: null,
            origin_service_plugin_id: this.#requireId(
              origin.pluginId,
              'service plugin ID',
            ),
          };

    const db = this.#options.db;
    const key = {
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
    };
    await db(TABLE)
      .insert({
        ...key,
        ...originColumns,
        definition_version: definitionVersion,
        dispatch_unknown: false,
        status: 'pending',
        detail: null,
        revision: 0,
        updated_at: db.fn.now(),
      })
      .onConflict(['plugin_id', 'session_id'])
      .ignore();

    // The origin and the definition version are the authority a resume is
    // admitted against. They are immutable for the execution generation, so a
    // write racing a recovery pass can never relabel running work, and an
    // existing dispatch-unknown marker is never cleared.
    const existing = await db(TABLE)
      .where(key)
      .first(
        'origin_kind',
        'origin_user_id',
        'origin_service_plugin_id',
        'definition_version',
      );
    if (existing === undefined) {
      throw new Error(
        `Cannot record the AI session '${namespace.sessionId}' of the '${namespace.pluginId}' plugin: the session record is missing`,
      );
    }
    const unchanged =
      existing.origin_kind === originColumns.origin_kind &&
      existing.origin_user_id === originColumns.origin_user_id &&
      existing.origin_service_plugin_id ===
        originColumns.origin_service_plugin_id &&
      existing.definition_version === definitionVersion;
    if (!unchanged) {
      throw new Error(
        `The origin and definition version of the AI session '${
          namespace.sessionId
        }' of the '${
          namespace.pluginId
        }' plugin are immutable for its execution generation: recorded ${describeRecorded(
          existing,
        )}, attempted ${describeAttempted(originColumns, definitionVersion)}`,
      );
    }
  }

  async markDispatchUnknown(namespace: Namespace): Promise<void> {
    this.#assertNamespace(namespace);
    const updated = await this.#options
      .db(TABLE)
      .where({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
      })
      .update({
        dispatch_unknown: true,
        status: 'unknown-dispatch-outcome',
        detail: 'A dispatch was attempted and its outcome is unknown',
        revision: this.#options.db.raw('revision + 1'),
        updated_at: this.#options.db.fn.now(),
      });
    if (updated !== 1) {
      throw new Error(
        `Cannot record an unknown dispatch outcome for the unknown AI session '${namespace.sessionId}' of the '${namespace.pluginId}' plugin`,
      );
    }
  }

  async recover(
    options: {
      readonly cursor?: string;
      readonly limit?: number;
    } = {},
  ): Promise<RecoveryReport> {
    if (!this.#sealed) {
      throw new Error(
        `Recovery for the '${
          this.#options.pluginId
        }' plugin cannot enumerate sessions before startup recovery resolvers are registered: call completeStartup() after registering them`,
      );
    }
    const limit = options.limit ?? this.#pageSize;
    if (!Number.isSafeInteger(limit) || limit <= 0) {
      throw new Error('Recovery limit must be a positive integer');
    }

    const outcomes: RecoveryOutcome[] = [];
    let cursor = options.cursor;
    let examined = 0;

    while (examined < limit) {
      const page = await this.#options.leases.enumerate(
        this.#options.pluginId,
        cursor,
      );
      if (page.namespaces.length === 0) {
        cursor = undefined;
        break;
      }
      const sessions = page.namespaces.map(item => item.sessionId);
      const rows: RecoveryRow[] = await this.#options
        .db(TABLE)
        .where('plugin_id', this.#options.pluginId)
        .whereIn('session_id', sessions)
        .select(...ROW_COLUMNS);
      const bySession = new Map(rows.map(row => [row.session_id, row]));

      for (const namespace of page.namespaces) {
        const row = bySession.get(namespace.sessionId);
        if (!row) {
          // A namespace with no persisted session has no work to recover.
          continue;
        }
        outcomes.push(await this.#recoverOne(namespace));
        examined++;
      }

      cursor = page.next;
      if (cursor === undefined) break;
    }

    return { examined, outcomes, next: cursor };
  }

  async statusOf(
    namespace: Namespace,
  ): Promise<RecoveryStatusRecord | undefined> {
    this.#assertNamespace(namespace);
    const row = await this.#options
      .db(TABLE)
      .where({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
      })
      .first('status', 'detail');
    return row === undefined
      ? undefined
      : { status: row.status, detail: row.detail ?? undefined };
  }

  async #recoverOne(namespace: Namespace): Promise<RecoveryOutcome> {
    for (let attempt = 0; attempt < REVALIDATION_ATTEMPTS; attempt++) {
      // Never authorize from stale metadata: the enumeration snapshot is only
      // a candidate list, and every decision starts from a fresh authoritative
      // read.
      const row = await this.#readRow(namespace);
      if (row === undefined) {
        return {
          namespace,
          status: 'failed',
          detail: 'The session record is missing',
        };
      }
      const revision = String(row.revision);

      const precheck = this.#precheck(namespace, row);
      if (precheck !== undefined) {
        // No admission is open on this path, so nothing needs finalizing.
        if (await this.#persist(namespace, revision, precheck)) return precheck;
        continue;
      }

      const resolver = this.#resolvers
        .get(namespace.pluginId)!
        .get(row.definition_version)!;

      const lifetime = await AdmissionLifetime.open({
        leases: this.#options.leases,
        namespace,
        ownerPrefix: `recovery:${this.#options.pluginId}`,
        keepaliveMs: this.#admissionKeepaliveMs,
      });
      if (lifetime === undefined) {
        return {
          namespace,
          status: row.status,
          detail: 'Skipped: another replica holds the session lease',
        };
      }

      const outcome = await this.#resumeSession(
        namespace,
        row,
        revision,
        resolver,
        lifetime,
      );
      if (outcome !== undefined) return outcome;
      // Superseded before the resume was admitted: decide again.
    }

    return this.#persistedOutcome(
      namespace,
      'The session authority record kept changing during recovery',
    );
  }

  /**
   * Runs one resume inside an admission and ends it exactly once.
   *
   * @remarks
   *
   * This function never returns or throws before {@link AdmissionLifetime.dispose}
   * has run, so a thrown resolver, a failed outcome write or an unexpected read
   * error can never leave the resumed work running or the fence held. The
   * disposition is the only thing the persisted status depends on: a resume that
   * is not handed off never reports or keeps `recovered`.
   *
   * Returns the outcome to report, or `undefined` when the authority record was
   * superseded before admission and the session must be decided again.
   */
  async #resumeSession(
    namespace: Namespace,
    row: RecoveryRow,
    revision: string,
    resolver: RecoveryResolver,
    lifetime: AdmissionLifetime,
  ): Promise<RecoveryOutcome | undefined> {
    let step: SessionStep;
    try {
      step = await this.#runSession(
        namespace,
        row,
        revision,
        resolver,
        lifetime,
      );
    } catch (error) {
      step = { kind: 'failed', error };
    }

    // Exactly one finalization, on every path. `recovered` is the only outcome
    // that asks to keep the fence; everything else — including a superseded
    // resume, a failed outcome write and a thrown error — revokes the admission.
    const superseded =
      step.kind === 'superseded-before-admission' ||
      step.kind === 'superseded-at-write';
    const disposition = await lifetime.dispose(
      !superseded &&
        step.kind === 'decided' &&
        step.outcome.status === 'recovered'
        ? { kind: 'hand-off' }
        : {
            kind: 'revoke',
            reason: superseded ? 'authority-superseded' : 'session-closed',
          },
    );

    if (step.kind === 'failed') throw step.error;
    if (step.kind === 'superseded-before-admission') return undefined;
    if (step.kind === 'superseded-at-write') {
      return this.#persistedOutcome(
        namespace,
        'The session authority record changed while the resume ran',
      );
    }

    // A persist that landed after the fence was lost or the admission was
    // invalidated must not resurrect `recovered`, whatever the ordering was.
    if (
      step.outcome.status === 'recovered' &&
      disposition.kind !== 'handed-off'
    ) {
      return this.#downgradeRecovered(namespace, step.revision);
    }

    if (disposition.kind === 'handed-off') {
      // A newer authority record may still have landed after our write; the
      // freshest persisted state decides what is reported.
      const current = await this.#readRow(namespace);
      if (current !== undefined && current.status !== 'recovered') {
        return {
          namespace,
          status: current.status,
          detail: current.detail ?? undefined,
        };
      }
    }

    return step.outcome;
  }

  /**
   * The work inside one admission bracket, from credentials to outcome write.
   *
   * @remarks
   *
   * Every path here returns a {@link SessionStep} decision; the caller owns the
   * single finalization. That is deliberate: only one place in this module can
   * end an admission, so no new branch can forget to.
   */
  async #runSession(
    namespace: Namespace,
    row: RecoveryRow,
    revision: string,
    resolver: RecoveryResolver,
    lifetime: AdmissionLifetime,
  ): Promise<SessionStep> {
    let credentials: BackstageCredentials;
    try {
      credentials = await this.#options.getOwnServiceCredentials();
      const principal = credentials?.principal as { type?: string } | undefined;
      if (principal?.type !== 'service') {
        throw new Error(
          'the plugin credential source did not return service credentials',
        );
      }
    } catch (error) {
      const blocked: RecoveryOutcome = {
        namespace,
        status: 'blocked-credentials',
        detail: `Fresh service credentials for the '${
          namespace.pluginId
        }' plugin could not be obtained: ${describe(error)}`,
      };
      const blockedRevision = await this.#persist(namespace, revision, blocked);
      if (blockedRevision !== undefined) {
        return { kind: 'decided', outcome: blocked, revision: blockedRevision };
      }
      return { kind: 'superseded-before-admission' };
    }

    const admitted = await this.#readRow(namespace);
    await this.#options.admissionSnapshotGate?.(namespace);

    // GUARANTEE BOUNDARY (lead ruling, Wave 1 rework cycle 2): this admission
    // snapshot is the linearization point for LOCAL recovery work. Local
    // execution is deliberately not linearized against a concurrent authority
    // change: the resolver writes this same recovery row, so holding its lock
    // across the resume would deadlock. The guarantee is therefore two-layer —
    // (1) local admission is snapshot-linearized here, and (2) no external
    // effect can occur under stale authority because provider dispatch is
    // separately hard-gated per attempt by the dispatch guard's authority and
    // credential-generation recheck. This mirrors the accepted bounded-overlap
    // ruling on external fence sends.
    if (
      admitted === undefined ||
      String(admitted.revision) !== revision ||
      !sameAuthority(row, admitted)
    ) {
      return { kind: 'superseded-before-admission' };
    }

    let outcome: RecoveryOutcome;
    try {
      const resolution = await resolver.resume({
        namespace,
        origin: {
          kind: 'service',
          pluginId: row.origin_service_plugin_id!,
        },
        definitionVersion: row.definition_version,
        credentials,
        admission: lifetime,
      });
      switch (resolution.kind) {
        case 'resumed':
          outcome = { namespace, status: 'recovered' };
          break;
        case 'blocked-definition':
          outcome = {
            namespace,
            status: 'blocked-definition',
            detail: resolution.reason,
          };
          break;
        case 'failed':
          outcome = { namespace, status: 'failed', detail: resolution.reason };
          break;
        default:
          outcome = {
            namespace,
            status: 'failed',
            detail: `The '${namespace.pluginId}' plugin resolver returned an unknown resolution`,
          };
      }
    } catch (error) {
      outcome = { namespace, status: 'failed', detail: describe(error) };
    }

    // A resume whose fence was invalidated while it ran (takeover, expiry or a
    // failed renewal) must never be recorded as recovered: the lease it opened
    // work under is already lost.
    if (outcome.status === 'recovered' && lifetime.invalidated) {
      outcome = {
        namespace,
        status: 'failed',
        detail: 'The session lease was lost while the resume ran',
      };
    }

    const written = await this.#persist(namespace, revision, outcome);
    if (written === undefined) {
      return { kind: 'superseded-at-write' };
    }
    return { kind: 'decided', outcome, revision: written };
  }

  /**
   * Rewrites a 'recovered' outcome that this admission wrote, if and only if
   * the record is still exactly at that write.
   *
   * @remarks
   *
   * The compensation is scoped to the revision this admission created. If a
   * successor has since acquired the session and written its own newer state,
   * the compare-and-swap fails and nothing is rewritten: the successor owns the
   * record, and a stale admission must never turn its `recovered` into
   * `failed`.
   */
  async #downgradeRecovered(
    namespace: Namespace,
    writeRevision: string,
  ): Promise<RecoveryOutcome> {
    const detail = 'The session lease was lost while the outcome was recorded';
    const failed: RecoveryOutcome = { namespace, status: 'failed', detail };
    if (await this.#persist(namespace, writeRevision, failed)) {
      return failed;
    }
    // Scope lost: a newer admission owns this session. Do nothing, and report
    // whatever is actually persisted.
    return this.#persistedOutcome(
      namespace,
      'A newer admission owns this session',
    );
  }

  async #persistedOutcome(
    namespace: Namespace,
    fallbackDetail: string,
  ): Promise<RecoveryOutcome> {
    const current = await this.#readRow(namespace);
    if (current === undefined) {
      return { namespace, status: 'failed', detail: fallbackDetail };
    }
    return {
      namespace,
      status: current.status,
      detail: current.detail ?? fallbackDetail,
    };
  }

  /**
   * Decides everything that does not need credentials or a resume.
   *
   * @remarks
   *
   * `undefined` means the session is eligible for a service-origin resume and
   * must go through admission.
   */
  #precheck(
    namespace: Namespace,
    row: RecoveryRow,
  ): RecoveryOutcome | undefined {
    const record = (status: RecoveryStatus, detail?: string) => ({
      namespace,
      status,
      detail,
    });

    // An uncertain external effect outranks everything else: it must never be
    // reported as recovered, and resuming could duplicate it.
    if (row.dispatch_unknown) {
      return record(
        'unknown-dispatch-outcome',
        'A dispatch was attempted and its outcome is unknown, so the session is not resumed automatically',
      );
    }

    // User-origin work stays paused until the authenticated user
    // reauthorizes. No credential source is consulted, so the session cannot
    // be silently resumed as a service identity.
    if (row.origin_kind === 'user') {
      return record(
        'needs-reauth',
        `User ${row.origin_user_id} must reauthorize this session before its work resumes`,
      );
    }

    if (row.origin_service_plugin_id !== namespace.pluginId) {
      return record(
        'blocked-credentials',
        `The session originated as service work for the '${row.origin_service_plugin_id}' plugin and cannot be resumed as the '${namespace.pluginId}' plugin`,
      );
    }

    if (
      this.#resolvers.get(namespace.pluginId)?.get(row.definition_version) ===
      undefined
    ) {
      return record(
        'blocked-definition',
        `No recovery resolver for the '${namespace.pluginId}' plugin registered definition version '${row.definition_version}'; the session cannot be reconstructed`,
      );
    }

    return undefined;
  }

  /**
   * Writes an outcome only if the authority record is unchanged.
   *
   * @remarks
   *
   * Returns the revision this write created, or `undefined` when the
   * compare-and-swap lost. Callers that may need to compensate must use that
   * exact revision, so a compensation can never touch a successor's newer
   * record.
   */
  async #persist(
    namespace: Namespace,
    revision: string,
    outcome: RecoveryOutcome,
  ): Promise<string | undefined> {
    const updated = await this.#options
      .db(TABLE)
      .where({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
        revision,
      })
      .update({
        status: outcome.status,
        detail: outcome.detail ?? null,
        revision: this.#options.db.raw('revision + 1'),
        updated_at: this.#options.db.fn.now(),
      });
    return updated === 1 ? nextRevision(revision) : undefined;
  }

  async #readRow(namespace: Namespace): Promise<RecoveryRow | undefined> {
    return this.#options
      .db(TABLE)
      .where({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
      })
      .select(...ROW_COLUMNS)
      .first();
  }

  #assertNamespace(namespace: Namespace): void {
    if (namespace?.pluginId !== this.#options.pluginId) {
      throw new Error(
        `The '${
          this.#options.pluginId
        }' plugin recovery cannot handle sessions of the '${
          namespace?.pluginId
        }' plugin`,
      );
    }
    if (typeof namespace.sessionId !== 'string' || !namespace.sessionId) {
      throw new Error('Invalid AI session ID');
    }
  }

  #requireId(value: unknown, label: string): string {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(`A recovery session requires a non-empty ${label}`);
    }
    return value;
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The revision a successful compare-and-swap write creates. */
function nextRevision(revision: string): string {
  return (BigInt(revision) + 1n).toString();
}

function sameAuthority(left: RecoveryRow, right: RecoveryRow): boolean {
  return (
    left.origin_kind === right.origin_kind &&
    left.origin_user_id === right.origin_user_id &&
    left.origin_service_plugin_id === right.origin_service_plugin_id &&
    left.definition_version === right.definition_version &&
    Boolean(left.dispatch_unknown) === Boolean(right.dispatch_unknown)
  );
}

function describeRecorded(row: {
  origin_kind: string;
  origin_user_id: string | null;
  origin_service_plugin_id: string | null;
  definition_version: string;
}): string {
  const origin =
    row.origin_kind === 'user'
      ? `user '${row.origin_user_id}'`
      : `service '${row.origin_service_plugin_id}'`;
  return `origin ${origin} at definition version '${row.definition_version}'`;
}

function describeAttempted(
  columns: {
    origin_kind: string;
    origin_user_id: string | null;
    origin_service_plugin_id: string | null;
  },
  definitionVersion: string,
): string {
  return describeRecorded({
    ...columns,
    definition_version: definitionVersion,
  });
}

/**
 * Creates startup recovery for one consuming plugin.
 *
 * @remarks
 *
 * The consuming plugin must register every stable versioned registry/config
 * resolver and then call {@link AiRecovery.completeStartup} during startup,
 * before the first enumeration. Missing or incompatible resolvers leave the
 * session visibly `blocked-definition`; no other definition, registry or
 * credential source is ever substituted. Fails early when the recovery table is
 * missing.
 *
 * @internal
 */
export async function createAiRecovery(
  options: AiRecoveryOptions,
): Promise<AiRecovery> {
  if (typeof options.pluginId !== 'string' || !options.pluginId) {
    throw new Error('Recovery requires a plugin ID');
  }
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isSafeInteger(pageSize) || pageSize <= 0) {
    throw new Error('Recovery page size must be positive');
  }
  await options.db(TABLE).select('session_id').limit(1);
  return new StartupRecovery({ ...options, pageSize });
}
