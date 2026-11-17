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

import type { Knex } from 'knex';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Fence } from '../contracts';
import { bigintText, dbNow, fencedTransaction } from '../storage/dialect-kit';
import { builtinProviderRegistry } from '../providers/builtins';
import type { AiProviderRegistry } from '../providers/registry';
import {
  assertPrincipalRef,
  parseAttemptId,
  parseAuditQuery,
  parseDecision,
  parseFence,
  parseOutcome,
  parseRecovery,
  type ParsedDecision,
  type ParsedOutcome,
  type ParsedRecovery,
} from './redaction';
import { AuditAccessDeniedError, AuditSessionNotFoundError } from './errors';
import {
  AI_AUDIT_READ_PERMISSION_NAME,
  type AttemptId,
  type AttemptJournal,
  type AuditEventView,
  type AuditPage,
  type AuditReadAuthorizer,
  type JournalAuditorMirror,
} from './types';

/** Table holding the append-only journal ledger. */
export const JOURNAL_EVENTS_TABLE = 'ai_journal_events';

/** Table holding the stored owner of each journaled session. */
export const JOURNAL_SESSION_OWNERS_TABLE = 'ai_journal_session_owners';

/**
 * Options for {@link createAttemptJournal}.
 *
 * @alpha
 */
export interface AttemptJournalOptions {
  readonly db: Knex;
  /** Provider routes and operation classifications approved by the host. */
  readonly providers?: AiProviderRegistry;
  /**
   * Checks the separate `ai.audit.read` permission for a reader. The journal
   * never authorizes reads itself.
   */
  readonly authorizer: AuditReadAuthorizer;
  /** Best-effort write-through mirror to the Backstage auditor service. */
  readonly mirror?: JournalAuditorMirror;
  /**
   * Integration-time override for session ownership lookup. When absent,
   * ownership is read from the journal's own stored session owners. A
   * resolver returns the owning principal entity reference, or undefined for
   * an unknown session.
   */
  readonly ownershipResolver?: (
    namespace: Readonly<{
      pluginId: string;
      sessionId: string;
    }>,
  ) => Promise<string | undefined>;
}

interface EventRow {
  id: string | number;
  plugin_id: string;
  session_id: string;
  kind: 'decision' | 'outcome' | 'recovery';
  attempt_id: string | number | null;
  actor: string | null;
  conversation_id: string | null;
  task_id: string | null;
  call_id: string | null;
  definition_version: string | null;
  config_version: string | null;
  provider: string | null;
  model: string | null;
  operation: string | null;
  destination: string | null;
  attempt: number | null;
  decision: string | null;
  reason: string | null;
  status: string | null;
  http_status: number | null;
  detail: string | null;
  fence_owner: string;
  fence_token: string;
  recovery_kind: string | null;
  created_at: Date | string;
}

/**
 * Knex-backed durable audit journal.
 *
 * Every append validates and redacts the event at the boundary, then checks
 * the current unexpired lease owner/token in the same database transaction
 * as the insert, mirroring the storage adapter's fenced-write protocol: the
 * lease row is locked (row lock on PostgreSQL, write lock on SQLite) before
 * the fence is checked against the database clock, so a takeover during an
 * append cannot interleave and a stale owner can never commit a row.
 *
 * The durable ledger is the primary, blocking path: an append that fails
 * rejects, which blocks dispatch. The auditor mirror is strictly secondary
 * and best-effort: it runs after commit and its failures are swallowed
 * without erasing committed journal facts.
 */
class KnexAttemptJournal implements AttemptJournal {
  readonly #db: Knex;
  readonly #authorizer: AuditReadAuthorizer;
  readonly #mirror: JournalAuditorMirror | undefined;
  readonly #ownershipResolver:
    | AttemptJournalOptions['ownershipResolver']
    | undefined;
  readonly #sqlite: boolean;
  readonly #providers: AiProviderRegistry;

  constructor(options: AttemptJournalOptions) {
    this.#db = options.db;
    this.#providers = options.providers ?? builtinProviderRegistry;
    this.#authorizer = options.authorizer;
    this.#mirror = options.mirror;
    this.#ownershipResolver = options.ownershipResolver;
    this.#sqlite = options.db.client.config.client === 'better-sqlite3';
  }

