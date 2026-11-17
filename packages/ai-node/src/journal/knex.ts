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
import {
  NotAllowedError,
  NotFoundError,
  type BackstageCredentials,
} from '@backstage/backend-plugin-api';
import type { Fence } from '../contracts';
import {
  parseAttemptId,
  parseAuditQuery,
  parseDecision,
  parseFence,
  parseOutcome,
  parseRecovery,
  type ParsedDecision,
  type ParsedOutcome,
  type ParsedQuery,
  type ParsedRecovery,
} from './redaction';
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
  /**
   * Checks the separate `ai.audit.read` permission for a reader. The journal
   * never authorizes reads itself.
   */
  readonly authorizer: AuditReadAuthorizer;
  /** Best-effort write-through mirror to the Backstage auditor service. */
  readonly mirror?: JournalAuditorMirror;
}

type Executor = Knex | Knex.Transaction;

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
  readonly #sqlite: boolean;

  constructor(options: AttemptJournalOptions) {
    this.#db = options.db;
    this.#authorizer = options.authorizer;
    this.#mirror = options.mirror;
    this.#sqlite = options.db.client.config.client === 'better-sqlite3';
  }

  async recordDecisionAndIntent(
    fence: Fence,
    event: unknown,
  ): Promise<AttemptId> {
    const parsed = parseDecision(event);
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
        })
        .onConflict(['plugin_id', 'session_id'])
        .ignore();
      const inserted = await trx(JOURNAL_EVENTS_TABLE)
        .insert(decisionColumns(lease, parsed))
        .returning('id');
      return String((inserted[0] as { id: string | number }).id);
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
      const inserted = await trx(JOURNAL_EVENTS_TABLE)
        .insert(outcomeColumns(lease, attemptId, parsed))
        .returning('id');
      return String((inserted[0] as { id: string | number }).id);
    });
    await this.#mirrorEvent(id);
  }

  async recordRecovery(fence: Fence, event: unknown): Promise<void> {
    const parsed = parseRecovery(event);
    const lease = parseFence(fence);
    const id = await this.#append(lease, async trx => {
      const inserted = await trx(JOURNAL_EVENTS_TABLE)
        .insert(recoveryColumns(lease, parsed))
        .returning('id');
      return String((inserted[0] as { id: string | number }).id);
    });
    await this.#mirrorEvent(id);
  }

  async read(
    credentials: BackstageCredentials,
    query: unknown,
  ): Promise<AuditPage> {
    const parsed = parseAuditQuery(query);
    const owner = await this.#db(JOURNAL_SESSION_OWNERS_TABLE)
      .where(ns(parsed))
      .first('owner_ref');
    if (!owner) {
      throw new NotFoundError(
        `No journaled session ${parsed.pluginId}/${parsed.sessionId}`,
      );
    }
    const ref = principalRef(credentials);
    if (ref === undefined || ref !== owner.owner_ref) {
      throw new NotAllowedError('Audit reads require ownership of the session');
    }
    if (!(await this.#authorizer.authorizeAuditRead(credentials))) {
      throw new NotAllowedError(
        `Audit reads require the ${AI_AUDIT_READ_PERMISSION_NAME} permission`,
      );
    }

    const rows: EventRow[] = await this.#db(JOURNAL_EVENTS_TABLE)
      .where(ns(parsed))
      .where('id', '>', parsed.cursor ?? 0)
      .orderBy('id', 'asc')
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
          .select('attempt_id', 'status');
      for (const outcome of outcomes) {
        resolved.set(String(outcome.attempt_id), outcome.status);
      }
    }

    return {
      items: rows.map(row => rowToView(row, resolved.get(String(row.id)))),
      nextCursor: hasMore ? String(rows[rows.length - 1].id) : undefined,
    };
  }

  async #mirrorEvent(id: string): Promise<void> {
    if (!this.#mirror) return;
    try {
      const row = await this.#db(JOURNAL_EVENTS_TABLE).where({ id }).first();
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
    for (let attempt = 0; ; attempt++) {
      const trx = await this.#db.transaction();
      let locked = false;
      let committing = false;
      try {
        await this.#lockLeaseRow(trx, lease);
        locked = true;
        await this.#checkFence(trx, lease);
        const result = await insert(trx);
        committing = true;
        await trx.commit();
        return result;
      } catch (error) {
        let rolledBack = false;
        if (!trx.isCompleted()) {
          try {
            await trx.rollback();
            rolledBack = true;
          } catch {
            /* The outcome is not known safe. */
          }
        }
        const code = (error as { code?: string })?.code;
        if (
          !committing &&
          !locked &&
          rolledBack &&
          attempt < 3 &&
          ['SQLITE_BUSY', 'SQLITE_LOCKED', '40001', '40P01'].includes(
            code ?? '',
          )
        ) {
          await new Promise(resolve => setTimeout(resolve, 50 * 2 ** attempt));
          continue;
        }
        throw error;
      }
    }
  }

  async #lockLeaseRow(
    trx: Knex.Transaction,
    lease: ReturnType<typeof parseFence>,
  ): Promise<void> {
    const key = ns(lease);
    if (this.#sqlite) {
      // An UPDATE obtains SQLite's write lock before observing the lease.
      await trx('ai_namespace_leases')
        .where(key)
        .update({ owner_id: trx.raw('owner_id') });
    } else {
      await trx('ai_namespace_leases').where(key).forUpdate().first();
    }
  }

  async #checkFence(
    trx: Knex.Transaction,
    lease: ReturnType<typeof parseFence>,
  ): Promise<void> {
    const clock = this.#sqlite
      ? "CASE WHEN typeof(expires_at) IN ('integer', 'real') THEN expires_at > (julianday('now') - 2440587.5) * 86400000 ELSE julianday(expires_at) > julianday('now') END"
      : 'expires_at > statement_timestamp()';
    const row = await trx('ai_namespace_leases')
      .where(ns(lease))
      .where({ owner_id: lease.owner, token: lease.token })
      .whereRaw(clock)
      .first('token');
    if (!row) throw new Error('Journal fence is stale or expired');
  }
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
    recordedAt: new Date(
      row.created_at as string | number | Date,
    ).toISOString(),
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
        row.decision === 'deny' ? undefined : outcomeStatus ?? 'unknown',
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
  if (
    typeof principal === 'object' &&
    principal !== null &&
    principal.type === 'user'
  ) {
    const ref = (principal as { userEntityRef?: unknown }).userEntityRef;
    if (typeof ref === 'string' && ref.length > 0) return ref;
    return undefined;
  }
  if (
    typeof principal === 'object' &&
    principal !== null &&
    principal.type === 'service'
  ) {
    const subject = (principal as { subject?: unknown }).subject;
    if (typeof subject === 'string' && subject.length > 0) return subject;
    return undefined;
  }
  return undefined;
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
