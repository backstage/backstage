/*
 * Copyright 2024 The Backstage Authors
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

import { Format, TransformableInfo } from 'logform';
import { MESSAGE } from 'triple-beam';
import { format } from 'winston';
import { escapeRegExp } from './escapeRegExp';

/**
 * Creates a winston log format for redacting secrets.
 */
export function redacterFormat(): {
  format: Format;
  add: (redactions: Iterable<string>) => void;
} {
  const redactionSet = new Set<string>();

  let redactionPattern: RegExp | undefined = undefined;

  return {
    format: format((obj: TransformableInfo) => {
      if (!redactionPattern || !obj) {
        return obj;
      }

      obj[MESSAGE] = obj[MESSAGE]?.replace?.(redactionPattern, '***');

      return obj;
    })(),
    add(newRedactions) {
      let added = 0;
      for (const redactionToTrim of newRedactions) {
        // Trimming the string ensures that we don't accdentally get extra
        // newlines or other whitespace interfering with the redaction; this
        // can happen for example when using string literals in yaml
        const redaction = redactionToTrim.trim();
        // Exclude secrets that are empty or just one character in length. These
        // typically mean that you are running local dev or tests, or using the
        // --lax flag which sets things to just 'x'.
        if (redaction.length <= 1) {
          continue;
        }
        if (!redactionSet.has(redaction)) {
          redactionSet.add(redaction);
          added += 1;
        }
      }
      if (added > 0) {
        const redactions = Array.from(redactionSet)
          .map(r => escapeRegExp(r))
          .join('|');
        redactionPattern = new RegExp(`(${redactions})`, 'g');
      }
    },
  };
}
