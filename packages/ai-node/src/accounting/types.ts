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
import type { AttemptJournal, AttemptOutcomeStatus } from '../journal/types';
import type { PageOfNamespaces } from '../ownership/types';

/**
 * Dimensions an attempt can be grouped by.
 *
 * @remarks
 * Every aggregate always knows all of these; a query selects which of them
 * remain in the result key, so a narrower grouping is a roll-up of the same
 * durable facts rather than a different read.
 *
 * @internal
 */
export type UsageDimension =
  | 'pluginId'
  | 'sessionId'
  | 'provider'
  | 'model'
  | 'operation';

/** The outcome distribution of the attempts in one aggregate row. */
export interface UsageOutcomes {
  readonly completed: number;
  readonly failed: number;
  readonly 'stream-failed': number;
  readonly cancelled: number;
  /** Allowed attempts whose outcome never reached the journal. */
  readonly unknown: number;
}

/**
 * One aggregate row.
 *
 * @remarks
 * Rows carry identifiers and counts only: nothing the journal redacts can
 * appear here, because every field is either an identifier the journal itself
 * validated or a number.
 *
 * @internal
 */
export interface UsageAggregateRow {
  /** The grouping key: the requested dimensions that are known. */
  readonly key: Readonly<Partial<Record<UsageDimension, string>>>;
  /** Decisions recorded in the window, allowed and denied. */
  readonly attempts: number;
  readonly decisions: Readonly<{ allow: number; deny: number }>;
  readonly outcomes: UsageOutcomes;
  /** ISO timestamp of the newest event counted in this row. */
  readonly lastRecordedAt?: string;
}

/** A time-windowed, grouped usage query. */
export interface UsageQuery {
  /** Plugin whose sessions are aggregated. */
  readonly pluginId: string;
  /** Inclusive lower bound on `recordedAt`; absent means no lower bound. */
  readonly from?: string;
  /** Exclusive upper bound on `recordedAt`; absent means no upper bound. */
  readonly until?: string;
  /** Dimensions kept in the row key; default all of them. */
  readonly groupBy?: readonly UsageDimension[];
  /** Scan budget across all sessions; default 5000, at most 50000. */
  readonly maxEvents?: number;
  /** Maximum rows returned; default 500, at most 5000. */
  readonly maxRows?: number;
  /** Journal page size; default 200, at most 500. */
  readonly pageSize?: number;
  /**
   * Sessions to aggregate. When absent, the injected namespace enumerator
   * supplies them; a query needs one of the two.
   */
  readonly sessionIds?: readonly string[];
}

/** The result of one usage query. */
export interface UsageReport {
  readonly rows: readonly UsageAggregateRow[];
  /** Events actually read from the journal. */
  readonly eventsRead: number;
  /** Sessions aggregated, in enumeration order. */
  readonly sessionsRead: number;
  /** True when the scan budget or the row cap stopped the aggregation. */
  readonly truncated: boolean;
}

/**
 * Options for the accounting reader.
 *
 * @internal
 */
export interface UsageAccountingOptions {
  /** The audit journal; accounting never reads the database directly. */
  readonly journal: AttemptJournal;
  /**
   * Namespace enumeration for queries that do not name sessions, typically the
   * host's `NamespaceLease.enumerate`. Accounting does not own discovery.
   */
  readonly listNamespaces?: (
    pluginId: string,
    cursor?: string,
  ) => Promise<PageOfNamespaces>;
}

/** The accounting reader. */
export interface UsageAccounting {
  aggregate(
    credentials: BackstageCredentials,
    query: UsageQuery,
  ): Promise<UsageReport>;
}

/** The verdict of a recorded attempt, as the journal reports it. */
export type RecordedOutcome = AttemptOutcomeStatus;

/** Namespaces in `query`, from the query or from the enumerator. */
export type UsageNamespaces = readonly Namespace[];
