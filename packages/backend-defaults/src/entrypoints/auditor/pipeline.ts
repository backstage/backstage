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

import type { AuditSink, AuditorEvent } from '@backstage/backend-plugin-api';
import type { JsonObject, JsonValue } from '@backstage/types';

const REDACTED = '[REDACTED]';

/**
 * A single transformation applied to an audit event before it is written to
 * the sink.
 *
 * @internal
 */
export type AuditStage = (event: AuditorEvent) => AuditorEvent;

/**
 * Reports an emission failure without ever letting it propagate, including
 * failures thrown by the error reporting itself.
 *
 * @internal
 */
export function reportAuditError(
  error: unknown,
  onError?: (error: Error) => void,
): void {
  const reportedError =
    error instanceof Error ? error : new Error(String(error));
  try {
    onError?.(reportedError);
  } catch {
    // There is no further reporting channel; a throwing error callback must
    // never make an audit call reject.
  }
}

/**
 * Serializes a live error into the shape carried by failed audit events, so
 * that a live `Error` never reaches a sink.
 *
 * @internal
 */
export function serializeAuditError(error: Error): {
  name: string;
  message: string;
  stack?: string;
} {
  return { name: error.name, message: error.message, stack: error.stack };
}

/**
 * Creates a stage that strips query strings from the request URL of audit
 * events, to avoid credentials passed in the URL ending up in the audit
 * trail.
 *
 * @internal
 */
export function createSanitizeRequestStage(enabled: boolean): AuditStage {
  return event => {
    if (!enabled || !event.request) {
      return event;
    }
    const queryIndex = event.request.url.indexOf('?');
    if (queryIndex === -1) {
      return event;
    }
    return {
      ...event,
      request: {
        ...event.request,
        url: event.request.url.slice(0, queryIndex),
      },
    };
  };
}

/**
 * Creates a stage that replaces the values of denylisted metadata keys with
 * `[REDACTED]`, recursively and case-insensitively.
 *
 * @internal
 */
export function createRedactMetaStage(keys: Set<string>): AuditStage {
  return event => ({
    ...event,
    meta: event.meta
      ? (redactValue(event.meta, keys) as JsonObject)
      : undefined,
  });
}

function redactValue(value: JsonValue, keys: Set<string>): JsonValue {
  if (Array.isArray(value)) {
    return value.map(item => redactValue(item, keys));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        keys.has(key.toLowerCase())
          ? REDACTED
          : redactValue(item as JsonValue, keys),
      ]),
    );
  }
  return value;
}

/**
 * Creates a stage that truncates long string values in event metadata to the
 * given maximum length, recursively. A maximum length of `-1` disables
 * truncation.
 *
 * @internal
 */
export function createTruncateMetaStage(maxLength: number): AuditStage {
  return event => ({
    ...event,
    meta: event.meta
      ? (truncateValue(event.meta, maxLength) as JsonObject)
      : undefined,
  });
}

function truncateValue(value: JsonValue, maxLength: number): JsonValue {
  if (typeof value === 'string') {
    // The redaction marker is a control value, not user data; truncating it
    // would break the marker even though redaction ran first.
    if (maxLength >= 0 && value.length > maxLength && value !== REDACTED) {
      return value.slice(0, maxLength);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => truncateValue(item, maxLength));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        truncateValue(item as JsonValue, maxLength),
      ]),
    );
  }
  return value;
}

/**
 * Combines a fan-out sink: every sink receives the event in parallel, and each
 * sink's failure is isolated — reported through `onError`, never rejecting
 * and never blocking the other sinks.
 *
 * @internal
 */
export function createFanOutAuditSink(
  sinks: AuditSink[],
  onError?: (error: Error) => void,
): AuditSink {
  return {
    async write(event) {
      await Promise.all(
        sinks.map(async sink => {
          try {
            await sink.write(event);
          } catch (error) {
            reportAuditError(error, onError);
          }
        }),
      );
    },
  };
}

/**
 * Creates the internal audit pipeline: applies the given stages in order and
 * writes the processed event to the given sink.
 *
 * @internal
 */
export function createAuditPipeline(options: {
  stages: AuditStage[];
  sink: AuditSink;
}): { emit(event: AuditorEvent): Promise<void> } {
  return {
    async emit(event: AuditorEvent) {
      let processed = event;
      for (const stage of options.stages) {
        processed = stage(processed);
      }
      await options.sink.write(processed);
    },
  };
}
