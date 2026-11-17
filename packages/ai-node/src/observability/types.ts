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

/**
 * One observation emitted at a module's public boundary.
 *
 * @remarks
 *
 * Events carry identifiers, counts, reasons and durations — never credentials,
 * prompts, payloads or header values. Anything shaped like a secret is
 * rejected before a subscriber sees it, so a metrics implementation cannot
 * accidentally publish one.
 *
 * @internal
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
      outcome: 'sent' | 'completed' | 'failed' | 'cancelled' | 'unknown';
      httpStatus?: number;
      durationMs: number;
    }>
  | Readonly<{
      kind: 'lease';
      at: number;
      pluginId: string;
      sessionId: string;
      action: 'acquire' | 'contention' | 'renew' | 'release' | 'lost';
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
 * @internal
 */
export interface AiEventEmitter {
  emit(event: AiObservabilityEvent): void;
}

/** The default emitter: no subscriber, no overhead beyond the call. */
export const noopAiEventEmitter: AiEventEmitter = Object.freeze({
  emit() {},
});

/**
 * Emits one validated event, never throwing into the observed operation.
 *
 * @remarks
 * Modules emit through this helper: an emitter that throws, or an event that
 * fails the structural check, is dropped rather than turning an observation
 * into a dispatch or persistence failure.
 *
 * @internal
 */
export function emitSafe(
  emitter: AiEventEmitter | undefined,
  event: AiObservabilityEvent,
): void {
  if (emitter === undefined) return;
  try {
    emitter.emit(assertObservableEvent(event));
  } catch {
    // Observation never changes the outcome of the operation it observes.
  }
}

/** Longest tolerated text field, matching the journal's reason budget. */
const MAX_TEXT_LENGTH = 512;

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
  const fields = Object.keys(event);
  const allowed = new Set([
    'kind',
    'at',
    'pluginId',
    'sessionId',
    'provider',
    'modelId',
    'operation',
    'reason',
    'attempt',
    'outcome',
    'httpStatus',
    'durationMs',
    'action',
    'decision',
    'pruned',
  ]);
  for (const field of fields) {
    if (!allowed.has(field)) {
      throw new Error('Invalid observability event: unknown field');
    }
    const fieldValue = event[field];
    if (typeof fieldValue === 'string') {
      if (
        fieldValue.length === 0 ||
        fieldValue.length > MAX_TEXT_LENGTH ||
        fieldValue !== fieldValue.trim() ||
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u001f\u007f]/.test(fieldValue) ||
        isSecretShaped(fieldValue)
      ) {
        throw new Error('Invalid observability event: unsafe text field');
      }
    } else if (
      fieldValue !== undefined &&
      typeof fieldValue !== 'number' &&
      typeof fieldValue !== 'boolean'
    ) {
      throw new Error('Invalid observability event: unsafe field value');
    }
  }
  for (const numeric of ['attempt', 'httpStatus', 'durationMs', 'pruned']) {
    const fieldValue = event[numeric];
    if (
      fieldValue !== undefined &&
      (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue))
    ) {
      throw new Error('Invalid observability event: unsafe numeric field');
    }
  }
  return value as AiObservabilityEvent;
}

const SECRET_SHAPES = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{30,}/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/,
  /(?<![A-Za-z])(?:sk-(?:ant-|proj-)?|rk-|pk-)[A-Za-z0-9_-]{20,}/,
  /\bbearer\s+[A-Za-z0-9._~+/=-]{6,}/i,
  /\b(?:api[_-]?key|token|secret|password|credential|authorization)\s*[=:]\s*\S{8,}/i,
  /[A-Za-z0-9+/=_-]{48,}/,
];

function isSecretShaped(value: string): boolean {
  return SECRET_SHAPES.some(shape => shape.test(value));
}
