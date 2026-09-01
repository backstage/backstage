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

import { JsonObject, JsonValue } from '@backstage/types';

type Match = { start: number; end: number };

export const TASK_REDACTION_OVERFLOW = '\0scaffolder-redaction-overflow\0';

const DEFAULT_MAX_VALUES = 128;
const DEFAULT_MAX_TOTAL_LENGTH = 16 * 1024;
const DEFAULT_MAX_MATCHES = 10_000;

type MatcherNode = {
  transitions: Map<number, number>;
  failure: number;
  outputLength: number;
};

class MultiPatternMatcher {
  readonly #nodes: MatcherNode[] = [
    { transitions: new Map(), failure: 0, outputLength: 0 },
  ];

  constructor(patterns: Iterable<ArrayLike<number>>) {
    for (const pattern of patterns) {
      let state = 0;
      for (let index = 0; index < pattern.length; index += 1) {
        const symbol = pattern[index];
        let next = this.#nodes[state].transitions.get(symbol);
        if (next === undefined) {
          next = this.#nodes.length;
          this.#nodes[state].transitions.set(symbol, next);
          this.#nodes.push({
            transitions: new Map(),
            failure: 0,
            outputLength: 0,
          });
        }
        state = next;
      }
      this.#nodes[state].outputLength = Math.max(
        this.#nodes[state].outputLength,
        pattern.length,
      );
    }

    const queue = Array.from(this.#nodes[0].transitions.values());
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const state = queue[cursor];
      for (const [symbol, next] of this.#nodes[state].transitions) {
        queue.push(next);
        let fallback = this.#nodes[state].failure;
        while (
          fallback !== 0 &&
          !this.#nodes[fallback].transitions.has(symbol)
        ) {
          fallback = this.#nodes[fallback].failure;
        }
        this.#nodes[next].failure =
          this.#nodes[fallback].transitions.get(symbol) ?? 0;
        this.#nodes[next].outputLength = Math.max(
          this.#nodes[next].outputLength,
          this.#nodes[this.#nodes[next].failure].outputLength,
        );
      }
    }
  }

  findMatches(
    length: number,
    symbolAt: (index: number) => number,
    maxMatches: number,
  ): Match[] | undefined {
    const matches: Match[] = [];
    let state = 0;
    for (let index = 0; index < length; index += 1) {
      const symbol = symbolAt(index);
      while (state !== 0 && !this.#nodes[state].transitions.has(symbol)) {
        state = this.#nodes[state].failure;
      }
      state = this.#nodes[state].transitions.get(symbol) ?? 0;

      const outputLength = this.#nodes[state].outputLength;
      if (outputLength === 0) {
        continue;
      }

      let start = index + 1 - outputLength;
      while (matches.length > 0 && start <= matches.at(-1)!.end) {
        start = Math.min(start, matches.pop()!.start);
      }
      matches.push({ start, end: index + 1 });
      if (matches.length > maxMatches) {
        return undefined;
      }
    }
    return matches;
  }
}

function thrownValueType(value: unknown): string {
  return value === null ? 'null' : typeof value;
}

/**
 * Redacts the exact sensitive values known to one Scaffolder task attempt.
 *
 * Values are add-only so that data removed or rotated during an attempt stays
 * protected in diagnostics produced later in the same attempt.
 */
export class TaskRedacter {
  readonly #values = new Set<string>();
  readonly #maxValues: number;
  readonly #maxTotalLength: number;
  readonly #maxMatches: number;
  #totalLength = 0;
  #redactAll = false;
  #stringMatcher?: MultiPatternMatcher;
  #bufferMatcher?: MultiPatternMatcher;

  constructor(options?: {
    maxValues?: number;
    maxTotalLength?: number;
    maxMatches?: number;
  }) {
    this.#maxValues = options?.maxValues ?? DEFAULT_MAX_VALUES;
    this.#maxTotalLength = options?.maxTotalLength ?? DEFAULT_MAX_TOTAL_LENGTH;
    this.#maxMatches = options?.maxMatches ?? DEFAULT_MAX_MATCHES;
  }

  get redactsAll(): boolean {
    return this.#redactAll;
  }