  async recordDecisionAndIntent(
    fence: Fence,
    event: unknown,
  ): Promise<AttemptId> {
    const parsed = parseDecision(event, this.#providers);
    const lease = parseFence(fence);
    const id = await this.#append(lease, async trx => {
      // The first recorded decision's actor becomes the stored session
      // owner; later actors may append (service-origin work) but ownership
      // never silently changes hands.
      await trx(JOURNAL_SESSION_OWNERS_TABLE)
        .insert({
          plugin_id: lease.pluginId,
          session_id: lease.sessionId,
          owner_ref: parsed.actor,
          created_at: dbNow(trx),
        })
        .onConflict(['plugin_id', 'session_id'])
        .ignore();
      return this.#insertEvent(trx, decisionColumns(lease, parsed));
    });
    await this.#mirrorEvent(id);
    return id;
  }

  async recordOutcome(
    fence: Fence,
    attempt: AttemptId,
    outcome: unknown,
  ): Promise<void> {
    const parsed = parseOutcome(outcome);
    const attemptId = parseAttemptId(attempt);
    const lease = parseFence(fence);
    const id = await this.#append(lease, async trx => {
      const decision = await trx(JOURNAL_EVENTS_TABLE)
        .where(ns(lease))
        .where({ id: attemptId, kind: 'decision' })
        .first('decision', 'attempt');
      if (!decision) {
        throw new Error(
          `Cannot record an outcome: no decision found for attempt ${attemptId} in this namespace`,
        );
      }
      if (decision.decision === 'deny') {
        throw new Error(
          `Cannot record an outcome: attempt ${attemptId} was denied and never sent`,
        );
      }
      const existing = await trx(JOURNAL_EVENTS_TABLE)
        .where({ kind: 'outcome', attempt_id: attemptId })
        .first('id');
      if (existing) {
        throw new Error(
          `Cannot record an outcome: attempt ${attemptId} already has one; outcomes are never rewritten`,
        );
      }
      return this.#insertEvent(trx, outcomeColumns(lease, attemptId, parsed));
    });
    await this.#mirrorEvent(id);
  }

  async recordRecovery(fence: Fence, event: unknown): Promise<void> {
    const parsed = parseRecovery(event);
    const lease = parseFence(fence);
    const id = await this.#append(lease, async trx => {
      return this.#insertEvent(trx, recoveryColumns(lease, parsed));
    });
    await this.#mirrorEvent(id);
  }

  async read(
    credentials: BackstageCredentials,
    query: unknown,
  ): Promise<AuditPage> {
    const parsed = parseAuditQuery(query);
    const ref = principalRef(credentials);
    if (ref === undefined) {
      throw new AuditAccessDeniedError(
        'Audit reads require ownership of the session',
      );
    }
    const ownerRef = this.#ownershipResolver
      ? await this.#ownershipResolver({
          pluginId: parsed.pluginId,
          sessionId: parsed.sessionId,
        })
      : (
          await this.#db(JOURNAL_SESSION_OWNERS_TABLE)
            .where(ns(parsed))
            .first('owner_ref')
        )?.owner_ref;
    if (!ownerRef) {
      throw new AuditSessionNotFoundError(
        `No journaled session ${parsed.pluginId}/${parsed.sessionId}`,
      );
    }
    if (ref !== ownerRef) {
      throw new AuditAccessDeniedError(
        'Audit reads require ownership of the session',
      );
    }
    if (!(await this.#authorizer.authorizeAuditRead(credentials))) {
      throw new AuditAccessDeniedError(
        `Audit reads require the ${AI_AUDIT_READ_PERMISSION_NAME} permission`,
      );
    }

    // ORDER BY and cursor comparisons target the underlying numeric column:
    // the TEXT cast alias would otherwise sort (and page) lexicographically.
    const rows: EventRow[] = await this.#selectEvents(this.#db)
      .where(ns(parsed))
      .where('ai_journal_events.id', '>', parsed.cursor ?? 0)
      .orderByRaw('ai_journal_events.id ASC')
      .limit(parsed.limit + 1);
    const hasMore = rows.length > parsed.limit;
    if (hasMore) rows.pop();

    const resolved = new Map<string, string>();
    const attemptIds = rows
      .filter(row => row.kind === 'decision' && row.decision === 'allow')
      .map(row => String(row.id));
    if (attemptIds.length > 0) {
      const outcomes: Array<{ attempt_id: string | number; status: string }> =
        await this.#db(JOURNAL_EVENTS_TABLE)
          .where({ kind: 'outcome' })
          .whereIn('attempt_id', attemptIds)
          .select(bigintText(this.#db, 'attempt_id'), 'status');
      for (const outcome of outcomes) {
        resolved.set(String(outcome.attempt_id), outcome.status);
      }
    }

    return {
      items: rows.map(row => rowToView(row, resolved.get(String(row.id)))),
      nextCursor: hasMore ? String(rows[rows.length - 1].id) : undefined,
    };
  }

  /**
   * Inserts one journal event and returns its ID as an exact decimal string.
   *
   * SQLite returns INTEGER primary keys to JavaScript as numbers, which
   * silently loses precision above 2^53, so the ID is cast to TEXT inside
   * the database; PostgreSQL already returns bigints as strings.
   */
  async #insertEvent(
    trx: Knex.Transaction,
    columns: Record<string, unknown>,
  ): Promise<AttemptId> {
    const row = { ...columns, created_at: dbNow(trx) };
    if (this.#sqlite) {
      await trx(JOURNAL_EVENTS_TABLE).insert(row);
      const rows: Array<{ id: string }> = await trx(JOURNAL_EVENTS_TABLE)
        .select(bigintText(trx, 'id'))
        .whereRaw('rowid = last_insert_rowid()');
      return rows[0].id;
    }
    const inserted = await trx(JOURNAL_EVENTS_TABLE)
      .insert(row)
      .returning('id');
    return String((inserted[0] as { id: string | number }).id);
  }

  /**
   * Selects journal event rows with the 64-bit ID columns cast to TEXT, so
   * SQLite never rounds them through a JavaScript number. Explicit columns
   * avoid ambiguous ORDER BY targets from `*` plus aliased casts.
   */
  #selectEvents(db: Knex): Knex.QueryBuilder {
    return db(JOURNAL_EVENTS_TABLE).select(
      bigintText(db, 'id'),
      'plugin_id',
      'session_id',
      'kind',
      bigintText(db, 'attempt_id'),
      'actor',
      'conversation_id',
      'task_id',
      'call_id',
      'definition_version',
      'config_version',
      'provider',
      'model',
      'operation',
      'destination',
      'attempt',
      'decision',
      'reason',
      'status',
      'http_status',
      'detail',
      'recovery_kind',
      'fence_owner',
      'fence_token',
      'created_at',
    );
  }

  async #mirrorEvent(id: string): Promise<void> {
    if (!this.#mirror) return;
    try {
      // The same lossless TEXT-cast projection as reads: a mirrored event
      // must never round a 64-bit ID through a JavaScript number.
      const row = await this.#selectEvents(this.#db)
        .where('ai_journal_events.id', id)
        .first();
      if (row) await this.#mirror.mirror(rowToView(row, undefined));
    } catch {
      // Best effort by contract: a mirror failure never erases or fails a
      // committed journal fact.
    }
  }

  /**
   * Runs one fenced append: lock the lease row, check the current unexpired
   * owner/token against the database clock, then insert, all in a single
   * transaction. A failed fence check rejects the append.
   */
  async #append<T>(
    lease: ReturnType<typeof parseFence>,
    insert: (trx: Knex.Transaction) => Promise<T>,
  ): Promise<T> {
    return fencedTransaction(
      this.#db,
      ns(lease),
      lease,
      'Journal fence is stale or expired',
      async () => undefined,
      insert,
    );
  }
}

