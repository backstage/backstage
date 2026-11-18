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
import type { Namespace } from '../contracts';
import type { AuditEventView, AuditPage } from '../journal/types';
import type {
  UsageAccounting,
  UsageAccountingOptions,
  UsageAggregateRow,
  UsageDimension,
  UsageOutcomes,
  UsageQuery,
  UsageReport,
} from './types';

const DIMENSIONS: readonly UsageDimension[] = [
  'pluginId',
  'sessionId',
  'provider',
  'model',
  'operation',
];

const DEFAULT_MAX_EVENTS = 5_000;
const MAX_EVENTS_CEILING = 50_000;
const DEFAULT_MAX_ROWS = 500;
const MAX_ROWS_CEILING = 5_000;
const DEFAULT_PAGE_SIZE = 200;
const PAGE_SIZE_CEILING = 500;
/** Guard against an enumerator that never reaches its end. */
const MAX_ENUMERATION_PAGES = 1_000;

function integerInRange(
  value: number | undefined,
  fallback: number,
  ceiling: number,
  field: string,
): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < 1 || value > ceiling) {
    throw new Error(
      `Invalid usage query: "${field}" must be an integer between 1 and ${ceiling}`,
    );
  }
  return value;
}

function timestamp(
  value: string | undefined,
  field: string,
): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Date.parse(value);
  if (typeof value !== 'string' || Number.isNaN(parsed)) {
    throw new Error(
      `Invalid usage query: "${field}" must be an ISO-8601 timestamp`,
    );
  }
  return parsed;
}

function groupBy(
  requested: readonly UsageDimension[] | undefined,
): readonly UsageDimension[] {
  if (requested === undefined) return DIMENSIONS;
  if (requested.length === 0) {
    throw new Error('Invalid usage query: "groupBy" must not be empty');
  }
  for (const dimension of requested) {
    if (!DIMENSIONS.includes(dimension)) {
      throw new Error(
        `Invalid usage query: "${dimension}" is not a usage dimension`,
      );
    }
  }
  // Keep a stable dimension order so two queries with the same set of
  // dimensions produce identical keys regardless of argument order.
  return DIMENSIONS.filter(dimension => requested.includes(dimension));
}

function emptyOutcomes(): MutableRow['outcomes'] {
  return {
    completed: 0,
    failed: 0,
    'stream-failed': 0,
    cancelled: 0,
    unknown: 0,
  };
}

function keyOf(
  event: AuditEventView & { kind: 'decision' },
  dimensions: readonly UsageDimension[],
): Readonly<Partial<Record<UsageDimension, string>>> {
  const key: Partial<Record<UsageDimension, string>> = {};
  for (const dimension of dimensions) {
    switch (dimension) {
      case 'pluginId':
        key.pluginId = event.pluginId;
        break;
      case 'sessionId':
        key.sessionId = event.sessionId;
        break;
      case 'provider':
        if (event.provider !== undefined) key.provider = event.provider;
        break;
      case 'model':
        if (event.model !== undefined) key.model = event.model;
        break;
      case 'operation':
        key.operation = event.operation;
        break;
      default:
        break;
    }
  }
  return key;
}

function serializeKey(
  key: Readonly<Partial<Record<UsageDimension, string>>>,
): string {
  return DIMENSIONS.map(dimension => key[dimension] ?? '\u0000').join('\u0001');
}

/**
 * Creates the usage/cost accounting reader.
 *
 * @remarks
 * Accounting is a reader of the durable audit journal, never a journal
 * feature: it consumes `AttemptJournal.read` page by page, so the journal's
 * stored-session ownership check and the `ai.audit.read` permission apply
 * unchanged and a caller cannot aggregate a session it may not read. Every
 * aggregate is derived from committed journal rows alone, so a report is
 * reproducible after a restart or a crash, and the journal is never written to.
 *
 * The journal records decisions and their resolved outcomes but no durations,
 * so a report carries attempt counts, decision counts and the outcome
 * distribution and nothing time-based beyond each row's newest `recordedAt`.
 * Durations stay a live-observability signal (the event seam) until a journal
 * read extension exposes them.
 *
 * @internal
 */
