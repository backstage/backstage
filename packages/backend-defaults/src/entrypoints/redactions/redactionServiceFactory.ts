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
  createServiceFactory,
  coreServices,
  RedactionsService,
} from '@backstage/backend-plugin-api';
import { escapeRegExp } from '../../lib/escapeRegExp';

/** @internal */
export class DefaultRedactionsService implements RedactionsService {
  #redactions = new Set<string>();
  #pattern = undefined as RegExp | undefined;

  redact(input: string): string {
    if (this.#pattern) {
      return input.replace(this.#pattern, '***');
    }
    return input;
  }

  addRedactions = (newRedactions: Iterable<string>): void => {
    let added = 0;
    for (const redactionToTrim of newRedactions) {
      // Trimming the string ensures that we don't accidentally get extra
      // newlines or other whitespace interfering with the redaction; this
      // can happen for example when using string literals in yaml
      const redaction = redactionToTrim.trim();
      // Exclude secrets that are empty or just one character in length. These
      // typically mean that you are running local dev or tests, or using the
      // --lax flag which sets things to just 'x'.
      if (redaction.length <= 1) {
        continue;
      }
      if (!this.#redactions.has(redaction)) {
        this.#redactions.add(redaction);
        added += 1;
      }
    }
    if (added > 0) {
      const redactions = Array.from(this.#redactions)
        .map(r => escapeRegExp(r))
        .join('|');
      this.#pattern = new RegExp(`(${redactions})`, 'g');
    }
  };
}

/** @public */
export const redactionsServiceFactory = createServiceFactory({
  service: coreServices.redactions,
  deps: {},
  async factory() {
    return new DefaultRedactionsService();
  },
});