/**
 * Normalizes a stored timestamp to UTC ISO-8601. SQLite rows are UTC ISO
 * text with an explicit zone marker; older rows written as timezone-less
 * `YYYY-MM-DD HH:MM:SS` text (SQLite `CURRENT_TIMESTAMP`) or epoch numbers
 * are interpreted as UTC, never as host-local time.
 */
function toIsoTimestamp(value: Date | string | number): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return new Date(value).toISOString();
  const text = value.trim();
  if (/Z$/i.test(text) || /[+-]\d{2}:?\d{2}$/.test(text)) {
    return new Date(text).toISOString();
  }
  // Timezone-less text is UTC by storage contract, not host-local.
  return new Date(`${text.replace(' ', 'T')}Z`).toISOString();
}

function ns(lease: { pluginId: string; sessionId: string }) {
  return { plugin_id: lease.pluginId, session_id: lease.sessionId };
}

function decisionColumns(
  lease: ReturnType<typeof parseFence>,
  parsed: ParsedDecision,
) {
  return {
    ...ns(lease),
    kind: 'decision',
    attempt_id: null,
    actor: parsed.actor,
    conversation_id: parsed.conversationId ?? null,
    task_id: parsed.taskId ?? null,
    call_id: parsed.callId ?? null,
    definition_version: parsed.definitionVersion,
    config_version: parsed.configVersion,
    provider: parsed.provider ?? null,
    model: parsed.model ?? null,
    operation: parsed.operation,
    destination: parsed.destination ?? null,
    attempt: parsed.attempt,
    decision: parsed.decision,
    reason: parsed.reason ?? null,
    status: null,
    http_status: null,
    detail: null,
    fence_owner: lease.owner,
    fence_token: lease.token,
    recovery_kind: null,
  };
}

