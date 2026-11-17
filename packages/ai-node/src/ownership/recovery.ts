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
import type { Namespace } from '../contracts';
import type { NamespaceLease } from './types';

const TABLE = 'ai_recovery_sessions';
const DEFAULT_PAGE_SIZE = 100;

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
};

class StartupRecovery implements AiRecovery {
  readonly #options: AiRecoveryOptions;
  readonly #pageSize: number;
  readonly #resolvers = new Map<string, Map<string, RecoveryResolver>>();
  #sealed = false;

  constructor(options: AiRecoveryOptions) {
    this.#options = options;
    this.#pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
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

    // An existing dispatch-unknown marker is durable evidence and is never
    // cleared by recording the session again.
    await this.#options
      .db(TABLE)
      .insert({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
        ...originColumns,
        definition_version: definitionVersion,
        dispatch_unknown: false,
        status: 'pending',
        detail: null,
        updated_at: this.#options.db.fn.now(),
      })
      .onConflict(['plugin_id', 'session_id'])
      .merge({
        ...originColumns,
        definition_version: definitionVersion,
        updated_at: this.#options.db.fn.now(),
      });
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
        .select(
          'session_id',
          'origin_kind',
          'origin_user_id',
          'origin_service_plugin_id',
          'definition_version',
          'dispatch_unknown',
          'status',
          'detail',
        );
      const bySession = new Map(rows.map(row => [row.session_id, row]));

      for (const namespace of page.namespaces) {
        const row = bySession.get(namespace.sessionId);
        if (!row) {
          // A namespace with no persisted session has no work to recover.
          continue;
        }
        outcomes.push(await this.#recoverOne(namespace, row));
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

  async #recoverOne(
    namespace: Namespace,
    row: RecoveryRow,
  ): Promise<RecoveryOutcome> {
    const outcome = await this.#decide(namespace, row);
    await this.#options
      .db(TABLE)
      .where({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
      })
      .update({
        status: outcome.status,
        detail: outcome.detail ?? null,
        updated_at: this.#options.db.fn.now(),
      });
    return outcome;
  }

  async #decide(
    namespace: Namespace,
    row: RecoveryRow,
  ): Promise<RecoveryOutcome> {
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

    const resolver = this.#resolvers
      .get(namespace.pluginId)
      ?.get(row.definition_version);
    if (resolver === undefined) {
      return record(
        'blocked-definition',
        `No recovery resolver for the '${namespace.pluginId}' plugin registered definition version '${row.definition_version}'; the session cannot be reconstructed`,
      );
    }

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
      return record(
        'blocked-credentials',
        `Fresh service credentials for the '${
          namespace.pluginId
        }' plugin could not be obtained: ${describe(error)}`,
      );
    }

    try {
      const resolution = await resolver.resume({
        namespace,
        origin: {
          kind: 'service',
          pluginId: row.origin_service_plugin_id,
        },
        definitionVersion: row.definition_version,
        credentials,
      });
      switch (resolution.kind) {
        case 'resumed':
          return record('recovered');
        case 'blocked-definition':
          return record('blocked-definition', resolution.reason);
        case 'failed':
          return record('failed', resolution.reason);
        default:
          return record(
            'failed',
            `The '${namespace.pluginId}' plugin resolver returned an unknown resolution`,
          );
      }
    } catch (error) {
      return record('failed', describe(error));
    }
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
