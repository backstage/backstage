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

import {
  LogEntry,
  StoredLogEntry,
  StoredLogEntryArgument,
  LogChange,
  LogStoreApi,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';

import { PublishSubject } from '../../../lib/subjects';

export interface LogRetentionPolicy {
  /**
   * Max number of log entries before removal / allowing GC
   */
  maxEntries: number;

  /**
   * Milliseconds of TTL until removal / allowing GC
   */
  ttl: number;
}

const POLICY_DEFAULT_MAX_ENTRIES = 5000;
const POLICY_DEFAULT_TTL = 1000 * 60 * 60 * 24; // 24h
const POLICY_DEFAULT_GC_MAX_ENTRIES = 200;
const POLICY_DEFAULT_GC_TTL = 1000 * 60 * 60; // 1h

export interface LogStoreApiOptions {
  /**
   * The log retention policy before old entries will be removed.
   */
  retentionPolicy: Partial<LogRetentionPolicy>;

  /**
   * The log retention policy before old entries will allowed to be garbage
   * collected.
   */
  garbageCollectionPolicy: Partial<LogRetentionPolicy>;
}

interface StoredLogEntryImpl extends StoredLogEntry {
  /*
   * Whether the value of the arguments might be garbage collected or not.
   *
   * Begins as false, but is set to true after garbage collection retention
   * policy has handled this entry.
   */
  retired: boolean;
}

export class DefaultLogStoreApi implements LogStoreApi {
  private _retired: number = 0;
  private _retentionPolicy: LogRetentionPolicy;
  private _garbageCollectionPolicy: LogRetentionPolicy;
  private _entries: StoredLogEntryImpl[] = [];

  private readonly subject = new PublishSubject<LogChange>();

  get entries(): ReadonlyArray<StoredLogEntry> {
    return this._entries;
  }

  clear() {
    this._entries.length = 0;
    this._retired = 0;
    this.subject.next({ type: 'clear' });
  }

  post(entry: LogEntry) {
    const storedEntry = this.makeStored(entry);

    this._entries.push(storedEntry);
    this.subject.next({ type: 'add', entry: storedEntry });

    this.runCleanupPolicy();
  }

  entry$(): Observable<LogChange> {
    return this.subject;
  }

  static create(options?: Partial<LogStoreApiOptions>): DefaultLogStoreApi {
    return new DefaultLogStoreApi({ ...options });
  }

  private constructor(options: Partial<LogStoreApiOptions>) {
    this._retentionPolicy = {
      maxEntries:
        options.garbageCollectionPolicy?.maxEntries ??
        POLICY_DEFAULT_MAX_ENTRIES,
      ttl: options.garbageCollectionPolicy?.ttl ?? POLICY_DEFAULT_TTL,
    };
    this._garbageCollectionPolicy = {
      maxEntries:
        options.garbageCollectionPolicy?.maxEntries ??
        POLICY_DEFAULT_GC_MAX_ENTRIES,
      ttl: options.garbageCollectionPolicy?.ttl ?? POLICY_DEFAULT_GC_TTL,
    };
  }

  private makeStored(logEntry: LogEntry): StoredLogEntryImpl {
    return {
      ...logEntry,
      retired: false,
      args: logEntry.args.map(value => ({ value })),
      key: `${Math.random()}_${logEntry.timestamp.getTime()}`,
    };
  }

  private runCleanupPolicy() {
    // Remove too old entries
    this.cleanupEntries();
    // Allow garbage collection of too old entries
    this.retireEntries();
  }

  private cleanupEntries() {
    const count = this.useRetentionPolicy(this._retentionPolicy);

    if (!count) return;

    this._retired -= Math.min(this._retired, count);
    const removed = this._entries.splice(0, count);

    removed.forEach(entry => this.subject.next({ type: 'remove', entry }));
  }

  private retireEntries() {
    const count = this.useRetentionPolicy(
      this._garbageCollectionPolicy,
      this._retired,
    );

    for (let i = 0; i < count; ++i) {
      this.retireEntry(this._entries[this._retired++]);
    }
  }

  private retireEntry(entry: StoredLogEntryImpl) {
    entry.retired = true;
    entry.args = entry.args.map(arg => {
      if (!isObject(arg.value)) {
        return arg;
      }

      const weakRef = new WeakRef(arg.value);
      const typeName = getObjectTypeName(arg.value);

      return Object.defineProperties({} as StoredLogEntryArgument, {
        value: {
          enumerable: true,
          configurable: true,
          get() {
            return weakRef.deref() ?? typeName;
          },
        },
        reclaimed: {
          enumerable: true,
          configurable: true,
          get(): boolean {
            return !weakRef.deref();
          },
        },
      });
    });
  }

  /**
   * Count the number of entries to apply the policy to
   */
  private useRetentionPolicy(policy: LogRetentionPolicy, offset = 0) {
    let count = Math.max(
      0,
      this._entries.length - (offset + policy.maxEntries),
    );

    const now = Date.now();

    const shouldBeRetiredByTTL = (entry: StoredLogEntry) =>
      entry.timestamp.getTime() + policy.ttl < now;

    while (
      count < this._entries.length &&
      shouldBeRetiredByTTL(this._entries[count])
    ) {
      ++count;
    }

    return count;
  }
}

function isObject(t: any): t is object | Function {
  return (!!t && typeof t === 'object') || typeof t === 'function';
}

function getObjectTypeName(obj: object | Function): string {
  if (typeof obj === 'function') {
    return `[Function ${obj.name}]`;
  } else if (Array.isArray(obj)) {
    return `[Array(${obj.length})]`;
  } else if (typeof obj.constructor?.name === 'string') {
    return `[Object ${obj.constructor.name}]`;
  }
  return `[Object]`;
}
