// T5 frozen contract 6f277db5eb; vendored for compilation, superseded by the identical file at integration.
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

/**
 * Identifier of one recorded decision/intent row in the journal.
 *
 * @remarks
 *
 * A decimal string of a database-safe 64-bit integer. Never a JS number:
 * journal IDs are not precision-bound at the seam.
 *
 * @alpha
 */
export type AttemptId = string;

/**
 * The permission that separately controls audit reads, checked by an injected
 * authorizer in addition to stored session ownership.
 *
 * @alpha
 */
export const AI_AUDIT_READ_PERMISSION_NAME = 'ai.audit.read';

/**
 * How an attempt ended, as classified by the dispatch guard.
 *
 * @remarks
 *
 * - `completed`: the logical operation succeeded.
 * - `failed`: the operation failed before or during dispatch.
 * - `cancelled`: cancelled by caller or abort before an uncertain point.
 * - `stream-failed`: failure after response headers (e.g. stream error or
 *   abort mid-stream); 200 headers alone are not completion.
 * - `unknown`: the writer cannot know the remote outcome (e.g. worker closed
 *   mid-stream, post-send crash discovered by a successor). The journal never
 *   invents an outcome; `unknown` is an explicit uncertain record, and the
 *   absence of any outcome row is also reported as `unknown` on read.
 *
 * @alpha
 */
export type AttemptOutcomeStatus =
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'stream-failed'
  | 'unknown';

/**
 * The durable decision/intent record, committed before any send.
 *
 * @remarks
 *
 * `decision: 'allow'` is the send intent: it must be durably committed before
 * dispatch. `decision: 'deny'` records a denial with no send intent and never
 * receives an outcome. `attempt` is the per-call attempt ordinal. All fields
 * are structurally redacted: the journal validates an exact field set and
 * rejects unknown fields and secret-shaped text, so credentials, auth
 * headers, prompts and raw payloads are unrepresentable here.
 *
 * @alpha
 */
export type AttemptDecision = Readonly<{
  /** Redacted actor: the authenticated principal entity ref, never a token. */
  readonly actor: string;
  readonly conversationId?: string;
  readonly taskId?: string;
  readonly callId?: string;
  /** Stable version identity of the definitions registry in use. */
  readonly definitionVersion: string;
  /** Stable version identity of the resolved configuration in use. */
  readonly configVersion: string;
  /** Canonical provider ID, when the operation targets a model. */
  readonly provider?: string;
  /** Canonical model ID, when the operation targets a model. */
  readonly model?: string;
  /** Operation name and classification, e.g. `models.stream` or `auth.token`. */
  readonly operation: string;
  /**
   * Canonical destination of the attempt: origin + path only. Query strings,
   * fragments and userinfo are never included; absent for local rejections
   * that never resolved a destination.
   */
  readonly destination?: string;
  /** Attempt ordinal within the call; monotonically increasing per call. */
  readonly attempt: number;
  /** The permission decision for this attempt. */
  readonly decision: 'allow' | 'deny';
  /** Short sanitized reason, e.g. for a denial. */
  readonly reason?: string;
}>;

/**
 * The outcome of one recorded attempt, appended after the attempt settles.
 *
 * @remarks
 *
 * At most one outcome exists per {@link AttemptId}; the journal rejects a
 * second. Never invented: a writer that cannot know the remote outcome
 * records `unknown` explicitly.
 *
 * @alpha
 */
export type AttemptOutcome = Readonly<{
  readonly status: AttemptOutcomeStatus;
  /** HTTP response status code, when a response was received. */
  readonly httpStatus?: number;
  /** Short sanitized detail. No payloads, prompts or credentials. */
  readonly detail?: string;
}>;

/**
 * A recovery-lifecycle event, recorded separately from decisions and outcomes.
 *
 * @remarks
 *
 * Needs-reauth, blocked-definition and unknown-dispatch are distinct kinds;
 * `unknown-dispatch` is the durable uncertainty record for an attempt whose
 * remote outcome can never be established.
 *
 * @alpha
 */
export type RecoveryEvent = Readonly<{
  /** Redacted actor: the authenticated principal entity ref, never a token. */
  readonly actor: string;
  readonly kind:
    | 'needs-reauth'
    | 'blocked-definition'
    | 'unknown-dispatch'
    | 'other';
  readonly conversationId?: string;
  readonly taskId?: string;
  readonly callId?: string;
  readonly definitionVersion?: string;
  readonly configVersion?: string;
  /** Short sanitized detail. */
  readonly detail?: string;
}>;

