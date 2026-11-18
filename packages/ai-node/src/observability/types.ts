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

import { assertRedactedText } from '../journal/redaction';

/**
 * One observation emitted at a module's public boundary.
 *
 * @remarks
 *
 * Events carry identifiers, counts, reasons and durations — never credentials,
 * prompts, payloads or header values. Anything shaped like a credential is
 * rejected before a subscriber sees it, so a metrics implementation cannot
 * accidentally publish one.
 *
 * ## Trust contract
 *
 * Secret-freedom here is parity with the attempt journal, not a stronger
 * claim. The identified fields (`pluginId`, `sessionId`, `provider`,
 * `modelId`, `operation`) are host- or module-supplied identifiers carrying
 * exactly the trust the journal gives `sessionRef`; the union has no
 * payload, prompt, credential or header field for a value to hide in, so the
 * only textual channels are identifiers, closed enumerations and internal
 * reason codes. `reason` is internal vocabulary — module and guard constants
 * with at most an identifier fragment, never caller text.
 *
 * A shape check cannot prove a string is not a secret, and does not claim to.
 * What it does guarantee, on top of the trust contract above, is
 * defense-in-depth: identifier and reason values are length- and
 * character-bounded, and any value matching the journal's credential formats,
 * `key=value` secret assignments or high-entropy base64 runs is dropped.
 *
 * @alpha
 */
export type AiObservabilityEvent =
  | Readonly<{
      kind: 'denial';
      at: number;
      pluginId?: string;
      sessionId?: string;
      provider?: string;
      modelId?: string;
      /** Closed operation vocabulary, e.g. `models.stream` or `auth.token`. */
      operation: string;
      /** Short sanitized reason. */
      reason: string;
      attempt: number;
    }>
  | Readonly<{
      kind: 'dispatch';
      at: number;
      pluginId?: string;
      sessionId?: string;
      provider?: string;
      modelId?: string;
      operation: string;
      /** `sent` when the request went out, else the settled attempt status. */
      outcome:
        | 'sent'
        | 'completed'
        | 'failed'
        | 'cancelled'
        | 'unknown'
        | 'stream-failed';
      httpStatus?: number;
      durationMs: number;
    }>
  | Readonly<{
      kind: 'lease';
      at: number;
      pluginId: string;
      sessionId: string;
      action: 'acquire' | 'contention' | 'renew' | 'release' | 'lost';
      /**
       * Lease generation the action belongs to, so a stale holder's event
       * cannot move the gauge of the holder that superseded it.
       */
      generation?: string;
      durationMs?: number;
    }>
  | Readonly<{
      kind: 'journal';
      at: number;
      action: 'decision' | 'outcome' | 'recovery' | 'prune';
      decision?: 'allow' | 'deny';
      durationMs: number;
      /** Rows removed by a prune. */
      pruned?: number;
    }>;

/**
 * Receives observations. One injected instance per module instance; there is no
 * global emitter.
 *
 * @remarks
 *
 * Implementations must not throw and must not retain secrets: the emitter is
 * called on the dispatch and persistence paths, so a throwing subscriber would
 * break the operation it observes.
 *
 * @alpha
 */
export interface AiEventEmitter {
  /**
   * @remarks
   * A subscriber may return a promise; the emit path consumes a rejection so a
   * failing async subscriber cannot surface as an unhandled rejection.
   */
  emit(event: AiObservabilityEvent): void | Promise<void>;
}

/** The default emitter: no subscriber, no overhead beyond the call. */
export const noopAiEventEmitter: AiEventEmitter = Object.freeze({
  emit() {},
});

/**
 * Emits one validated event, never throwing into the observed operation.
 *
 * @remarks
 * Modules emit through this helper: an emitter that throws or rejects, or an
 * event that fails the structural check, is dropped rather than turning an
 * observation into a dispatch or persistence failure. A subscriber therefore
 * sees strictly less than what was emitted, never a value that failed
 * validation.
 *
 * @internal
 */