  #activateRedactAll(): void {
    this.#values.clear();
    this.#totalLength = 0;
    this.#redactAll = true;
    this.#stringMatcher = undefined;
    this.#bufferMatcher = undefined;
  }

  add(values: Iterable<string>): void {
    if (this.#redactAll) {
      return;
    }

    for (const valueToTrim of values) {
      if (valueToTrim === TASK_REDACTION_OVERFLOW) {
        this.#activateRedactAll();
        return;
      }
      if (typeof valueToTrim !== 'string') {
        continue;
      }

      const value = valueToTrim.trim();
      // Single-character placeholders such as "x" are common and would make
      // ordinary diagnostics unreadable if they were treated as secrets.
      if (value.length <= 1 || this.#values.has(value)) {
        continue;
      }

      const valueLength = Buffer.byteLength(value, 'utf8');
      if (
        this.#values.size + 1 > this.#maxValues ||
        this.#totalLength + valueLength > this.#maxTotalLength
      ) {
        this.#activateRedactAll();
        return;
      }

      this.#values.add(value);
      this.#totalLength += valueLength;
      this.#stringMatcher = undefined;
      this.#bufferMatcher = undefined;
    }
  }

  addJson(value: JsonValue): void {
    function* visit(item: JsonValue): Generator<string> {
      if (typeof item === 'string') {
        yield item;
      } else if (Array.isArray(item)) {
        for (const child of item) {
          yield* visit(child);
        }
      } else if (item && typeof item === 'object') {
        for (const [key, child] of Object.entries(item)) {
          yield key;
          if (child !== undefined) {
            yield* visit(child);
          }
        }
      }
    }

    this.add(visit(value));
  }

  redactString(value: string): string {
    if (this.#redactAll) {
      return value.length > 1 ? '***' : value;
    }
    if (this.#values.size === 0) {
      return value;
    }

    this.#stringMatcher ??= new MultiPatternMatcher(
      Array.from(this.#values, sensitiveValue => {
        const pattern = new Uint16Array(sensitiveValue.length);
        for (let index = 0; index < sensitiveValue.length; index += 1) {
          pattern[index] = sensitiveValue.charCodeAt(index);
        }
        return pattern;
      }),
    );
    const matches = this.#stringMatcher.findMatches(
      value.length,
      index => value.charCodeAt(index),
      this.#maxMatches,
    );

    if (!matches) {
      return '***';
    }
    if (matches.length === 0) {
      return value;
    }

    let result = '';
    let cursor = 0;
    for (const match of matches) {
      result += `${value.slice(cursor, match.start)}***`;
      cursor = match.end;
    }
    return result + value.slice(cursor);
  }

  redactJson(value: JsonValue): JsonValue {
    if (typeof value === 'string') {
      return this.redactString(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.redactJson(item));
    }
    if (value && typeof value === 'object') {
      const result: JsonObject = {};
      for (const [key, child] of Object.entries(value)) {
        if (child !== undefined) {
          Object.defineProperty(result, this.redactString(key), {
            configurable: true,
            enumerable: true,
            value: this.redactJson(child),
            writable: true,
          });
        }
      }
      return result;
    }
    return value;
  }

  redactBuffer(value: Buffer): Buffer {
    if (this.#redactAll) {
      return value.length > 1 ? Buffer.from('***') : Buffer.from(value);
    }
    if (this.#values.size === 0) {
      return Buffer.from(value);
    }

    this.#bufferMatcher ??= new MultiPatternMatcher(
      Array.from(this.#values, sensitiveValue =>
        Buffer.from(sensitiveValue, 'utf8'),
      ),
    );
    const matches = this.#bufferMatcher.findMatches(
      value.length,
      index => value[index],
      this.#maxMatches,
    );
    if (!matches) {
      return Buffer.from('***');
    }
    if (matches.length === 0) {
      return Buffer.from(value);
    }

    const chunks: Buffer[] = [];
    let cursor = 0;
    for (const match of matches) {
      chunks.push(value.subarray(cursor, match.start), Buffer.from('***'));
      cursor = match.end;
    }
    chunks.push(value.subarray(cursor));
    return Buffer.concat(chunks);
  }

  redactError(error: unknown): Error {
    if (typeof error === 'string') {
      return new Error(this.redactString(error));
    }

    if (
      (typeof error !== 'object' || error === null) &&
      typeof error !== 'function'
    ) {
      return new Error(
        `Task failed with thrown value of type ${thrownValueType(error)}`,
      );
    }

    let name: unknown;
    let message: unknown;
    let stack: unknown;
    try {
      const errorLike = error as {
        name?: unknown;
        message?: unknown;
        stack?: unknown;
      };
      name = errorLike.name;
      message = errorLike.message;
      stack = errorLike.stack;
    } catch {
      return new Error('Task failed');
    }

    const result = new Error(
      typeof message === 'string' ? this.redactString(message) : 'Task failed',
    );
    if (typeof name === 'string' && name) {
      result.name = this.redactString(name);
    }
    if (typeof stack === 'string') {
      result.stack = this.redactString(stack);
    }
    return result;
  }
}
