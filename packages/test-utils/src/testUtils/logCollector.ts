/*
 * Copyright 2020 The Backstage Authors
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

/* eslint-disable no-console */

/**
 * Severity levels of {@link CollectedLogs}
 * @public */
export type LogFuncs = 'log' | 'warn' | 'error';
/**
 * AsyncLogCollector type used in {@link (withLogCollector:1)} callback function.
 * @public */
export type AsyncLogCollector = () => Promise<void>;
/**
 * SyncLogCollector type used in {@link (withLogCollector:2)} callback function.
 * @public */
export type SyncLogCollector = () => void;
/**
 * Union type used in {@link (withLogCollector:3)} callback function.
 * @public */
export type LogCollector = AsyncLogCollector | SyncLogCollector;
/**
 * Map of severity level and corresponding log lines.
 * @public */
export type CollectedLogs<T extends LogFuncs> = { [key in T]: string[] };

const allCategories = ['log', 'warn', 'error'];

/**
 * Asynchronous log collector with that collects all categories
 * @public */
export function withLogCollector(
  callback: AsyncLogCollector,
): Promise<CollectedLogs<LogFuncs>>;

/**
 * Synchronous log collector with that collects all categories
 * @public */
export function withLogCollector(
  callback: SyncLogCollector,
): CollectedLogs<LogFuncs>;

/**
 * Asynchronous log collector with that only collects selected categories
 * @public
 */
export function withLogCollector<T extends LogFuncs>(
  logsToCollect: T[],
  callback: AsyncLogCollector,
): Promise<CollectedLogs<T>>;

/**
 * Synchronous log collector with that only collects selected categories
 * @public */
export function withLogCollector<T extends LogFuncs>(
  logsToCollect: T[],
  callback: SyncLogCollector,
): CollectedLogs<T>;

/**
 * Log collector that collect logs either from a sync or async collector.
 * @public
 * @deprecated import from test-utils instead
 * */
export function withLogCollector(
  logsToCollect: LogFuncs[] | LogCollector,
  callback?: LogCollector,
): CollectedLogs<LogFuncs> | Promise<CollectedLogs<LogFuncs>> {
  const oneArg = !callback;
  const actualCallback = (oneArg ? logsToCollect : callback) as LogCollector;
  const categories = (oneArg ? allCategories : logsToCollect) as LogFuncs[];

  const logs = {
    log: new Array<string>(),
    warn: new Array<string>(),
    error: new Array<string>(),
  };

  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  if (categories.includes('log')) {
    console.log = (message: string) => {
      logs.log.push(message);
    };
  }
  if (categories.includes('warn')) {
    console.warn = (message: string) => {
      logs.warn.push(message);
    };
  }
  if (categories.includes('error')) {
    console.error = (message: string) => {
      logs.error.push(message);
    };
  }

  const restore = () => {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  };

  try {
    const ret = actualCallback();

    if (!ret || !ret.then) {
      restore();
      return logs;
    }

    return ret.then(
      () => {
        restore();
        return logs;
      },
      error => {
        restore();
        throw error;
      },
    );
  } catch (error) {
    restore();
    throw error;
  }
}