function outcomeColumns(
  lease: ReturnType<typeof parseFence>,
  attemptId: string,
  parsed: ParsedOutcome,
) {
  return {
    ...ns(lease),
    kind: 'outcome',
    attempt_id: attemptId,
    actor: null,
    conversation_id: null,
    task_id: null,
    call_id: null,
    definition_version: null,
    config_version: null,
    provider: null,
    model: null,
    operation: null,
    destination: null,
    attempt: null,
    decision: null,
    reason: null,
    status: parsed.status,
    http_status: parsed.httpStatus ?? null,
    detail: parsed.detail ?? null,
    fence_owner: lease.owner,
    fence_token: lease.token,
    recovery_kind: null,
  };
}

function recoveryColumns(
  lease: ReturnType<typeof parseFence>,
  parsed: ParsedRecovery,
) {
  return {
    ...ns(lease),
    kind: 'recovery',
    attempt_id: null,
    actor: parsed.actor,
    conversation_id: parsed.conversationId ?? null,
    task_id: parsed.taskId ?? null,
    call_id: parsed.callId ?? null,
    definition_version: parsed.definitionVersion ?? null,
    config_version: parsed.configVersion ?? null,
    provider: null,
    model: null,
    operation: null,
    destination: null,
    attempt: null,
    decision: null,
    reason: null,
    status: null,
    http_status: null,
    detail: parsed.detail ?? null,
    fence_owner: lease.owner,
    fence_token: lease.token,
    recovery_kind: parsed.kind,
  };
}

function rowToView(
  row: EventRow,
  outcomeStatus: string | undefined,
): AuditEventView {
  const common = {
    id: String(row.id),
    pluginId: row.plugin_id,
    sessionId: row.session_id,
    recordedAt: toIsoTimestamp(row.created_at),
    fenceOwner: row.fence_owner,
    fenceToken: row.fence_token,
  };
  if (row.kind === 'decision') {
    return {
      kind: 'decision',
      ...common,
      actor: row.actor!,
      conversationId: row.conversation_id ?? undefined,
      taskId: row.task_id ?? undefined,
      callId: row.call_id ?? undefined,
      definitionVersion: row.definition_version!,
      configVersion: row.config_version!,
      provider: row.provider ?? undefined,
      model: row.model ?? undefined,
      operation: row.operation!,
      destination: row.destination ?? undefined,
      attempt: row.attempt!,
      decision: row.decision as 'allow' | 'deny',
      reason: row.reason ?? undefined,
      // A send intent with no recorded outcome stays unknown forever; the
      // journal never invents an outcome for a crashed attempt.
      outcomeStatus:
        row.decision === 'deny'
          ? undefined
          : (outcomeStatus as ParsedOutcome['status']) ?? 'unknown',
    };
  }
  if (row.kind === 'outcome') {
    return {
      kind: 'outcome',
      ...common,
      attemptId: String(row.attempt_id),
      status: row.status as ParsedOutcome['status'],
      httpStatus: row.http_status ?? undefined,
      detail: row.detail ?? undefined,
    };
  }
  return {
    kind: 'recovery',
    ...common,
    actor: row.actor!,
    recoveryKind: row.recovery_kind as ParsedRecovery['kind'],
    conversationId: row.conversation_id ?? undefined,
    taskId: row.task_id ?? undefined,
    callId: row.call_id ?? undefined,
    definitionVersion: row.definition_version ?? undefined,
    configVersion: row.config_version ?? undefined,
    detail: row.detail ?? undefined,
  };
}

function principalRef(credentials: BackstageCredentials): string | undefined {
  const principal = (credentials as { principal?: { type?: string } })
    .principal;
  if (typeof principal !== 'object' || principal === null) return undefined;
  let value: unknown;
  if (principal.type === 'user') {
    value = (principal as { userEntityRef?: unknown }).userEntityRef;
  } else if (principal.type === 'service') {
    value = (principal as { subject?: unknown }).subject;
  }
  try {
    return assertPrincipalRef(value);
  } catch {
    return undefined;
  }
}

/**
 * Creates the durable, fenced, redacted audit journal on a Knex database.
 *
 * @remarks
 *
 * Requires the shared AI lease and journal tables to exist (run the AI
 * migrations); a missing schema fails on first use rather than implicitly
 * migrating.
 *
 * @alpha
 */
export function createAttemptJournal(
  options: AttemptJournalOptions,
): AttemptJournal {
  return new KnexAttemptJournal(options);
}