export function createUsageAccounting(
  options: UsageAccountingOptions,
): UsageAccounting {
  const { journal, listNamespaces } = options;

  const namespacesFor = async (
    pluginId: string,
    query: UsageQuery,
  ): Promise<readonly Namespace[]> => {
    if (query.sessionIds !== undefined) {
      return query.sessionIds.map(sessionId => ({ pluginId, sessionId }));
    }
    if (listNamespaces === undefined) {
      throw new Error(
        'Invalid usage query: pass sessionIds or configure a namespace enumerator',
      );
    }
    const namespaces: Namespace[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < MAX_ENUMERATION_PAGES; page++) {
      const result = await listNamespaces(pluginId, cursor);
      namespaces.push(...result.namespaces);
      if (result.next === undefined) break;
      cursor = result.next;
    }
    return namespaces;
  };

  return {
    async aggregate(
      credentials: BackstageCredentials,
      query: UsageQuery,
    ): Promise<UsageReport> {
      const dimensions = groupBy(query.groupBy);
      const from = timestamp(query.from, 'from');
      const until = timestamp(query.until, 'until');
      const maxEvents = integerInRange(
        query.maxEvents,
        DEFAULT_MAX_EVENTS,
        MAX_EVENTS_CEILING,
        'maxEvents',
      );
      const maxRows = integerInRange(
        query.maxRows,
        DEFAULT_MAX_ROWS,
        MAX_ROWS_CEILING,
        'maxRows',
      );
      const pageSize = integerInRange(
        query.pageSize,
        DEFAULT_PAGE_SIZE,
        PAGE_SIZE_CEILING,
        'pageSize',
      );

      const namespaces = await namespacesFor(query.pluginId, query);
      const aggregates = new Map<
        string,
        { key: UsageAggregateRow['key']; row: MutableRow }
      >();
      let eventsRead = 0;
      let truncated = false;

      for (const namespace of namespaces) {
        let cursor: string | undefined;
        let sawWindowEnd = false;
        while (!truncated && !sawWindowEnd) {
          const remaining = maxEvents - eventsRead;
          if (remaining <= 0) {
            truncated = true;
            break;
          }
          // Reads are session-scoped, so a foreign session is refused by the
          // journal before any row is returned.
          const page: AuditPage = await journal.read(credentials, {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
            ...(cursor === undefined ? {} : { cursor }),
            limit: Math.min(pageSize, remaining),
          });
          for (const event of page.items) {
            const recordedAt = Date.parse(event.recordedAt);
            if (!Number.isNaN(recordedAt)) {
              if (until !== undefined && recordedAt >= until) {
                // Events are ordered oldest first, so the window is over.
                sawWindowEnd = true;
                break;
              }
              if (from !== undefined && recordedAt < from) continue;
            }
            eventsRead += 1;
            if (event.kind !== 'decision') continue;
            const key = keyOf(event, dimensions);
            const serialized = serializeKey(key);
            let entry = aggregates.get(serialized);
            if (entry === undefined) {
              if (aggregates.size >= maxRows) {
                truncated = true;
                break;
              }
              entry = {
                key,
                row: {
                  attempts: 0,
                  decisions: { allow: 0, deny: 0 },
                  outcomes: emptyOutcomes(),
                  lastRecordedAt: event.recordedAt,
                },
              };
              aggregates.set(serialized, entry);
            }
            const row = entry.row;
            row.attempts += 1;
            row.decisions[event.decision] += 1;
            if (event.decision === 'allow') {
              const status = event.outcomeStatus ?? 'unknown';
              row.outcomes[status] += 1;
            }
            if (
              row.lastRecordedAt === undefined ||
              event.recordedAt > row.lastRecordedAt
            ) {
              row.lastRecordedAt = event.recordedAt;
            }
          }
          if (truncated || sawWindowEnd) break;
          cursor = page.nextCursor;
          if (cursor === undefined) break;
        }
      }

      const rows: UsageAggregateRow[] = [...aggregates.values()]
        .map(entry => ({
          key: entry.key,
          attempts: entry.row.attempts,
          decisions: { ...entry.row.decisions },
          outcomes: { ...entry.row.outcomes },
          ...(entry.row.lastRecordedAt === undefined
            ? {}
            : { lastRecordedAt: entry.row.lastRecordedAt }),
        }))
        .sort((a, b) => serializeKey(a.key).localeCompare(serializeKey(b.key)));

      return {
        rows,
        eventsRead,
        sessionsRead: namespaces.length,
        truncated,
      };
    },
  };
}

interface MutableRow {
  attempts: number;
  decisions: { allow: number; deny: number };
  outcomes: { -readonly [K in keyof UsageOutcomes]: number };
  lastRecordedAt?: string;
}
