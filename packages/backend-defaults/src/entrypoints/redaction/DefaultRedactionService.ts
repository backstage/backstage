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

import { RedactionService } from '@backstage/backend-plugin-api';

/**
 * Default implementation of the redaction service.
 *
 * @internal
 */
export class DefaultRedactionService implements RedactionService {
  readonly #redactions = new Set<string>();
  private pattern: RegExp;

  static create(redactions?: string[]): RedactionService {
    const service = new DefaultRedactionService(redactions ?? []);
    return service;
  }

  private constructor(redactions: string[]) {
    this.#redactions = new Set(redactions);
    this.pattern = new RegExp(redactions.join('|'), 'g');
  }

  redact(options: { input: string }): string {
    if (this.#redactions.size === 0) {
      return options.input;
    }
    return options.input.replace(this.pattern, 'REDACTED');
  }

  addRedaction(options: { pattern: string }): void {
    this.#redactions.add(options.pattern);
    this.pattern = new RegExp(Array.from(this.#redactions).join('|'), 'g');
  }

  getRedactions(): Iterable<string> {
    return this.#redactions;
  }
}