export function emitSafe(
  emitter: AiEventEmitter | undefined,
  event: AiObservabilityEvent,
): void {
  if (emitter === undefined) return;
  try {
    const result: unknown = emitter.emit(assertObservableEvent(event));
    if (
      result !== null &&
      (typeof result === 'object' || typeof result === 'function') &&
      typeof (result as PromiseLike<void>).then === 'function'
    ) {
      void Promise.resolve(result).catch(() => undefined);
    }
  } catch {
    // Observation never changes the outcome of the operation it observes.
  }
}

/** Longest tolerated reason, short enough to stay a message not a payload. */
const MAX_REASON_LENGTH = 160;

/**
 * Identifier fields double as metric labels, so they are restricted to a
 * bounded character class and length: free text cannot widen the label space.
 */
const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const REASON = new RegExp(`^[\\x20-\\x7e]{1,${MAX_REASON_LENGTH}}$`);

const DISPATCH_OUTCOMES = [
  'sent',
  'completed',
  'failed',
  'cancelled',
  'unknown',
  'stream-failed',
] as const;
const LEASE_ACTIONS = [
  'acquire',
  'contention',
  'renew',
  'release',
  'lost',
] as const;
const JOURNAL_ACTIONS = ['decision', 'outcome', 'recovery', 'prune'] as const;

/**
 * Exact field set per event kind: a field that belongs to another kind is
 * rejected, so a malformed event cannot smuggle values into the subscriber.
 */
const FIELDS_BY_KIND = {
  denial: {
    required: ['operation', 'reason', 'attempt'],
    allowed: [
      'kind',
      'at',
      'pluginId',
      'sessionId',
      'provider',
      'modelId',
      'operation',
      'reason',
      'attempt',
    ],
  },
  dispatch: {
    required: ['operation', 'outcome', 'durationMs'],
    allowed: [
      'kind',
      'at',
      'pluginId',
      'sessionId',
      'provider',
      'modelId',
      'operation',
      'outcome',
      'httpStatus',
      'durationMs',
    ],
  },
  lease: {
    required: ['pluginId', 'sessionId', 'action'],
    allowed: [
      'kind',
      'at',
      'pluginId',
      'sessionId',
      'action',
      'generation',
      'durationMs',
    ],
  },
  journal: {
    required: ['action', 'durationMs'],
    allowed: ['kind', 'at', 'action', 'decision', 'durationMs', 'pruned'],
  },
} as const satisfies Record<
  'denial' | 'dispatch' | 'lease' | 'journal',
  { required: readonly string[]; allowed: readonly string[] }
>;

/** String fields validated against a closed set, not a text pattern. */
const ENUM_FIELDS = ['kind', 'action', 'outcome', 'decision'] as const;

/** Every field that must be exactly a string. */
const TEXT_FIELDS = [
  'kind',
  'action',
  'outcome',
  'decision',
  'reason',
  'pluginId',
  'sessionId',
  'provider',
  'modelId',
  'operation',
  'generation',
] as const;

/** Every field that must be exactly a number. */
const NUMERIC_FIELDS = [
  'at',
  'attempt',
  'httpStatus',
  'durationMs',
  'pruned',
] as const;

/**
 * Rejects any event that could carry a secret or an unbounded value.
 *
 * @remarks
 *
 * Mirrors the journal's structural discipline: unknown shapes, secret-shaped
 * text and oversized values fail closed, so an emitter implementation cannot
 * be used to leak credentials into metrics.
 *
 * @internal
 */