/**
 * One redacted journal event as returned by {@link AttemptJournal.read}.
 *
 * @remarks
 *
 * `outcomeStatus` on a decision is the resolved outcome of the attempt, or
 * `unknown` when no outcome was ever recorded (e.g. a crash between intent
 * and send). It is omitted for denials, which have no send.
 *
 * @alpha
 */
export type AuditEventView = Readonly<
  | {
      readonly kind: 'decision';
      readonly id: AttemptId;
      readonly actor: string;
      readonly conversationId?: string;
      readonly taskId?: string;
      readonly callId?: string;
      readonly definitionVersion: string;
      readonly configVersion: string;
      readonly provider?: string;
      readonly model?: string;
      readonly operation: string;
      readonly destination?: string;
      readonly attempt: number;
      readonly decision: 'allow' | 'deny';
      readonly reason?: string;
      readonly outcomeStatus?: AttemptOutcomeStatus;
    }
  | {
      readonly kind: 'outcome';
      readonly id: AttemptId;
      readonly attemptId: AttemptId;
      readonly status: AttemptOutcomeStatus;
      readonly httpStatus?: number;
      readonly detail?: string;
    }
  | {
      readonly kind: 'recovery';
      readonly id: AttemptId;
      readonly actor: string;
      readonly recoveryKind: RecoveryEvent['kind'];
      readonly conversationId?: string;
      readonly taskId?: string;
      readonly callId?: string;
      readonly definitionVersion?: string;
      readonly configVersion?: string;
      readonly detail?: string;
    }
> &
  Readonly<{
    readonly pluginId: string;
    readonly sessionId: string;
    readonly recordedAt: string;
    readonly fenceOwner: string;
    readonly fenceToken: string;
  }>;

/**
 * A paginated, session-scoped audit read query.
 *
 * @remarks
 *
 * Reads are always scoped to one namespace: the journal enforces stored
 * session ownership and the separate `ai.audit.read` permission for the
 * querying principal before returning anything.
 *
 * @alpha
 */
export type AuditQuery = Readonly<{
  readonly pluginId: string;
  readonly sessionId: string;
  /** Opaque cursor from a previous page. */
  readonly cursor?: string;
  /** Page size, 1 to 500; defaults to 100. */
  readonly limit?: number;
}>;

/**
 * One page of audit events, oldest first.
 *
 * @alpha
 */
export type AuditPage = Readonly<{
  readonly items: readonly AuditEventView[];
  readonly nextCursor?: string;
}>;

/**
 * Injected authorization for audit reads.
 *
 * @remarks
 *
 * The journal never self-performs authorization: the host checks the
 * `ai.audit.read` permission ({@link AI_AUDIT_READ_PERMISSION_NAME}) for the
 * caller and returns whether it is granted.
 *
 * @alpha
 */
export interface AuditReadAuthorizer {
  authorizeAuditRead(credentials: BackstageCredentials): Promise<boolean>;
}

/**
 * Best-effort write-through mirror to the Backstage auditor service.
 *
 * @remarks
 *
 * Strictly secondary: the durable ledger is written and committed first, and
 * mirror failures are swallowed and never erase committed journal facts. A
 * journal write failure, by contrast, rejects the append and blocks dispatch.
 *
 * @alpha
 */
export interface JournalAuditorMirror {
  mirror(event: AuditEventView): void | Promise<void>;
}

/**
 * The durable, fenced, redacted audit journal — the authority for AI service
 * audit, not the logger-based Backstage auditor.
 *
 * @remarks
 *
 * Every append checks the current unexpired lease owner/token in the same
 * database transaction as the insert, so the journal never accepts writes
 * from a stale owner. `recordDecisionAndIntent` commits before send: its
 * rejection blocks dispatch. Uncertainty is never erased: an intent without
 * an outcome survives crashes and reads back as `unknown`.
 *
 * @alpha
 */
export interface AttemptJournal {
  recordDecisionAndIntent(
    fence: Fence,
    event: AttemptDecision,
  ): Promise<AttemptId>;
  recordOutcome(
    fence: Fence,
    attempt: AttemptId,
    outcome: AttemptOutcome,
  ): Promise<void>;
  recordRecovery(fence: Fence, event: RecoveryEvent): Promise<void>;
  read(
    credentials: BackstageCredentials,
    query: AuditQuery,
  ): Promise<AuditPage>;
}
