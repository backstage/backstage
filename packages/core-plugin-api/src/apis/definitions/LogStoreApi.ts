/*
 * Copyright 2022 The Backstage Authors
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

import { Observable } from '@backstage/types';

import { ApiRef, createApiRef } from '../system';
import { ApiFacetContext } from '../facet';

export type LogChange =
  | { type: 'add'; entry: StoredLogEntry }
  | { type: 'remove'; entry: StoredLogEntry }
  | { type: 'clear' };

/**
 * A wrapper for the fetch API, that has additional behaviors such as the
 * ability to automatically inject auth information where necessary.
 *
 * @public
 */
export type LogStoreApi = {
  readonly entries: ReadonlyArray<StoredLogEntry>;

  /**
   * Clear logs
   */
  clear(): void;

  /**
   * Post a log entry to the store
   */
  post(entry: LogEntry): void;

  /**
   * Observe new log entries
   */
  entry$(): Observable<LogChange>;
};

/**
 * Log levels
 *
 * @public
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * A LogEntry is the information around a log entry created from debug(),
 * info(), warn() or error().
 *
 * @public
 */
export interface LogEntry {
  /**
   * The log level
   */
  level: LogLevel;

  /**
   * The current time when the log was sent
   */
  timestamp: Date;

  /**
   * The current window.location.pathname when the log was sent
   */
  pathname: string;

  /**
   * The stack of ApiFacetContexts containing information about the callsite
   */
  contextStack: ApiFacetContext[];

  /**
   * The callstack of the log (may only exist for certain log levels)
   */
  callStack?: string;

  /**
   * The message arguments
   */
  args: unknown[];
}

/**
 * A StoredLogEntry is the _stored_ information around a log entry created from
 * debug(), info(), warn() or error().
 *
 * It is almost the same as {@link LogEntry}, but the arguments are possibly
 * garbage collectable.
 *
 * @public
 */
export interface StoredLogEntry extends Omit<LogEntry, 'args'> {
  args: StoredLogEntryArgument[];

  /**
   * Unique key for this log entry (useful for arrays of components in React
   * UI's)
   */
  key: string;
}

/**
 * StoredLogEntryArgument
 */
export interface StoredLogEntryArgument {
  /**
   * Will be set to true when the value is reclaimed (garbage collected). In
   * that case, {@link value} is a string describing the reclaimed object.
   */
  reclaimed?: boolean;

  value: unknown;
}

/**
 * The {@link ApiRef} of {@link LogStoreApi}.
 *
 * @public
 */
export const logStoreApiRef: ApiRef<LogStoreApi> = createApiRef({
  id: 'core.log-store',
});