export function assertObservableEvent(value: unknown): AiObservabilityEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid observability event');
  }
  const event = value as Record<string, unknown>;
  const kind = event.kind;
  const at = event.at;
  if (
    (kind !== 'denial' &&
      kind !== 'dispatch' &&
      kind !== 'lease' &&
      kind !== 'journal') ||
    typeof at !== 'number' ||
    !Number.isFinite(at)
  ) {
    throw new Error('Invalid observability event');
  }
  const spec: { required: readonly string[]; allowed: readonly string[] } =
    FIELDS_BY_KIND[kind];
  const fields = Object.keys(event);
  for (const required of spec.required) {
    if (event[required] === undefined) {
      throw new Error(`Invalid observability event: missing ${required}`);
    }
  }
  for (const field of fields) {
    if (!spec.allowed.includes(field)) {
      throw new Error(
        `Invalid observability event: field '${field}' does not belong to a '${kind}' event`,
      );
    }
    const fieldValue = event[field];
    if (fieldValue === undefined) continue;
    if ((TEXT_FIELDS as readonly string[]).includes(field)) {
      // Exactly a string: a numeric or boolean value here would smuggle
      // untyped content into a field the subscriber treats as an identifier.
      if (typeof fieldValue !== 'string') {
        throw new Error(
          `Invalid observability event: field '${field}' must be a string`,
        );
      }
      if ((ENUM_FIELDS as readonly string[]).includes(field)) {
        // Validated against its closed set below.
        continue;
      }
      const pattern = field === 'reason' ? REASON : IDENTIFIER;
      if (!pattern.test(fieldValue) || fieldValue !== fieldValue.trim()) {
        throw new Error('Invalid observability event: unsafe text field');
      }
      assertNoCredentialShape(fieldValue, field);
    } else if (!(NUMERIC_FIELDS as readonly string[]).includes(field)) {
      throw new Error('Invalid observability event: unsafe field value');
    }
  }
  // Closed sets: an unknown label value would otherwise mint a new series.
  const oneOf = (field: string, values: readonly string[]) => {
    const fieldValue = event[field];
    if (fieldValue !== undefined && !values.includes(fieldValue as string)) {
      throw new Error('Invalid observability event: unknown enumeration value');
    }
  };
  if (kind === 'dispatch') {
    if (event.outcome === undefined) {
      throw new Error('Invalid observability event: missing outcome');
    }
    oneOf('outcome', DISPATCH_OUTCOMES);
  } else if (kind === 'lease') {
    if (event.action === undefined) {
      throw new Error('Invalid observability event: missing lease action');
    }
    oneOf('action', LEASE_ACTIONS);
  } else if (kind === 'journal') {
    if (event.action === undefined) {
      throw new Error('Invalid observability event: missing journal action');
    }
    oneOf('action', JOURNAL_ACTIONS);
  } else if (typeof event.reason !== 'string') {
    throw new Error('Invalid observability event: missing denial reason');
  }
  oneOf('decision', ['allow', 'deny']);

  for (const numeric of ['attempt', 'httpStatus', 'durationMs', 'pruned']) {
    const fieldValue = event[numeric];
    if (
      fieldValue !== undefined &&
      (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue))
    ) {
      throw new Error('Invalid observability event: unsafe numeric field');
    }
  }
  if (
    event.attempt !== undefined &&
    !(Number.isInteger(event.attempt) && (event.attempt as number) >= 1)
  ) {
    throw new Error(
      'Invalid observability event: attempt must be a positive integer',
    );
  }
  if (
    event.httpStatus !== undefined &&
    !(
      Number.isInteger(event.httpStatus) &&
      (event.httpStatus as number) >= 100 &&
      (event.httpStatus as number) <= 599
    )
  ) {
    throw new Error('Invalid observability event: httpStatus out of range');
  }
  for (const nonNegative of ['durationMs', 'pruned', 'at']) {
    const fieldValue = event[nonNegative];
    if (fieldValue !== undefined && (fieldValue as number) < 0) {
      throw new Error('Invalid observability event: negative value');
    }
  }
  if (event.pruned !== undefined && !Number.isInteger(event.pruned)) {
    throw new Error('Invalid observability event: pruned must be an integer');
  }
  return value as AiObservabilityEvent;
}

/**
 * Credential-shape rejection reuses the journal's vocabulary so an identifier
 * that looks like a secret is dropped here exactly as it would be there.
 */
function assertNoCredentialShape(value: string, field: string): void {
  try {
    assertRedactedText(value, field, { required: true });
  } catch {
    throw new Error('Invalid observability event: unsafe text field');
  }
}
