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

import stringify from 'safe-stable-stringify';
import { LoggerFormat } from './types';

// These symbols are the shared Winston 3 / logform record protocol.
export const LEVEL = Symbol.for('level');
export const MESSAGE = Symbol.for('message');

/** Stable JSON output, including circular references and BigInt metadata. */
export function stringifyLogValue(value: unknown): string | undefined {
  try {
    // Preserve logform's string encoding of BigInt to avoid losing precision.
    return stringify(value, (_key, item) =>
      typeof item === 'bigint' ? String(item) : item,
    );
  } catch {
    return '"[field value not castable to string]"';
  }
}

export function jsonFormat(): LoggerFormat {
  return {
    transform(info) {
      info.timestamp ??= new Date().toISOString();
      info[MESSAGE] = stringifyLogValue(info);
      return info;
    },
  };
}
